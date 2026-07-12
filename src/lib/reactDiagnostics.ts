export type DiagnosticInitializer = () => Promise<void>;

export async function runOptionalReactDiagnostics(
  initializers: readonly DiagnosticInitializer[],
): Promise<void> {
  await Promise.allSettled(initializers.map((initialize) => initialize()));
}
