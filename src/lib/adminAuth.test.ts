import assert from "node:assert/strict";
import crypto from "node:crypto";
import { afterEach, beforeEach, test } from "node:test";
import type { TestContext } from "node:test";
import {
  SESSION_MAX_AGE,
  adminLoginRateLimitKey,
  createSessionToken,
  verifyCredentials,
  verifySession,
} from "./adminAuth";

let previousUsername: string | undefined;
let previousPassword: string | undefined;
let previousSessionSecret: string | undefined;
let previousForwardedFor: string | undefined;
let previousDateNow: typeof Date.now;

function restoreEnvironment(name: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[name];
    return;
  }
  process.env[name] = value;
}

function configureAdmin(username = "administrator", password = "correct-password"): void {
  process.env.ADMIN_USERNAME = username;
  process.env.ADMIN_PASSWORD = password;
  process.env.ADMIN_SESSION_SECRET = "test-session-secret";
}

function countCredentialHashCalls(context: TestContext): () => number {
  let hashCalls = 0;
  const createHash = crypto.createHash;
  context.mock.method(crypto, "createHash", (algorithm: string) => {
    hashCalls += 1;
    return createHash(algorithm);
  });
  return () => hashCalls;
}

beforeEach(() => {
  previousUsername = process.env.ADMIN_USERNAME;
  previousPassword = process.env.ADMIN_PASSWORD;
  previousSessionSecret = process.env.ADMIN_SESSION_SECRET;
  previousForwardedFor = process.env.HTTP_X_FORWARDED_FOR;
  previousDateNow = Date.now;
});

afterEach(() => {
  restoreEnvironment("ADMIN_USERNAME", previousUsername);
  restoreEnvironment("ADMIN_PASSWORD", previousPassword);
  restoreEnvironment("ADMIN_SESSION_SECRET", previousSessionSecret);
  restoreEnvironment("HTTP_X_FORWARDED_FOR", previousForwardedFor);
  Date.now = previousDateNow;
});

test("Given exact credentials, when verified, then authentication succeeds", () => {
  // Given
  configureAdmin();

  // When
  const verified = verifyCredentials("administrator", "correct-password");

  // Then
  assert.equal(verified, true);
});

test("Given a valid username, when credentials are verified, then both comparisons execute", (context) => {
  // Given
  configureAdmin();
  const hashCalls = countCredentialHashCalls(context);

  // When
  verifyCredentials("administrator", "correct-password");

  // Then
  assert.equal(hashCalls(), 4);
});

test("Given an invalid username, when credentials are verified, then both comparisons execute", (context) => {
  // Given
  configureAdmin();
  const hashCalls = countCredentialHashCalls(context);

  // When
  verifyCredentials("wrong-admin", "correct-password");

  // Then
  assert.equal(hashCalls(), 4);
});

test("Given an equal-length wrong password, when verified, then authentication fails", () => {
  // Given
  configureAdmin();

  // When
  const verified = verifyCredentials("administrator", "corrEct-password");

  // Then
  assert.equal(verified, false);
});

test("Given an unequal-length wrong password, when verified, then authentication fails", () => {
  // Given
  configureAdmin();

  // When
  const verified = verifyCredentials("administrator", "wrong");

  // Then
  assert.equal(verified, false);
});

test("Given exact Unicode credentials, when verified, then authentication succeeds", () => {
  // Given
  configureAdmin("관리자", "비밀번호-🔒");

  // When
  const verified = verifyCredentials("관리자", "비밀번호-🔒");

  // Then
  assert.equal(verified, true);
});

test("Given an empty credential, when verified, then authentication fails", () => {
  // Given
  configureAdmin();

  // When
  const verified = verifyCredentials("", "correct-password");

  // Then
  assert.equal(verified, false);
});

test("Given an oversized credential, when verified, then authentication fails", () => {
  // Given
  configureAdmin();

  // When
  const verified = verifyCredentials("administrator", "x".repeat(16_384));

  // Then
  assert.equal(verified, false);
});

test("Given unchanged credentials and a fresh token, when verified, then the session is valid", () => {
  // Given
  configureAdmin();
  const token = createSessionToken();

  // When
  const verified = verifySession(token);

  // Then
  assert.equal(verified, true);
});

test("Given a fresh token, when its body is decoded, then it contains only the expiry", () => {
  // Given
  configureAdmin();
  const token = createSessionToken();

  // When
  const body = Buffer.from(token.slice(0, token.indexOf(".")), "base64url").toString("utf8");

  // Then
  assert.match(body, /^\{"exp":\d+\}$/);
  assert.equal(body.includes("administrator"), false);
  assert.equal(body.includes("correct-password"), false);
});

test("Given a token minted before username rotation, when verified, then the session is rejected", () => {
  // Given
  configureAdmin();
  const token = createSessionToken();
  process.env.ADMIN_USERNAME = "rotated-administrator";

  // When
  const verified = verifySession(token);

  // Then
  assert.equal(verified, false);
});

test("Given a token minted before password rotation, when verified, then the session is rejected", () => {
  // Given
  configureAdmin();
  const token = createSessionToken();
  process.env.ADMIN_PASSWORD = "rotated-password";

  // When
  const verified = verifySession(token);

  // Then
  assert.equal(verified, false);
});

test("Given a malformed token, when verified, then the session is rejected", () => {
  // Given
  configureAdmin();
  const token = "not-a-session-token";

  // When
  const verified = verifySession(token);

  // Then
  assert.equal(verified, false);
});

test("Given an oversized malformed token, when verified, then the session is rejected", () => {
  // Given
  configureAdmin();
  const token = "x".repeat(16_384);

  // When
  const verified = verifySession(token);

  // Then
  assert.equal(verified, false);
});

test("Given a tampered token, when verified, then the session is rejected", () => {
  // Given
  configureAdmin();
  const token = createSessionToken();
  const tamperedToken = `${token.slice(0, -1)}${token.endsWith("A") ? "B" : "A"}`;

  // When
  const verified = verifySession(tamperedToken);

  // Then
  assert.equal(verified, false);
});

test("Given an expired token, when verified, then the session is rejected", () => {
  // Given
  configureAdmin();
  const issuedAt = Date.now();
  const token = createSessionToken();
  Date.now = () => issuedAt + SESSION_MAX_AGE * 1000 + 1;

  // When
  const verified = verifySession(token);

  // Then
  assert.equal(verified, false);
});

test("rate-limit identity ignores forged proxy-header environment values", () => {
  // Given
  configureAdmin();
  process.env.HTTP_X_FORWARDED_FOR = "198.51.100.9";
  const first = adminLoginRateLimitKey();
  process.env.HTTP_X_FORWARDED_FOR = "203.0.113.7";

  // When
  const second = adminLoginRateLimitKey();

  // Then
  assert.equal(second, first);
});
