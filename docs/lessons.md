# Lessons learned

A short log with one section per chapter: what surprised us, and what we would do again. It is written at the end of a chapter, in the review step of the [workflow](.project/workflow.md).

## A1: Vector2

- **Measure, with realistic loops.** Intuition about performance was wrong twice. A first micro-benchmark favored immutable vectors only because V8 removed the allocations. Only a loop whose vectors are stored in an array gave a trustworthy answer.
- **Visibility is a design property.** `#` fields would have made deep equality blind in every test that compares vectors. Plain, public, `readonly` data keeps the tests honest.
- **A test must be able to fail.** Mutation checks (break the code on purpose) found no bugs this time, and they cost almost nothing.
- **Different valid solutions exist.** Tests prove that a specification is met, not which of several valid implementations an author prefers. An independent `length` built on `Math.hypot` passed every test, and it disagrees with the `sqrt` version in the last digits for about a third of vectors. The choice therefore lives in the docs, not in the tests.
- **Floats are not real numbers.** Addition is not associative, `scale(0)` of a negative component gives `-0`, and two correct implementations can differ in the last bit.
- **Structural parameter types are free flexibility.** Accepting `Vector2Like` instead of `Vector2` costs nothing and keeps callers independent of engine classes.
