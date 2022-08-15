import { Did } from '@trustcerts/did';
import { DidStatusListStructure, StatusPurpose } from '@trustcerts/gateway';
import {
  DidStatusListDocument,
  StatusListDocResponse,
} from '@trustcerts/observer';
import { Bitstring } from './bit-string';

export class DidStatusList extends Did {
  static objectName = 'statuslist';

  statusPurpose!: StatusPurpose;
  encodedList!: string;

  private list!: Bitstring;

  constructor(public override id: string, private length: number = 1000) {
    super(id, DidStatusList.objectName, 22);
    this.list = new Bitstring({ length: this.length });
    this.statusPurpose = StatusPurpose.revocation;
  }

  parseTransactions(transactions: DidStatusListStructure[]): void {
    // this.values.
    for (const transaction of transactions) {
      this.version++;
      // validate signature of transaction
      // parse it into the existing document
      this.parseTransactionControllers(transaction);
    }
    const lastTransaction = transactions.at(-1);
    if (lastTransaction) {
      this.statusPurpose = lastTransaction.statusPurpose ?? this.statusPurpose;
      this.encodedList = lastTransaction.encodedList ?? this.encodedList;
    }
  }
  parseDocument(docResponse: StatusListDocResponse): void {
    this.parseDocumentSuper(docResponse);
    this.statusPurpose = docResponse.document.statusPurpose;
    this.encodedList = docResponse.document.encodedList;
  }

  async init() {
    const buffer = await Bitstring.decodeBits(this.encodedList);
    this.list = new Bitstring({ buffer });
  }

  getDocument(): DidStatusListDocument {
    return {
      '@context': this.context,
      id: this.id,
      controller: Array.from(this.controller.current.values()),
      statusPurpose: this.statusPurpose,
      encodedList: this.encodedList,
    };
  }
  resetChanges(): void {
    // TODO implement
  }

  async getChanges(): Promise<DidStatusListStructure> {
    const changes = this.getBasicChanges<DidStatusListStructure>();
    this.encodedList = await this.list.encodeBits();
    changes.statusPurpose = this.statusPurpose;
    changes.encodedList = this.encodedList;
    return changes;
  }

  /**
   * Revokes or unrevokes a given credential status
   *
   * @param position
   * @param revoked The revocation status to set it to
   */
  public setRevoked(position: number, revoked = true) {
    this.list.set(position, revoked);
  }

  /**
   * Checks if the positon is revoked
   *
   * @param position
   * @returns
   */
  public async isRevoked(position: number) {
    return this.list.get(position);
  }
}
