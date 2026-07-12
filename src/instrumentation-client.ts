import { runOptionalReactDiagnostics } from "./lib/reactDiagnostics";

if (
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_DISABLE_REACT_DEVTOOLS !== "1"
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
