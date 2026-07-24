const KAKAO_MAP_SEARCH_BASE = "https://map.kakao.com/link/search/";

/**
 * Kakao가 공식 지원하는 지도 검색결과 바로가기 URL을 만든다.
 * 주소가 비어 있으면 Kakao 지도 홈으로 이동한다.
 */
export function buildKakaoMapSearchHref(address: string | null | undefined): string {
  const query = address?.trim();
  return query
    ? `${KAKAO_MAP_SEARCH_BASE}${encodeURIComponent(query)}`
    : "https://map.kakao.com";
}
