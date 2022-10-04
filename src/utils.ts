export const getAlgorithm = (signature: string) => {
  return signature.startsWith("sha256=") ? "sha256" : "sha1";
};
