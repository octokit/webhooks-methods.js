const blockSize = 64;

export async function hmacSha256(
  key: Uint8Array,
  data: Uint8Array,
): Promise<Uint8Array> {
  const keyLength = key.length;
  if (keyLength > blockSize) {
    key = new Uint8Array(await crypto.subtle.digest("SHA-256", key), 0, 32);
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
  const innerHash = new Uint8Array(
    await crypto.subtle.digest("SHA-256", iKeyPad),
    0,
    32,
  );
  oKeyPad.set(innerHash, blockSize);
  return new Uint8Array(await crypto.subtle.digest("SHA-256", oKeyPad), 0, 32);
}
