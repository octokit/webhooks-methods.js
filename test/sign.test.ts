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

  test("throws without options throws", async () => {
    // @ts-expect-error
    await expect(() => sign()).rejects.toThrow(
      "[@octokit/webhooks-methods] secret & payload required for sign()",
    );
  });

  test("throws without secret", async () => {
    // @ts-ignore
    await expect(() => sign(undefined, eventPayload)).rejects.toThrow(
      "[@octokit/webhooks-methods] secret & payload required for sign()",
    );
  });

  test("throws without eventPayload", async () => {
    // @ts-expect-error
    await expect(() => sign(secret)).rejects.toThrow(
      "[@octokit/webhooks-methods] secret & payload required for sign()",
    );
  });

  describe("with eventPayload as string", () => {
    describe("returns expected sha256 signature", () => {
      test("sign(secret, eventPayload)", async () => {
        const signature = await sign(secret, JSON.stringify(eventPayload));
        expect(signature).toBe(
          "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3",
        );
      });
    });
  });

  test("throws with eventPayload as object", () => {
    // @ts-expect-error
    expect(() => sign(secret, eventPayload)).rejects.toThrow(
      "[@octokit/webhooks-methods] payload must be a string",
    );
  });
});
