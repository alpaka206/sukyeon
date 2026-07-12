import assert from "node:assert/strict";
import { test } from "node:test";

import { NextRequest } from "next/server";

import { proxy } from "./proxy";

test("Given an unsupported login method, when proxying the request, then it is rejected with an explicit Allow contract", () => {
  // Given
  const request = new NextRequest("http://localhost/admin/login", { method: "PUT" });

  // When
  const response = proxy(request);

  // Then
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("Allow"), "GET, HEAD, POST");
});
