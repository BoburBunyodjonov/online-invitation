import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  rateLimit,
  _resetRateLimitsForTests,
} from "@/lib/server/rate-limit";

describe("rateLimit", () => {
  it("allows requests under the limit", () => {
    _resetRateLimitsForTests();
    assert.equal(rateLimit("test-key", 3, 60_000).allowed, true);
    assert.equal(rateLimit("test-key", 3, 60_000).allowed, true);
    assert.equal(rateLimit("test-key", 3, 60_000).allowed, true);
  });

  it("blocks requests over the limit", () => {
    _resetRateLimitsForTests();
    rateLimit("block-key", 2, 60_000);
    rateLimit("block-key", 2, 60_000);
    const third = rateLimit("block-key", 2, 60_000);
    assert.equal(third.allowed, false);
    assert.ok(third.retryAfterSec > 0);
  });
});
