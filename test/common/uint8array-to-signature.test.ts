import { describe, it, expect } from "../test-runner.ts";
import { uint8arrayToPrefixedSignature } from "../../src/common/uint8array-to-signature.ts";

describe("uint8arrayToPrefixedSignature", () => {
  it("should return signature", () => {
    const uint8array = new Uint8Array([
      0x48, 0x64, 0xd2, 0x75, 0x99, 0x38, 0xa1, 0x54, 0x68, 0xb5, 0xdf, 0x9a,
      0xde, 0x20, 0xbf, 0x16, 0x1d, 0xa9, 0xb4, 0xf7, 0x37, 0xea, 0x61, 0x79,
      0x41, 0x42, 0xf3, 0x48, 0x42, 0x36, 0xbd, 0xa3,
    ]);
    const signature = uint8arrayToPrefixedSignature(uint8array);
    expect(signature).toStrictEqual(
      new TextEncoder().encode(
        "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3",
      ),
    );
  });
});
