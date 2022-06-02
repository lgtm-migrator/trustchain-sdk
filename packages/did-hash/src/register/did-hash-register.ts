import {
  getHashFromFile,
  getHashFromArrayBuffer,
  getHash,
} from '@trustcerts/crypto';
import { DidCreation, Identifier } from '@trustcerts/did';
import { SchemaResponse } from '@trustcerts/gateway';
import { DidHash } from '../resolver/did-hash';
import { DidHashResolver } from '../resolver/did-hash-resolver';
import { SignatureIssuerService } from './hash-issuer-service';

export interface DidHashCreation extends DidCreation {
  id: string;
  algorithm: string;
}

export class DidHashRegister {
  private didSignatrueResolver = new DidHashResolver();

  /**
   * creates a fresh did with a unique identifier. Add controller when they are passed.
   */
  public create(values: DidHashCreation): DidHash {
    // TODO check if a given id should be allowed
    const id = values?.id ?? Identifier.generate('hash');
    const did = new DidHash(id);
    values.controllers?.forEach((controller) => did.addController(controller));
    did.algorithm = values.algorithm;
    return did;
  }

  public save(
    did: DidHash,
    client: SignatureIssuerService,
    date?: string
  ): Promise<SchemaResponse> {
    const value = did.getChanges();
    did.version++;
    did.resetChanges();
    return client.persistHash(value, date);
  }

  /**
   * Signs a file
   *
   * @returns {Promise<void>}
   */
  async signFile(filePath: string, controllers: string[]): Promise<DidHash> {
    const hash = await getHashFromFile(filePath);
    return this.create({
      id: Identifier.generate('hash', hash),
      algorithm: 'sha256',
      controllers,
    });
  }

  /**
   * Signs a buffer
   *
   * @returns {Promise<void>}
   */
  async signBuffer(
    buffer: ArrayBuffer,
    controllers: string[]
  ): Promise<DidHash> {
    const hash = await getHashFromArrayBuffer(buffer);
    return this.create({
      id: Identifier.generate('hash', hash),
      algorithm: 'sha256',
      controllers,
    });
  }

  /**
   * Signs a string.
   * @param value
   */
  async signString(value: string, controllers: string[]): Promise<DidHash> {
    const hash = await getHash(value);
    return this.create({
      id: Identifier.generate('hash', hash),
      algorithm: 'sha256',
      controllers,
    });
  }

  /**
   * Revokes a file
   *
   * @returns {Promise<void>}
   */
  async revokeFile(
    filePath: string,
    date = new Date().toISOString()
  ): Promise<DidHash> {
    const hash = await getHashFromFile(filePath);
    return this.revoke(hash, date);
  }

  /**
   * Revokes a buffer
   *
   * @returns {Promise<void>}
   */
  async revokeBuffer(
    buffer: Buffer,
    date = new Date().toISOString()
  ): Promise<DidHash> {
    const hash = await getHashFromArrayBuffer(buffer);
    return this.revoke(hash, date);
  }

  /**
   * Revokes a string.
   * @param value
   */
  async revokeString(
    value: string,
    date = new Date().toISOString()
  ): Promise<DidHash> {
    const hash = await getHash(value);
    return this.revoke(hash, date);
  }

  /**
   * Revokes a string
   * @param hash
   * @private
   */
  private async revoke(hash: string, date: string) {
    const did = await this.didSignatrueResolver.load(
      Identifier.generate('hash', hash)
    );
    did.revoked = date;
    return did;
  }
}
