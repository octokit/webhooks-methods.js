const hexLookUp = new Array(255).fill(0);
for (let i = 0; i < 16; i++) {
  hexLookUp[i] = i.toString(16).charCodeAt(0);
}

const hexLookUpHighByte = new Array(255).fill(0);
const hexLookUpLowByte = new Array(255).fill(0);
for (let i = 0; i < 255; i++) {
  hexLookUpHighByte[i] = hexLookUp[(i & 0xf0) >> 4];
  hexLookUpLowByte[i] = hexLookUp[i & 0x0f];
}

export function prefixSignature(signature: Uint8Array): Uint8Array {
  const prefixedSignature = new Uint8Array(71);
  prefixedSignature[0] = 0x73; // 's'
  prefixedSignature[1] = 0x68; // 'h'
  prefixedSignature[2] = 0x61; // 'a'
  prefixedSignature[3] = 0x32; // '2'
  prefixedSignature[4] = 0x35; // '5'
  prefixedSignature[5] = 0x36; // '6'
  prefixedSignature[6] = 0x3d; // '='

  for (let i = 0, offset = 7; i < signature.length; ++i) {
    prefixedSignature[offset++] = hexLookUpHighByte[signature[i]];
    prefixedSignature[offset++] = hexLookUpLowByte[signature[i]];
  }
  return prefixedSignature;
}
