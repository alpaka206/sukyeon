import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export function installCdpFetchBridge(): () => void {
  const originalFetch = globalThis.fetch;
  if (process.env.AUDIT_CDP_FETCH_BRIDGE !== "1") {
    return () => undefined;
  }
  globalThis.fetch = async (...parameters: Parameters<typeof fetch>) => {
    const [input, init] = parameters;
    const requestUrl = input instanceof Request ? input.url : input.toString();
    const url = new URL(requestUrl);
    const cdpHosts = new Set(["127.0.0.1", "localhost", "[::1]"]);
    if (cdpHosts.has(url.hostname) && url.pathname === "/json/version") {
      const { stdout } = await execFileAsync(
        "curl.exe",
        ["--fail", "--silent", "--show-error", requestUrl],
        { encoding: "utf8" },
      );
      return new Response(stdout, {
        headers: { "content-type": "application/json" },
        status: 200,
      });
    }
    return originalFetch(input, init);
  };
  return () => {
    globalThis.fetch = originalFetch;
  };
}
