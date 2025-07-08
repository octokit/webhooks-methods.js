export async function hmacSha256(
  key: Awaited<ReturnType<typeof crypto.subtle.importKey>>,
  data: Uint8Array,
): Promise<Uint8Array> {
  const signature = await crypto.subtle.sign(
    "HMAC",
    key, // the key to use for signing
    data,
  );
  return new Uint8Array(signature);
}
