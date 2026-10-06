# ADR 0005: Module structure and how much of it to enforce

- Status: accepted
- Date: 2026-10-06

## Context

The owner wants a very modular project in which the engine does not depend on visualization, with the caveat that nothing should exist merely because it may be needed. The project is built by two parties, the owner and an assistant, across chats that do not remember each other.

## Options considered

| Question          | Chosen                                                                                                          | Alternative and why not                                                                                                                                                                       |
| ----------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Packaging         | one package, with `src/engine` and `src/visualization`                                                          | A workspace with a package per module: boundaries are still unknown, and every refactor would cross an `exports` boundary                                                                     |
| Organization      | layers by concept (`core`, `math`, `geometry`, `collision`, `dynamics`, `solver`, `world`), outer layers on top | Feature slices duplicate shared concepts. An entity-component-system adds concepts that a small world does not need yet                                                                       |
| Pluggability      | an interface only when a second implementation exists (the rule of two)                                         | An interface for every algorithm up front: indirection and abstractions that fit nothing                                                                                                      |
| Existence         | need-driven: folders, modules, interfaces and docs appear when a need is shown                                  | Scaffolding for modules that may exist: empty structure that drifts                                                                                                                           |
| Enforcement       | directive plus API discipline, with one executable guard                                                        | No guard at all: fine for readers, but erosion, one convenient import at a time, is the real risk across chats. A full table of allowed imports now: no proven need with two or three modules |
| Outer folder name | `visualization`, to be revisited in chapter A2                                                                  | A rename now, before the runner exists, would be a guess                                                                                                                                      |

## Decision

- The layers and their allowed dependencies are those of the [architecture overview](../architecture/overview.md). Outer layers import only `engine/mod.ts`.
- A module exposes only its intended API through its `mod.ts`, documents it, and anything else is internal. `deno task doc:lint` requires JSDoc on every export.
- The one executable guard: the engine never reaches `src/visualization/`, `examples/` or `tests/`. `check:engine` and `check:visualization` run separately so DOM types cannot leak into the engine.
- The table of allowed imports between engine modules is deferred, until the first wrong-direction import slips through or there are about five modules.

## Consequences

- A new chat is directed by the docs; the guard backs the single rule that matters most.
- Unresolved imports must make any dependency check fail, because a guard that passes when it cannot see is worse than none.
- Reopen the outer folder name, and whether to split it, in chapter A2.
