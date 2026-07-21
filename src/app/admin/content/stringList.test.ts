import assert from "node:assert/strict";
import { test } from "node:test";
import { readStringList } from "./stringList";

test("Given legacy object-array product features, when the admin editor reads them, then their text remains editable", () => {
  // Given
  const storedFeatures = [
    "현재 문자열 형식",
    { _key: "legacy-1", item: "이전 객체 형식" },
    { _key: "damaged-1" },
  ];

  // When
  const editableFeatures = readStringList(storedFeatures);

  // Then
  assert.deepEqual(editableFeatures, ["현재 문자열 형식", "이전 객체 형식"]);
});

test("Given a non-array product feature value, when the admin editor reads it, then it uses an empty list", () => {
  // Given
  const storedFeatures = null;

  // When
  const editableFeatures = readStringList(storedFeatures);

  // Then
  assert.deepEqual(editableFeatures, []);
});
