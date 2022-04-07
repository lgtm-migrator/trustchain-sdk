import { Did } from '@trustcerts/did';
import {
  HashDocResponse,
  DidHashStructure,
  DidHashDocument,
} from '@trustcerts/observer';

export class DidHash extends Did {
  algorithm!: string;
  revoked?: string | undefined;

  constructor(public override id: string) {
    super(id);
    // if the passed id value already has a prefix remove it.
    // TODO set correct regexp, normal did should have no type
    // TODO use method from Identifier.method
  }

  protected override getExp() {
    return '^did:trust:[:a-z]*[1-9A-HJ-NP-Za-km-z]{20}';
  }

  parseTransactions(transactions: DidHashStructure[]): void {
    for (const transaction of transactions) {
      this.version++;
      // validate signature of transaction
      // parse it into the existing document
      this.parseTransactionControllers(transaction);

      this.algorithm = transaction.algorithm ?? this.algorithm;
      this.revoked = transaction.revoked ?? this.revoked;
    }
  }

  parseDocument(docResponse: HashDocResponse): void {
    this.parseDocumentSuper(docResponse);
    this.algorithm = docResponse.document.algorithm;
    this.revoked = docResponse.document.revoked;
  }

  getDocument(): DidHashDocument {
    return {
      '@context': this.context,
      id: this.id,
      controller: Array.from(this.controller.current.values()),
      algorithm: this.algorithm,
      revoked: this.revoked,
    };
  }
  resetChanges(): void {
    //TODO define reset
  }

  getChanges(): DidHashStructure {
    const changes = this.getBasicChanges<DidHashStructure>();
    changes.algorithm = this.algorithm;
    changes.revoked = this.revoked;
    return changes;
  }
}
