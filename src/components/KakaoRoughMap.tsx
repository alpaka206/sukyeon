"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

const ROUGH_MAP_SCRIPT_SRC =
  "https://ssl.daumcdn.net/dmaps/map_js_init/roughmapLoader.js";

const DEFAULT_TIMESTAMP = "1784908009871";
const DEFAULT_ROUGH_MAP_KEY = "reiddtkjusf";

const DEFAULT_PLACE_NAME = "석연 MRO";
const DEFAULT_LABEL_SEARCH_TEXT = "인천 서해구 염곡로15번길 16";

const MESSAGE_SOURCE = "sukyeon-kakao-roughmap";
const LOAD_TIMEOUT_MS = 10_000;

const ROUGH_MAP_FOOTER_HEIGHT = 32;
const MIN_MAP_BODY_HEIGHT = 180;

type MapStatus = "loading" | "ready" | "error";

type MapSize = {
  readonly width: number;
  readonly height: number;
};

type KakaoRoughMapProps = {
  /** Kakao RoughMap HTML 코드의 timestamp */
  readonly timestamp?: string;

  /** Kakao RoughMap HTML 코드의 key */
  readonly mapKey?: string;

  /** 접근성 및 iframe 제목 */
  readonly label?: string;

  /** 마커 위에 표시할 이름 */
  readonly placeName?: string;

  /** 기존 마커 문구를 찾기 위한 주소 일부 */
  readonly labelSearchText?: string;

  /** 지도 로딩 실패 시 이동할 링크 */
  readonly fallbackHref?: string;
};

type RoughMapMessage = {
  readonly source: typeof MESSAGE_SOURCE;
  readonly renderId: string;
  readonly status: "ready" | "error";
};

type RoughMapResult = {
  readonly renderId: string;
  readonly status: Exclude<MapStatus, "loading">;
};

function normalizeTimestamp(value: string | undefined): string {
  return value && /^\d{10,20}$/.test(value)
    ? value
    : DEFAULT_TIMESTAMP;
}

function normalizeMapKey(value: string | undefined): string {
  return value && /^[A-Za-z0-9_-]{1,32}$/.test(value)
    ? value
    : DEFAULT_ROUGH_MAP_KEY;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character] ?? character;
  });
}

/**
 * HTML script 내부에 안전하게 삽입할 JSON 문자열을 만든다.
 */
