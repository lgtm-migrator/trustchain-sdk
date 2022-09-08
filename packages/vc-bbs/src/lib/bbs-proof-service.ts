import { JsonWebKey } from '@mattrglobal/bls12381-key-pair/lib/types';
import {
  BbsBlsSignature2020,
  Bls12381G2KeyPair,
} from '@mattrglobal/jsonld-signatures-bbs';
import { DecryptedKeyPair } from '@trustcerts/crypto';
import { purposes, sign } from 'jsonld-signatures';
import {
  DocumentLoader,
  ISignService,
  ProofValues,
  VerifiableCredential,
  VerifiableCredentialBBSProof,
} from '@trustcerts/vc';

export class BbsSignService
  implements ISignService<VerifiableCredentialBBSProof>
{
  constructor(
    private keyPair: DecryptedKeyPair,
    private docLoader = new DocumentLoader().getLoader()
  ) {}

  async sign(
    values: ProofValues
  ): Promise<VerifiableCredential<VerifiableCredentialBBSProof>> {
    const bbsKeyPair = await Bls12381G2KeyPair.fromJwk({
      publicKeyJwk: this.keyPair.publicKey as JsonWebKey,
      privateKeyJwk: this.keyPair.privateKey as JsonWebKey,
      id: this.keyPair.identifier,
    });

    values['@context'].push('https://w3id.org/security/bbs/v1');
    return sign(values, {
      suite: new BbsBlsSignature2020({ key: bbsKeyPair }),
      purpose: new purposes.AssertionProofPurpose(),
      documentLoader: this.docLoader,
    });
  }
}
