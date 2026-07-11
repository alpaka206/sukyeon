import assert from "node:assert/strict";
import test from "node:test";
import { adminLoginRateLimitKey } from "./adminAuth";

test("rate-limit identity ignores forged proxy-header environment values", () => {
  const previousUsername = process.env.ADMIN_USERNAME;
  const previousSecret = process.env.ADMIN_SESSION_SECRET;
  const previousForwardedFor = process.env.HTTP_X_FORWARDED_FOR;
  try {
    process.env.ADMIN_USERNAME = "administrator";
    process.env.ADMIN_SESSION_SECRET = "test-session-secret";
    process.env.HTTP_X_FORWARDED_FOR = "198.51.100.9";
    const first = adminLoginRateLimitKey();
    process.env.HTTP_X_FORWARDED_FOR = "203.0.113.7";
    assert.equal(adminLoginRateLimitKey(), first);
  } finally {
    if (previousUsername === undefined) delete process.env.ADMIN_USERNAME;
    else process.env.ADMIN_USERNAME = previousUsername;
    if (previousSecret === undefined) delete process.env.ADMIN_SESSION_SECRET;
    else process.env.ADMIN_SESSION_SECRET = previousSecret;
    if (previousForwardedFor === undefined) delete process.env.HTTP_X_FORWARDED_FOR;
    else process.env.HTTP_X_FORWARDED_FOR = previousForwardedFor;
  }
});
