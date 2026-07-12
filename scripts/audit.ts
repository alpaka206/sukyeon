import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { chromium } from "playwright";
import type { Browser } from "playwright";

import {
  assertBudgets,
  AUDIT_PROFILES,
  AUDIT_RUNS,
  AuditError,
  type AuditResult,
  type RetryReason,
} from "./auditPolicy";
import { createInstrumentationBundle } from "./auditInstrumentation";
import { installCdpFetchBridge } from "./auditCdpBridge";
import { runLighthouseAttempt } from "./auditRunner";
import { runReactScan, type ScanResult } from "./auditScan";

const MAX_ATTEMPTS = 3;

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "object" && error !== null && "message" in error) {
    return String(error.message);
  }
  return JSON.stringify(error);
}

async function openAuditBrowser(
  cdpPort: number,
  cdpBindAddress: string,
): Promise<Browser> {
  return process.env.AUDIT_CDP_URL
    ? chromium.connectOverCDP(process.env.AUDIT_CDP_URL)
    : chromium.launch({
        channel: "chrome",
        args: [
          `--remote-debugging-address=${cdpBindAddress}`,
          `--remote-debugging-port=${cdpPort}`,
        ],
      });
}

async function openScanBrowser(): Promise<Browser> {
  return chromium.launch({ channel: "chrome" });
}

async function main(): Promise<void> {
  const baseUrl = new URL(process.env.AUDIT_BASE_URL ?? "http://localhost:3000");
  const evidenceDirectory = resolve(".omo", "evidence");
  await mkdir(evidenceDirectory, { recursive: true });
  const instrumentationBundle = await createInstrumentationBundle();
  const results: AuditResult[] = [];
  const retryReasons: RetryReason[] = [];
  const scanRuns: ScanResult[] = [];
  let nextCdpPort = 43_000;
  const cdpHost = process.env.AUDIT_CDP_HOST ?? "127.0.0.1";
  const cdpBindAddress = process.env.AUDIT_CDP_BIND_ADDRESS ?? cdpHost;
  for (const profile of AUDIT_PROFILES) {
    for (const run of AUDIT_RUNS) {
      let completed = false;
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
        let browser: Browser | undefined;
        try {
          const cdpPort = nextCdpPort;
          nextCdpPort += 1;
          const lighthousePort = Number.parseInt(
            process.env.AUDIT_LIGHTHOUSE_PORT ?? String(cdpPort),
            10,
          );
          browser = await openAuditBrowser(cdpPort, cdpBindAddress);
          const outcome = await runLighthouseAttempt(browser, {
            attempt,
            baseUrl,
            cdpHost,
            cdpPort,
            evidenceDirectory,
            lighthousePort,
            profile,
            run,
          });
          results.push(outcome.result);
          completed = true;
          break;
        } catch (error: unknown) {
          const message = errorMessage(error);
          retryReasons.push({
            attempt,
            message,
            profile,
            run,
          });
          await writeFile(
            resolve(evidenceDirectory, "lighthouse-retries.json"),
            `${JSON.stringify({ retryReasons }, null, 2)}\n`,
          );
          if (attempt === MAX_ATTEMPTS) {
            throw new AuditError(
              `${profile} run ${run} failed after ${MAX_ATTEMPTS} cold attempts: ${message}`,
            );
          }
        } finally {
          await browser?.close();
        }
      }
      if (!completed) {
        throw new AuditError(`${profile} run ${run} did not complete.`);
      }
    }
  }
  for (const profile of AUDIT_PROFILES) {
    const browser = await openScanBrowser();
    try {
      scanRuns.push(
        await runReactScan(browser, baseUrl, instrumentationBundle, profile),
      );
    } finally {
      await browser.close();
    }
  }
  const unnecessaryCount = scanRuns.reduce(
    (total, scan) => total + scan.unnecessaryCount,
    0,
  );
  await writeFile(
    resolve(evidenceDirectory, "react-scan.json"),
    `${JSON.stringify({ unnecessaryCount, runs: scanRuns }, null, 2)}\n`,
  );
  await writeFile(
    resolve(evidenceDirectory, "lighthouse-summary.json"),
    `${JSON.stringify({
      coldIsolation: {
        browserContextPerAttempt: true,
        browserProcessPerAttempt: true,
        disableStorageReset: false,
      },
      results,
      retryReasons,
    }, null, 2)}\n`,
  );
  assertBudgets(results, unnecessaryCount);
}

const restoreCdpFetch = installCdpFetchBridge();
void main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.stack : JSON.stringify(error));
    process.exitCode = 1;
  })
  .finally(restoreCdpFetch);
