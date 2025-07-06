const padding = "00000000";

export function uint8ArrayToHex(value: Uint8Array): string {
  let digest = "";
  const view = new DataView(value.buffer, value.byteOffset, value.byteLength);
  for (let i = 0; i < view.byteLength; i += 4) {
    // We use getUint32 to reduce the number of iterations (notice the `i += 4`)
    const value = view.getUint32(i);
    // toString(16) will transform the integer into the corresponding hex string
    // but will remove any initial "0"
    const stringValue = value.toString(16);
    // One Uint32 element is 4 bytes or 8 hex chars (it would also work with 4
    // chars for Uint16 and 2 chars for Uint8)
    const paddedValue = (padding + stringValue).slice(-8);
    digest += paddedValue;
  }

  return digest;
}
