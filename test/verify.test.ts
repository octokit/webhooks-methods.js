import { describe, it, expect } from "./test-runner.ts";
import { verify as verifyNode } from "../src/index.ts";
import { verify as verifyWeb } from "../src/web.ts";
import { toNormalizedJsonString } from "./common.ts";

const JSONPayload = { foo: "bar" };
const payload = toNormalizedJsonString(JSONPayload);
const secret = "mysecret";
const signature =
  "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3";

const textEncoder = new TextEncoder();

[
  ["node", verifyNode],
  ["web", verifyWeb],
].forEach((tuple) => {
  const [environment, verify] = tuple as [string, typeof verifyNode];

  describe(environment, () => {
    describe("verify", () => {
      it("is a function", () => {
        expect(typeof verify).toBe("function");
      });

      it("verify.VERSION is set", () => {
        expect(verify.VERSION).toBe("0.0.0-development");
      });

      it("verify() without options throws", async () => {
        // @ts-expect-error
        await expect(verify()).rejects.toThrow(
          "[@octokit/webhooks-methods] secret, payload & signature required",
        );
      });

      it("verify(undefined, payload) without secret throws", async () => {
        // @ts-expect-error
        await expect(verify(undefined, payload)).rejects.toThrow(
          "[@octokit/webhooks-methods] secret, payload & signature required",
        );
      });

      it("verify(secret) without payload throws", async () => {
        // @ts-expect-error
        await expect(verify(secret)).rejects.toThrow(
          "[@octokit/webhooks-methods] secret, payload & signature required",
        );
      });

      it("verify(secret, payload) without options.signature throws", async () => {
        // @ts-expect-error
        await expect(verify(secret, payload)).rejects.toThrow(
          "[@octokit/webhooks-methods] secret, payload & signature required",
        );
      });

      it("verify(secret, payload, signature) returns true for correct signature", async () => {
        const signatureMatches = await verify(secret, payload, signature);
        expect(signatureMatches).toBe(true);
      });

      it("verify(secret, payload, signature) returns false for incorrect signature", async () => {
        const signatureMatches = await verify(secret, payload, "foo");
        expect(signatureMatches).toBe(false);
      });

      it("verify(secret, payload, signature) returns false for incorrect secret", async () => {
        const signatureMatches = await verify("foo", payload, signature);
        expect(signatureMatches).toBe(false);
      });

      it("verify(secret, payload, signature) returns true if payload contains special characters (#71)", async () => {
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
        // https://github.com/octokit/webhooks.js/issues/71
        const signatureMatchesLowerCaseSequenceUint8Array = await verify(
          "development",
          textEncoder.encode(
            toNormalizedJsonString({
              foo: "Foo\n\u001b[34mbar: ♥♥♥♥♥♥♥♥\nthis-is-lost\u001b[0m\u001b[2K",
            }),
          ),
          "sha256=afecc3caa27548bb90d51a50384cb2868b9a3327b4ad6a01c9bd4ed0f8b0b12c",
        );
        expect(signatureMatchesLowerCaseSequenceUint8Array).toBe(true);
        const signatureMatchesUpperCaseSequenceUint8Array = await verify(
          "development",
          textEncoder.encode(
            toNormalizedJsonString({
              foo: "Foo\n\u001B[34mbar: ♥♥♥♥♥♥♥♥\nthis-is-lost\u001B[0m\u001B[2K",
            }),
          ),
          "sha256=afecc3caa27548bb90d51a50384cb2868b9a3327b4ad6a01c9bd4ed0f8b0b12c",
        );
        expect(signatureMatchesUpperCaseSequenceUint8Array).toBe(true);
        const signatureMatchesEscapedSequenceUint8Array = await verify(
          "development",
          textEncoder.encode(
            toNormalizedJsonString({
              foo: "\\u001b",
            }),
          ),
          "sha256=6f8326efbacfbd04e870cea25b5652e635be8c9807f2fd5348ef60753c9e96ed",
        );
        expect(signatureMatchesEscapedSequenceUint8Array).toBe(true);
      });

      it("verify(secret, payload, signature) with JSON payload", async () => {
        await expect(
          // @ts-expect-error
          verify(secret, JSONPayload, signature),
        ).rejects.toThrow(
          "[@octokit/webhooks-methods] payload must be a string or Uint8Array",
        );
      });
    });
  });
});
