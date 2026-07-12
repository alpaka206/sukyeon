import type { Browser } from "playwright";

import { AuditError, type Profile } from "./auditPolicy";

export type ScanResult = {
  readonly profile: Profile;
  readonly unnecessaryCount: number;
  readonly events: unknown;
};

export async function runReactScan(
  browser: Browser,
  baseUrl: URL,
  instrumentationBundle: string,
  profile: Profile,
): Promise<ScanResult> {
  const viewport =
    profile === "mobile"
      ? { width: 375, height: 812 }
      : { width: 1_280, height: 800 };
  const context = await browser.newContext({ viewport });
  await context.addInitScript({ content: instrumentationBundle });
  const page = await context.newPage();
  try {
    const response = await page.goto(new URL("/", baseUrl).toString(), {
      waitUntil: "networkidle",
    });
    if (response?.status() !== 200) {
      throw new AuditError(
        `react-scan origin returned ${response?.status() ?? "no response"}.`,
      );
    }
    await page.waitForFunction(
      () =>
        typeof Reflect.get(window, "__SUKYEON_REACT_SCAN_COUNT__") ===
        "number",
    );
    const next = page.getByRole("button", { name: "다음 슬라이드" });
    if ((await next.count()) === 1) {
      const before = await page.locator('[aria-current="true"]').getAttribute("aria-label");
      await next.click();
      await page.waitForFunction(
        (previous) =>
          document
            .querySelector('[aria-current="true"]')
            ?.getAttribute("aria-label") !== previous,
        before,
      );
    }
    const unnecessaryCount = await page.evaluate(() =>
      Reflect.get(window, "__SUKYEON_REACT_SCAN_COUNT__"),
    );
    if (typeof unnecessaryCount !== "number") {
      throw new AuditError("react-scan did not initialize before React mounted.");
    }
    const events = await page.evaluate(
      () => Reflect.get(window, "__SUKYEON_REACT_SCAN_EVENTS__") ?? [],
    );
    return { events, profile, unnecessaryCount };
  } finally {
    await context.close();
  }
}
