import { assertEquals, assertNotEquals } from "@std/assert";
import { Vector2, type Vector2Like } from "./vector2.ts";

Deno.test("Vector2 stores its components", () => {
  const v = new Vector2(3, -4);
  assertEquals(v.x, 3);
  assertEquals(v.y, -4);
});

Deno.test("Vector2 components are read-only (checked by the compiler)", () => {
  const v = new Vector2(1, 2);
  // Never called: the assertions are the `@ts-expect-error` lines. If a field ever became
  // writable, the directive would be unused and `deno task check` would fail.
  const mutate = () => {
    // @ts-expect-error x is readonly
    v.x = 5;
    // @ts-expect-error y is readonly
    v.y = 5;
  };
  assertEquals(typeof mutate, "function");
  assertEquals(v, new Vector2(1, 2));
});

Deno.test("Vector2 is plain data: structural, serializable and comparable", () => {
  // A plain object and a Vector2 are both accepted wherever a Vector2Like is expected.
  const lengthOf = (v: Vector2Like) => Math.hypot(v.x, v.y);
  assertEquals(lengthOf({ x: 3, y: 4 }), 5);
  assertEquals(lengthOf(new Vector2(3, 4)), 5);

  // It serializes as plain data. With `#` fields it would serialize as `{}` and break snapshots.
  assertEquals(JSON.stringify(new Vector2(1, 2)), '{"x":1,"y":2}');

  // Deep equality can tell two vectors apart. With `#` fields it would be blind to the difference,
  // and every test comparing vectors would pass whatever the values.
  assertEquals(new Vector2(1, 2), new Vector2(1, 2));
  assertNotEquals(new Vector2(1, 2), new Vector2(3, 4));
});

Deno.test("add returns the component-wise sum and leaves both operands unchanged", () => {
  const a = new Vector2(1, 2);
  const b = new Vector2(3, 4);
  const sum = a.add(b);
  assertEquals(sum, new Vector2(4, 6));
  assertEquals(a, new Vector2(1, 2));
  assertEquals(b, new Vector2(3, 4));
  assertEquals(sum === a || sum === b, false);
});

Deno.test("sub returns this minus other, not the other way round", () => {
  const difference = new Vector2(5, 7).sub(new Vector2(2, 3));
  assertEquals(difference, new Vector2(3, 4));
  assertEquals(new Vector2(2, 3).sub(new Vector2(5, 7)), new Vector2(-3, -4));
});

Deno.test("scale multiplies both components and leaves the vector unchanged", () => {
  const v = new Vector2(1.5, -2);
  assertEquals(v.scale(2), new Vector2(3, -4));
  assertEquals(v.scale(-1), new Vector2(-1.5, 2));
  assertEquals(v, new Vector2(1.5, -2));
});

Deno.test("add and sub accept any object with x and y", () => {
  assertEquals(new Vector2(1, 2).add({ x: 10, y: 20 }), new Vector2(11, 22));
  assertEquals(new Vector2(11, 22).sub({ x: 10, y: 20 }), new Vector2(1, 2));
});

Deno.test("the operations agree with each other exactly", () => {
  // These hold bit for bit, even with floats that are not exactly representable:
  // addition is commutative, and subtracting equals adding the negated vector.
  const a = new Vector2(0.1, 0.2);
  const b = new Vector2(0.3, 0.4);
  assertEquals(a.add(b), b.add(a));
  assertEquals(a.sub(b), a.add(b.scale(-1)));
});

Deno.test("dot returns the sum of the component products", () => {
  assertEquals(new Vector2(1, 2).dot(new Vector2(3, 4)), 11);
  assertEquals(new Vector2(1, 2).dot({ x: 3, y: 4 }), 11);
});

Deno.test("dot is zero for perpendicular vectors and negative for opposite ones", () => {
  assertEquals(new Vector2(1, 0).dot(new Vector2(0, 5)), 0);
  assertEquals(new Vector2(3, 4).dot(new Vector2(-4, 3)), 0);
  assertEquals(new Vector2(1, 0).dot(new Vector2(-2, 0)), -2);
});

Deno.test("dot is commutative and leaves its operands unchanged", () => {
  const a = new Vector2(0.1, 0.2);
  const b = new Vector2(0.3, 0.4);
  assertEquals(a.dot(b), b.dot(a));
  assertEquals(a, new Vector2(0.1, 0.2));
  assertEquals(b, new Vector2(0.3, 0.4));
});

Deno.test("length of the 3-4-5 triangle is 5, whatever the signs", () => {
  assertEquals(new Vector2(3, 4).length(), 5);
  assertEquals(new Vector2(-3, -4).length(), 5);
  assertEquals(new Vector2(0, 0).length(), 0);
});

Deno.test("length scales linearly and is the square root of the dot with itself", () => {
  const v = new Vector2(3, 4);
  assertEquals(v.scale(2).length(), 10);
  assertEquals(v.length() ** 2, v.dot(v));
});
