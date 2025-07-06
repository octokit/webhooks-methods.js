const hexRE = /^sha256=[\da-fA-F]{64}$/;

/**
 * Verifies if a given value is a valid SHA-256 signature.
 * The signature must start with "sha256=" followed by a 64-character hexadecimal string.
 *
 * @param value - The value to verify.
 * @returns {value is `sha256=${string}`} `true` if the value is a valid SHA-256 signature, `false` otherwise.
 */
export const verifySignature = RegExp.prototype.test.bind(hexRE) as (
  value: string,
) => value is `sha256=${string}`;
