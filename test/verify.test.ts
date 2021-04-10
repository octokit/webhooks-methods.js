import { verify } from "../src";

const eventPayload = {
  foo: "bar",
};
const secret = "mysecret";
const signatureSHA1 = "sha1=d03207e4b030cf234e3447bac4d93add4c6643d8";
const signatureSHA256 =
  "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3";

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
      {
        foo: "Foo\n\u001b[34mbar: ♥♥♥♥♥♥♥♥\nthis-is-lost\u001b[0m\u001b[2K",
      },
      "sha1=7316ec5e7866e42e4aba4af550d21a5f036f949d"
    );
    expect(signatureMatchesLowerCaseSequence).toBe(true);
    const signatureMatchesUpperCaseSequence = await verify(
      "development",
      {
        foo: "Foo\n\u001B[34mbar: ♥♥♥♥♥♥♥♥\nthis-is-lost\u001B[0m\u001B[2K",
      },
      "sha1=7316ec5e7866e42e4aba4af550d21a5f036f949d"
    );
    expect(signatureMatchesUpperCaseSequence).toBe(true);
    const signatureMatchesEscapedSequence = await verify(
      "development",
      {
        foo: "\\u001b",
      },
      "sha1=2c440a176f4cb84c8c921dfee882d594c2465097"
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
      {
        foo: "Foo\n\u001b[34mbar: ♥♥♥♥♥♥♥♥\nthis-is-lost\u001b[0m\u001b[2K",
      },
      "sha256=afecc3caa27548bb90d51a50384cb2868b9a3327b4ad6a01c9bd4ed0f8b0b12c"
    );
    expect(signatureMatchesLowerCaseSequence).toBe(true);
    const signatureMatchesUpperCaseSequence = await verify(
      "development",
      {
        foo: "Foo\n\u001B[34mbar: ♥♥♥♥♥♥♥♥\nthis-is-lost\u001B[0m\u001B[2K",
      },
      "sha256=afecc3caa27548bb90d51a50384cb2868b9a3327b4ad6a01c9bd4ed0f8b0b12c"
    );
    expect(signatureMatchesUpperCaseSequence).toBe(true);
    const signatureMatchesEscapedSequence = await verify(
      "development",
      {
        foo: "\\u001b",
      },
      "sha256=6f8326efbacfbd04e870cea25b5652e635be8c9807f2fd5348ef60753c9e96ed"
    );
    expect(signatureMatchesEscapedSequence).toBe(true);
  });
});
