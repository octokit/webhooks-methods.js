import { bench, describe } from "vitest";
import {
  isValidPrefixedSignature,
  isValidPrefixedSignatureString,
  isValidPrefixedSignatureUint8Array,
} from "../../src/common/is-valid-signature.ts";

describe("isValidPrefixedSignature", () => {
  const signature =
    "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3";
  const signatureUint8Array = new TextEncoder().encode(signature);

  bench("isValidPrefixedSignature", async () => {
    isValidPrefixedSignature(signature);
  });
  bench("isValidPrefixedSignatureString", async () => {
    isValidPrefixedSignatureString(signature);
  });
  bench("isValidPrefixedSignatureUint8Array", async () => {
    isValidPrefixedSignatureUint8Array(signatureUint8Array);
  });
});
