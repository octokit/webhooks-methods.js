import { describe, it, expect } from "../test-runner.ts";
import { isAsyncFunction } from "../../src/common/is-async-function.ts";

describe("isAsyncFunction", () => {
  it("should return true for async function", () => {
    expect(isAsyncFunction(async () => {})).toBe(true);
    expect(isAsyncFunction(async function () {})).toBe(true);
  });

  it("should return false for regular function", () => {
    expect(isAsyncFunction(() => {})).toBe(false);
    expect(isAsyncFunction(function () {})).toBe(false);
  });

  it("should return false for non-function values", () => {
    expect(isAsyncFunction(null)).toBe(false);
    expect(isAsyncFunction(undefined)).toBe(false);
    expect(isAsyncFunction(42)).toBe(false);
    expect(isAsyncFunction("string")).toBe(false);
    expect(isAsyncFunction({})).toBe(false);
    expect(isAsyncFunction([])).toBe(false);
  });
});
