export type Signature = `sha256=${string}`;

export type Signer = {
  (secret: string, payload: string): Promise<Signature>;
  VERSION: string;
};

export type Verifier = {
  (secret: string, eventPayload: string, signature: string): Promise<boolean>;
  VERSION: string;
};

export type VerifyWithFallback = {
  (
    secret: string,
    payload: string,
    signature: string,
    additionalSecrets?: undefined | string[],
  ): Promise<boolean>;
};
