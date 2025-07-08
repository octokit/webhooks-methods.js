export async function cryptoVerify(
  key: Awaited<ReturnType<typeof crypto.subtle.importKey>>,
  data: Uint8Array,
  signature: Uint8Array,
): Promise<boolean> {
  return await crypto.subtle.verify("HMAC", key, signature, data);
}
