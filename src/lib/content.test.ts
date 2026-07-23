import assert from "node:assert/strict";
import { test } from "node:test";
import { readCerts, readDocs } from "./content/docs";
import { readAboutPage, readHomePage, readSiteSettings } from "./content/pages";
import { readProductGalleries, readProductLineups } from "./content/products";

class SanityTestOutage extends Error {
  readonly name = "SanityTestOutage";

  constructor() {
    super("SANITY_TEST_OUTAGE");
  }
}

test("Given no configured request, when list content is read, then every exact empty fallback is returned", async () => {
  // Given
  const request = null;

  // When
  const results = await Promise.all([
    readDocs(request),
    readCerts(request),
    readProductLineups(request),
    readProductGalleries(request),
  ]);

  // Then
  assert.deepEqual(results, [[], [], [], []]);
});

test("Given no configured request, when singleton content is read, then every exact null fallback is returned", async () => {
  // Given
  const request = null;

  // When
  const results = await Promise.all([
    readHomePage(request),
    readSiteSettings(request),
    readAboutPage(request),
  ]);

  // Then
  assert.deepEqual(results, [null, null, null]);
});

test("Given product lineups with object-array text items, when lineups are read, then text arrays are normalized", async () => {
  // Given
  const request = async () => [
    {
      key: "release",
      title: "이형제",
      brand: "RELEASE",
      intro: "우수한 이형성과 고온 안정성",
      bullets: [{ item: "우수한 이형성과 고온 안정성 — 결함 저감" }],
      items: [
        {
          code: "R-100",
          image: "/release.webp",
          summary: "요약",
          points: [{ item: "피막 형성" }],
          documents: [{ label: "MSDS", url: "/data/msds" }],
        },
      ],
    },
  ];

  // When
  const lineups = await readProductLineups(request);

  // Then
  assert.deepEqual(lineups[0]?.bullets, [
    "우수한 이형성과 고온 안정성 — 결함 저감",
  ]);
  assert.deepEqual(lineups[0]?.items[0]?.points, ["피막 형성"]);
});

test("Given configured list requests returning legitimate empty values, when content is read, then emptiness is preserved", async () => {
  // Given
  const request = async () => null;

  // When
  const docs = await readDocs(request);

  // Then
  assert.deepEqual(docs, []);
});

test("Given a configured singleton request returning legitimate null, when content is read, then null is preserved", async () => {
  // Given
  const request = async () => null;

  // When
  const homePage = await readHomePage(request);

  // Then
  assert.equal(homePage, null);
});

test("Given a configured request rejection, when content is read, then the exact rejection propagates", async () => {
  // Given
  const outage = new SanityTestOutage();
  const request = async (): Promise<never> => {
    throw outage;
  };

  // When / Then
  await Promise.all(
    [
      readDocs(request),
      readCerts(request),
      readProductLineups(request),
      readProductGalleries(request),
      readHomePage(request),
      readSiteSettings(request),
      readAboutPage(request),
    ].map((result) =>
      assert.rejects(result, (error: unknown) => error === outage),
    ),
  );
});
