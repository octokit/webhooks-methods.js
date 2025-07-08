import { describe, it, expect } from "../test-runner.ts";
import { isValidPrefixedSignature } from "../../src/common/is-valid-signature.ts";

const textEncoder = new TextEncoder();
describe("isValidPrefixedSignature", () => {
  it("should return false for too short signature", () => {
    expect(
      isValidPrefixedSignature(
        "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda",
      ),
    ).toBe(false);
    expect(
      isValidPrefixedSignature(
        textEncoder.encode(
          "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda",
        ),
      ),
    ).toBe(false);
  });

  it("should return false for too long signature", () => {
    expect(
      isValidPrefixedSignature(
        "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3a",
      ),
    ).toBe(false);
    expect(
      isValidPrefixedSignature(
        textEncoder.encode(
          "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3a",
        ),
      ),
    ).toBe(false);
  });

  it("should return false for invalid algorithm", () => {
    expect(
      isValidPrefixedSignature(
        "sha258=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3",
      ),
    ).toBe(false);
    expect(
      isValidPrefixedSignature(
        textEncoder.encode(
          "sha258=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3",
        ),
      ),
    ).toBe(false);
  });

  it("should return false for missing algorithm", () => {
    expect(
      isValidPrefixedSignature(
        textEncoder.encode(
          "4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3",
        ),
      ),
    ).toBe(false);
  });

  it("should return false for empty signature", () => {
    expect(isValidPrefixedSignature("")).toBe(false);
    expect(isValidPrefixedSignature(new Uint8Array())).toBe(false);
  });

  it("should return false for invalid character", () => {
    expect(
      isValidPrefixedSignature(
        "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bdaz",
      ),
    ).toBe(false);
    expect(
      isValidPrefixedSignature(
        textEncoder.encode(
          "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bdaz",
        ),
      ),
    ).toBe(false);
  });

  it("should return true for valid signature", () => {
    expect(
      isValidPrefixedSignature(
        "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3",
      ),
    ).toBe(true);
    expect(
      isValidPrefixedSignature(
        textEncoder.encode(
          "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3",
        ),
      ),
    ).toBe(true);
  });
});
