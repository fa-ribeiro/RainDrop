# Handover

Update this file with every step and commit it together with the code.

## Baseline

- Last verified commit: _fill in after the first commit_
- Environment: Deno 2.9.7 (owner). The assistant's sandbox runs Deno 2.9.6.

## Where we are

- Goal 0 (foundation) is delivered: tasks, folder layout, docs skeleton, and an architecture test that stops the engine from depending on visualization, examples or tests.
- Waiting for the owner's `deno task verify` result.

## Next

- Goal 1: scope and architecture, docs only. Answer the open questions in [scope](../scope.md), then draw the module boundaries.
- After that: Goal 2 `Vec2`, then Goal 3 bodies and motion (explicit vs semi-implicit Euler, validated against an analytic solution).

## Decisions so far

| Decision                                                        | Why                                                                                                                                                                |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| One package: `src/engine` and `src/visualization`, no workspace | Boundaries are still unknown; a workspace makes every refactor cross `exports`                                                                                     |
| `src/visualization`                                             | It will hold more than renderers: cameras, viewport, maybe interaction. Watch that it does not become a junk drawer; split it into subfolders when content arrives |
| Engine never imports visualization, examples or tests           | Visualization must be replaceable; enforced by an architecture test                                                                                                |
| DOM types only where a file asks for them                       | `check:engine` and `check:visualization` run separately so the DOM cannot leak                                                                                     |
| Tests named `*.test.ts`, unit tests colocated                   | Tests move with the code they protect                                                                                                                              |
| `tests/validation`                                              | Name says what is checked: physical laws and analytic solutions                                                                                                    |
| `@std/assert` for assertions                                    | Provides `assertAlmostEquals`, which float comparisons need                                                                                                        |
| Plain JSDoc with `deno doc`; no TSDoc-only tags                 | `deno doc` is the native tool and drops `@remarks`                                                                                                                 |
| Docs created when there is content; handover in `.project`      | Empty docs rot                                                                                                                                                     |
| Tags only for completed capabilities                            | First tag expected after Goal 3                                                                                                                                    |

## Open questions

See the open questions in [scope](../scope.md), including where input and interaction belong. Also open: the project's real name.

## Resuming in a new chat

1. Give the assistant the repository (or the files) and the last verified commit.
2. The assistant reads, in order: [workflow.md](workflow.md), this file, [scope](../scope.md), and then the code and tests that the next goal touches.
3. The assistant confirms the baseline and the next goal with the owner before proposing anything.
