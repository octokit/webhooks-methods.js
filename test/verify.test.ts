import { verify, verifySync, verifyWithFallback } from "../src/index.ts";

function toNormalizedJsonString(payload: object) {
  // GitHub sends its JSON with an indentation of 2 spaces and a line break at the end
  const payloadString = JSON.stringify(payload, null, 2) + "\n";
  return payloadString.replace(/[^\\]\\u[\da-f]{4}/g, (s) => {
    return s.substr(0, 3) + s.substr(3).toUpperCase();
  });
}

const eventPayload = toNormalizedJsonString({ foo: "bar" });
const secret = "mysecret";
const signature =
  "sha256=e3eccac34c43c7dc1cbb905488b1b81347fcc700a7b025697a9d07862256023f";

describe("verify", () => {
  it("is a function", () => {
    expect(verify).toBeInstanceOf(Function);
  });

  it("verify.VERSION is set", () => {
    expect(verify.VERSION).toEqual("0.0.0-development");
  });

  test("verify() without options throws", async () => {
    // @ts-expect-error
    await expect(() => verify()).rejects.toThrow(
      "[@octokit/webhooks-methods] secret, eventPayload & signature required",
    );
  });

  test("verify(undefined, eventPayload) without secret throws", async () => {
    // @ts-expect-error
    await expect(() => verify(undefined, eventPayload)).rejects.toThrow(
      "[@octokit/webhooks-methods] secret, eventPayload & signature required",
    );
  });

  test("verify(secret) without eventPayload throws", async () => {
    // @ts-expect-error
    await expect(() => verify(secret)).rejects.toThrow(
      "[@octokit/webhooks-methods] secret, eventPayload & signature required",
    );
  });

  test("verify(secret, eventPayload) without options.signature throws", async () => {
    // @ts-expect-error
    await expect(() => verify(secret, eventPayload)).rejects.toThrow(
      "[@octokit/webhooks-methods] secret, eventPayload & signature required",
    );
  });

  test("verify(secret, eventPayload, signature) returns true for correct signature", async () => {
    const signatureMatches = await verify(secret, eventPayload, signature);
    expect(signatureMatches).toBe(true);
  });

  test("verify(secret, eventPayload, signature) returns true for secret provided as Buffer", async () => {
    const signatureMatches = await verify(
      Buffer.from(secret),
      eventPayload,
      signature,
    );
    expect(signatureMatches).toBe(true);
  });

  test("verify(secret, eventPayload, signature) returns true for payload provided as Buffer", async () => {
    const signatureMatches = await verify(
      secret,
      Buffer.from(eventPayload),
      signature,
    );
    expect(signatureMatches).toBe(true);
  });

  test("verify(secret, eventPayload, signature) returns true for payload and secret provided as Buffer", async () => {
    const signatureMatches = await verify(
      Buffer.from(secret),
      Buffer.from(eventPayload),
      signature,
    );
    expect(signatureMatches).toBe(true);
  });

  test("verify(secret, eventPayload, signature) returns false for incorrect signature", async () => {
    const signatureMatches = await verify(
      secret,
      eventPayload,
      "sha256=xxxccac34c43c7dc1cbb905488b1b81347fcc700a7b025697a9d07862256023f",
    );
    expect(signatureMatches).toBe(false);
  });

  test("verify(secret, eventPayload, signature) returns false for incorrect signature", async () => {
    const signatureMatches = await verify(secret, eventPayload, "foo");
    expect(signatureMatches).toBe(false);
  });

  test("verify(secret, eventPayload, signature) returns false for incorrect secret", async () => {
    const signatureMatches = await verify("foo", eventPayload, signature);
    expect(signatureMatches).toBe(false);
  });

  test("verify(secret, eventPayload, signature) returns true if eventPayload contains special characters (#71)", async () => {
    // https://github.com/octokit/webhooks.js/issues/71
    const signatureMatchesLowerCaseSequence = await verify(
      "development",
      toNormalizedJsonString({
        foo: "Foo\n\u001b[34mbar: ♥♥♥♥♥♥♥♥\nthis-is-lost\u001b[0m\u001b[2K",
      }),
      "sha256=9dacf9003316b09be07df56d86a2d0d6872e42a1e6c72c3bad9ff915a7c5603e",
    );
    expect(signatureMatchesLowerCaseSequence).toBe(true);
    const signatureMatchesUpperCaseSequence = await verify(
      "development",
      toNormalizedJsonString({
        foo: "Foo\n\u001B[34mbar: ♥♥♥♥♥♥♥♥\nthis-is-lost\u001B[0m\u001B[2K",
      }),
      "sha256=9dacf9003316b09be07df56d86a2d0d6872e42a1e6c72c3bad9ff915a7c5603e",
    );
    expect(signatureMatchesUpperCaseSequence).toBe(true);
    const signatureMatchesEscapedSequence = await verify(
      "development",
      toNormalizedJsonString({
        foo: "\\u001b",
      }),
      "sha256=87316067e2011fae39998b18c46a14d83b3e7c3ffdd88fb2ee5afb7d11288e60",
    );
    expect(signatureMatchesEscapedSequence).toBe(true);
  });
});

describe("verifyWithFallback", () => {
  it("is a function", () => {
    expect(verifyWithFallback).toBeInstanceOf(Function);
  });

  test("verifyWithFallback(secret, eventPayload, signature, [bogus]) returns true", async () => {
    const signatureMatches = await verifyWithFallback(
      secret,
      eventPayload,
      signature,
      ["foo"],
    );
    expect(signatureMatches).toBe(true);
  });

  test("verifyWithFallback(bogus, eventPayload, signature, [secret]) returns true", async () => {
    const signatureMatches = await verifyWithFallback(
      "foo",
      eventPayload,
      signature,
      [secret],
    );
    expect(signatureMatches).toBe(true);
  });

  test("verify(bogus, eventPayload, signature, [bogus]) returns false", async () => {
    const signatureMatches = await verifyWithFallback(
      "foo",
      eventPayload,
      signature,
      ["foo"],
    );
    expect(signatureMatches).toBe(false);
  });
});

describe("verifySync", () => {
  it("is a function", () => {
    expect(verifySync).toBeInstanceOf(Function);
  });

  it("verifySync.VERSION is set", () => {
    expect(verifySync.VERSION).toEqual("0.0.0-development");
  });

  test("verifySync(secret, eventPayload, signature) returns true for correct signature", () => {
    const signatureMatches = verifySync(secret, eventPayload, signature);
    expect(signatureMatches).toBe(true);
  });
});
