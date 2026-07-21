import assert from "node:assert/strict";
import { test } from "node:test";
import { mergeContentFormFields, parseContentForm } from "./adminContentForm";

test("Given string-list inputs at numeric leaf paths, when the form is parsed, then the strings are kept verbatim", () => {
  // Given — 라인업 특징(bullets)을 두 줄 입력한 폼 제출
  const formData = new FormData();
  formData.set("array.bullets", "replace");
  formData.set("content.key", "release");
  formData.set("content.title", "이형제");
  formData.set("content.bullets.0", "우수한 이형성 — 결함 저감");
  formData.set("content.bullets.1", "고온 안정성");

  // When
  const parsed = parseContentForm("productLineup", formData);

  // Then — 과거 회귀: 문자열이 {}로 바뀌어 저장 때마다 목록이 사라졌다
  assert.deepEqual(parsed.errors, []);
  assert.deepEqual(parsed.fields.bullets, ["우수한 이형성 — 결함 저감", "고온 안정성"]);
});

test("Given nested string-list inputs inside an array item, when the form is parsed, then item points survive", () => {
  // Given — 제품 항목의 특징(points) 입력
  const formData = new FormData();
  formData.set("array.items", "replace");
  formData.set("array.items.0.points", "replace");
  formData.set("content.key", "release");
  formData.set("content.title", "이형제");
  formData.set("content.items.0.code", "R-100");
  formData.set("content.items.0.points.0", "피막 형성");

  // When
  const parsed = parseContentForm("productLineup", formData);

  // Then
  assert.deepEqual(parsed.errors, []);
  assert.deepEqual(parsed.fields.items, [
    { visible: true, code: "R-100", points: ["피막 형성"] },
  ]);
});

test("Given singleton paragraph inputs, when the form is parsed, then paragraphs are plain strings", () => {
  // Given — 회사소개 인사말 문단 편집
  const formData = new FormData();
  formData.set("array.greeting.paragraphs", "replace");
  formData.set("content.greeting.paragraphs.0", "첫 문단");
  formData.set("content.greeting.paragraphs.1", "둘째 문단");

  // When
  const parsed = parseContentForm("aboutPage", formData);

  // Then
  assert.deepEqual(parsed.errors, []);
  assert.deepEqual(parsed.fields, { greeting: { paragraphs: ["첫 문단", "둘째 문단"] } });
});

test("Given an asset clear input inside an array item, when the form is parsed, then the unset path is recorded", () => {
  // Given
  const formData = new FormData();
  formData.set("content.key", "release");
  formData.set("content.title", "이형제");
  formData.set("clear.items.0.image", "true");

  // When
  const parsed = parseContentForm("productLineup", formData);

  // Then
  assert.deepEqual(parsed.errors, []);
  assert.deepEqual(parsed.unset, ["items.0.image"]);
});

test("Given child-first array markers and all nested rows deleted, when parsed and merged, then the nested array becomes empty instead of resurrecting old values", () => {
  // Given — React effect 순서 때문에 중첩 마커(array.items.0.points)가 부모 마커(array.items)보다 먼저 온다
  const existing = {
    items: [{ _key: "k1", code: "R-100", points: ["p1", "p2"] }],
  };
  const formData = new FormData();
  formData.set("array.items.0.points", "replace");
  formData.set("array.items.0.documents", "replace");
  formData.set("array.items", "replace");
  formData.set("content.key", "release");
  formData.set("content.title", "이형제");
  formData.set("content.items.0._key", "k1");
  formData.set("content.items.0.code", "R-100");

  // When
  const parsed = parseContentForm("productLineup", formData);
  const merged = mergeContentFormFields(existing, parsed.fields);

  // Then — 과거 회귀: 부모 마커가 중첩 빈 배열을 덮어써 points가 ["p1","p2"]로 되살아났다
  assert.deepEqual(parsed.errors, []);
  const item = (merged.items as Record<string, unknown>[])[0];
  assert.deepEqual(item?.points, []);
  assert.deepEqual(item?.documents, []);
});

test("Given an untouched sibling save, when submitted string arrays merge with stored strings, then stored text is not corrupted", () => {
  // Given — 편집기에서 그대로 다시 제출된 문자열 배열
  const existing = { greeting: { heading: "인사", paragraphs: ["기존 문단"] } };
  const formData = new FormData();
  formData.set("array.greeting.paragraphs", "replace");
  formData.set("content.greeting.paragraphs.0", "기존 문단");
  const parsed = parseContentForm("aboutPage", formData);

  // When
  const merged = mergeContentFormFields(existing, parsed.fields);

  // Then
  assert.deepEqual(merged, { greeting: { heading: "인사", paragraphs: ["기존 문단"] } });
});
