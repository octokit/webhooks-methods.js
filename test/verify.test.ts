import { describe, it, expect } from "vitest";
import { verify, verifyWithFallback } from "../src/index.ts";
import { toNormalizedJsonString } from "./common.ts";

const JSONeventPayload = { foo: "bar" };
const eventPayload = toNormalizedJsonString(JSONeventPayload);
const secret = "mysecret";
const signatureSHA256 =
  "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3";

describe("verify", () => {
  it("is a function", () => {
    expect(verify).toBeInstanceOf(Function);
  });

  it("verify.VERSION is set", () => {
    expect(verify.VERSION).toEqual("0.0.0-development");
  });

  it("verify() without options throws", async () => {
    // @ts-expect-error
    await expect(() => verify()).rejects.toThrow(
      "[@octokit/webhooks-methods] secret, eventPayload & signature required",
    );
  });

  it("verify(undefined, eventPayload) without secret throws", async () => {
    // @ts-expect-error
    await expect(() => verify(undefined, eventPayload)).rejects.toThrow(
      "[@octokit/webhooks-methods] secret, eventPayload & signature required",
    );
  });

  it("verify(secret) without eventPayload throws", async () => {
    // @ts-expect-error
    await expect(() => verify(secret)).rejects.toThrow(
      "[@octokit/webhooks-methods] secret, eventPayload & signature required",
    );
  });

  it("verify(secret, eventPayload) without options.signature throws", async () => {
    // @ts-expect-error
    await expect(() => verify(secret, eventPayload)).rejects.toThrow(
      "[@octokit/webhooks-methods] secret, eventPayload & signature required",
    );
  });

  it("verify(secret, eventPayload, signatureSHA256) returns true for correct signature", async () => {
    const signatureMatches = await verify(
      secret,
      eventPayload,
      signatureSHA256,
    );
    expect(signatureMatches).toBe(true);
  });

  it("verify(secret, eventPayload, signatureSHA256) returns false for incorrect signature", async () => {
    const signatureMatches = await verify(secret, eventPayload, "foo");
    expect(signatureMatches).toBe(false);
  });

  it("verify(secret, eventPayload, signatureSHA256) returns false for incorrect secret", async () => {
    const signatureMatches = await verify("foo", eventPayload, signatureSHA256);
    expect(signatureMatches).toBe(false);
  });

  it("verify(secret, eventPayload, signatureSHA256) returns true if eventPayload contains special characters (#71)", async () => {
    // https://github.com/octokit/webhooks.js/issues/71
    const signatureMatchesLowerCaseSequence = await verify(
      "development",
      toNormalizedJsonString({
        foo: "Foo\n\u001b[34mbar: ♥♥♥♥♥♥♥♥\nthis-is-lost\u001b[0m\u001b[2K",
      }),
      "sha256=afecc3caa27548bb90d51a50384cb2868b9a3327b4ad6a01c9bd4ed0f8b0b12c",
    );
    expect(signatureMatchesLowerCaseSequence).toBe(true);
    const signatureMatchesUpperCaseSequence = await verify(
      "development",
      toNormalizedJsonString({
        foo: "Foo\n\u001B[34mbar: ♥♥♥♥♥♥♥♥\nthis-is-lost\u001B[0m\u001B[2K",
      }),
      "sha256=afecc3caa27548bb90d51a50384cb2868b9a3327b4ad6a01c9bd4ed0f8b0b12c",
    );
    expect(signatureMatchesUpperCaseSequence).toBe(true);
    const signatureMatchesEscapedSequence = await verify(
      "development",
      toNormalizedJsonString({
        foo: "\\u001b",
      }),
      "sha256=6f8326efbacfbd04e870cea25b5652e635be8c9807f2fd5348ef60753c9e96ed",
    );
    expect(signatureMatchesEscapedSequence).toBe(true);
  });

  it("verify(secret, eventPayload, signatureSHA256) with JSON eventPayload", async () => {
    await expect(() =>
      // @ts-expect-error
      verify(secret, JSONeventPayload, signatureSHA256),
    ).rejects.toThrow(
      "[@octokit/webhooks-methods] eventPayload must be a string",
    );
  });
});

describe("verifyWithFallback", () => {
  it("is a function", () => {
    expect(verifyWithFallback).toBeInstanceOf(Function);
  });

  it("verifyWithFallback(secret, eventPayload, signatureSHA256, [bogus]) returns true", async () => {
    const signatureMatches = await verifyWithFallback(
      secret,
      eventPayload,
      signatureSHA256,
      ["foo"],
    );
    expect(signatureMatches).toBe(true);
  });

  it("verifyWithFallback(bogus, eventPayload, signatureSHA256, [secret]) returns true", async () => {
    const signatureMatches = await verifyWithFallback(
      "foo",
      eventPayload,
      signatureSHA256,
      [secret],
    );
    expect(signatureMatches).toBe(true);
  });

  it("verify(bogus, eventPayload, signatureSHA256, [bogus]) returns false", async () => {
    const signatureMatches = await verifyWithFallback(
      "foo",
      eventPayload,
      signatureSHA256,
      ["foo"],
    );
    expect(signatureMatches).toBe(false);
  });
});
