export const isValidSignaturePrefix = (signature: string) => {
  return (
    signature.length === 71 &&
    signature[0] === "s" &&
    signature[1] === "h" &&
    signature[2] === "a" &&
    signature[3] === "2" &&
    signature[4] === "5" &&
    signature[5] === "6" &&
    signature[6] === "="
  );
};
