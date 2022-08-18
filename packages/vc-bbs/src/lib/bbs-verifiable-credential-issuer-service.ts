import { JsonWebKey } from '@mattrglobal/bls12381-key-pair/lib/types';
import {
  BbsBlsSignature2020,
  Bls12381G2KeyPair,
} from '@mattrglobal/jsonld-signatures-bbs';
import { purposes, sign } from 'jsonld-signatures';
import {
  IVerifiableCredentialArguments,
  IVerifiablePresentationArgumentsBBS,
  IVerifiablePresentationBBS,
  VerifiableCredentialBBS,
  DocumentLoader,
} from '@trustcerts/vc';

import { DecryptedKeyPair } from '@trustcerts/crypto';
import { logger } from '@trustcerts/logger';
import { RevocationService } from '@trustcerts/did-status-list';
export class BbsVerifiableCredentialIssuerService {
  /**
   * Creates a verifiable credential signed with a BBS+ signature.
   *
   * @param vcArguments The arguments of the verifiable credential
   * @param keyPair The Bls12381G2 keypair as JsonWebKeys
   * @param revocationService If set, a credentialStatus property is added to the verifiable credential using revocationService
   * @returns A BBS+ signed verifiable credential
   */
  async createBBSVerifiableCredential(
    vcArguments: IVerifiableCredentialArguments,
    keyPair: DecryptedKeyPair,
    revocationService?: RevocationService
  ): Promise<VerifiableCredentialBBS> {
    const issuanceDate = new Date();

    const bbsKeyPair = await Bls12381G2KeyPair.fromJwk({
      publicKeyJwk: keyPair.publicKey as JsonWebKey,
      privateKeyJwk: keyPair.privateKey as JsonWebKey,
      id: keyPair.identifier,
    });

    const docLoader = new DocumentLoader().getLoader();

    // Add VerifiableCredential as type if not present yet
    const vcTypes = [...vcArguments.type];
    if (!vcTypes.find((vcType) => vcType == 'VerifiableCredential')) {
      vcTypes.unshift('VerifiableCredential');
    }

    const vc: Partial<VerifiableCredentialBBS> = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://w3id.org/security/bbs/v1',
        ...vcArguments['@context'],
      ],
      type: vcTypes,
      credentialSubject: vcArguments.credentialSubject,
      issuanceDate: issuanceDate.toISOString(),
      issuer: String(vcArguments.issuer),
      id: vcArguments.id,
    };

    if (revocationService) {
      vc.credentialStatus = await revocationService.getNewCredentialStatus();
      vc['@context']!.push('https://w3id.org/vc/status-list/2021/v1');
    }

    // TODO: Warum sind diese 3 Zeilen auskommentiert? Warum hat das Interface kein expirationDate?
    // if (vcArguments.expirationDate !== undefined) {
    //     vc['expirationDate'] = vcArguments.expirationDate;
    // }

    const signedCredential: VerifiableCredentialBBS = await sign(vc, {
      suite: new BbsBlsSignature2020({ key: bbsKeyPair }),
      purpose: new purposes.AssertionProofPurpose(),
      documentLoader: docLoader,
    });

    logger.debug(signedCredential);

    return signedCredential;
  }

  /**
   * Creates a verifiable presentation signed with a BBS+ signature.
   *
   * @param vpArguments The arguments of the verifiable presentation
   * @param keyPair The Bls12381G2 keypair as JsonWebKeys
   * @returns A BBS+ signed verifiable presentation
   */
  async createVerifiablePresentation(
    vpArguments: IVerifiablePresentationArgumentsBBS,
    keyPair: DecryptedKeyPair
  ): Promise<IVerifiablePresentationBBS> {
    const verifiablePresentation: Partial<IVerifiablePresentationBBS> = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://w3id.org/security/bbs/v1',
        ...vpArguments['@context'],
      ],
      type: ['VerifiablePresentation', ...vpArguments.type],
      verifiableCredential: vpArguments.verifiableCredential,
    };

    const bbsKeyPair = await Bls12381G2KeyPair.fromJwk({
      publicKeyJwk: keyPair.publicKey as JsonWebKey,
      privateKeyJwk: keyPair.privateKey as JsonWebKey,
      id: keyPair.identifier,
    });

    const docLoader = new DocumentLoader().getLoader();

    const signedPresentation: IVerifiablePresentationBBS = (await sign(
      verifiablePresentation,
      {
        suite: new BbsBlsSignature2020({ key: bbsKeyPair }),
        purpose: new purposes.AuthenticationProofPurpose({
          challenge: vpArguments.challenge,
          domain: vpArguments.domain,
        }),
        documentLoader: docLoader,
      }
    )) as IVerifiablePresentationBBS;

    logger.debug(signedPresentation);

    return signedPresentation;
  }
}
