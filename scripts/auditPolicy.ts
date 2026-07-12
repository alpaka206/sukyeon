import { randomUUID } from "node:crypto";

export const AUDIT_PROFILES = ["mobile", "desktop"] as const;
export const AUDIT_RUNS = [1, 2, 3] as const;
const SCORE_THRESHOLD = 100;

export type Profile = (typeof AUDIT_PROFILES)[number];

export type AuditAttemptPolicy = {
  readonly isolationKey: string;
  readonly disableStorageReset: false;
};

export type ColdNetworkEvidence = {
  readonly imageResponses: number;
  readonly imageTransferBytes: number;
  readonly totalTransferBytes: number;
};

export type AuditResult = {
  readonly profile: Profile;
  readonly run: number;
  readonly attempt: number;
  readonly isolationKey: string;
  readonly scores: {
    readonly performance: number;
    readonly accessibility: number;
    readonly bestPractices: number;
    readonly seo: number;
  };
  readonly cls: number;
  readonly tbtMs: number;
  readonly lcpMs: number;
  readonly coldNetwork: ColdNetworkEvidence;
};

export type RetryReason = {
  readonly profile: Profile;
  readonly run: number;
  readonly attempt: number;
  readonly message: string;
};

export class AuditError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuditError";
  }
}

export function createAuditAttemptPolicy(): AuditAttemptPolicy {
  return {
    isolationKey: randomUUID(),
    disableStorageReset: false,
  };
}

function median(values: readonly number[]): number {
  if (values.length === 0) {
    throw new AuditError("Cannot calculate a median without audit values.");
  }
  const sorted = [...values].sort((left, right) => left - right);
  const value = sorted[Math.floor(sorted.length / 2)];
  if (value === undefined) {
    throw new AuditError("The audit median was unexpectedly unavailable.");
  }
  return value;
}

export function assertBudgets(
  results: readonly AuditResult[],
  unnecessaryCount: number,
): void {
  for (const profile of AUDIT_PROFILES) {
    const runs = results.filter((result) => result.profile === profile);
    if (runs.length !== AUDIT_RUNS.length) {
      throw new AuditError(`${profile} does not have three complete cold runs.`);
    }
    const scoreMedians = [
      median(runs.map((result) => result.scores.performance)),
      median(runs.map((result) => result.scores.accessibility)),
      median(runs.map((result) => result.scores.bestPractices)),
      median(runs.map((result) => result.scores.seo)),
    ];
    if (scoreMedians.some((score) => score < SCORE_THRESHOLD)) {
      throw new AuditError(`${profile} Lighthouse category median is below 100.`);
    }
    if (median(runs.map((result) => result.cls)) > 0.1) {
      throw new AuditError(`${profile} CLS median exceeds 0.1.`);
    }
    if (median(runs.map((result) => result.tbtMs)) > 200) {
      throw new AuditError(`${profile} TBT median exceeds 200ms.`);
    }
    if (median(runs.map((result) => result.lcpMs)) > 2_500) {
      throw new AuditError(`${profile} LCP median exceeds 2500ms.`);
    }
    if (runs.some((result) => result.coldNetwork.imageTransferBytes <= 0)) {
      throw new AuditError(`${profile} contains a warm image-cache audit run.`);
    }
  }
  if (unnecessaryCount > 0) {
    throw new AuditError(
      `react-scan found ${unnecessaryCount} unnecessary commits.`,
    );
  }
}
