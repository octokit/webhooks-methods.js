import { bench, describe } from "vitest";
import {
  verifySignature,
  verifySignatureString,
  verifySignatureUint8Array,
} from "../src/common/verify-signature.js";

describe("verifySignature", () => {
  const signature =
    "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3";
  const signatureUint8Array = new TextEncoder().encode(signature);

  bench("verifySignature", async () => {
    verifySignature(signature);
  });
  bench("verifySignatureString", async () => {
    verifySignatureString(signature);
  });
  bench("verifySignatureUint8Array", async () => {
    verifySignatureUint8Array(signatureUint8Array);
  });
});
