const textEncoder = new TextEncoder();

export const stringToUint8Array =
  TextEncoder.prototype.encode.bind(textEncoder);
