import { ConfigService } from '@trustcerts/config';
import { LocalConfigService } from '@trustcerts/config-local';
import { CryptoService, defaultCryptoKeyService } from '@trustcerts/crypto';
import {
  DidNetworks,
  Identifier,
  VerificationRelationshipType,
} from '@trustcerts/did';
import {
  DidStatusListRegister,
  DidStatusListResolver,
  StatusListIssuerService,
} from '@trustcerts/did-status-list';
import { WalletService } from '@trustcerts/wallet';
import { readFileSync } from 'fs';

describe('test statuslist service', () => {
  let config: ConfigService;
  let cryptoService: CryptoService;

  const testValues = JSON.parse(readFileSync('./values.json', 'utf-8'));

  beforeAll(async () => {
    DidNetworks.add(testValues.network.namespace, testValues.network);
    Identifier.setNetwork(testValues.network.namespace);
    config = new LocalConfigService(testValues.filePath);
    await config.init(testValues.configValues);

    const wallet = new WalletService(config);
    await wallet.init();

    cryptoService = new CryptoService();
    const key = (
      await wallet.findOrCreate(
        VerificationRelationshipType.assertionMethod,
        defaultCryptoKeyService.algorithm
      )
    )[0];
    await cryptoService.init(key);
  }, 10000);

  it('verify and read', async () => {
    if (!config.config.invite) throw new Error();
    const clientSchema = new StatusListIssuerService(
      testValues.network.gateways,
      cryptoService
    );
    const statusListDid = DidStatusListRegister.create({
      controllers: [config.config.invite.id],
      length: 1000,
    });

    const revokeId = 10;
    for (let i = 0; i < statusListDid.getLength(); i++) {
      expect(statusListDid.isRevoked(i)).toEqual(false);
    }
    statusListDid.setRevoked(revokeId);
    for (let i = 0; i < statusListDid.getLength(); i++) {
      expect(statusListDid.isRevoked(i)).toEqual(i == revokeId);
    }
    await DidStatusListRegister.save(statusListDid, clientSchema);

    // Read DID doc from ledger and expect to get original DID document
    const loadedStatusListByTransactions =
      await new DidStatusListResolver().load(statusListDid.id, { doc: false });
    const loadedStatusListByDoc = await new DidStatusListResolver().load(
      statusListDid.id,
      { doc: true }
    );

    expect(loadedStatusListByTransactions.getDocument()).toEqual(
      statusListDid.getDocument()
    );
    expect(loadedStatusListByDoc.getDocument()).toEqual(
      statusListDid.getDocument()
    );
  }, 100000);
});
