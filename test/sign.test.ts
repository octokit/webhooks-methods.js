import { sign } from "../src";

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
      "[@octokit/webhooks-methods] secret & payload required for sign()"
    );
  });

  test("throws without secret", async () => {
    // @ts-ignore
    await expect(() => sign(undefined, eventPayload)).rejects.toThrow(
      "[@octokit/webhooks-methods] secret & payload required for sign()"
    );
  });

  test("throws without eventPayload", async () => {
    // @ts-expect-error
    await expect(() => sign(secret)).rejects.toThrow(
      "[@octokit/webhooks-methods] secret & payload required for sign()"
    );
  });

  test("sign({secret, algorithm}) throws with invalid algorithm", async () => {
    await expect(() =>
      // @ts-expect-error
      sign({ secret, algorithm: "sha2" }, eventPayload)
    ).rejects.toThrow(
      "[@octokit/webhooks] Algorithm sha2 is not supported. Must be  'sha1' or 'sha256'"
    );
  });

  describe("with eventPayload as string", () => {
    describe("returns expected sha1 signature", () => {
      test("sign(secret, eventPayload)", async () => {
        const signature = await sign(secret, JSON.stringify(eventPayload));
        expect(signature).toBe(
          "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3"
        );
      });

      test("sign({secret}, eventPayload)", async () => {
        const signature = await sign({ secret }, JSON.stringify(eventPayload));
        expect(signature).toBe(
          "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3"
        );
      });

      test("sign({secret, algorithm: 'sha1'}, eventPayload)", async () => {
        const signature = await sign(
          { secret, algorithm: "sha1" },
          JSON.stringify(eventPayload)
        );
        expect(signature).toBe("sha1=d03207e4b030cf234e3447bac4d93add4c6643d8");
      });
    });

    describe("returns expected sha256 signature", () => {
      test("sign({secret, algorithm: 'sha256'}, eventPayload)", async () => {
        const signature = await sign(
          { secret, algorithm: "sha256" },
          JSON.stringify(eventPayload)
        );
        expect(signature).toBe(
          "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3"
        );
      });
    });
  });
});
