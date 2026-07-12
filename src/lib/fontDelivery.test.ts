import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const projectRoot = process.cwd();
const layoutPath = join(projectRoot, "src", "app", "layout.tsx");
const fontCssPath = join(projectRoot, "src", "app", "pretendard.css");
const instrumentationPath = join(projectRoot, "src", "instrumentation-client.ts");
const legacyDevToolsPath = join(
  projectRoot,
  "src",
  "components",
  "ReactDevTools.tsx",
);
const fontRoot = join(projectRoot, "public", "fonts", "pretendard", "v1.3.9");

test("Given the root layout, when font delivery is inspected, then only local Pretendard is loaded before global styles", () => {
  // Given
  const layoutSource = readFileSync(layoutPath, "utf8");

  // When
  const fontImportIndex = layoutSource.indexOf('import "./pretendard.css";');
  const globalImportIndex = layoutSource.indexOf('import "./globals.css";');

  // Then
  assert.equal(layoutSource.includes("cdn.jsdelivr.net"), false);
  assert.equal(layoutSource.includes("unpkg.com"), false);
  assert.ok(fontImportIndex >= 0);
  assert.ok(fontImportIndex < globalImportIndex);
});

test("Given the local font stylesheet, when its URLs are parsed, then all 92 official variable subsets exist at safe same-origin paths", () => {
  // Given
  assert.ok(existsSync(fontCssPath));
  const fontCss = readFileSync(fontCssPath, "utf8");

  // When
  const fontUrls = [...fontCss.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map(
    (match) => match[1],
  );

  // Then
  assert.equal(fontUrls.length, 92);
  assert.equal(new Set(fontUrls).size, 92);
  for (const [index, url] of fontUrls.entries()) {
    assert.ok(url !== undefined);
    assert.equal(url.includes(".."), false);
    assert.equal(
      url,
      `/fonts/pretendard/v1.3.9/woff2-dynamic-subset/PretendardVariable.subset.${index}.woff2`,
    );
    assert.ok(existsSync(join(projectRoot, "public", url.slice(1))));
  }
});

test("Given the self-hosted font assets, when provenance is audited, then the upstream license and pinned source are present", () => {
  // Given
  const licensePath = join(fontRoot, "LICENSE.txt");
  const provenancePath = join(fontRoot, "PROVENANCE.md");

  // When
  const license = existsSync(licensePath) ? readFileSync(licensePath, "utf8") : "";
  const provenance = existsSync(provenancePath)
    ? readFileSync(provenancePath, "utf8")
    : "";

  // Then
  assert.match(license, /SIL OPEN FONT LICENSE Version 1\.1/);
  assert.match(provenance, /pretendard@1\.3\.9/);
  assert.match(provenance, /node_modules\/pretendard\/dist\/web\/variable/);
});

test("Given React diagnostics, when source gates are inspected, then client instrumentation is development-only and disableable", () => {
  // Given
  assert.ok(existsSync(instrumentationPath));
  const layoutSource = readFileSync(layoutPath, "utf8");
  const instrumentationSource = readFileSync(instrumentationPath, "utf8");

  // When
  const combinedSource = `${layoutSource}\n${instrumentationSource}`;

  // Then
  assert.equal(existsSync(legacyDevToolsPath), false);
  assert.equal(layoutSource.includes("ReactDevTools"), false);
  assert.match(combinedSource, /process\.env\.NODE_ENV === "development"/);
  assert.match(combinedSource, /NEXT_PUBLIC_DISABLE_REACT_DEVTOOLS !== "1"/);
  assert.match(instrumentationSource, /import\("react-grab"\)/);
  assert.match(
    instrumentationSource,
    /import\("react-scan\/dist\/index\.js"\)/,
  );
  assert.match(instrumentationSource, /\.init\(/);
  assert.match(instrumentationSource, /\.scan\(/);
  assert.equal(/https?:\/\//.test(instrumentationSource), false);
});
