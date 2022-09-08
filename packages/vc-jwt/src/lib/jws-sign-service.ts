import { JsonWebKey } from '@mattrglobal/bls12381-key-pair/lib/types';
import {
  BbsBlsSignature2020,
  Bls12381G2KeyPair,
} from '@mattrglobal/jsonld-signatures-bbs';
import { DecryptedKeyPair } from '@trustcerts/crypto';
import {
  DocumentLoader,
  ISignService,
  ProofPurpose,
  ProofType,
  ProofValues,
  VerifiableCredential,
  VerifiableCredentialProof,
} from '@trustcerts/vc';
import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020';
import { Ed25519Signature2020 } from '@digitalbazaar/ed25519-signature-2020';
import vc from '@digitalbazaar/vc';

export interface VerifiableCredentialJwsProof
  extends VerifiableCredentialProof {
  jws: string;
}

export class JwsSignService
  implements ISignService<VerifiableCredentialJwsProof>
{
  constructor(
    private keyPair: DecryptedKeyPair,
    private docLoader = new DocumentLoader().getLoader()
  ) {}

  async sign(
    values: ProofValues
  ): Promise<VerifiableCredential<VerifiableCredentialJwsProof>> {
    values['@context'].push('https://w3id.org/security/bbs/v1');

    const keyPair = await Ed25519VerificationKey2020.generate();

    const suite = new Ed25519Signature2020({ key: keyPair });

    return await vc.issue({ values, suite, documentLoader: this.docLoader });
  }
}
