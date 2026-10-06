/**
 * Anything with numeric `x` and `y`: the shape in which vectors enter and leave the engine.
 *
 * A {@link Vector2} satisfies it, and so does a plain object such as `{ x: 1, y: 2 }`. Taking this
 * type at the boundaries keeps callers free of engine classes, and keeps snapshots plain data.
 */
export interface Vector2Like {
  /** Horizontal component. */
  readonly x: number;
  /** Vertical component. */
  readonly y: number;
}

/**
 * An immutable 2D vector of 64-bit floats.
 *
 * Immutable means that no operation changes a vector: operations return a new one. Several bodies
 * may therefore share a vector safely, and a committed world state can be observed without copying.
 *
 * A vector does not know what its components measure (meters, meters per second, newtons...). Whoever
 * holds a vector documents the unit.
 *
 * > **Note:** the fields are public and `readonly` on purpose. A vector is plain data with no
 * > invariant to protect (any pair of numbers is a vector). Hiding it behind `private` or `#`
 * > fields would add getter boilerplate and break things that rely on plain data: `#` fields
 * > serialize as `{}` and make deep equality in tests blind, and `private` leaks internal names
 * > into `JSON.stringify`.
 *
 * The constructor does not validate its arguments: it is used in hot loops. Values entering the
 * engine are validated at the world boundary.
 */
export class Vector2 implements Vector2Like {
  /** Horizontal component, in the unit of whatever the vector represents. */
  readonly x: number;
  /** Vertical component, in the unit of whatever the vector represents. */
  readonly y: number;

  /**
   * Creates a vector.
   *
   * @param x Horizontal component.
   * @param y Vertical component.
   */
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Adds another vector.
   *
   * @param other The vector to add: a Vector2 or any object with `x` and `y`.
   * @returns A new vector holding the component-wise sum. Neither operand changes.
   */
  add(other: Vector2Like): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  /**
   * Subtracts another vector: `this - other`.
   *
   * @param other The vector to subtract: a Vector2 or any object with `x` and `y`.
   * @returns A new vector holding the component-wise difference. Neither operand changes.
   */
  sub(other: Vector2Like): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  /**
   * Multiplies both components by a number.
   *
   * A negative factor reverses the direction, and a factor of 0 gives a zero-length vector.
   *
   * @param factor The number to multiply by (a plain number, with no unit of its own).
   * @returns A new vector holding the scaled components. This vector does not change.
   */
  scale(factor: number): Vector2 {
    return new Vector2(this.x * factor, this.y * factor);
  }

  /**
   * Dot product with another vector: `x * other.x + y * other.y`.
   *
   * It equals `|a| * |b| * cos(angle between them)`. It is positive when the vectors point to the
   * same side, zero when they are perpendicular, and negative when they point to opposite sides. For
   * a unit-length `n`, `v.dot(n)` is the length of the shadow of `v` along `n`: later chapters use it
   * to split a velocity into the part along a contact normal and the rest.
   *
   * @param other The other vector: a Vector2 or any object with `x` and `y`.
   * @returns A plain number. Its unit is the product of the units of the two vectors (a force in
   * newtons dotted with a displacement in meters gives joules).
   */
  dot(other: Vector2Like): number {
    return this.x * other.x + this.y * other.y;
  }

  /**
   * Length (magnitude) of the vector, in the vector's own unit.
   *
   * It is the square root of the dot product of the vector with itself. That is faster than
   * `Math.hypot`, at the price of overflowing to `Infinity` above components of about 1e150 and
   * losing precision below about 1e-150. Physical sizes in this engine (roughly 0.1 to 10 m) are
   * far inside that range, and a step that produced `Infinity` would be rejected by the commit check.
   *
   * @returns The length, never negative.
   */
  length(): number {
    return Math.sqrt(this.dot(this));
  }
}
