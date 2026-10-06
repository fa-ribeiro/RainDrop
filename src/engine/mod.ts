/**
 * The physics engine: pure simulation code with no knowledge of rendering or any other visualization.
 *
 * This file is the public API boundary of the engine. Everything meant for consumers is
 * re-exported from here; everything else is internal to `src/engine/`.
 *
 * > **Rule:** the engine must never import from `src/visualization/`, `examples/` or `tests/`.
 * > `tests/architecture/dependency-direction.test.ts` enforces it.
 *
 * The engine also must not use DOM types (`document`, `window`, canvas, ...). `deno task
 * check:engine` type-checks `src/engine` on its own, without the DOM library, so such a use fails
 * the check.
 *
 * @module
 */

export { Vector2 } from "./math/mod.ts";
export type { Vector2Like } from "./math/mod.ts";
