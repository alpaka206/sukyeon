import assert from "node:assert/strict";
import { test } from "node:test";

import { createAuditAttemptPolicy } from "./auditPolicy";

test("Given separate Lighthouse attempts, when policies are created, then storage and cache state cannot carry across attempts", () => {
  // Given
  const first = createAuditAttemptPolicy();

  // When
  const retry = createAuditAttemptPolicy();

  // Then
  assert.equal(first.disableStorageReset, false);
  assert.equal(retry.disableStorageReset, false);
  assert.notEqual(first.isolationKey, retry.isolationKey);
});
