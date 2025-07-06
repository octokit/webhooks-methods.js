// 0-9, a-f hex encoding for Uint8Array signatures
const hexLookUp = [
  0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x61, 0x62, 0x63,
  0x64, 0x65, 0x66,
];

const hexLookUpHighByte = new Array(256);
const hexLookUpLowByte = new Array(256);
for (let i = 0; i < 255; i++) {
  hexLookUpHighByte[i] = hexLookUp[(i & 0xf0) >> 4];
  hexLookUpLowByte[i] = hexLookUp[i & 0x0f];
}

const textDecoder = new TextDecoder();

export function uint8ArrayToHex(value: Uint8Array): string {
  const valueLength = value.length;
  const result = new Uint8Array(valueLength * 2);
  let i = 0;
  while (i < valueLength) {
    result[i << 1] = hexLookUpHighByte[value[i]];
    result[(i << 1) + 1] = hexLookUpLowByte[value[i++]];
  }
  return textDecoder.decode(result);
}
