# Handover

Update this file at the end of each chapter and commit it together with the docs.

## Baseline

- Last verified commit: `72a6732` (the last code commit of chapter A1). The docs commit that closes the chapter comes after it.
- Environment: Deno 2.9.7 (owner). The assistant's sandbox runs Deno 2.9.6.

## Where we are

- Goal 0 (foundation) is delivered: tasks, folder layout, a docs skeleton, and an architecture test that stops the engine from depending on visualization, examples or tests.
- Goal 1 (scope and architecture) is decided and documented: [scope](../scope.md), [roadmap](../roadmap.md), [conventions](../conventions.md), [architecture overview](../architecture/overview.md) and the [decision records](../decisions/README.md).
- Chapter A1 (`Vector2`) is complete in three steps (`d9dbd34`, `f9d8dec`, `72a6732`): an immutable class with public `readonly` fields, `add`, `sub`, `scale`, `dot` and `length`, and `Vector2Like` at the boundaries. The reasoning and the measurements are in [ADR 0006](../decisions/0006-vector2.md), and the lessons in [lessons](../lessons.md).

## Next

Chapter A2, **Data model**: a body and a world with a shapeless body, the engine's three verbs (command, step, observe), and the first `core` helpers (errors and validation). Topics to discuss, with alternatives and the why-not:

- Body: definition versus state, ids as handles, descriptions in, the first body being a point mass.
- World: commands, a `step(dt)` skeleton with the atomic commit and `StepError`, `snapshot()`, validation and errors.
- Stable ids and body removal, at least how the first design leaves room for them.
- Which tests protect these, and where they live. This chapter may need splitting into smaller ones.

## Decisions so far

| Decision                                                                                                                       | Record                                                                |
| ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| Plausible first, faithful where cheap, no silent hacks                                                                         | [ADR 0001](../decisions/0001-plausible-first-faithful-where-cheap.md) |
| SI units, y up, counter-clockwise angles, 64-bit floats, fixed `dt`, determinism, throw on invalid input, documented constants | [ADR 0002](../decisions/0002-conventions.md)                          |
| Mass: a 2D world is a slice 1 m thick                                                                                          | [ADR 0003](../decisions/0003-mass-in-a-2d-world.md)                   |
| Engine boundary: command, step, observe; descriptions in, handles out; atomic step                                             | [ADR 0004](../decisions/0004-engine-boundary.md)                      |
| Single package, layered modules, one executable guard, rule of two, need-driven existence                                      | [ADR 0005](../decisions/0005-module-structure-and-enforcement.md)     |
| Vector2: an immutable class with public readonly fields, `Vector2Like` at the boundaries, `length` via `sqrt` of the dot       | [ADR 0006](../decisions/0006-vector2.md)                              |
| Observable by design: plain data at boundaries, tests observe through the public surface, tests must be able to fail           | [conventions](../conventions.md#observable-by-design)                 |
| Roadmap order, with circles before rotation and polygons                                                                       | [roadmap](../roadmap.md)                                              |
| Tests named `*.test.ts`, unit tests colocated, cross-module tests in `tests/`; `@std/assert`                                   | [workflow](workflow.md)                                               |
| Plain JSDoc with `deno doc`; no TSDoc-only tags                                                                                | [workflow](workflow.md)                                               |
| Tags only for completed capabilities; the first is expected after chapter A4                                                   | [workflow](workflow.md)                                               |

## Open questions

- Materials: default density, friction and restitution values, with cited sources.
- Body removal and stable ids.
- The name of the outer folder (chapter A3) and whether to split it.
- The project's real name.
- Process: record a short brief in this file when a chapter's path is agreed, so that a chat that ends mid-chapter loses nothing? Not confirmed yet.

## Resuming in a new chat

1. Give the assistant the repository (or the files) and the last verified commit.
2. The assistant reads, in order: [workflow.md](workflow.md), this file, [scope](../scope.md), [roadmap](../roadmap.md), [conventions](../conventions.md), the [architecture overview](../architecture/overview.md), and then the code and tests that the next chapter touches.
3. The assistant confirms the baseline and the next chapter with the owner before proposing anything.
