import { describe, it, expect } from "../test-runner.ts";
import { verifyPrefixedSignature } from "../../src/common/verify-signature.ts";

const textEncoder = new TextEncoder();
describe("verifyPrefixedSignature", () => {
  it("should return false for too short signature", () => {
    expect(
      verifyPrefixedSignature(
        "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda",
      ),
    ).toBe(false);
    expect(
      verifyPrefixedSignature(
        textEncoder.encode(
          "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda",
        ),
      ),
    ).toBe(false);
  });

  it("should return false for too long signature", () => {
    expect(
      verifyPrefixedSignature(
        "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3a",
      ),
    ).toBe(false);
    expect(
      verifyPrefixedSignature(
        textEncoder.encode(
          "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3a",
        ),
      ),
    ).toBe(false);
  });

  it("should return false for invalid algorithm", () => {
    expect(
      verifyPrefixedSignature(
        "sha258=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3",
      ),
    ).toBe(false);
    expect(
      verifyPrefixedSignature(
        textEncoder.encode(
          "sha258=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3",
        ),
      ),
    ).toBe(false);
  });

  it("should return false for missing algorithm", () => {
    expect(
      verifyPrefixedSignature(
        textEncoder.encode(
          "4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3",
        ),
      ),
    ).toBe(false);
  });

  it("should return false for empty signature", () => {
    expect(verifyPrefixedSignature("")).toBe(false);
    expect(verifyPrefixedSignature(new Uint8Array())).toBe(false);
  });

  it("should return false for invalid character", () => {
    expect(
      verifyPrefixedSignature(
        "sha258=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bdaz",
      ),
    ).toBe(false);
    expect(
      verifyPrefixedSignature(
        textEncoder.encode(
          "sha258=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bdaz",
        ),
      ),
    ).toBe(false);
  });

  it("should return true for valid signature", () => {
    expect(
      verifyPrefixedSignature(
        "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3",
      ),
    ).toBe(true);
    expect(
      verifyPrefixedSignature(
        textEncoder.encode(
          "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3",
        ),
      ),
    ).toBe(true);
  });
});
