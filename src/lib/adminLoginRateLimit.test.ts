import assert from "node:assert/strict";
import test from "node:test";
import { AdminLoginRateLimiter, type LoginRateLimitRecord, type LoginRateLimitStore } from "./adminLoginRateLimit";

class MemoryRateLimitStore implements LoginRateLimitStore {
  readonly records = new Map<string, LoginRateLimitRecord>();
  revision = 0;

  async read(id: string): Promise<LoginRateLimitRecord | null> {
    return this.records.get(id) ?? null;
  }

  async create(record: Omit<LoginRateLimitRecord, "revision">): Promise<void> {
    if (this.records.has(record.id)) throw new Error("conflict");
    this.revision += 1;
    this.records.set(record.id, { ...record, revision: String(this.revision) });
  }

  async replace(record: LoginRateLimitRecord): Promise<void> {
    const existing = this.records.get(record.id);
    if (!existing || existing.revision !== record.revision) throw new Error("conflict");
    this.revision += 1;
    this.records.set(record.id, { ...record, revision: String(this.revision) });
  }

  async remove(record: LoginRateLimitRecord): Promise<void> {
    const existing = this.records.get(record.id);
    if (!existing || existing.revision !== record.revision) throw new Error("conflict");
    this.records.delete(record.id);
  }
}

test("blocks after five failed attempts and resumes after backoff", async () => {
  const limiter = new AdminLoginRateLimiter(new MemoryRateLimitStore());
  const start = 1_000_000;

  for (let attempt = 0; attempt < 4; attempt += 1) {
    assert.equal((await limiter.recordFailure("key", start)).kind, "allowed");
  }
  assert.equal((await limiter.recordFailure("key", start)).kind, "blocked");
  assert.equal((await limiter.check("key", start + 59_999)).kind, "blocked");
  assert.equal((await limiter.check("key", start + 60_000)).kind, "allowed");
  assert.equal((await limiter.recordFailure("key", start + 60_000)).kind, "blocked");
  assert.equal((await limiter.check("key", start + 179_999)).kind, "blocked");
  assert.equal((await limiter.check("key", start + 180_000)).kind, "allowed");
});

test("successful login clears prior failures and window expiry starts a new count", async () => {
  const limiter = new AdminLoginRateLimiter(new MemoryRateLimitStore());
  const start = 2_000_000;

  await limiter.recordFailure("key", start);
  await limiter.reset("key");
  assert.equal((await limiter.recordFailure("key", start)).kind, "allowed");
  await limiter.recordFailure("window", start);
  assert.equal((await limiter.recordFailure("window", start + 15 * 60 * 1000)).kind, "allowed");
});
