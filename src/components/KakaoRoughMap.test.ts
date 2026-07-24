import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const source = readFileSync(
  join(process.cwd(), "src", "components", "KakaoRoughMap.tsx"),
  "utf8",
);

test("Given the Kakao map component, when its loading contract is inspected, then document-write is isolated and responsive failure paths are handled", () => {
  assert.match(source, /srcDoc=\{srcDoc\}/);
  assert.match(source, /new ResizeObserver/);
  assert.match(source, /window\.parent\.postMessage/);
  assert.match(source, /event\.source !== iframeRef\.current\?\.contentWindow/);
  assert.match(source, /ROUGH_MAP_FOOTER_HEIGHT = 32/);
  assert.match(source, /mapWidth: \$\{JSON\.stringify\(String\(width\)\)\}/);
  assert.match(source, /카카오맵에서 확인/);
  assert.equal(source.includes('from "next/script"'), false);
});
