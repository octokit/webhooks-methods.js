import type { SignatureString } from "../types.js";

const hexLookUpHighByte: Record<string, number> = {
  "0": 0x00,
  "1": 0x10,
  "2": 0x20,
  "3": 0x30,
  "4": 0x40,
  "5": 0x50,
  "6": 0x60,
  "7": 0x70,
  "8": 0x80,
  "9": 0x90,
  a: 0xa0,
  b: 0xb0,
  c: 0xc0,
  d: 0xd0,
  e: 0xe0,
  f: 0xf0,
  A: 0xa0,
  B: 0xb0,
  C: 0xc0,
  D: 0xd0,
  E: 0xe0,
  F: 0xf0,
};

const hexLookUpLowByte: Record<string, number> = {
  "0": 0x00,
  "1": 0x01,
  "2": 0x02,
  "3": 0x03,
  "4": 0x04,
  "5": 0x05,
  "6": 0x06,
  "7": 0x07,
  "8": 0x08,
  "9": 0x09,
  a: 0x0a,
  b: 0x0b,
  c: 0x0c,
  d: 0x0d,
  e: 0x0e,
  f: 0x0f,
  A: 0x0a,
  B: 0x0b,
  C: 0x0c,
  D: 0x0d,
  E: 0x0e,
  F: 0x0f,
};

export function signatureStringToUint8Array(
  prefixedSignature: SignatureString,
): Uint8Array {
  const result = new Uint8Array(32);

  let i = 0,
    offset = 7; // Skip the "sha256=" prefix

  while (i < 32) {
    // Each byte in the Uint8Array is represented by two hex characters
    result[i++] =
      hexLookUpHighByte[prefixedSignature[offset++]] +
      hexLookUpLowByte[prefixedSignature[offset++]];
  }
  return result;
}
