import { describe, it, expect } from "vitest";
import { sign } from "../src/index.ts";

const eventPayload = {
  foo: "bar",
};
const secret = "mysecret";

describe("sign", () => {
  it("is a function", () => {
    expect(sign).toBeInstanceOf(Function);
  });

  it("sign.VERSION is set", () => {
    expect(sign.VERSION).toEqual("0.0.0-development");
  });

  it("throws without options throws", async () => {
    // @ts-expect-error
    await expect(sign()).rejects.toThrow(
      "[@octokit/webhooks-methods] secret & payload required for sign()",
    );
  });

  it("throws without secret", async () => {
    // @ts-ignore
    await expect(sign(undefined, eventPayload)).rejects.toThrow(
      "[@octokit/webhooks-methods] secret & payload required for sign()",
    );
  });

  it("throws without eventPayload", async () => {
    // @ts-expect-error
    await expect(sign(secret)).rejects.toThrow(
      "[@octokit/webhooks-methods] secret & payload required for sign()",
    );
  });

  describe("with eventPayload as string", () => {
    describe("returns expected sha256 signature", () => {
      it("sign(secret, eventPayload)", async () => {
        const signature = await sign(secret, JSON.stringify(eventPayload));
        expect(signature).toBe(
          "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3",
        );
      });
    });
  });

  it("throws with eventPayload as object", async () => {
    // @ts-expect-error
    await expect(sign(secret, eventPayload)).rejects.toThrow(
      "[@octokit/webhooks-methods] payload must be a string",
    );
  });
});
