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
