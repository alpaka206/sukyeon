import crypto from "node:crypto";
import type { SanityClient } from "@sanity/client";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;
const INITIAL_BACKOFF_MS = 60 * 1000;
const MAX_BACKOFF_MS = 30 * 60 * 1000;
const MAX_MUTATION_RETRIES = 3;

export type LoginRateLimitRecord = {
  readonly id: string;
  readonly revision: string;
  readonly windowStartedAt: number;
  readonly failures: number;
  readonly blockedUntil: number;
};

export interface LoginRateLimitStore {
  read(id: string): Promise<LoginRateLimitRecord | null>;
  create(record: Omit<LoginRateLimitRecord, "revision">): Promise<void>;
  replace(record: LoginRateLimitRecord): Promise<void>;
  remove(record: LoginRateLimitRecord): Promise<void>;
}

type LoginRateLimitDecision =
  | { readonly kind: "allowed" }
  | { readonly kind: "blocked" };

function documentId(key: string): string {
  return `admin-login-rate-limit-${crypto.createHash("sha256").update(key).digest("hex")}`;
}

function isWindowExpired(record: LoginRateLimitRecord, now: number): boolean {
  return now - record.windowStartedAt >= WINDOW_MS;
}

function backoffMs(failures: number): number {
  const exponent = Math.max(0, failures - MAX_FAILURES);
  return Math.min(INITIAL_BACKOFF_MS * 2 ** exponent, MAX_BACKOFF_MS);
}

function nextFailure(record: LoginRateLimitRecord | null, id: string, now: number): Omit<LoginRateLimitRecord, "revision"> {
  const active = record && !isWindowExpired(record, now) ? record : null;
  const failures = (active?.failures ?? 0) + 1;
  return {
    id,
    windowStartedAt: active?.windowStartedAt ?? now,
    failures,
    blockedUntil: failures >= MAX_FAILURES ? now + backoffMs(failures) : 0,
  };
}

function sameRecord(a: Omit<LoginRateLimitRecord, "revision">, b: LoginRateLimitRecord): LoginRateLimitRecord {
  return { ...a, revision: b.revision };
}

export class AdminLoginRateLimiter {
  readonly #store: LoginRateLimitStore;

  constructor(store: LoginRateLimitStore) {
    this.#store = store;
  }

  async check(key: string, now = Date.now()): Promise<LoginRateLimitDecision> {
    const record = await this.#store.read(documentId(key));
    return record && !isWindowExpired(record, now) && record.blockedUntil > now
      ? { kind: "blocked" }
      : { kind: "allowed" };
  }

  async recordFailure(key: string, now = Date.now()): Promise<LoginRateLimitDecision> {
    const id = documentId(key);
    for (let attempt = 0; attempt < MAX_MUTATION_RETRIES; attempt += 1) {
      const existing = await this.#store.read(id);
      const next = nextFailure(existing, id, now);
      try {
        if (existing) await this.#store.replace(sameRecord(next, existing));
        else await this.#store.create(next);
        return next.blockedUntil > now ? { kind: "blocked" } : { kind: "allowed" };
      } catch (error) {
        if (error instanceof Error && attempt + 1 < MAX_MUTATION_RETRIES) continue;
        throw error;
      }
    }
    throw new Error("Login rate limit update failed");
  }

  async reset(key: string): Promise<void> {
    const existing = await this.#store.read(documentId(key));
    if (!existing) return;
    await this.#store.remove(existing);
  }
}

type SanityRateLimitDocument = {
  readonly _id: string;
  readonly _rev: string;
  readonly windowStartedAt: number;
  readonly failures: number;
  readonly blockedUntil: number;
};

function toRecord(document: SanityRateLimitDocument): LoginRateLimitRecord | null {
  if (
    !Number.isFinite(document.windowStartedAt)
    || !Number.isInteger(document.failures)
    || document.failures < 0
    || !Number.isFinite(document.blockedUntil)
  ) return null;
  return {
    id: document._id,
    revision: document._rev,
    windowStartedAt: document.windowStartedAt,
    failures: document.failures,
    blockedUntil: document.blockedUntil,
  };
}

export class SanityLoginRateLimitStore implements LoginRateLimitStore {
  readonly #client: SanityClient;

  constructor(client: SanityClient) {
    this.#client = client;
  }

  async read(id: string): Promise<LoginRateLimitRecord | null> {
    const document = await this.#client.fetch<SanityRateLimitDocument | null>(
      `*[_id==$id && _type=="adminLoginRateLimit"][0]{_id,_rev,windowStartedAt,failures,blockedUntil}`,
      { id },
    );
    return document ? toRecord(document) : null;
  }

  async create(record: Omit<LoginRateLimitRecord, "revision">): Promise<void> {
    await this.#client.create({
      _id: record.id,
      _type: "adminLoginRateLimit",
      windowStartedAt: record.windowStartedAt,
      failures: record.failures,
      blockedUntil: record.blockedUntil,
    });
  }

  async replace(record: LoginRateLimitRecord): Promise<void> {
    await this.#client.patch(record.id).ifRevisionId(record.revision).set({
      windowStartedAt: record.windowStartedAt,
      failures: record.failures,
      blockedUntil: record.blockedUntil,
    }).commit();
  }

  async remove(record: LoginRateLimitRecord): Promise<void> {
    await this.#client.transaction().patch(record.id, { ifRevisionID: record.revision }).delete(record.id).commit();
  }
}

export function createAdminLoginRateLimiter(client: SanityClient): AdminLoginRateLimiter {
  return new AdminLoginRateLimiter(new SanityLoginRateLimitStore(client));
}
