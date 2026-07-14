import assert from "node:assert/strict";
import { test } from "node:test";

import {
  HERO_CAROUSEL_FADE_MS,
  HERO_CAROUSEL_AUTOPLAY_MS,
  nextSlideIndex,
  optimizedSanitySource,
  previousSlideIndex,
  shouldAutoplaySlides,
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

test("Given the home hero carousel, then slide replacement uses a soft cross-fade", () => {
  assert.equal(HERO_CAROUSEL_FADE_MS, 700);
});

test("Given the home hero carousel, then slides auto-advance every four seconds", () => {
  assert.equal(HERO_CAROUSEL_AUTOPLAY_MS, 4000);
});

test("Given one slide, when the carousel is visible, then autoplay is disabled", () => {
  assert.equal(shouldAutoplaySlides(1, false), false);
});

test("Given multiple slides, when the carousel is hovered, then autoplay is paused", () => {
  assert.equal(shouldAutoplaySlides(3, true), false);
});

test("Given multiple slides, when the carousel is not hovered, then autoplay runs", () => {
  assert.equal(shouldAutoplaySlides(3, false), true);
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
