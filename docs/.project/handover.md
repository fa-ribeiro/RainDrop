# Handover

Update this file at the end of each chapter and commit it together with the docs.

## Baseline

- Last verified commit: _fill in after the commit that contains this file_
- Environment: Deno 2.9.7 (owner). The assistant's sandbox runs Deno 2.9.6.

## Where we are

- Goal 0 (foundation) is delivered: tasks, folder layout, a docs skeleton, and an architecture test that stops the engine from depending on visualization, examples or tests.
- Goal 1 (scope and architecture) is decided and documented. No code was written. The documents are: [scope](../scope.md), [roadmap](../roadmap.md), [conventions](../conventions.md), [architecture overview](../architecture/overview.md) and the [decision records](../decisions/README.md).

## Next

Chapter A1, **Data model**: `Vector2`, a body and a world with a shapeless body, the engine's three verbs (command, step, observe), and the first `core` helpers (errors and validation). Topics to discuss, with alternatives and the why-not:

- `Vector2`: the name (`Vec2` or `Vector2`), mutable or immutable, allocation, the minimal method set, and what reference engines do.
- Body: definition versus state, ids as handles, descriptions in, the first body being a point mass.
- World: commands, a `step(dt)` skeleton with the atomic commit, `snapshot()`, validation and errors.
- Which tests protect these, and where they live.

## Decisions so far

| Decision                                                                                                                       | Record                                                                |
| ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| Plausible first, faithful where cheap, no silent hacks                                                                         | [ADR 0001](../decisions/0001-plausible-first-faithful-where-cheap.md) |
| SI units, y up, counter-clockwise angles, 64-bit floats, fixed `dt`, determinism, throw on invalid input, documented constants | [ADR 0002](../decisions/0002-conventions.md)                          |
| Mass: a 2D world is a slice 1 m thick                                                                                          | [ADR 0003](../decisions/0003-mass-in-a-2d-world.md)                   |
| Engine boundary: command, step, observe; descriptions in, handles out; atomic step                                             | [ADR 0004](../decisions/0004-engine-boundary.md)                      |
| Single package, layered modules, one executable guard, rule of two, need-driven existence                                      | [ADR 0005](../decisions/0005-module-structure-and-enforcement.md)     |
| Roadmap order, with circles before rotation and polygons                                                                       | [roadmap](../roadmap.md)                                              |
| Tests named `*.test.ts`, unit tests colocated, cross-module tests in `tests/`; `@std/assert`                                   | [workflow](workflow.md)                                               |
| Plain JSDoc with `deno doc`; no TSDoc-only tags                                                                                | [workflow](workflow.md)                                               |
| Tags only for completed capabilities; the first is expected after chapter A3                                                   | [workflow](workflow.md)                                               |

## Open questions

- Materials: default density, friction and restitution values, with cited sources.
- Body removal and stable ids.
- The name of the outer folder (chapter A2) and whether to split it.
- The project's real name.
- Process: record a short brief in this file when a chapter's path is agreed, so that a chat that ends mid-chapter loses nothing? Not confirmed yet.

## Resuming in a new chat

1. Give the assistant the repository (or the files) and the last verified commit.
2. The assistant reads, in order: [workflow.md](workflow.md), this file, [scope](../scope.md), [roadmap](../roadmap.md), [conventions](../conventions.md), the [architecture overview](../architecture/overview.md), and then the code and tests that the next chapter touches.
3. The assistant confirms the baseline and the next chapter with the owner before proposing anything.
