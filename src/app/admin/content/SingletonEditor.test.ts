import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

test("Given admin content links can be internal paths, when singleton fields render, then browser URL validation cannot block saving", () => {
  // Given
  const singletonEditor = readFileSync(join(process.cwd(), "src", "app", "admin", "content", "SingletonEditor.tsx"), "utf8");
  const collectionEditor = readFileSync(join(process.cwd(), "src", "app", "admin", "content", "CollectionEditor.tsx"), "utf8");

  // When
  const editorSource = `${singletonEditor}\n${collectionEditor}`;
  const usesNativeUrlInput = /type=(?:"url"|\{spec\.kind === "url")/.test(editorSource);

  // Then
  assert.equal(usesNativeUrlInput, false);
});

test("Given stored string-array content, when either editor initializes rows, then legacy-safe readStringList is used", () => {
  // Given — 문자열 배열을 레코드 필터로만 읽으면 기존 문단·특징이 빈 목록으로 보이고 저장 시 소실된다
  const singletonEditor = readFileSync(join(process.cwd(), "src", "app", "admin", "content", "SingletonEditor.tsx"), "utf8");
  const collectionEditor = readFileSync(join(process.cwd(), "src", "app", "admin", "content", "CollectionEditor.tsx"), "utf8");

  // When / Then
  assert.match(singletonEditor, /readStringList\(value\)/);
  assert.match(collectionEditor, /readStringList\(value\)/);
});

test("Given admin asset inputs are left unselected, when content is saved, then empty file placeholders are ignored", () => {
  // Given
  const actions = readFileSync(join(process.cwd(), "src", "app", "admin", "actions.ts"), "utf8");

  // When
  const skipsEmptyFilePlaceholder = /\|\| raw\.size === 0\) continue;/.test(actions);

  // Then
  assert.equal(skipsEmptyFilePlaceholder, true);
});
