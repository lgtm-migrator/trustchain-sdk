export class DecryptedKeyPair {
  privateKey!: JsonWebKey;

  publicKey!: JsonWebKey;

  /**
   * unique identifier for the public key, in most cases the fingerprint.
   */
  identifier!: string;

  // TODO check if this param is required since the keytype is defined in the publickey
  keyType!: string;
}
