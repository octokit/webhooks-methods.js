import { verify } from "../src";

describe("verify", () => {
  it("is a function", () => {
    expect(verify).toBeInstanceOf(Function);
  });

  it("verify.VERSION is set", () => {
    expect(verify.VERSION).toEqual("0.0.0-development");
  });
});
