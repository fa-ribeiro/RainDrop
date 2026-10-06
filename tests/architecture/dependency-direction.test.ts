import { assertEquals } from "@std/assert";

/** The part of the `deno info --json` output this test relies on. */
interface ModuleGraph {
  modules: { specifier: string }[];
}

/** Locations the engine must never reach, directly or through other modules. */
const FORBIDDEN_PREFIXES = [
  import.meta.resolve("../../src/visualization/"),
  import.meta.resolve("../../examples/"),
  import.meta.resolve("../../tests/"),
];

/** Returns the modules in `graph` whose specifier starts with one of the forbidden prefixes. */
function findForbidden(graph: ModuleGraph, forbiddenPrefixes: string[]): string[] {
  return graph.modules
    .map((module) => module.specifier)
    .filter((specifier) => forbiddenPrefixes.some((prefix) => specifier.startsWith(prefix)));
}

/**
 * Asks Deno for the fully resolved module graph of `entry`, so import maps, re-exports and
 * transitive imports are all accounted for (a regular expression over the source would miss them).
 */
async function readGraph(entry: string): Promise<ModuleGraph> {
  const { success, stdout, stderr } = await new Deno.Command("deno", {
    args: ["info", "--json", entry],
  }).output();
  if (!success) throw new Error(new TextDecoder().decode(stderr));
  return JSON.parse(new TextDecoder().decode(stdout));
}

/** Lists the non-test TypeScript files under `dir`, recursively. Paths are relative to the cwd. */
async function listSourceFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  for await (const entry of Deno.readDir(dir)) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory) {
      files.push(...await listSourceFiles(path));
    } else if (entry.name.endsWith(".ts") && !entry.name.endsWith(".test.ts")) {
      files.push(path);
    }
  }
  return files;
}

// A guard that can never fail protects nothing, so first prove the detection logic works on a
// hand-made graph that contains a violation.
Deno.test("findForbidden reports a visualization module reachable from the engine", () => {
  const graph: ModuleGraph = {
    modules: [
      { specifier: "file:///project/src/engine/mod.ts" },
      { specifier: "file:///project/src/visualization/svg.ts" },
    ],
  };
  assertEquals(findForbidden(graph, ["file:///project/src/visualization/"]), [
    "file:///project/src/visualization/svg.ts",
  ]);
});

// Every engine file is used as an entry point, so internal files that `mod.ts` does not (yet)
// export are checked too. Tests run from the project root (see the `test` task).
Deno.test("the engine never reaches visualization, examples or tests", async () => {
  for (const file of await listSourceFiles("src/engine")) {
    const offenders = findForbidden(await readGraph(file), FORBIDDEN_PREFIXES);
    assertEquals(offenders, [], `${file} depends on modules it must not know about`);
  }
});
