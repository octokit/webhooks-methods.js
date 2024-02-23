export enum Algorithm {
  SHA256 = "sha256",
}

export type AlgorithmLike = Algorithm | "sha256";

export type SignOptions = {
  secret: string;
  algorithm?: AlgorithmLike;
};
