import { rename, rm } from "node:fs/promises";
import { resolve } from "node:path";

import { pageFunctions } from "lighthouse/core/lib/page-functions.js";
import type { Browser } from "playwright";
import { playAudit } from "playwright-lighthouse";

import {
  AuditError,
  createAuditAttemptPolicy,
  type AuditResult,
  type ColdNetworkEvidence,
  type Profile,
} from "./auditPolicy";

pageFunctions.esbuildFunctionWrapperString =
  "let __name=(fn,value)=>Object.defineProperty(fn,'name',{value,configurable:true})";

type AttemptInput = {
  readonly browser: Browser;
  readonly baseUrl: URL;
  readonly evidenceDirectory: string;
  readonly cdpPort: number;
  readonly cdpHost: string;
  readonly lighthousePort: number;
  readonly profile: Profile;
  readonly run: number;
  readonly attempt: number;
};

type AttemptOutcome = {
  readonly result: AuditResult;
  readonly isolationKey: string;
};

type NumericAudit = { readonly numericValue?: number };
type NetworkItem = {
  readonly resourceType?: string;
  readonly statusCode?: number;
  readonly transferSize?: number;
};

function numericAuditValue(
  audits: Readonly<Record<string, NumericAudit>>,
  id: string,
): number {
  const value = audits[id]?.numericValue;
  if (typeof value !== "number") {
    throw new AuditError(`Lighthouse did not return the ${id} metric.`);
  }
  return value;
}

function readColdNetwork(items: readonly NetworkItem[]): ColdNetworkEvidence {
  const images = items.filter(
    (item) => item.resourceType === "Image" && item.statusCode === 200,
  );
  return {
    imageResponses: images.length,
    imageTransferBytes: images.reduce(
      (total, item) => total + (item.transferSize ?? 0),
      0,
    ),
    totalTransferBytes: items.reduce(
      (total, item) => total + (item.transferSize ?? 0),
      0,
    ),
  };
}

function parseNetworkItems(details: unknown): readonly NetworkItem[] {
  if (
    typeof details !== "object" ||
    details === null ||
    !("items" in details) ||
    !Array.isArray(details.items)
  ) {
    throw new AuditError("Lighthouse did not return network request evidence.");
  }
  return details.items.map((item: unknown) => {
    if (typeof item !== "object" || item === null) {
      throw new AuditError("Lighthouse returned a malformed network request.");
    }
    return {
      resourceType:
        "resourceType" in item && typeof item.resourceType === "string"
          ? item.resourceType
          : undefined,
      statusCode:
        "statusCode" in item && typeof item.statusCode === "number"
          ? item.statusCode
          : undefined,
      transferSize:
        "transferSize" in item && typeof item.transferSize === "number"
          ? item.transferSize
          : undefined,
    };
  });
}

function assertNoBrowserErrors(audits: Readonly<Record<string, unknown>>): void {
  const consoleAudit = audits["errors-in-console"];
  if (
    typeof consoleAudit === "object" &&
    consoleAudit !== null &&
    "score" in consoleAudit &&
    consoleAudit.score === 0
  ) {
    throw new AuditError(
      "Lighthouse observed browser console errors in this cold attempt.",
    );
  }
}

function desktopConfig(): object {
  return {
    extends: "lighthouse:default",
    settings: {
      formFactor: "desktop",
      throttling: {
        rttMs: 40,
        throughputKbps: 10 * 1_024,
        cpuSlowdownMultiplier: 1,
        requestLatencyMs: 0,
        downloadThroughputKbps: 0,
        uploadThroughputKbps: 0,
      },
      screenEmulation: {
        mobile: false,
        width: 1_350,
        height: 940,
        deviceScaleFactor: 1,
        disabled: false,
      },
    },
  };
}

export async function runLighthouseAttempt(
  browser: Browser,
  input: Omit<AttemptInput, "browser">,
): Promise<AttemptOutcome> {
  const policy = createAuditAttemptPolicy();
  const attemptName = `lighthouse-${input.profile}-${input.run}-attempt-${input.attempt}`;
  const attemptPath = resolve(input.evidenceDirectory, `${attemptName}.json`);
  const canonicalPath = resolve(
    input.evidenceDirectory,
    `lighthouse-${input.profile}-${input.run}.json`,
  );
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    const response = await page.goto(new URL("/", input.baseUrl).toString(), {
      waitUntil: "domcontentloaded",
    });
    if (response?.status() !== 200) {
      throw new AuditError(
        `Audit origin returned ${response?.status() ?? "no response"}.`,
      );
    }
    const outcome = await playAudit({
      page,
      port: input.lighthousePort,
      opts: {
        disableStorageReset: policy.disableStorageReset,
        hostname: input.cdpHost,
      },
      thresholds: {
        performance: 100,
        accessibility: 100,
        "best-practices": 100,
        seo: 100,
      },
      ignoreError: true,
      disableLogs: true,
      config: input.profile === "desktop" ? desktopConfig() : undefined,
      reports: {
        directory: input.evidenceDirectory,
        formats: { json: true },
        name: attemptName,
      },
    });
    const category = outcome.lhr.categories;
    assertNoBrowserErrors(outcome.lhr.audits);
    const score = (id: string): number => {
      const value = category[id]?.score;
      if (typeof value !== "number") {
        throw new AuditError(`Lighthouse did not return the ${id} score.`);
      }
      return Math.round(value * 100);
    };
    const networkItems = parseNetworkItems(
      outcome.lhr.audits["network-requests"]?.details,
    );
    await rm(canonicalPath, { force: true });
    await rename(attemptPath, canonicalPath);
    return {
      isolationKey: policy.isolationKey,
      result: {
        attempt: input.attempt,
        profile: input.profile,
        run: input.run,
        isolationKey: policy.isolationKey,
        scores: {
          performance: score("performance"),
          accessibility: score("accessibility"),
          bestPractices: score("best-practices"),
          seo: score("seo"),
        },
        cls: numericAuditValue(outcome.lhr.audits, "cumulative-layout-shift"),
        tbtMs: numericAuditValue(outcome.lhr.audits, "total-blocking-time"),
        lcpMs: numericAuditValue(outcome.lhr.audits, "largest-contentful-paint"),
        coldNetwork: readColdNetwork(networkItems),
      },
    };
  } catch (error: unknown) {
    await rm(attemptPath, { force: true });
    throw error;
  } finally {
    await context.close();
  }
}
