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

  const iKeyPad = new Uint8Array(blockSize + data.length);
  const oKeyPad = new Uint8Array(blockSize + 32);

  for (let i = 0; i < keyLength; i++) {
    iKeyPad[i] = key[i] ^ 0x36;
    oKeyPad[i] = key[i] ^ 0x5c;
  }

  for (let i = keyLength; i < blockSize; i++) {
    iKeyPad[i] = 0x36;
    oKeyPad[i] = 0x5c;
  }

  iKeyPad.set(data, blockSize);
  const innerHash = await sha256(iKeyPad);
  oKeyPad.set(innerHash, blockSize);
  return sha256(oKeyPad);
}
