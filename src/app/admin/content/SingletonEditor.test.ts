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

test("Given admin asset inputs are left unselected, when content is saved, then empty file placeholders are ignored", () => {
  // Given
  const actions = readFileSync(join(process.cwd(), "src", "app", "admin", "actions.ts"), "utf8");

  // When
  const skipsEmptyFilePlaceholder = /\|\| raw\.size === 0\) continue;/.test(actions);

  // Then
  assert.equal(skipsEmptyFilePlaceholder, true);
});
