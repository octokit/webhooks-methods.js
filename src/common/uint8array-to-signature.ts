import type { PrefixedSignatureString } from "../types.js";

// 0-9, a-f hex encoding for Uint8Array signatures
const hexLookUp = [
  0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x61, 0x62, 0x63,
  0x64, 0x65, 0x66,
];

const hexLookUpHighByte = new Array(255).fill(0);
const hexLookUpLowByte = new Array(255).fill(0);
for (let i = 0; i < 255; i++) {
  hexLookUpHighByte[i] = hexLookUp[(i & 0xf0) >> 4];
  hexLookUpLowByte[i] = hexLookUp[i & 0x0f];
}

export function uint8arrayToSignature(signature: Uint8Array): Uint8Array {
  const prefixedSignature = new Uint8Array(64);
  let i = 0,
    offset = 0;

  while (i < 32) {
    prefixedSignature[offset++] = hexLookUpHighByte[signature[i]];
    prefixedSignature[offset++] = hexLookUpLowByte[signature[i++]];
  }
  return prefixedSignature;
}

export function uint8arrayToPrefixedSignature(
  signature: Uint8Array,
): Uint8Array {
  const prefixedSignature = new Uint8Array(71);
  prefixedSignature[0] = 0x73; // 's'
  prefixedSignature[1] = 0x68; // 'h'
  prefixedSignature[2] = 0x61; // 'a'
  prefixedSignature[3] = 0x32; // '2'
  prefixedSignature[4] = 0x35; // '5'
  prefixedSignature[5] = 0x36; // '6'
  prefixedSignature[6] = 0x3d; // '='

  let i = 0,
    offset = 7;

  while (i < 32) {
    prefixedSignature[offset++] = hexLookUpHighByte[signature[i]];
    prefixedSignature[offset++] = hexLookUpLowByte[signature[i++]];
  }
  return prefixedSignature;
}

const hexCharLookUp: Array<string> = new Array(256);
for (let i = 0; i < 256; i++) {
  hexCharLookUp[i] =
    String.fromCharCode(hexLookUpHighByte[i]) +
    String.fromCharCode(hexLookUpLowByte[i]);
}

export function uint8arrayToPrefixedSignatureString(
  signature: Uint8Array,
): PrefixedSignatureString {
  return ("sha256=" +
    hexCharLookUp[signature[0]] +
    hexCharLookUp[signature[1]] +
    hexCharLookUp[signature[2]] +
    hexCharLookUp[signature[3]] +
    hexCharLookUp[signature[4]] +
    hexCharLookUp[signature[5]] +
    hexCharLookUp[signature[6]] +
    hexCharLookUp[signature[7]] +
    hexCharLookUp[signature[8]] +
    hexCharLookUp[signature[9]] +
    hexCharLookUp[signature[10]] +
    hexCharLookUp[signature[11]] +
    hexCharLookUp[signature[12]] +
    hexCharLookUp[signature[13]] +
    hexCharLookUp[signature[14]] +
    hexCharLookUp[signature[15]] +
    hexCharLookUp[signature[16]] +
    hexCharLookUp[signature[17]] +
    hexCharLookUp[signature[18]] +
    hexCharLookUp[signature[19]] +
    hexCharLookUp[signature[20]] +
    hexCharLookUp[signature[21]] +
    hexCharLookUp[signature[22]] +
    hexCharLookUp[signature[23]] +
    hexCharLookUp[signature[24]] +
    hexCharLookUp[signature[25]] +
    hexCharLookUp[signature[26]] +
    hexCharLookUp[signature[27]] +
    hexCharLookUp[signature[28]] +
    hexCharLookUp[signature[29]] +
    hexCharLookUp[signature[30]] +
    hexCharLookUp[signature[31]]) as PrefixedSignatureString;
}
