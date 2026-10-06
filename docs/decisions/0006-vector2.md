# ADR 0006: Vector2 is an immutable class with public readonly fields

- Status: accepted
- Date: 2026-10-06

## Context

Every module above `core` uses 2D vectors. The vector has to fit the decisions already taken: plain-data snapshots, immutable committed states, descriptions copied in at the boundary, and the rule that tests must be able to see the data ([conventions](../conventions.md#observable-by-design)).

## Options considered

| Question      | Chosen                                                                     | Alternative and why not                                                                                                                                                                                                                                          |
| ------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mutability    | immutable: every method returns a new vector                               | Mutable in place: fewer allocations, but aliasing bugs (two bodies sharing one vector), and it clashes with immutable committed states. Plain `{ x, y }` with free functions: serializable, but the API is less discoverable and immutability is only convention |
| Boundary type | `Vector2Like`, a structural `{ x, y }`, accepted wherever a vector is read | Requiring the class: forces callers to build engine objects for no gain                                                                                                                                                                                          |
| Field privacy | public `readonly x` and `y`                                                | TypeScript `private` plus getters leaks internal names into `JSON.stringify` and can be bypassed at runtime. `#x` plus getters serializes as `{}` and makes deep equality blind. Both add boilerplate, and a vector has no invariant to protect                  |
| Name          | `Vector2`                                                                  | `Vec2`: shorter in formulas, but less obvious to a newcomer                                                                                                                                                                                                      |
| Validation    | none in the constructor; the world validates at its boundary               | Validating every construction: it breaks the rule of minimal validation inside hot loops                                                                                                                                                                         |
| Method set    | constructor, `add`, `sub`, `scale`, `dot`, `length`                        | `neg`, `normalize`, `cross`, rotation and the rest wait for the chapter that needs them. `normalize` needs an explicit zero-vector policy first                                                                                                                  |
| `length`      | `Math.sqrt(this.dot(this))`                                                | `Math.hypot(x, y)`: equally valid, and robust at extreme magnitudes                                                                                                                                                                                              |

## Evidence

All measurements are indicative: one machine, Deno 2.9.6.

- **Allocation cost.** With 1000 bodies updated as `position += velocity * dt` and the vectors stored in an array, immutable cost about 18 ns per update and in place about 21 ns. A simulated second of 1000 bodies costs about 1 ms either way. A first, less realistic micro-benchmark even favored immutable, because V8 optimized the allocations away.
- **Field privacy.** Public fields serialize as `{"x":1,"y":2}`. TypeScript `private` serializes as `{"_x":1,"_y":2}`. `#` fields serialize as `{}`, and a deep-equality check (tested with Node's `deepStrictEqual`) could not tell `(1, 2)` from `(3, 4)`. The speed of `#` fields with getters equals that of public fields (about 18 ns per update).
- **`length`.** `sqrt` took about 15 ns per call against about 23 ns for `hypot`. `hypot` stays correct for components around 1e200 or 1e-200, where `sqrt` overflows to `Infinity` or underflows to 0. Inside the physical range (components within 10 in size), the two disagree in the last digits for about a third of random vectors, by at most about two units in the last place.

## Decision

`Vector2` is an immutable class with public `readonly` fields, which also satisfies `Vector2Like`. It does not validate, and it has the six members above. `length` is `Math.sqrt(this.dot(this))`, with its valid range stated in the JSDoc.

## Consequences

- A compile-time test (`@ts-expect-error`) fails if a field ever becomes writable, and a plain-data test fails if the fields become `#` fields (checked by doing it).
- `Vector2` is the first public API: it is exported from `engine/mod.ts`, so `doc:lint` checks it.
- If profiling the real engine ever shows vector allocation as a bottleneck, an in-place variant can be added then (the rule of need).
- Swapping `length` for `hypot`, or the reverse, passes every test but changes results in the last digits, which can grow in chaotic scenes. Computed floats are therefore compared with a tolerance, and exactly only in constructed cases such as the 3-4-5 triangle.
