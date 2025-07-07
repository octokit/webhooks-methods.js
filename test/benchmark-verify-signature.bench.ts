import { bench, describe } from "vitest";
import {
  verifyPrefixedSignature,
  verifyPrefixedSignatureString,
  verifyPrefixedSignatureUint8Array,
} from "../src/common/verify-signature.ts";

describe("verifyPrefixedSignature", () => {
  const signature =
    "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3";
  const signatureUint8Array = new TextEncoder().encode(signature);

  bench("verifyPrefixedSignature", async () => {
    verifyPrefixedSignature(signature);
  });
  bench("verifyPrefixedSignatureString", async () => {
    verifyPrefixedSignatureString(signature);
  });
  bench("verifyPrefixedSignatureUint8Array", async () => {
    verifyPrefixedSignatureUint8Array(signatureUint8Array);
  });
});
