# Decision records

A short record exists for each decision that is costly to reverse. It keeps the context, the options that were weighed, the "why not" for each, the decision, and what follows from it. Smaller choices live in the docs that use them.

| Record                                               | Decision                                                        |
| ---------------------------------------------------- | --------------------------------------------------------------- |
| [0001](0001-plausible-first-faithful-where-cheap.md) | Plausible behavior first, faithful where cheap, no silent hacks |
| [0002](0002-conventions.md)                          | Units, axes, numbers, time, determinism, errors, defaults       |
| [0003](0003-mass-in-a-2d-world.md)                   | Mass in a 2D world: a slice 1 m thick                           |
| [0004](0004-engine-boundary.md)                      | The engine boundary: commands, step, snapshots, atomic step     |
| [0005](0005-module-structure-and-enforcement.md)     | Module structure and how much of it to enforce                  |

## Template

```md
# ADR NNNN: Title

- Status: proposed, accepted or superseded by NNNN
- Date: YYYY-MM-DD

## Context

## Options considered

## Decision

## Consequences
```

A superseded record is kept, with its status changed, so the history of the reasoning stays readable.
