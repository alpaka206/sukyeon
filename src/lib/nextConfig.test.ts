import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from "next/constants";
import nextConfig from "../../next.config";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const KAKAO_SCRIPT = "https://*.daumcdn.net https://*.kakaocdn.net";
const KAKAO_SCRIPT_HTTP = "http://*.daumcdn.net http://*.kakaocdn.net";
const KAKAO_RESOURCES = "https://*.daum.net https://*.daumcdn.net https://*.kakao.com https://*.kakaocdn.net";
const KAKAO_RESOURCES_HTTP = "http://*.daum.net http://*.daumcdn.net http://*.kakao.com http://*.kakaocdn.net";
const SANITY_CONNECT = "https://api.sanity.io https://*.api.sanity.io https://apicdn.sanity.io https://*.apicdn.sanity.io https://cdn.sanity.io https://www.sanity.io https://*.sanity.io https://*.sanity-cdn.com wss://api.sanity.io wss://*.api.sanity.io";
const SANITY_FRAMES = "https://www.sanity.io https://*.sanity.io";
const PRODUCTION_CSP = `default-src 'self'; script-src 'self' 'unsafe-inline' ${KAKAO_SCRIPT}; style-src 'self' 'unsafe-inline' ${KAKAO_SCRIPT}; img-src 'self' data: blob: https://cdn.sanity.io ${KAKAO_RESOURCES}; font-src 'self' data: ${KAKAO_SCRIPT}; connect-src 'self' ${KAKAO_RESOURCES} ${SANITY_CONNECT}; frame-src 'self' ${KAKAO_RESOURCES} ${SANITY_FRAMES}; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; manifest-src 'self'; upgrade-insecure-requests`;
const DEVELOPMENT_CSP = `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' ${KAKAO_SCRIPT} ${KAKAO_SCRIPT_HTTP}; style-src 'self' 'unsafe-inline' ${KAKAO_SCRIPT} ${KAKAO_SCRIPT_HTTP}; img-src 'self' data: blob: https://cdn.sanity.io ${KAKAO_RESOURCES} ${KAKAO_RESOURCES_HTTP}; font-src 'self' data: ${KAKAO_SCRIPT} ${KAKAO_SCRIPT_HTTP}; connect-src 'self' ${KAKAO_RESOURCES} ${KAKAO_RESOURCES_HTTP} ${SANITY_CONNECT} ws: wss:; frame-src 'self' ${KAKAO_RESOURCES} ${KAKAO_RESOURCES_HTTP} ${SANITY_FRAMES}; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; manifest-src 'self'`;

let previousProjectId: string | undefined;
let previousDataset: string | undefined;
let previousDiagnostics: string | undefined;

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
  previousDiagnostics = process.env.NEXT_PUBLIC_ENABLE_REACT_DIAGNOSTICS;
  delete process.env.NEXT_PUBLIC_ENABLE_REACT_DIAGNOSTICS;
});

afterEach(() => {
  restoreEnvironment("NEXT_PUBLIC_SANITY_PROJECT_ID", previousProjectId);
  restoreEnvironment("NEXT_PUBLIC_SANITY_DATASET", previousDataset);
  restoreEnvironment("NEXT_PUBLIC_ENABLE_REACT_DIAGNOSTICS", previousDiagnostics);
});

test("Given production config, when headers are resolved, then map, Studio, and security headers are configured", async () => {
  const config = nextConfig(PHASE_PRODUCTION_BUILD);
  const resolveHeaders = config.headers;
  if (typeof resolveHeaders !== "function") {
    assert.fail("Expected production headers to be configured");
  }

  const headers = await resolveHeaders();

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

test("Given development config, when headers are resolved, then HMR and protocol-relative RoughMap resources are allowed without HSTS", async () => {
  const config = nextConfig(PHASE_DEVELOPMENT_SERVER);
  const resolveHeaders = config.headers;
  if (typeof resolveHeaders !== "function") {
    assert.fail("Expected development headers to be configured");
  }

  const headers = await resolveHeaders();

  assert.equal(headers[0]?.headers[0]?.value, DEVELOPMENT_CSP);
  assert.equal(
    headers[0]?.headers.some((header) => header.key === "Strict-Transport-Security"),
    false,
  );
});

test("Given opt-in React diagnostics, when development CSP is resolved, then only its version endpoint is added", async () => {
  process.env.NEXT_PUBLIC_ENABLE_REACT_DIAGNOSTICS = "1";
  const config = nextConfig(PHASE_DEVELOPMENT_SERVER);
  const resolveHeaders = config.headers;
  if (typeof resolveHeaders !== "function") {
    assert.fail("Expected development headers to be configured");
  }

  const headers = await resolveHeaders();
  const csp = headers[0]?.headers[0]?.value ?? "";

  assert.match(csp, /connect-src [^;]*https:\/\/www\.react-grab\.com/);
});

test("Given configured Sanity tenant values, when image config is resolved, then only that image path is allowed", () => {
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "project-id";
  process.env.NEXT_PUBLIC_SANITY_DATASET = "production";

  const config = nextConfig(PHASE_PRODUCTION_BUILD);

  assert.deepEqual(config.images?.remotePatterns, [
    {
      protocol: "https",
      hostname: "cdn.sanity.io",
      pathname: "/images/project-id/production/**",
    },
  ]);
});

test("Given an incomplete Sanity tenant, when image config is resolved, then no Sanity remote path is allowed", () => {
  delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  process.env.NEXT_PUBLIC_SANITY_DATASET = "production";

  const config = nextConfig(PHASE_PRODUCTION_BUILD);

  assert.deepEqual(config.images?.remotePatterns, []);
});

test("Given production image config, when inspected, then modern formats and approved qualities are enabled", () => {
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "project-id";
  process.env.NEXT_PUBLIC_SANITY_DATASET = "production";

  const images = nextConfig(PHASE_PRODUCTION_BUILD).images;

  assert.deepEqual(images?.formats, ["image/avif", "image/webp"]);
  assert.deepEqual(images?.qualities, [60, 75, 85, 100]);
  assert.equal(Object.hasOwn(images ?? {}, "unoptimized"), false);
});

test("Given the header logo, when its delivery contract is inspected, then it uses the tenant-scoped Next optimizer", () => {
  const header = readFileSync(
    join(process.cwd(), "src", "components", "Header.tsx"),
    "utf8",
  );

  const bypassesOptimizer = /\bunoptimized\b/.test(header);

  assert.equal(bypassesOptimizer, false);
  assert.match(header, /sizes="150px"/);
  assert.match(header, /quality=\{85\}/);
});
