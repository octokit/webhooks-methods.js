import { sign } from "../src";

describe("Smoke test", () => {
  it("is a function", () => {
    expect(sign).toBeInstanceOf(Function);
  });

  it("sign.VERSION is set", () => {
    expect(sign.VERSION).toEqual("0.0.0-development");
  });
});