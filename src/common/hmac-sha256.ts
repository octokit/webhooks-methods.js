import { concatUint8Array } from "./concat-uint8array.js";

type HmacSha256Options = {
  key: Uint8Array;
  data: Uint8Array;
  sha256: (data: Uint8Array) => Uint8Array | Promise<Uint8Array>;
};

const blockSize = 64;

export async function hmacSha256({
  sha256,
  data,
  key,
}: HmacSha256Options): Promise<Uint8Array> {
  const keyLength = key.length;
  if (keyLength > blockSize) {
    key = await sha256(key);
  }

  const oKeyPad = new Uint8Array(blockSize);
  const iKeyPad = new Uint8Array(blockSize);

  for (let i = 0; i < keyLength; i++) {
    oKeyPad[i] = key[i] ^ 0x5c;
    iKeyPad[i] = key[i] ^ 0x36;
  }

  for (let i = keyLength; i < blockSize; i++) {
    oKeyPad[i] = 0x5c;
    iKeyPad[i] = 0x36;
  }

  const innerHash = await sha256(concatUint8Array(iKeyPad, data));
  return sha256(concatUint8Array(oKeyPad, innerHash));
}
