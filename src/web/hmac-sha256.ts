export async function hmacSha256(
  key: Uint8Array,
  data: Uint8Array,
): Promise<Uint8Array> {
  const importedKey = await crypto.subtle.importKey(
    "raw", // raw format of the key - should be Uint8Array
    key, // the key to import
    {
      // algorithm details
      name: "HMAC",
      hash: { name: "SHA-256" },
    },
    false, // export = false
    ["sign", "verify"], // what this key can do
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    importedKey, // the key to use for signing
    data,
  );
  return new Uint8Array(signature);
}
