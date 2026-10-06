/**
 * Everything that turns an engine world into something a person can look at or act on.
 *
 * Visualization depends on the engine, never the other way around. It imports from
 * `src/engine/mod.ts` only, not from engine internals.
 *
 * Planned contents, each added when there is code for it: renderers (an SVG renderer for
 * snapshots, later canvas or WebGL), cameras and viewports, and possibly interaction and input.
 *
 * > **Note:** renderers and cameras only read the engine. Interaction and input are different:
 * > they would send commands to the engine, so whether they belong here is an open question (see
 * > `docs/scope.md`).
 *
 * Files that need browser types start with `/// <reference lib="dom" />`. Run `deno task
 * check:visualization` on its own; do not combine it with `check:engine`, because TypeScript shares
 * libraries across everything checked in one command and the DOM would leak into the engine check.
 *
 * @module
 */

export {};
