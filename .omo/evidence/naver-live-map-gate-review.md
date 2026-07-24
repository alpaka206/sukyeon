# Naver live map gate review

## recommendation

APPROVE

## blockers

None.

## originalIntent

The user wanted the `/about#sec-location` section to show a real, visible map rather than a placeholder or link-only substitute, while retaining a clear way to open Naver Maps externally and preserving the contact-page Naver link.

## desiredOutcome

- A real Naver map is rendered in the About page DOM.
- The map remains usable and visually coherent at 375 px, 768 px, and 1280 px viewports.
- A clearly labeled external Naver Maps link opens in a new tab.
- The Contact page keeps its external Naver Maps link.
- The production CSP permits the frame chain without introducing a blocking functional, accessibility, or security regression.

## userOutcomeReview

The shipped artifact satisfies the intended user-visible outcome. The current About page contains a real `<iframe>` whose source is Naver Maps, not a screenshot or mock. All three supplied captures visibly show Naver map tiles, controls, and the 석연MRO place marker. The crop consistently removes the Naver place-details pane while retaining the useful map pane; the external-open control remains visible and unobstructed at all three breakpoints. The iframe has an accessible title, the external control has visible text and a focus-visible treatment, and both About and Contact preserve explicit external Naver navigation.

No stated success criterion is violated. The fixed `460px` horizontal crop is coupled to Naver's current desktop layout and is therefore a maintenance risk, but the supplied breakpoint evidence demonstrates correct behavior for the requested surface today. This is a NOTE, not a blocker.

## criterionReview

1. **Real DOM iframe integration: PASS.** `src/app/(site)/about/page.tsx:169-178` renders a titled iframe with `src={naverMapEmbedHref}`. A live GET of `http://localhost:3022/about` returned 200 and contained that iframe and source.
2. **Design-system preservation: PASS.** `src/app/(site)/about/page.tsx:166-199` uses the page's existing `wide-shell`, navy palette, rounded borders, typography, spacing, shadow, hover, and focus conventions. The supplied captures show visual continuity with the surrounding navigation, information card, and footer.
3. **Responsive sizing/cropping: PASS.** `about-map-final-mobile.png`, `about-map-final-tablet.png`, and `about-map-final-desktop.png` show the location marker and map controls inside the card without horizontal page overflow. `playwright-final-report.json` records one loaded iframe at each viewport and frame boxes consistent with the deliberate crop.
4. **External-link behavior: PASS.** `src/app/(site)/about/page.tsx:180-187` uses a clear “네이버 지도 크게 보기 →” anchor with `target="_blank"` and `rel="noreferrer"`. The QA report records the resulting Naver Maps popup URL. `src/app/(site)/contact/page.tsx:38-45` preserves a separately labeled Naver Maps link.
5. **Blocking functional/accessibility/security issues: PASS.** The live `/about` response includes the required `frame-src` directive. The iframe has a meaningful title, lazy loading, and a strict-origin referrer policy. The external link is keyboard-focus styled and uses `noreferrer`. No blocking issue is visible in the diff or captures.

## removeAiSlopsAndProgrammingReview

- No obvious comments, defensive branches, dead code, needless helper/extraction, duplicated implementation, complex control flow, type escape hatch, debug output, or speculative abstraction was added.
- The iframe and two URL constants are the smallest direct implementation of the requested behavior.
- `src/lib/nextConfig.test.ts:8-10` pins observable CSP output. It mirrors the exact policy by design, but it is not a tautology or removal-only test: reverting the production `frame-src` change makes the test fail, and the policy is externally observable in HTTP headers.
- No excessive or useless test, deletion-only test, requested-removal-only test, parsing/normalization layer, or production extraction was introduced.
- The About and Contact page behavior is primarily protected by browser evidence rather than a source-text test, which avoids implementation-mirroring UI tests.
- Changed source files remain below the 250 pure-LOC defect threshold for the added scope; no new function has parameter bloat, variant discrimination, redundant post-action verification, or negative-form naming.
- The production iframe integration necessarily depends on Naver's embeddable page behavior. The fixed crop is justified by the observed three-breakpoint result and does not violate a stated criterion.

## reproducedEvidence

- Live `GET http://localhost:3022/about`: HTTP 200.
- Live response CSP contained:
  `frame-src https://map.naver.com https://pcmap.place.naver.com https://naver.me https://*.pstatic.net`.
- Live server-rendered HTML contained:
  - `<iframe title="석연MRO 네이버 지도" ... src="https://map.naver.com/p/entry/place/16795539?placePath=%2Fhome">`
  - external `https://naver.me/G0pxAIzJ` anchor with `target="_blank"`.
- `node_modules/.bin/tsx.cmd --test src/lib/nextConfig.test.ts`: 6 tests passed, 0 failed.
- Visual inspection:
  - Mobile 375×920: marker, map mode controls, zoom/location controls, and external button visible.
  - Tablet 768×1000: marker centered in a full-width map card; external button visible.
  - Desktop 1280×1000: map aligns with the existing content column and side navigation; marker and external button visible.

## checkedArtifactPaths

- `C:/Users/gyuwo/Desktop/Sukyeon/.omo/evidence/naver-live-map/final.diff`
- `C:/Users/gyuwo/Desktop/Sukyeon/.omo/evidence/naver-live-map/playwright-final-report.json`
- `C:/Users/gyuwo/Desktop/Sukyeon/.omo/evidence/naver-live-map/about-map-final-mobile.png`
- `C:/Users/gyuwo/Desktop/Sukyeon/.omo/evidence/naver-live-map/about-map-final-tablet.png`
- `C:/Users/gyuwo/Desktop/Sukyeon/.omo/evidence/naver-live-map/about-map-final-desktop.png`
- `C:/Users/gyuwo/Desktop/Sukyeon/.omo/evidence/naver-live-map/server-final.log`
- `C:/Users/gyuwo/Desktop/Sukyeon/next.config.ts`
- `C:/Users/gyuwo/Desktop/Sukyeon/src/app/(site)/about/page.tsx`
- `C:/Users/gyuwo/Desktop/Sukyeon/src/app/(site)/contact/page.tsx`
- `C:/Users/gyuwo/Desktop/Sukyeon/src/lib/nextConfig.test.ts`
- `C:/Users/gyuwo/Desktop/Sukyeon/package.json`

## exactEvidenceGaps

- `omo ulw-loop status --json` could not execute because the installed Windows wrapper reports a command syntax error. No `.omo/evidence/ulw` plan directory exists, so this report uses the required fallback path.
- No standalone code-review report was present under `.omo/evidence`. Direct inspection covers the required programming and overfit/slop perspectives, so this does not establish a failed success criterion.
- No separately named manual-QA matrix or notepad path was supplied. `playwright-final-report.json` plus the three breakpoint captures provide the relevant matrix evidence.
- `playwright-final-report.json` does not serialize a dedicated `consoleErrors` field, despite the executor prose claiming no CSP/frame console errors. Successful nested Naver frame URLs, visible rendered tiles, and the reproduced CSP support functionality, but the absence of an explicit console-log field remains an evidence gap.
- A full production rebuild, full test suite, typecheck, and lint were not rerun by this read-only gate. The targeted CSP suite and already-running production artifact were reproduced. No stated criterion makes full-suite reruns mandatory for this review.

