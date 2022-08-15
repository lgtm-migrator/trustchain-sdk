import { Identifier, DidCreation } from '@trustcerts/did';
import { StatusListResponse } from '@trustcerts/gateway';
import { DidStatusList } from '../resolver/did-status-list';
import { StatusListIssuerService } from './status-list-issuer-service';

export class DidStatusListRegister {
  /**
   * creates a fresh did with a unique identifier. Add controller when they are passed.
   *
   * @param values
   * @returns
   */
  public static create(values?: DidCreation): DidStatusList {
    // TODO check if a given id should be allowed
    const id = values?.id ?? Identifier.generate(DidStatusList.objectName);
    const did = new DidStatusList(id);
    values?.controllers?.forEach((controller) => did.addController(controller));
    return did;
  }

  public static async save(
    did: DidStatusList,
    client: StatusListIssuerService
  ): Promise<StatusListResponse> {
    const value = await did.getChanges();
    did.version++;
    did.resetChanges();
    return client.persistStatusList(value);
  }
}
