# ADR 0003: Mass in a 2D world is a slice 1 m thick

- Status: accepted
- Date: 2026-10-06

## Context

Mass needs a volume, and a 2D world only has area. The owner wants real-world intuition (Earth-like defaults, water-like density as a reference point).

## Options considered

| Option                   | What it is                                    | Trade-off                                                                     |
| ------------------------ | --------------------------------------------- | ----------------------------------------------------------------------------- |
| A. A slice 1 m thick     | density in kg/m³; mass = density × area × 1 m | Real material tables work as they are; costs a stated pretend third dimension |
| B. Area density in kg/m² | pure 2D, no pretend dimension                 | Water would be 1000 kg/m², which looks odd next to real tables                |

Both give identical numbers at 1 m thickness. The difference is naming and whether the thickness could ever vary.

## What other engines do

All of the ones checked treat density as mass per unit area:

- Box2D documents shape density as usually in kg/m², and is tuned for meters, kilograms and seconds with moving objects between 0.1 and 10 m ([repository](https://github.com/erincatto/box2d)).
- Matter.js defines density as mass per unit area, with a default of 0.001, and computes mass from the body's area ([source](https://brm.io/matter-js/docs/files/src_body_Body.js.html)).
- Rapier defaults the density to 1.0 and derives mass and inertia from the shape ([docs](https://rapier.rs/docs/user_guides/rust/collider_mass_properties/)).

They choose small default densities so that unit-size shapes weigh a few kilograms, and since only mass ratios matter for gravity-only motion, nobody notices.

## Decision

Option A, accepting that a water-density disc the size of a football weighs about 38 kg.

## Consequences

- The default density is a separate decision, taken in the materials chapter with cited sources. With water's 1000 kg/m³ a circle of radius 1 m weighs about 3.1 tonnes: harmless for motion, but forces in newtons feel weak.
- Interaction tools set a velocity change (Δv), not newtons.
- Friction and restitution belong to pairs of surfaces, not to a single body; how two materials are mixed is a convention to decide in the materials chapter.
