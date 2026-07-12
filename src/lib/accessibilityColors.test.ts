import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const projectRoot = process.cwd();
const designPath = join(projectRoot, "DESIGN.md");
const globalsPath = join(projectRoot, "src", "app", "globals.css");
const dataPagePath = join(projectRoot, "src", "app", "(site)", "data", "page.tsx");
const homePagePath = join(projectRoot, "src", "app", "(site)", "page.tsx");
const productsPagePath = join(projectRoot, "src", "app", "(site)", "products", "page.tsx");
const loginPagePath = join(projectRoot, "src", "app", "admin", "login", "page.tsx");
const headerPath = join(projectRoot, "src", "components", "Header.tsx");
const sourceRoot = join(projectRoot, "src");

const requiredTokens = [
  { designToken: "--color-muted", cssToken: "--color-muted", value: "#5e6c84" },
  { designToken: "--color-muted-dark", cssToken: "--color-muted-dark", value: "#9fb0c9" },
  { designToken: "--color-accent-on-dark", cssToken: "--color-accent-on-dark", value: "#89a7ff" },
  { designToken: "--accent-primary", cssToken: "--color-brand", value: "#22409b" },
] as const;

const requiredPairs = [
  { label: "muted on white", foreground: "#5e6c84", background: "#ffffff" },
  { label: "muted on secondary", foreground: "#5e6c84", background: "#fbfcfe" },
  { label: "muted on muted surface", foreground: "#5e6c84", background: "#f6f9fb" },
  { label: "muted on navy", foreground: "#9fb0c9", background: "#0a1b33" },
  { label: "accent on navy", foreground: "#89a7ff", background: "#0a1b33" },
  { label: "white on primary CTA", foreground: "#ffffff", background: "#22409b" },
] as const;

function relativeLuminance(hex: string): number {
  const channels = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map(
    (channel) => Number.parseInt(channel, 16) / 255,
  );
  const linear = channels.map((channel) =>
    channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * (linear[0] ?? 0) + 0.7152 * (linear[1] ?? 0) + 0.0722 * (linear[2] ?? 0);
}

function contrastRatio(foreground: string, background: string): number {
  const values = [relativeLuminance(foreground), relativeLuminance(background)];
  const lighter = Math.max(...values);
  const darker = Math.min(...values);
  return (lighter + 0.05) / (darker + 0.05);
}

test("Given the design contract, when accessibility colors are parsed, then every normal-text pair reaches WCAG AA", () => {
  // Given
  const design = readFileSync(designPath, "utf8");
  const globals = readFileSync(globalsPath, "utf8");

  // When
  const ratios = requiredPairs.map((pair) => ({
    ...pair,
    ratio: contrastRatio(pair.foreground, pair.background),
  }));

  // Then
  for (const pair of requiredTokens) {
    assert.match(
      design,
      new RegExp("`" + pair.designToken + "`.*`" + pair.value + "`", "i"),
    );
    assert.match(globals, new RegExp(`${pair.cssToken}:\\s*${pair.value}`, "i"));
  }
  for (const pair of ratios) {
    assert.ok(pair.ratio >= 4.5, `${pair.label} measured ${pair.ratio.toFixed(3)}:1`);
  }
});

test("Given JSX sources, when accessibility contracts are scanned, then audited semantics and colors remain present", () => {
  // Given
  const sources = readdirSync(sourceRoot, { recursive: true, encoding: "utf8" })
    .filter((path) => path.endsWith(".tsx"))
    .map((path) => readFileSync(join(sourceRoot, path), "utf8"));

  // When
  const combinedSource = sources.join("\n");
  const header = readFileSync(headerPath, "utf8");
  const login = readFileSync(loginPagePath, "utf8");
  const home = readFileSync(homePagePath, "utf8");
  const products = readFileSync(productsPagePath, "utf8");

  // Then
  assert.equal(combinedSource.includes("text-[#8a96ab]"), false);
  assert.equal(combinedSource.includes("placeholder:text-[#8a96ab]"), false);
  assert.equal(combinedSource.includes("text-[#5d6f88]"), false);
  assert.equal(combinedSource.includes("text-[#4f74e6]"), false);
  assert.equal(combinedSource.includes("hover:text-[#4f74e6]"), false);
  assert.equal(combinedSource.includes("bg-[#4f74e6]"), false);
  assert.match(header, /onFocus=.*setOpenMenu/);
  assert.match(header, /onBlur=/);
  assert.match(header, /aria-haspopup="true"/);
  assert.match(header, /mobileOpen \? "메뉴 닫기" : "메뉴 열기"/);
  assert.match(login, /htmlFor="admin-username"/);
  assert.match(login, /htmlFor="admin-password"/);
  assert.match(login, /role="alert"/);
  assert.match(home, /max-w-\[300px\]/);
  assert.match(home, /sm:max-w-190/);
  assert.match(products, /text-pretty/);
  assert.match(products, /break-keep/);
  assert.match(home, /전문 생산/);
  assert.match(home, /최상의 제품/);
  assert.match(products, /우수한 이형성과/);
  assert.match(products, /고온 안정성/);
  assert.match(products, /작업 환경/);
  assert.match(products, /피막 형성/);
  assert.match(products, /keepTogether\(lineup\.intro\)/);
});

test("Given the data route, when the viewport is narrow, then accessible cards replace the desktop table", () => {
  // Given
  const design = readFileSync(designPath, "utf8");
  const dataPage = readFileSync(dataPagePath, "utf8");

  // When
  const hasMobileCards = /aria-label="자료 목록"[^>]*className="[^"]*sm:hidden/.test(dataPage);
  const hasDesktopTable = /className="[^"]*hidden[^"]*sm:block[^"]*"/.test(dataPage);

  // Then
  assert.match(design, /### Data Mobile Card/);
  assert.equal(hasMobileCards, true);
  assert.equal(hasDesktopTable, true);
});
