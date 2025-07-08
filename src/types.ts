export type PrefixedSignatureString = `sha256=${string}`;

export type Signer = {
  (
    secret: string,
    payload: string | Uint8Array,
  ): Promise<PrefixedSignatureString>;
  VERSION: string;
};

export type Verifier = {
  (
    secret: string,
    payload: string | Uint8Array,
    signature: string,
  ): Promise<boolean>;
  VERSION: string;
};

export type VerifyWithFallback = {
  (
    secret: string,
    payload: string | Uint8Array,
    signature: string,
    additionalSecrets?: undefined | string[],
  ): Promise<boolean>;
};
