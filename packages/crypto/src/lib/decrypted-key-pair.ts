import { SignatureType } from './signature-type';

export class DecryptedKeyPair {
  privateKey!: JsonWebKey;

  publicKey!: JsonWebKey;

  /**
   * unique identifier for the public key, in most cases the fingerprint.
   */
  identifier!: string;

  signatureType!: SignatureType;
}
