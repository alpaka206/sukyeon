import assert from "node:assert/strict";
import { test } from "node:test";
import { applyContentClears, compactContentArrays } from "./adminContentClears";

test("Given an asset clear inside an array item, when clears are applied, then the asset field is removed from the merged document", () => {
  // Given
  const merged: Record<string, unknown> = {
    items: [
      { _key: "a", code: "R-100", image: { _type: "image", asset: { _ref: "image-1" } } },
      { _key: "b", code: "R-200", image: { _type: "image", asset: { _ref: "image-2" } } },
    ],
  };

  // When
  const topLevel = applyContentClears(merged, ["items.0.image"]);

  // Then
  assert.deepEqual(topLevel, []);
  assert.deepEqual(merged.items, [
    { _key: "a", code: "R-100" },
    { _key: "b", code: "R-200", image: { _type: "image", asset: { _ref: "image-2" } } },
  ]);
});

test("Given a top-level clear, when clears are applied, then the field is dropped from set and returned for unset", () => {
  // Given
  const merged: Record<string, unknown> = {
    title: "제품 안내",
    file: { _type: "file", asset: { _ref: "file-1" } },
  };

  // When
  const topLevel = applyContentClears(merged, ["file"]);

  // Then
  assert.deepEqual(topLevel, ["file"]);
  assert.deepEqual(merged, { title: "제품 안내" });
});

test("Given cleared array elements, when clears are applied, then later indexes are removed first so earlier removals cannot shift them", () => {
  // Given
  const merged: Record<string, unknown> = {
    greeting: { paragraphs: ["첫째", "둘째", "셋째", "넷째"] },
  };

  // When
  const topLevel = applyContentClears(merged, ["greeting.paragraphs.0", "greeting.paragraphs.2"]);

  // Then
  assert.deepEqual(topLevel, []);
  assert.deepEqual(merged, { greeting: { paragraphs: ["둘째", "넷째"] } });
});

test("Given a clear for a deeply nested slide image, when clears are applied, then only that slide loses its image", () => {
  // Given
  const merged: Record<string, unknown> = {
    hero: {
      slides: [
        { _key: "s1", alt: "첫 슬라이드", desktopImage: { asset: { _ref: "image-1" } } },
        { _key: "s2", alt: "둘째 슬라이드", desktopImage: { asset: { _ref: "image-2" } } },
      ],
    },
  };

  // When
  applyContentClears(merged, ["hero.slides.1.desktopImage"]);

  // Then
  assert.deepEqual(merged, {
    hero: {
      slides: [
        { _key: "s1", alt: "첫 슬라이드", desktopImage: { asset: { _ref: "image-1" } } },
        { _key: "s2", alt: "둘째 슬라이드" },
      ],
    },
  });
});

test("Given array holes left by clear-only rows, when arrays are compacted, then no null elements reach the patch payload", () => {
  // Given — 값 삭제만 한 행은 폼 인덱스에 구멍을 남긴다
  const slides: unknown[] = [];
  slides[1] = { _key: "s1", alt: "슬라이드" };
  const merged: Record<string, unknown> = { hero: { slides } };

  // When
  const compacted = compactContentArrays(merged);

  // Then
  assert.equal(JSON.stringify(compacted).includes("null"), false);
  assert.deepEqual(compacted, { hero: { slides: [{ _key: "s1", alt: "슬라이드" }] } });
});

test("Given nested arrays with holes, when arrays are compacted, then every level is compacted", () => {
  // Given
  const lines: unknown[] = [];
  lines[1] = "둘째 줄";
  const entries: unknown[] = [];
  entries[1] = { _key: "h1", year: "2020", lines };
  const merged: Record<string, unknown> = { history: { entries } };

  // When
  const compacted = compactContentArrays(merged);

  // Then
  assert.deepEqual(compacted, {
    history: { entries: [{ _key: "h1", year: "2020", lines: ["둘째 줄"] }] },
  });
});

test("Given a clear path that no longer matches the document, when clears are applied, then the document is left untouched", () => {
  // Given
  const merged: Record<string, unknown> = { title: "제품" };

  // When
  const topLevel = applyContentClears(merged, ["items.5.image", "hero.slides.0.desktopImage"]);

  // Then
  assert.deepEqual(topLevel, []);
  assert.deepEqual(merged, { title: "제품" });
});
