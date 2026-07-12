import assert from "node:assert/strict";
import { test } from "node:test";

import {
  nextSlideIndex,
  optimizedSanitySource,
  previousSlideIndex,
  shouldAnimateSlide,
} from "./heroCarouselState";

test("Given the first of three slides, when Next is pressed, then the second slide becomes active", () => {
  // Given
  const active = 0;

  // When
  const next = nextSlideIndex(active, 3);

  // Then
  assert.equal(next, 1);
});

test("Given the first of three slides, when Previous is pressed, then the last slide becomes active", () => {
  // Given
  const active = 0;

  // When
  const previous = previousSlideIndex(active, 3);

  // Then
  assert.equal(previous, 2);
});

test("Given the last of three slides, when Next is pressed, then the first slide becomes active", () => {
  // Given
  const active = 2;

  // When
  const next = nextSlideIndex(active, 3);

  // Then
  assert.equal(next, 0);
});

test("Given the initial hero paint, then the LCP image does not animate", () => {
  assert.equal(shouldAnimateSlide(false), false);
});

test("Given a user-selected slide, then the replacement image uses the short transition", () => {
  assert.equal(shouldAnimateSlide(true), true);
});

test("Given a Sanity mobile hero, then its source is right-sized WebP for fast decoding", () => {
  assert.equal(
    optimizedSanitySource(
      "https://cdn.sanity.io/images/project/production/hero.webp",
      420,
      65,
      "webp",
    ),
    "https://cdn.sanity.io/images/project/production/hero.webp?w=420&q=65&fm=webp",
  );
});
