# ADR 0002: Conventions every module inherits

- Status: accepted
- Date: 2026-10-06

## Context

Units, axes, number types, time and error handling are inherited by every module and are painful to change later. The owner stressed determinism and isolation: the engine must know nothing about wall clocks, mouse events or the display.

## Options considered

| Convention    | Chosen                                                                                          | Alternative and why not                                                                                                      |
| ------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Units         | SI; objects roughly 0.1 to 10 m                                                                 | Pixels or game units: easier at first, but nothing connects to real numbers and "validated against physics" is lost          |
| Axes, angles  | y up, counter-clockwise positive, radians                                                       | y down like screens: fewer flips in the viewer, but backwards for every physics formula. The flip lives in the camera        |
| Numbers       | JavaScript `number` (64-bit)                                                                    | `Float32Array`: JS computes in 64-bit anyway, so precision is lost for no gain. Fixed-point: exact determinism, large detour |
| Time          | the engine advances by a given `dt`; callers use a fixed `dt`                                   | Variable `dt`: simpler loop, but results depend on the frame rate and stacking becomes unstable                              |
| Determinism   | same inputs, same results on the same runtime                                                   | Not caring: cheaper, but replay, snapshot tests and reproducible bug reports are lost                                        |
| Errors        | validate at the public boundary and throw; trust inside hot loops                               | Silent clamping hides bugs (a silent hack). Result types are explicit but noisy for a learning codebase                      |
| Defaults      | for environment and materials only, as documented constants; effective configuration is visible | Defaults for geometry: a guess. "Unit" geometries (1 m circles) were considered and rejected for the same reason             |
| Constants     | named, documented, with units                                                                   | Inline literals: fast to write, impossible to explain or tune                                                                |
| Units in docs | every numeric field states its unit in JSDoc                                                    | Relying on memory: the classic source of unit bugs                                                                           |

## Decision

All the chosen rules above. Cross-engine bit-identical results are not promised, because the language does not pin down functions such as `Math.sin`.

## Consequences

- The camera is the one place that flips y and negates angles.
- Tests can replay runs exactly from recorded `dt` values and commands.
- Every constant and tolerance appears in the docs with its unit (and in the approximation ledger when it is non-physical).
- Reference: [conventions](../conventions.md).
