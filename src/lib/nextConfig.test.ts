import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from "next/constants";
import nextConfig from "../../next.config";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const PRODUCTION_CSP = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://cdn.sanity.io; font-src 'self' data:; connect-src 'self'; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; manifest-src 'self'; upgrade-insecure-requests";
const DEVELOPMENT_CSP = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://cdn.sanity.io; font-src 'self' data:; connect-src 'self'; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; manifest-src 'self'; upgrade-insecure-requests";

let previousProjectId: string | undefined;
let previousDataset: string | undefined;

function restoreEnvironment(name: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[name];
    return;
  }
  process.env[name] = value;
}

beforeEach(() => {
  previousProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  previousDataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
});

afterEach(() => {
  restoreEnvironment("NEXT_PUBLIC_SANITY_PROJECT_ID", previousProjectId);
  restoreEnvironment("NEXT_PUBLIC_SANITY_DATASET", previousDataset);
});

test("Given production config, when headers are resolved, then the approved security policy is exact", async () => {
  // Given
  const config = nextConfig(PHASE_PRODUCTION_BUILD);
  const resolveHeaders = config.headers;
  if (typeof resolveHeaders !== "function") {
    assert.fail("Expected production headers to be configured");
  }

  // When
  const headers = await resolveHeaders();

  // Then
  assert.equal(config.poweredByHeader, false);
  assert.deepEqual(headers, [
    {
      source: "/(.*)",
      headers: [
        { key: "Content-Security-Policy", value: PRODUCTION_CSP },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
        },
      ],
    },
  ]);
});

test("Given development config, when headers are resolved, then CSP adds only unsafe-eval", async () => {
  // Given
  const config = nextConfig(PHASE_DEVELOPMENT_SERVER);
  const resolveHeaders = config.headers;
  if (typeof resolveHeaders !== "function") {
    assert.fail("Expected development headers to be configured");
  }

  // When
  const headers = await resolveHeaders();

  // Then
  assert.equal(headers[0]?.headers[0]?.value, DEVELOPMENT_CSP);
});

test("Given configured Sanity tenant values, when image config is resolved, then only that image path is allowed", () => {
  // Given
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "project-id";
  process.env.NEXT_PUBLIC_SANITY_DATASET = "production";

  // When
  const config = nextConfig(PHASE_PRODUCTION_BUILD);

  // Then
  assert.deepEqual(config.images?.remotePatterns, [
    {
      protocol: "https",
      hostname: "cdn.sanity.io",
      pathname: "/images/project-id/production/**",
    },
  ]);
});

test("Given an incomplete Sanity tenant, when image config is resolved, then no Sanity remote path is allowed", () => {
  // Given
  delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  process.env.NEXT_PUBLIC_SANITY_DATASET = "production";

  // When
  const config = nextConfig(PHASE_PRODUCTION_BUILD);

  // Then
  assert.deepEqual(config.images?.remotePatterns, []);
});

test("Given production image config, when inspected, then modern formats and approved qualities are enabled", () => {
  // Given
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "project-id";
  process.env.NEXT_PUBLIC_SANITY_DATASET = "production";

  // When
  const images = nextConfig(PHASE_PRODUCTION_BUILD).images;

  // Then
  assert.deepEqual(images?.formats, ["image/avif", "image/webp"]);
  assert.deepEqual(images?.qualities, [60, 75, 85, 100]);
  assert.equal(Object.hasOwn(images ?? {}, "unoptimized"), false);
});

test("Given the header logo, when its delivery contract is inspected, then it uses the tenant-scoped Next optimizer", () => {
  // Given
  const header = readFileSync(
    join(process.cwd(), "src", "components", "Header.tsx"),
    "utf8",
  );

  // When
  const bypassesOptimizer = /\bunoptimized\b/.test(header);

  // Then
  assert.equal(bypassesOptimizer, false);
  assert.match(header, /sizes="150px"/);
  assert.match(header, /quality=\{85\}/);
});
