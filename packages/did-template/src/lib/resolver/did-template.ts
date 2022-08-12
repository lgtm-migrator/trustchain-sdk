import { Did } from '@trustcerts/did';
import { DidTemplateStructure } from '@trustcerts/gateway';
import {
  Compression,
  DidTemplateDocument,
  TemplateDocResponse,
} from '@trustcerts/observer';

export class DidTemplate extends Did {
  // use setters to change values to detect if there where changes
  public compression!: Compression;

  public template!: string;

  public schemaId!: string;

  constructor(public override id: string) {
    super(id, 'tmp', 22);
  }

  parseTransactions(transactions: DidTemplateStructure[]): void {
    // this.values.
    for (const transaction of transactions) {
      this.version++;
      // validate signature of transaction
      // parse it into the existing document
      this.parseTransactionControllers(transaction);

      this.schemaId = transaction.schemaId ?? this.schemaId;
      this.template = transaction.template ?? this.template;
      this.compression = transaction.compression ?? this.compression;
    }
  }
  parseDocument(docResponse: TemplateDocResponse): void {
    this.parseDocumentSuper(docResponse);
    this.schemaId = docResponse.document.schemaId;
    this.template = docResponse.document.template;
    this.compression = docResponse.document.compression;
  }

  getDocument(): DidTemplateDocument {
    return {
      '@context': this.context,
      id: this.id,
      controller: Array.from(this.controller.current.values()),
      compression: this.compression,
      template: this.template,
      schemaId: this.schemaId,
    };
  }
  resetChanges(): void {
    // TODO implement
  }

  getChanges(): DidTemplateStructure {
    const changes = this.getBasicChanges<DidTemplateStructure>();
    changes.compression = this.compression;
    changes.schemaId = this.schemaId;
    changes.template = this.template;
    return changes;
  }
}
