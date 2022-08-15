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

  it('verify', async () => {
    if (!config.config.invite) throw new Error();
    const clientSchema = new StatusListIssuerService(
      testValues.network.gateways,
      cryptoService
    );
    const statusListDid = DidStatusListRegister.create({
      controllers: [config.config.invite.id],
    });
    await statusListDid.setRevoked(10);
    await DidStatusListRegister.save(statusListDid, clientSchema);
    const loadedStatusList = await new DidStatusListResolver().load(
      statusListDid.id
    );
    expect(loadedStatusList.encodedList).toEqual(statusListDid.encodedList);
  });
});
