import type { PrefixedSignatureString } from "../types.js";

const signatureRE = /^sha256=[\da-fA-F]{64}$/;

export const isValidPrefixedSignatureString = RegExp.prototype.test.bind(
  signatureRE,
) as (value: string) => value is `sha256=${string}`;
/**
 * Verifies if a given value is a valid SHA-256 signature.
 * The signature must start with "sha256=" followed by a 64-character hexadecimal string.
 *
 * @param value - The value to verify.
 * @returns {value is `sha256=${string}|Uint8Array`} `true` if the value is a valid SHA-256 signature, `false` otherwise.
 */
export const isValidPrefixedSignature = (
  value: string | Uint8Array,
): value is typeof value extends string
  ? PrefixedSignatureString
  : Uint8Array => {
  if (typeof value === "string") {
    return isValidPrefixedSignatureString(value);
  } else {
    return isValidPrefixedSignatureUint8Array(value);
  }
};

const notHexChars = new Array(256).fill(true);
for (let i = 0; i < 10; i++) {
  notHexChars[i + 0x30] = false; // 0-9
}
for (let i = 0; i < 6; i++) {
  notHexChars[i + 0x61] = false; // a-f
  notHexChars[i + 0x41] = false; // A-F
}

export const isValidPrefixedSignatureUint8Array = (
  value: Uint8Array,
): value is Uint8Array => {
  if (value.length !== 71) {
    return false;
  }

  if (
    value[0] !== 0x73 || // 's' character
    value[1] !== 0x68 || // 'h' character
    value[2] !== 0x61 || // 'a' character
    value[3] !== 0x32 || // '2' character
    value[4] !== 0x35 || // '5' character
    value[5] !== 0x36 || // '6' character
    value[6] !== 0x3d // '=' character
  ) {
    return false;
  }

  for (let i = 7; i < 71; i++) {
    if (notHexChars[value[i]]) {
      return false;
    }
  }
  return true;
};
