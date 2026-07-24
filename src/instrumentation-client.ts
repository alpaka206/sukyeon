import { runOptionalReactDiagnostics } from "./lib/reactDiagnostics";

// react-grab/react-scan은 개발 보조 도구이며 외부 버전 확인 요청을 만들 수 있다.
// CSP를 넓히지 않도록 기본은 비활성화하고, 필요한 로컬 세션에서만 명시적으로 켠다.
if (
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_ENABLE_REACT_DIAGNOSTICS === "1"
) {
  void runOptionalReactDiagnostics([
    async () => {
      const reactGrab = await import("react-grab");
      reactGrab.init();
    },
    async () => {
      const reactScan = await import("react-scan/dist/index.js");
      reactScan.scan();
    },
  ]);
}
