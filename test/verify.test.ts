import { verify } from "../src";

function toNormalizedJsonString(payload: object) {
  // GitHub sends its JSON with an indentation of 2 spaces and a line break at the end
  const payloadString = JSON.stringify(payload, null, 2) + "\n";
  return payloadString.replace(/[^\\]\\u[\da-f]{4}/g, (s) => {
    return s.substr(0, 3) + s.substr(3).toUpperCase();
  });
}

const eventPayload = toNormalizedJsonString({ foo: "bar" });
const secret = "mysecret";
const signatureSHA1 = "sha1=640c0ea7402a3f74e1767338fa2dba243b1f2d9c";
const signatureSHA256 =
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
      "[@octokit/webhooks-methods] secret, eventPayload & signature required"
    );
  });

  test("verify(undefined, eventPayload) without secret throws", async () => {
    // @ts-expect-error
    await expect(() => verify(undefined, eventPayload)).rejects.toThrow(
      "[@octokit/webhooks-methods] secret, eventPayload & signature required"
    );
  });

  test("verify(secret) without eventPayload throws", async () => {
    // @ts-expect-error
    await expect(() => verify(secret)).rejects.toThrow(
      "[@octokit/webhooks-methods] secret, eventPayload & signature required"
    );
  });

  test("verify(secret, eventPayload) without options.signature throws", async () => {
    // @ts-expect-error
    await expect(() => verify(secret, eventPayload)).rejects.toThrow(
      "[@octokit/webhooks-methods] secret, eventPayload & signature required"
    );
  });

  test("verify(secret, eventPayload, signatureSHA1) returns true for correct signature", async () => {
    const signatureMatches = await verify(secret, eventPayload, signatureSHA1);
    expect(signatureMatches).toBe(true);
  });

  test("verify(secret, eventPayload, signatureSHA1) returns false for incorrect signature", async () => {
    const signatureMatches = await verify(secret, eventPayload, "foo");
    expect(signatureMatches).toBe(false);
  });

  test("verify(secret, eventPayload, signatureSHA1) returns false for correct secret", async () => {
    const signatureMatches = await verify("foo", eventPayload, signatureSHA1);
    expect(signatureMatches).toBe(false);
  });

  test("verify(secret, eventPayload, signatureSHA1) returns true if eventPayload contains special characters (#71)", async () => {
    // https://github.com/octokit/webhooks.js/issues/71
    const signatureMatchesLowerCaseSequence = await verify(
      "development",
      toNormalizedJsonString({
        foo: "Foo\n\u001b[34mbar: ♥♥♥♥♥♥♥♥\nthis-is-lost\u001b[0m\u001b[2K",
      }),
      "sha1=82a91c5aacc9cdc2eea893bc828bd03d218df79c"
    );
    expect(signatureMatchesLowerCaseSequence).toBe(true);
    const signatureMatchesUpperCaseSequence = await verify(
      "development",
      toNormalizedJsonString({
        foo: "Foo\n\u001B[34mbar: ♥♥♥♥♥♥♥♥\nthis-is-lost\u001B[0m\u001B[2K",
      }),
      "sha1=82a91c5aacc9cdc2eea893bc828bd03d218df79c"
    );
    expect(signatureMatchesUpperCaseSequence).toBe(true);
    const signatureMatchesEscapedSequence = await verify(
      "development",
      toNormalizedJsonString({
        foo: "\\u001b",
      }),
      "sha1=bdae4705bdd827d026bb227817ca025b5b3a6756"
    );
    expect(signatureMatchesEscapedSequence).toBe(true);
  });

  test("verify(secret, eventPayload, signatureSHA256) returns true for correct signature", async () => {
    const signatureMatches = await verify(
      secret,
      eventPayload,
      signatureSHA256
    );
    expect(signatureMatches).toBe(true);
  });

  test("verify(secret, eventPayload, signatureSHA256) returns false for incorrect signature", async () => {
    const signatureMatches = await verify(secret, eventPayload, "foo");
    expect(signatureMatches).toBe(false);
  });

  test("verify(secret, eventPayload, signatureSHA256) returns false for correct secret", async () => {
    const signatureMatches = await verify("foo", eventPayload, signatureSHA256);
    expect(signatureMatches).toBe(false);
  });

  test("verify(secret, eventPayload, signatureSHA256) returns true if eventPayload contains special characters (#71)", async () => {
    // https://github.com/octokit/webhooks.js/issues/71
    const signatureMatchesLowerCaseSequence = await verify(
      "development",
      toNormalizedJsonString({
        foo: "Foo\n\u001b[34mbar: ♥♥♥♥♥♥♥♥\nthis-is-lost\u001b[0m\u001b[2K",
      }),
      "sha256=9dacf9003316b09be07df56d86a2d0d6872e42a1e6c72c3bad9ff915a7c5603e"
    );
    expect(signatureMatchesLowerCaseSequence).toBe(true);
    const signatureMatchesUpperCaseSequence = await verify(
      "development",
      toNormalizedJsonString({
        foo: "Foo\n\u001B[34mbar: ♥♥♥♥♥♥♥♥\nthis-is-lost\u001B[0m\u001B[2K",
      }),
      "sha256=9dacf9003316b09be07df56d86a2d0d6872e42a1e6c72c3bad9ff915a7c5603e"
    );
    expect(signatureMatchesUpperCaseSequence).toBe(true);
    const signatureMatchesEscapedSequence = await verify(
      "development",
      toNormalizedJsonString({
        foo: "\\u001b",
      }),
      "sha256=87316067e2011fae39998b18c46a14d83b3e7c3ffdd88fb2ee5afb7d11288e60"
    );
    expect(signatureMatchesEscapedSequence).toBe(true);
  });
});