function serializeForInlineScript(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function buildRoughMapDocument({
  timestamp,
  mapKey,
  width,
  height,
  label,
  placeName,
  labelSearchText,
  renderId,
}: {
  readonly timestamp: string;
  readonly mapKey: string;
  readonly width: number;
  readonly height: number;
  readonly label: string;
  readonly placeName: string;
  readonly labelSearchText: string;
  readonly renderId: string;
}): string {
  /*
   * RoughMap은 지도 아래에 약 32px의 서비스 바를 추가한다.
   * 전체 iframe 높이에서 서비스 바 높이를 제외한다.
   */
  const mapBodyHeight = Math.max(
    height - ROUGH_MAP_FOOTER_HEIGHT,
    MIN_MAP_BODY_HEIGHT,
  );

  const containerId = `daumRoughmapContainer${timestamp}`;

  const readyMessage = serializeForInlineScript({
    source: MESSAGE_SOURCE,
    renderId,
    status: "ready",
  } satisfies RoughMapMessage);

  const errorMessage = serializeForInlineScript({
    source: MESSAGE_SOURCE,
    renderId,
    status: "error",
  } satisfies RoughMapMessage);

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1"
  />

  <title>${escapeHtml(label)}</title>

  <style>
    html,
    body {
      width: 100%;
      height: 100%;
      margin: 0;
      overflow: hidden;
      background: #eef2f6;
    }

    #${containerId},
    .root_daum_roughmap,
    .root_daum_roughmap .wrap_map,
    .root_daum_roughmap .map {
      width: 100% !important;
      box-sizing: border-box;
    }

    .root_daum_roughmap img {
      max-width: none;
    }
  </style>
</head>

<body>
  <div
    id="${containerId}"
    class="root_daum_roughmap root_daum_roughmap_landing"
  ></div>

  <script
    charset="UTF-8"
    src="${ROUGH_MAP_SCRIPT_SRC}"
  ></script>

  <script>
    (function () {
      var containerId =
        ${serializeForInlineScript(containerId)};

      var targetText =
        ${serializeForInlineScript(labelSearchText)};

      var replacementText =
        ${serializeForInlineScript(placeName)};

      /*
       * 로컬 테스트에서 확인한 현재 RoughMap 내부 선택자.
       */
      var exactMarkerSelector =
        ":scope > div.wrap_map > div.map > div:nth-child(1) > div > div:nth-child(6) > div:nth-child(2) > div > a > span";

      var normalizeText = function (value) {
        return String(value || "")
          .replace(/\\s+/g, " ")
          .trim();
      };

      var updateElementAccessibility = function (
        markerLabel
      ) {
        markerLabel.setAttribute(
          "title",
          replacementText
        );

        markerLabel.setAttribute(
          "aria-label",
          replacementText
        );

        var anchor = markerLabel.closest("a");

        if (anchor) {
          anchor.setAttribute(
            "title",
            replacementText
          );

          anchor.setAttribute(
            "aria-label",
            replacementText
          );
        }
      };

      var replaceMarkerLabel = function () {
        var container =
          document.getElementById(containerId);

        if (!container) {
          return false;
        }

        /*
         * 1순위:
         * 실제 로컬에서 확인한 정확한 DOM 위치를 사용한다.
         */
        var markerLabel =
          container.querySelector(
            exactMarkerSelector
          );

        if (markerLabel) {
          var exactText = normalizeText(
            markerLabel.textContent
          );

          if (exactText === replacementText) {
            updateElementAccessibility(
              markerLabel
            );

            return true;
          }

          /*
           * 정확한 선택자가 다른 요소를 가리키는 경우를 막는다.
           */
          if (
            !targetText ||
            exactText.indexOf(targetText) !== -1
          ) {
            markerLabel.textContent =
              replacementText;

            updateElementAccessibility(
              markerLabel
            );

            return true;
          }
        }

        /*
         * 2순위:
         * 카카오가 nth-child 구조를 변경한 경우
         * 주소 문자열을 기준으로 모든 후보를 확인한다.
         */
        var candidates =
          container.querySelectorAll(
            ".wrap_map .map a span"
          );

        for (
          var index = 0;
          index < candidates.length;
          index += 1
        ) {
          var candidate =
            candidates[index];

          var currentText = normalizeText(
            candidate.textContent
          );

          if (
            currentText === replacementText
          ) {
            updateElementAccessibility(
              candidate
            );

            return true;
          }

          if (
            targetText &&
            currentText.indexOf(targetText) !== -1
          ) {
            candidate.textContent =
              replacementText;

            updateElementAccessibility(
              candidate
            );

            return true;
          }
        }

        return false;
      };

      try {
        if (
          !window.daum ||
          !window.daum.roughmap ||
          !window.daum.roughmap.Lander
        ) {
          throw new Error(
            "Kakao RoughMap loader unavailable"
          );
        }

        new window.daum.roughmap.Lander({
          timestamp:
            ${serializeForInlineScript(timestamp)},

          key:
            ${serializeForInlineScript(mapKey)},

          mapWidth:
            ${serializeForInlineScript(String(width))},

          mapHeight:
            ${serializeForInlineScript(
              String(mapBodyHeight)
            )}
        }).render();

        var container =
          document.getElementById(containerId);

        var labelObserver = null;
        var labelIntervalId = null;
        var labelAttempts = 0;
        var maximumLabelAttempts = 50;

        var stopLabelReplacement = function () {
          if (labelIntervalId !== null) {
            window.clearInterval(
              labelIntervalId
            );

            labelIntervalId = null;
          }

          if (labelObserver) {
            labelObserver.disconnect();
            labelObserver = null;
          }
        };

        var tryReplaceMarkerLabel =
          function () {
            labelAttempts += 1;

            if (replaceMarkerLabel()) {
              stopLabelReplacement();
              return;
            }

            if (
              labelAttempts >=
              maximumLabelAttempts
            ) {
              stopLabelReplacement();
            }
          };

        /*
         * RoughMap 내부 DOM은 비동기로 생성되므로
         * DOM 변경을 감지한다.
         */
        if (
          container &&
          typeof MutationObserver !==
            "undefined"
        ) {
          labelObserver =
            new MutationObserver(
              function () {
                tryReplaceMarkerLabel();
              }
            );

          labelObserver.observe(container, {
            childList: true,
            subtree: true,
            characterData: true
          });
        }

        /*
         * MutationObserver가 놓치는 경우를 대비해
         * 최대 10초 동안 200ms 간격으로 확인한다.
         */
        labelIntervalId =
          window.setInterval(function () {
            tryReplaceMarkerLabel();
          }, 200);

        tryReplaceMarkerLabel();

        /*
         * 지도가 실제로 생성됐는지 확인하고
         * 부모 React 컴포넌트에 결과를 전달한다.
         */
        window.setTimeout(function () {
          var renderedContainer =
            document.getElementById(
              containerId
            );

          var hasMap =
            Boolean(
              renderedContainer &&
              renderedContainer.children.length > 0
            );

          window.parent.postMessage(
            hasMap
              ? ${readyMessage}
              : ${errorMessage},
            "*"
          );
        }, 200);
      } catch (error) {
        window.parent.postMessage(
          ${errorMessage},
          "*"
        );
      }
    })();
  </script>
</body>
</html>`;
}

function isRoughMapMessage(
  value: unknown,
): value is RoughMapMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const message =
    value as Partial<RoughMapMessage>;

  return (
    message.source === MESSAGE_SOURCE &&
    typeof message.renderId === "string" &&
    (
      message.status === "ready" ||
      message.status === "error"
    )
  );
}

export default function KakaoRoughMap({
  timestamp: timestampProp =
    process.env
      .NEXT_PUBLIC_KAKAO_ROUGH_MAP_TIMESTAMP,

  mapKey: mapKeyProp =
    process.env
      .NEXT_PUBLIC_KAKAO_ROUGH_MAP_KEY,

  label = "석연 MRO 위치 지도",

  placeName = DEFAULT_PLACE_NAME,

  labelSearchText =
    DEFAULT_LABEL_SEARCH_TEXT,

  fallbackHref = "https://map.kakao.com",
}: KakaoRoughMapProps) {
  const wrapperRef =
    useRef<HTMLDivElement>(null);

  const iframeRef =
    useRef<HTMLIFrameElement>(null);

  const instanceId = useId().replace(
    /[^A-Za-z0-9_-]/g,
    "",
  );

  const timestamp =
    normalizeTimestamp(timestampProp);

  const mapKey =
    normalizeMapKey(mapKeyProp);

  const [size, setSize] =
    useState<MapSize | null>(null);

  const [result, setResult] =
    useState<RoughMapResult | null>(null);

  useEffect(() => {
    const wrapper =
      wrapperRef.current;

    if (!wrapper) {
      return;
    }

    let animationFrameId = 0;

    const updateSize = () => {
      const rect =
        wrapper.getBoundingClientRect();

      const width =
        Math.round(rect.width);

      const height =
        Math.round(rect.height);

      /*
       * 아직 레이아웃 계산 전이거나
       * display:none 상태라면 기다린다.
       */
      if (width <= 0 || height <= 0) {
        return;
      }

      const nextSize: MapSize = {
        width,
        height,
      };

      setSize((current) => {
        if (
          current?.width === nextSize.width &&
          current.height === nextSize.height
        ) {
          return current;
        }

        return nextSize;
      });
    };

    const scheduleSizeUpdate = () => {
      window.cancelAnimationFrame(
        animationFrameId,
      );

      animationFrameId =
        window.requestAnimationFrame(
          updateSize,
        );
    };

    scheduleSizeUpdate();

    if (
      typeof ResizeObserver !== "undefined"
    ) {
      const observer =
        new ResizeObserver(
          scheduleSizeUpdate,
        );

      observer.observe(wrapper);

      return () => {
        observer.disconnect();

        window.cancelAnimationFrame(
          animationFrameId,
        );
      };
    }

    window.addEventListener(
      "resize",
      scheduleSizeUpdate,
    );

    return () => {
      window.removeEventListener(
        "resize",
        scheduleSizeUpdate,
      );

      window.cancelAnimationFrame(
        animationFrameId,
      );
    };
  }, []);

  const renderId = size
    ? `${instanceId}-${timestamp}-${size.width}x${size.height}`
    : `${instanceId}-${timestamp}-pending`;

  /*
   * 새로운 크기의 iframe이 만들어진 경우,
   * 별도의 setStatus("loading") 없이 loading으로 계산한다.
   */
  const status: MapStatus =
    !size ||
    !result ||
    result.renderId !== renderId
      ? "loading"
      : result.status;

  const srcDoc = useMemo(() => {
    if (!size) {
      return "";
    }

    return buildRoughMapDocument({
      timestamp,
      mapKey,
      width: size.width,
      height: size.height,
      label,
      placeName,
      labelSearchText,
      renderId,
    });
  }, [
    label,
    labelSearchText,
    mapKey,
    placeName,
    renderId,
    size,
    timestamp,
  ]);

  useEffect(() => {
    if (!size) {
      return;
    }

    let active = true;
    let settled = false;

    const complete = (
      nextStatus: "ready" | "error",
    ) => {
      if (!active || settled) {
        return;
      }

      settled = true;

      setResult({
        renderId,
        status: nextStatus,
      });
    };

    const timeoutId =
      window.setTimeout(() => {
        complete("error");
      }, LOAD_TIMEOUT_MS);

    const onMessage = (
      event: MessageEvent<unknown>,
    ) => {
      /*
       * 현재 렌더링된 iframe에서 전달된
       * 메시지만 처리한다.
       */
      if (
        event.source !==
        iframeRef.current?.contentWindow
      ) {
        return;
      }

      if (
        !isRoughMapMessage(event.data)
      ) {
        return;
      }

      if (
        event.data.renderId !== renderId
      ) {
        return;
      }

      window.clearTimeout(timeoutId);
      complete(event.data.status);
    };

    window.addEventListener(
      "message",
      onMessage,
    );

    return () => {
      active = false;

      window.removeEventListener(
        "message",
        onMessage,
      );

      window.clearTimeout(timeoutId);
    };
  }, [renderId, size]);

  return (
    <div
      ref={wrapperRef}
      className="relative h-full w-full overflow-hidden bg-[#eef2f6]"
      role="region"
      aria-label={label}
    >
      {size && (
        <iframe
          key={renderId}
          ref={iframeRef}
          title={label}
          srcDoc={srcDoc}
          className="block h-full w-full border-0"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      )}

      {status === "loading" && (
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-20
            grid
            place-items-center
            bg-[#eef2f6]
            text-[14px]
            font-semibold
            text-[#5a6680]
          "
          aria-live="polite"
        >
          지도를 불러오는 중입니다.
        </div>
      )}

      {status === "error" && (
        <div
          className="
            absolute
            inset-0
            z-20
            grid
            place-items-center
            bg-[#eef2f6]
            p-6
            text-center
          "
        >
          <div>
            <p className="m-0 text-[14px] font-semibold text-[#42526b]">
              지도를 불러오지 못했습니다.
            </p>

            <a
              href={fallbackHref}
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-3
                inline-flex
                rounded-lg
                bg-[#22409b]
                px-4
                py-2
                text-[14px]
                font-bold
                text-white
                transition-opacity
                hover:opacity-90
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-[#22409b]
              "
            >
              카카오맵에서 확인
            </a>
          </div>
        </div>
      )}
    </div>
  );
}