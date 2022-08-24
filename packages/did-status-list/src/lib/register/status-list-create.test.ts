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
  RevocationService,
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

  async function createRevocationService(
    revocationServicePath: string,
    statusListLength?: number
  ): Promise<RevocationService> {
    if (!config.config.invite) throw new Error();
    const client = new StatusListIssuerService(
      testValues.network.gateways,
      cryptoService
    );
    const statusListDid = DidStatusListRegister.create({
      controllers: [config.config.invite.id],
      length: statusListLength,
    });
    await DidStatusListRegister.save(statusListDid, client);
    return RevocationService.create(statusListDid, revocationServicePath);
  }

  it('create', async () => {
    if (!config.config.invite) throw new Error();
    const client = new StatusListIssuerService(
      testValues.network.gateways,
      cryptoService
    );
    const statusListDid = DidStatusListRegister.create({
      controllers: [config.config.invite.id],
    });
    const response = await DidStatusListRegister.save(statusListDid, client);
    expect(response).toBeDefined();
  });

  it('load', async () => {
    const revocationServicePath = './tmp/revocationListConfig.json';
    await createRevocationService(revocationServicePath);
    const revocationService = await RevocationService.load(
      revocationServicePath
    );
    expect(revocationService.did).toBeDefined();
  });

  it('persist', async () => {
    const revocationServicePath = './tmp/revocationListConfig.json';
    const revocationService = await createRevocationService(
      revocationServicePath
    );
    const client = new StatusListIssuerService(
      testValues.network.gateways,
      cryptoService
    );

    // Create new credential status
    const credentialStatus = await revocationService.getNewCredentialStatus();

    // Revoke credential
    await revocationService.setRevoked(credentialStatus, true);

    // Expect status list resolver to return credential as not revoked yet
    expect(
      (await new DidStatusListResolver().load(credentialStatus.id)).isRevoked(
        credentialStatus.statusListIndex
      )
    ).toEqual(false);

    // Persist status list
    await revocationService.persistStatusList(client);

    // Expect status list resolver to return credential as revoked now
    expect(
      (await new DidStatusListResolver().load(credentialStatus.id)).isRevoked(
        credentialStatus.statusListIndex
      )
    ).toEqual(true);
  }, 20000);

  it('revoke credentialStatus', async () => {
    const revocationServicePath = './tmp/revocationListConfig.json';
    const revocationService = await createRevocationService(
      revocationServicePath
    );
    const credentialStatus = await revocationService.getNewCredentialStatus();
    expect(credentialStatus.id).toBeDefined();

    // Expect credential not to be revoked
    expect(
      revocationService.did.isRevoked(credentialStatus.statusListIndex)
    ).toEqual(false);

    // Revoke credential
    await revocationService.setRevoked(credentialStatus, true);
    // Expect credential to be revoked
    expect(
      revocationService.did.isRevoked(credentialStatus.statusListIndex)
    ).toEqual(true);

    // Unrevoke credential
    await revocationService.setRevoked(credentialStatus, false);
    // Expect credential not to be revoked
    expect(
      revocationService.did.isRevoked(credentialStatus.statusListIndex)
    ).toEqual(false);
  });

  it('maximum size', async () => {
    const revocationServicePath = './tmp/revocationListConfig.json';
    const statusListLength = 10;
    const revocationService = await createRevocationService(
      revocationServicePath,
      statusListLength
    );

    // create maximum number of credential status
    for (let i = 0; i < statusListLength; i++) {
      const credentialStatus = await revocationService.getNewCredentialStatus();
      expect(credentialStatus.id).toBeDefined();
    }

    // expect list to be full now
    await expect(
      revocationService.getNewCredentialStatus()
    ).rejects.toThrowError('The revocation list is full!');
  });
});
