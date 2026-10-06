# Scope and goals

> **Status:** agreed in Goal 1. The reasoning is in the [decision records](decisions/README.md). Revisit it at every gate of the [roadmap](roadmap.md).

## Purpose

Learn how a 2D physics engine works by building one from scratch: understand every part, and record why each choice was made and which alternatives were rejected.

## What we are building

A 2D rigid-body engine with forces and constraints (springs, joints), whose behavior is **plausible and recognizable**, expressed in SI units with Earth-like defaults.

The reference scenario is a kicked ball: it flies in a parabola, bounces a few times, rolls, and comes to rest.

## Principles

1. **Plausible first, faithful where cheap.** Names, units and defaults are physical, and the physical core is validated against known solutions where that is cheap. Every non-physical approximation is explicit: named, parameterized, documented and tested on its own. There are no silent hacks. ([ADR 0001](decisions/0001-plausible-first-faithful-where-cheap.md))
2. **Determinism and isolation.** The engine knows nothing about wall-clock time, input devices or the display. The same inputs give the same results on the same runtime. ([ADR 0004](decisions/0004-engine-boundary.md))
3. **Need-driven existence.** Nothing is created because it may be needed. Folders, modules, interfaces and docs exist because a need has been shown and their shape and purpose are clear. An interface is introduced only when a second implementation exists (the rule of two). A map or a roadmap may describe the future as a hypothesis; code and folders may not. ([ADR 0005](decisions/0005-module-structure-and-enforcement.md))
4. **Learning first.** Every choice is discussed with its alternatives, and the "why not" is recorded.

## Goals

- Understand the algorithms, not just use them: integration, collision detection, constraint solving.
- A modular architecture in which the engine is independent of any visualization.
- Tests that protect behavior and physical correctness, valued over coverage: validation tests against analytic solutions, behavior tests for recognizable scenarios, and invariants.
- Documentation that stays in step with the code.

## Non-goals (for now)

- Fluids, thermal effects, wind, the Coriolis effect and other celestial bodies.
- Soft bodies and fabric. They are deferred, and if they come they are built from particles and constraints (see the [roadmap](roadmap.md)).
- Production use, performance records, or API stability while the version is 0.x.
- Anything that the current chapter does not need.

## Reference scenario: the kicked ball

Splitting the scenario by the physics involved shows where the engine is faithful and where it needs an explicit approximation.

| Stage    | Physical cause                             | Verdict                                                                                                |
| -------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| Kick     | an impulse                                 | faithful                                                                                               |
| Flight   | gravity (air drag ignored)                 | faithful; checkable: apex height and range                                                             |
| Bounce   | restitution                                | an ideal model with a measured coefficient; checkable: each apex is `e²` of the previous one           |
| Rolling  | friction until `v = ωr`                    | faithful; checkable: a solid disc that lands sliding without spin rolls on at 2/3 of its speed         |
| Stopping | rolling resistance (deformation), air drag | **not in the rigid model**: an explicit approximation, because a perfect rigid disc would roll forever |

## Open questions

1. Materials: default density, friction and restitution values (wood-like), with cited sources.
2. Body removal and stable ids: designed with the data model, exercised by "pick and delete".
3. The name of the outer folder (`src/visualization`) and whether to split it: decided in chapter A3.
4. The project's real name.
