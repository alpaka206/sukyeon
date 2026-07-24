import assert from "node:assert/strict";
import { test } from "node:test";

import { buildKakaoMapSearchHref } from "./maps";

test("Given a company address, when a Kakao map link is built, then the query is safely encoded", () => {
  assert.equal(
    buildKakaoMapSearchHref("인천광역시 서구 가정로 1"),
    "https://map.kakao.com/link/search/%EC%9D%B8%EC%B2%9C%EA%B4%91%EC%97%AD%EC%8B%9C%20%EC%84%9C%EA%B5%AC%20%EA%B0%80%EC%A0%95%EB%A1%9C%201",
  );
});

test("Given a blank address, when a Kakao map link is built, then the map home is used", () => {
  assert.equal(buildKakaoMapSearchHref("  "), "https://map.kakao.com");
  assert.equal(buildKakaoMapSearchHref(undefined), "https://map.kakao.com");
});
