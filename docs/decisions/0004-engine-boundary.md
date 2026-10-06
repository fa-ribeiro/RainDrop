# ADR 0004: The engine boundary

- Status: accepted
- Date: 2026-10-06

## Context

The engine must be deterministic and isolated. Its clients are a real-time runner, interaction, camera and renderers, tests and, later, replay. The owner wants the world to be observable without exposing its data, and a failing step must never leave a half-updated world.

## Options considered

| Question              | Chosen                                                                | Alternative and why not                                                                                                                                  |
| --------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| How clients observe   | pull: `snapshot()`                                                    | Push observers: more machinery, and client code runs near the step (reentrancy)                                                                          |
| How bodies enter      | descriptions in, handles out                                          | Injecting objects by reference: both sides alias one object, so the caller can bypass validation and the commit rule                                     |
| How state is updated  | atomic: copy, run, check, commit                                      | In-place mutation: fastest, but a failure leaves a half-updated world. A journal or undo log: complex. Persistent immutable structures: allocation heavy |
| Committed states      | immutable once published; exactly one is kept; a new state per step   | Two reused buffers: no garbage, but views would be overwritten, so observers must copy. A history of states: memory for no need                          |
| Reporting a failure   | throw `StepError` carrying the failed state                           | Returning an error object: a lazy loop could ignore it and repeat the failing step every frame without anyone noticing                                   |
| What an observer sees | a snapshot (a photo); a checkpoint (a save game) when replay needs it | One type for both: the checkpoint will contain hidden internals (warm-start cache) that observers must not depend on                                     |

## Decision

- The front door has three verbs: **command**, **step** and **observe** (snapshots and read-only queries). Queries are separate from commands.
- Callers pass descriptions, the world validates and copies them and returns opaque ids.
- `snapshot()` returns the committed state as a read-only view. Committed states are never modified after publication, so the view is safe and costs nothing.
- A step copies the committed state, runs on the copy, and commits only if no error was raised and every number is finite. Otherwise it throws a `StepError` carrying the failed state, `dt` and step number, and the previous state stays in place.
- Time: the world advances by the `dt` it is given. A stepper that owns `dt` and simulated time can live next to the engine; the real-time driver lives in the outer layers.

## Consequences

- Retrying a failed step fails identically (determinism), so the runner must stop and surface the error. The previous state, `dt` and commands reproduce the failure exactly.
- The committed state must contain everything the next step reads, such as a future warm-start cache.
- TypeScript's `readonly` protects only at compile time. Tests may freeze states to catch accidental mutation.
- An allocation per step is accepted. It is negligible at this scale and can be revisited if profiling shows a need.
- The checkpoint is added when replay or undo needs it. Until then, only `snapshot()` exists.
