import { describe, it, expect } from "./test-runner.ts";
import { verifyWithFallback as verifyWithFallbackNode } from "../src/index.ts";
import { verifyWithFallback as verifyWithFallbackWeb } from "../src/web.ts";
import { toNormalizedJsonString } from "./common.ts";

const JSONPayload = { foo: "bar" };
const payload = toNormalizedJsonString(JSONPayload);
const secret = "mysecret";
const signatureSHA256 =
  "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3";

const textEncoder = new TextEncoder();

[
  ["node", verifyWithFallbackNode],
  ["web", verifyWithFallbackWeb],
].forEach((tuple) => {
  const [environment, verifyWithFallback] = tuple as [
    string,
    typeof verifyWithFallbackNode,
  ];

  describe(environment, () => {
    describe("verifyWithFallback", () => {
      it("is a function", () => {
        expect(typeof verifyWithFallback).toBe("function");
      });

      it("verifyWithFallback(secret, payload, signatureSHA256, [bogus]) returns true", async () => {
        const signatureMatches = await verifyWithFallback(
          secret,
          payload,
          signatureSHA256,
          ["foo"],
        );
        expect(signatureMatches).toBe(true);
      });

      it("verifyWithFallback(bogus, payload, signatureSHA256, [secret]) returns true", async () => {
        const signatureMatches = await verifyWithFallback(
          "foo",
          payload,
          signatureSHA256,
          [secret],
        );
        expect(signatureMatches).toBe(true);
      });

      it("verifyWithFallback(bogus, payload, signatureSHA256, [secret]) returns true", async () => {
        const signatureMatches = await verifyWithFallback(
          "foo",
          textEncoder.encode(payload),
          signatureSHA256,
          [secret],
        );
        expect(signatureMatches).toBe(true);
      });

      it("verify(bogus, payload, signatureSHA256, [bogus]) returns false", async () => {
        const signatureMatches = await verifyWithFallback(
          "foo",
          payload,
          signatureSHA256,
          ["foo"],
        );
        expect(signatureMatches).toBe(false);
      });
    });
  });
});
