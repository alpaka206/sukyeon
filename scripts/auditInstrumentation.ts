import { build } from "esbuild";

import { AuditError } from "./auditPolicy";

export async function createInstrumentationBundle(): Promise<string> {
  const result = await build({
    stdin: {
      contents: `
        import { instrument } from "react-scan/lite";
        const commits = [];
        Reflect.set(window, "__SUKYEON_REACT_SCAN_EVENTS__", commits);
        Reflect.set(window, "__SUKYEON_REACT_SCAN_COUNT__", 0);
        instrument({
          recordChangeDescriptions: true,
          includeFiberSource: true,
          includeFiberIdentity: true,
          onEvent(event) {
            if (event.kind !== "commit") return;
            const unnecessary = (event.tree ?? []).filter((fiber) => {
              const change = fiber.changeDescription;
              return change != null && !change.isFirstMount && change.parent &&
                (change.props?.length ?? 0) === 0 && !change.state &&
                !change.context && change.hooks.length === 0;
            }).map((fiber) => ({ name: fiber.name, source: fiber.source }));
            if (unnecessary.length === 0) return;
            commits.push({ timestamp: event.timestamp, fibers: unnecessary });
            Reflect.set(window, "__SUKYEON_REACT_SCAN_COUNT__", commits.length);
          },
        });
      `,
      loader: "js",
      resolveDir: process.cwd(),
    },
    bundle: true,
    define: { "process.env.NODE_ENV": '"production"' },
    format: "iife",
    minify: true,
    platform: "browser",
    write: false,
  });
  const output = result.outputFiles[0];
  if (output === undefined) {
    throw new AuditError("esbuild did not produce the react-scan bundle.");
  }
  return output.text;
}
