# Scope and goals

> **Draft.** Goal 1 turns the open questions below into decisions.

## Purpose

Learn how a 2D physics engine works by building one from scratch, understanding every part, and
documenting why each design choice was made and which alternatives were rejected.

## Goals

- Understand the algorithms, not just use them: integration, collision detection, constraint
  solving.
- A modular architecture where the engine is independent of any visualization.
- Tests that protect behavior and physical correctness, valued over coverage numbers.
- Documentation that stays in step with the code.

## Non-goals (provisional)

- Production use, performance records, or API stability while the version is 0.x.
- Features that are not needed by the current goal.

## Open questions (for Goal 1)

1. What does "a real physics world" mean here: higher fidelity (units, materials, validation
   against analytic solutions), more phenomena, or both?
2. What does "modular" mean here: folders with one-way dependencies, or independently replaceable
   parts, and which parts?
3. What does the visualization layer consume: a read-only snapshot of the world, or the engine's own
   state?
4. Where do input and interaction belong? Renderers and cameras only read the engine, but
   interaction sends commands into it (apply a force, drag a body). Should it live inside
   `src/visualization`, in a layer of its own, or in the application code?
