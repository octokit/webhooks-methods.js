import { describe, it, expect } from "./test-runner.ts";
import { sign as signNode } from "../src/index.ts";
import { sign as signWeb } from "../src/web.ts";

const payload = {
  foo: "bar",
};
const secret = "mysecret";

const textEncoder = new TextEncoder();

[
  ["node", signNode],
  ["web", signWeb],
].forEach((tuple) => {
  const [environment, sign] = tuple as [string, typeof signNode];

  describe(environment, () => {
    describe("sign", () => {
      it("is a function", () => {
        expect(typeof sign).toBe("function");
      });

      it("sign.VERSION is set", () => {
        expect(sign.VERSION).toBe("0.0.0-development");
      });

      it("throws without options throws", async () => {
        // @ts-expect-error
        await expect(sign()).rejects.toThrow(
          "[@octokit/webhooks-methods] secret & payload required for sign()",
        );
      });

      it("throws without secret", async () => {
        // @ts-ignore
        await expect(sign(undefined, payload)).rejects.toThrow(
          "[@octokit/webhooks-methods] secret & payload required for sign()",
        );
      });

      it("throws without payload", async () => {
        // @ts-expect-error
        await expect(sign(secret)).rejects.toThrow(
          "[@octokit/webhooks-methods] secret & payload required for sign()",
        );
      });

      describe("with payload returns expected sha256 signature", () => {
        it("payload as string", async () => {
          const signature = await sign(secret, JSON.stringify(payload));
          expect(signature).toBe(
            "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3",
          );
        });
        it("payload as Uint8Array", async () => {
          const signature = await sign(
            secret,
            textEncoder.encode(JSON.stringify(payload)),
          );
          expect(signature).toBe(
            "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3",
          );
        });
      });

      it("throws with payload as object", async () => {
        // @ts-expect-error
        await expect(sign(secret, payload)).rejects.toThrow(
          "[@octokit/webhooks-methods] payload must be a string or Uint8Array",
        );
      });
    });
  });
});
