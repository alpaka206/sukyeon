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

test("Given a lineup document whose 대표 PDF is 영문, when lineups are read, then the 국문 attachment is linked instead", async () => {
  // Given — 자료실에서 대표 PDF가 영문으로 지정된 MSDS를 참조하는 제품
  const request = async () => [
    {
      key: "release",
      items: [
        {
          code: "SR-800",
          documents: [
            {
              label: "CAST ONE 시리즈 MSDS",
              url: "https://cdn.sanity.io/files/p/production/eng.pdf",
              docAttachments: [
                { name: "CAST ONE SR 시리즈 MSDS(GHS)국문", file: "https://cdn.sanity.io/files/p/production/kor.pdf" },
                { name: "CAST ONE SR 시리즈 MSDS(GHS) 영문", file: "https://cdn.sanity.io/files/p/production/eng.pdf" },
              ],
            },
            {
              label: "SR-800 카탈로그",
              url: "https://cdn.sanity.io/files/p/production/catalog.pdf",
              docAttachments: [
                { name: "CAST ONE SR-800 카탈로그.pdf", file: "https://cdn.sanity.io/files/p/production/catalog.pdf" },
              ],
            },
            { label: "외부 안내", url: "/data/notice" },
          ],
        },
      ],
    },
  ];

  // When
  const lineups = await readProductLineups(request);

  // Then — 국문이 있으면 국문, 없으면 원래 대표 PDF나 링크가 그대로 유지된다
  assert.deepEqual(lineups[0]?.items[0]?.documents, [
    { label: "CAST ONE 시리즈 MSDS", url: "https://cdn.sanity.io/files/p/production/kor.pdf" },
    { label: "SR-800 카탈로그", url: "https://cdn.sanity.io/files/p/production/catalog.pdf" },
    { label: "외부 안내", url: "/data/notice" },
  ]);
});

test("Given a doc whose 대표 PDF is 영문, when docs are read, then the 국문 attachment becomes the primary file", async () => {
  // Given
  const request = async () => [
    {
      name: "이형제(캐스트원) 시리즈 MSDS 자료",
      slug: "cast-one-msds",
      date: "2025-01-01",
      file: "https://cdn.sanity.io/files/p/production/eng.pdf",
      attachments: [
        { name: "CAST ONE SR 시리즈 MSDS(GHS)국문", file: "https://cdn.sanity.io/files/p/production/kor.pdf" },
        { name: "CAST ONE SR 시리즈 MSDS(GHS) 영문", file: "https://cdn.sanity.io/files/p/production/eng.pdf" },
      ],
    },
    {
      name: "작동유·습동면유 MSDS(GHS)",
      slug: "hydraulic-way-oil-msds",
      date: "2024-01-01",
      file: "https://cdn.sanity.io/files/p/production/bh46.pdf",
      attachments: [
        { name: "HYDRO BH-46 작동유 MSDS(GHS).pdf", file: "https://cdn.sanity.io/files/p/production/bh46.pdf" },
        { name: "HYDRO BH-68 작동유 MSDS(GHS).pdf", file: "https://cdn.sanity.io/files/p/production/bh68.pdf" },
      ],
    },
  ];

  // When
  const docs = await readDocs(request);

  // Then — 국문 표기가 없는 자료는 기존 대표 PDF를 그대로 쓴다
  assert.equal(docs[0]?.file, "https://cdn.sanity.io/files/p/production/kor.pdf");
  assert.equal(docs[1]?.file, "https://cdn.sanity.io/files/p/production/bh46.pdf");
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
