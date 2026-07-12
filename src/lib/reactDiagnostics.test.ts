import assert from "node:assert/strict";
import { test } from "node:test";

import { runOptionalReactDiagnostics } from "./reactDiagnostics";

test("Given an optional development diagnostic fails, when diagnostics initialize, then the failure is contained", async () => {
  // Given
  const expected = new Error("diagnostic unavailable");
  const calls: string[] = [];

  // When
  await runOptionalReactDiagnostics([
    async () => {
      calls.push("first");
      throw expected;
    },
    async () => {
      calls.push("second");
    },
  ]);

  // Then
  assert.deepEqual(calls, ["first", "second"]);
});
