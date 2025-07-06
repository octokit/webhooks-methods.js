import { describe, it, expect } from "vitest";
import { verifySignature } from "../../src/common/verify-signature.js";

const textEncoder = new TextEncoder();
describe("verifySignature", () => {
  it("should return false for too short signature", () => {
    expect(
      verifySignature(
        "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda",
      ),
    ).toBe(false);
    expect(
      verifySignature(
        textEncoder.encode(
          "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda",
        ),
      ),
    ).toBe(false);
  });

  it("should return false for too long signature", () => {
    expect(
      verifySignature(
        "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3a",
      ),
    ).toBe(false);
    expect(
      verifySignature(
        textEncoder.encode(
          "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3a",
        ),
      ),
    ).toBe(false);
  });

  it("should return false for invalid algorithm", () => {
    expect(
      verifySignature(
        "sha258=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3",
      ),
    ).toBe(false);
    expect(
      verifySignature(
        textEncoder.encode(
          "sha258=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3",
        ),
      ),
    ).toBe(false);
  });

  it("should return false for missing algorithm", () => {
    expect(
      verifySignature(
        textEncoder.encode(
          "4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3",
        ),
      ),
    ).toBe(false);
  });

  it("should return false for empty signature", () => {
    expect(verifySignature("")).toBe(false);
    expect(verifySignature(new Uint8Array())).toBe(false);
  });

  it("should return false for invalid character", () => {
    expect(
      verifySignature(
        "sha258=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bdaz",
      ),
    ).toBe(false);
    expect(
      verifySignature(
        textEncoder.encode(
          "sha258=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bdaz",
        ),
      ),
    ).toBe(false);
  });

  it("should return true for valid signature", () => {
    expect(
      verifySignature(
        "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3",
      ),
    ).toBe(true);
    expect(
      verifySignature(
        textEncoder.encode(
          "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3",
        ),
      ),
    ).toBe(true);
  });
});
