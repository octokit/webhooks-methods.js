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
  if (!key || !data) {
    throw new TypeError(
      "[@octokit/webhooks-methods] key & data required for hmacSha256()",
    );
  }

  if (!(key instanceof Uint8Array) || !(data instanceof Uint8Array)) {
    throw new TypeError(
      "[@octokit/webhooks-methods] key & data must be Uint8Array",
    );
  }

  if (key.length > blockSize) {
    key = await sha256(key);
  } else if (key.length < blockSize) {
    const zeroBuffer = new Uint8Array(blockSize).fill(0);
    zeroBuffer.set(key, 0);
    key = zeroBuffer;
  }

  const oKeyPad = new Uint8Array(blockSize);
  const iKeyPad = new Uint8Array(blockSize);

  for (let i = 0; i < blockSize; i++) {
    oKeyPad[i] = key[i] ^ 0x5c;
    iKeyPad[i] = key[i] ^ 0x36;
  }

  const innerHash = await sha256(new Uint8Array([...iKeyPad, ...data]));
  return sha256(new Uint8Array([...oKeyPad, ...innerHash]));
}
