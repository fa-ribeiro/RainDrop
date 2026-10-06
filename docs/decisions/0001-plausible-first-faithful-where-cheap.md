# ADR 0001: Plausible behavior first, faithful where cheap

- Status: accepted
- Date: 2026-10-06

## Context

"A real physics world" can mean fidelity (the world obeys physical laws quantitatively), breadth (more phenomena than rigid bodies), or vocabulary (modules named after physical concepts). The owner wants recognizable behavior (a kicked ball), SI units with Earth-like defaults, and rigid bodies only, with pendulums, springs, compound bodies and fabric as later wishes.

## Options considered

| Option                   | What it is                                                | Why not, as it stands                                                                                                                                                       |
| ------------------------ | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A. Plausible toy         | Box2D-style: stable, fast, game feel                      | Its correctness means "looks right", through deliberate non-physical fixes (slop, thresholds, sleeping). You learn the algorithms but little physics                        |
| B. Faithful rigid bodies | SI units, materials, validated against analytic solutions | Faithful and robust sometimes disagree (stacking, resting contact, energy drift), so the world would look less stable                                                       |
| C. Broad sandbox         | rigid, soft, fluid and thermal phenomena                  | Each phenomenon is a different family of numerical methods: a survey instead of depth, and a general framework designed before a second phenomenon exists usually fits none |
| D. Everything, exactly   | all phenomena, faithfully                                 | Not reachable                                                                                                                                                               |

## Decision

Mostly A, leaning toward B where it is cheap. The rule:

- Names, units and defaults are physical.
- The physical core is validated against known solutions where that is cheap.
- **Every non-physical approximation is explicit**: named, parameterized, documented in an approximation ledger (`docs/ledger.md`, created with the first entry) and tested on its own. There are no silent hacks.

Rigid bodies only. Wind, the Coriolis effect and other celestial bodies are ignored. Fabric is deferred and, if it comes, is built from particles and constraints.

## Consequences

- Three kinds of tests: validation tests (analytic solutions, tight tolerances), behavior tests (the kicked ball bounces a few times and rests within a time), and invariants (no energy gain without input, no NaN, bounded penetration). Invariants expose fixes that inject energy.
- Rolling to a stop needs rolling resistance, which the rigid model lacks. It will be an explicit approximation, because friction alone leaves a perfect disc rolling forever.
- Moving toward B later means retiring ledger entries.
- The project can look less stable than a Box2D-style engine in places, and that is accepted.
