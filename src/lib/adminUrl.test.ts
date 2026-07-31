import assert from "node:assert/strict";
import { test } from "node:test";

import { safeDownloadHref } from "./adminUrl";

const SANITY_PDF = "https://cdn.sanity.io/files/nnfshrkw/production/32ea2b6b.pdf";

test("Given a Sanity file URL, when a download link is built, then ?dl forces an attachment response", () => {
  // Given — CDN 기본값은 Content-Disposition: inline 이라 브라우저에서 열린다
  // When — 다운로드 링크로 변환하면
  const link = safeDownloadHref(SANITY_PDF);

  // Then — ?dl 이 붙어 attachment 로 내려오고, 원본 파일명은 CDN이 유지한다
  assert.equal(link.href, `${SANITY_PDF}?dl=`);
  assert.equal(link.forced, true);
});

test("Given a Sanity file URL with a custom dl name, when a download link is built, then the name is kept", () => {
  const link = safeDownloadHref(`${SANITY_PDF}?dl=msds.pdf`);

  assert.equal(link.href, `${SANITY_PDF}?dl=msds.pdf`);
  assert.equal(link.forced, true);
});

test("Given a non-Sanity URL, when a download link is built, then it stays untouched and unforced", () => {
  // Given — 관리자 화면에서 외부 주소를 직접 입력한 자료
  const link = safeDownloadHref("https://example.com/catalog.pdf");

  // Then — attachment 를 보장할 수 없으므로 새 탭으로 열도록 forced=false 로 남긴다
  assert.equal(link.href, "https://example.com/catalog.pdf");
  assert.equal(link.forced, false);
});

test("Given an internal path, when a download link is built, then it is preserved as a normal link", () => {
  const link = safeDownloadHref("/data/msds");

  assert.equal(link.href, "/data/msds");
  assert.equal(link.forced, false);
});

test("Given an unusable value, when a download link is built, then the fallback is returned unforced", () => {
  // Given — 비어 있거나 javascript: 같은 위험한 값
  assert.deepEqual(safeDownloadHref(undefined), { href: "#", forced: false });
  assert.deepEqual(safeDownloadHref("javascript:alert(1)"), { href: "#", forced: false });
});
