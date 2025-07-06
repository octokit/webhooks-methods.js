export function concatUint8Array(...arrays: Uint8Array[]): Uint8Array {
  const len = arrays.length;
  if (len === 0) return new Uint8Array(0);
  if (len === 1) return arrays[0];

  let totalLength = 0;
  // Calculate the total length of the resulting Uint8Array
  for (let i = 0; i < len; i++) {
    totalLength += arrays[i].length;
  }
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (let i = 0; i < len; i++) {
    result.set(arrays[i], offset);
    offset += arrays[i].length;
  }

  return result;
}
