# Conventions

Rules that every module inherits. The reasons and the rejected alternatives are in [ADR 0002](decisions/0002-conventions.md) and [ADR 0003](decisions/0003-mass-in-a-2d-world.md).

## At a glance

| Convention    | Rule                                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Units         | SI: meters, kilograms, seconds, newtons, radians. Objects are sized roughly 0.1 to 10 m, because tolerances are in meters |
| Axes          | x to the right, y up                                                                                                      |
| Angles        | radians, counter-clockwise positive                                                                                       |
| Numbers       | JavaScript `number` (64-bit float) everywhere                                                                             |
| Time          | the engine advances by the `dt` it is given; callers use a fixed `dt` (for example 1/60 s)                                |
| Determinism   | same inputs, same results on the same runtime: no `Math.random`, no `Date.now`, stable iteration order                    |
| Mass          | the 2D world is a slice 1 m thick: mass = density (kg/m³) × area × 1 m                                                    |
| Errors        | validate everything that enters the engine and throw; inside hot loops assume valid input                                 |
| Defaults      | documented constants for the environment and for materials, never for geometry                                            |
| Magic numbers | every tolerance and threshold is a named, documented constant with its unit                                               |
| Units in docs | every numeric field and parameter states its unit in its JSDoc                                                            |

## World and screen

The physics world is y-up and counter-clockwise positive. A canvas is y-down and its `rotate()` is clockwise-positive. The flip happens in exactly one place, the camera, which also negates angles. The engine never sees pixels.

```mermaid
flowchart LR
    W["Physics world<br/>meters, y up, angle counter-clockwise"] -->|"camera: scale, flip y, negate angle"| S["Canvas<br/>pixels, y down, rotate() clockwise"]
```

## Time and determinism

The world offers one deterministic, single-pass `step(dt)`. Something outside the engine decides when to call it (a game loop, `requestAnimationFrame`, a test). There are two different things called a simulation: a stepper that owns `dt` and _simulated_ time and never reads a clock (it can live next to the engine), and a real-time driver that turns frame timing into steps (it lives in the outer layers). Determinism plus a recorded list of `dt` values and commands reproduces any run exactly.

Bit-identical results across different JavaScript engines are not promised: the language does not pin down the results of functions such as `Math.sin`.

## Errors and validation

Everything that enters the engine (constructors, setters, commands) is validated, and invalid input throws. A message names the parameter, the received value, the valid range and the unit:

```text
RangeError: gravity must be a finite number (m/s²), received NaN
```

Inside the step loop values are not re-validated. They are protected by invariants and tests, and a step is committed only if it raised no error and every number is finite (see [the engine boundary](architecture/overview.md#the-engine-boundary)).

## Defaults and constants

User parameters are minimal and optional. When one is omitted the engine uses a sane Earth-like default, held as a documented constant owned by the module that uses it (for example gravity `(0, -9.81)` m/s²). An override is optional and validated, at instantiation and at runtime. The world exposes its effective configuration, so you can always see which defaults were applied.

Defaults exist for the environment and for materials, never for geometry. A circle's radius is required, because a default size would be a silent guess.

## Mass

Mass needs a volume and a 2D world only has area, so the world is treated as a slice 1 m thick. A body's mass is its density times its area times 1 m. Real material tables work as they are (wood is about 700 kg/m³, water 1000), at the price of a stated pretend third dimension. Default material values are decided in the materials chapter, with cited sources.

Because the numbers are those of an area density in kg/m², the other engines' habits apply as well: a water-density disc the size of a football weighs about 38 kg, and only mass ratios matter for gravity-only motion. Interaction tools therefore set a velocity change (Δv), not newtons.

## Observable by design

Tests must be able to see what the code did, and they must be able to fail.

1. **Data that crosses a boundary is plain**: public, `readonly`, serializable, and comparable by deep equality. `Vector2` is the model: with `#` fields it would serialize as `{}` and make deep equality blind (see [ADR 0006](decisions/0006-vector2.md)).
2. **Everything the engine does is observable through its public surface**: snapshots, errors that carry the failed state, deterministic replay. Tests never reach in with casts or bracket access to private fields.
3. **If something is hard to observe, add an observation point**, do not loosen privacy. A private piece that needs its own test probably wants to be its own module.
4. **Colocated unit tests may use their own module's internals**, meaning exports that are not re-exported from `mod.ts`. Cross-module tests use `mod.ts` only.
5. **A test must be able to fail.** Every guard and test has a negative case: break the code on purpose and check that a test goes red.

This is a directive, not a guard. Revisit it the first time a test needs an `as any`.

## Documenting units

```ts
/**
 * Applies an instantaneous change of velocity.
 *
 * @param id The body.
 * @param deltaVelocity Velocity change in meters per second (m/s).
 */
```
