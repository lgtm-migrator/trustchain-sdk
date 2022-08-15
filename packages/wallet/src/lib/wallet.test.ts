import { ConfigService, Invite } from '@trustcerts/config';
import { LocalConfigService } from '@trustcerts/config-local';
import {
  defaultCryptoKeyService,
  ECCryptoKeyService,
  RSACryptoKeyService,
} from '@trustcerts/crypto';
import { BbsCryptoKeyService } from '@trustcerts/crypto-bbs';
import {
  DidCreator,
  DidNetworks,
  Identifier,
  VerificationRelationshipType,
} from '@trustcerts/did';
import { exists, remove } from '@trustcerts/helpers';
import { WalletService } from '@trustcerts/wallet';
import { readFileSync } from 'fs';

/**
 * Test vc class.
 */
describe('wallet', () => {
  let config: ConfigService;

  const testValues = JSON.parse(
    readFileSync('./tests/values-dev.json', 'utf-8')
  );

  beforeAll(async () => {
    DidNetworks.add(testValues.network.namespace, testValues.network);
    Identifier.setNetwork(testValues.network.namespace);
    config = new LocalConfigService(testValues.filePath);
    await config.init(testValues.configValues);
  });

  it('add and remove key', async () => {
    const cryptoKeyServices = [
      new RSACryptoKeyService(),
      new ECCryptoKeyService(),
      new BbsCryptoKeyService(),
    ];
    const walletService = new WalletService(config, cryptoKeyServices);
    await walletService.init();
    // Add a key for each SignatureType
    for (const cryptoKeyService of cryptoKeyServices) {
      // Add a key for each verification relationship
      const key = await walletService.addKey(
        Object.values(VerificationRelationshipType),
        cryptoKeyService.algorithm
      );

      // Check if the key is found by its identifier
      expect(walletService.findKeyByID(key.identifier)).toBe(key);

      // Check if the key is found by vrType and signatureType
      Object.values(VerificationRelationshipType).forEach((vrType) => {
        expect(
          walletService.findKeys(vrType, cryptoKeyService.algorithm)
        ).toContain(key);
      });

      // Remove the key
      walletService.removeKeyByID(key.identifier);

      // Verify that the key is removed
      expect(walletService.findKeyByID(key.identifier)).toBeUndefined();
    }
  }, 10000);
  it('add key with invalid algorithm', async () => {
    const walletService = new WalletService(config);
    await walletService.init();
    await expect(
      walletService.addKey(
        [VerificationRelationshipType.assertionMethod],
        {} as Algorithm
      )
    ).rejects.toThrowError('no service found for');
  }, 10000);
  it('test findOrCreate', async () => {
    const walletService = new WalletService(config);
    await walletService.init();

    const testKeyType = VerificationRelationshipType.assertionMethod;
    const testKeyAlgorithm = defaultCryptoKeyService.algorithm;

    // first make sure there are no keys yet, so findOrCreate has to create the key
    const keys = walletService.findKeys(testKeyType, testKeyAlgorithm);
    for (const key of keys) {
      walletService.removeKeyByID(key.identifier);
    }

    // expect no key to be found
    expect(walletService.findKeys(testKeyType, testKeyAlgorithm)).toHaveLength(
      0
    );

    await walletService.findOrCreate(testKeyType, testKeyAlgorithm);

    // expect that exactly one key was found (because it was created)
    expect(walletService.findKeys(testKeyType, testKeyAlgorithm)).toHaveLength(
      1
    );

    // call findOrCreate again and expect that still exactly one key was found (because it was found and not created again)
    await walletService.findOrCreate(testKeyType, testKeyAlgorithm);
    expect(walletService.findKeys(testKeyType, testKeyAlgorithm)).toHaveLength(
      1
    );
  }, 30000);

  it('tidy up', async () => {
    const walletService = new WalletService(config);
    await walletService.init();

    // Push new key to local configService of wallet, but don't add it to the DID document
    const invalidKey = await defaultCryptoKeyService.generateKeyPair(
      walletService.did.id
    );
    // Push new key with invalid DID to local configService of wallet
    const invalidKey2 = await defaultCryptoKeyService.generateKeyPair(
      'invalid did'
    );
    walletService.configService.config.keyPairs.push(invalidKey);
    walletService.configService.config.keyPairs.push(invalidKey2);

    expect(walletService.findKeyByID(invalidKey.identifier)).toBe(invalidKey);
    expect(walletService.findKeyByID(invalidKey2.identifier)).toBe(invalidKey2);

    // Remove keys from local configSerive of wallet that don't exist in the DID document
    await walletService.tidyUp();

    expect(walletService.findKeyByID(invalidKey.identifier)).toBeUndefined();
    expect(walletService.findKeyByID(invalidKey2.identifier)).toBeUndefined();
  }, 15000);

  it('init wallet with invalid config invite', async () => {
    config.config.invite = null as any as Invite;
    const walletService = new WalletService(config, []);
    await expect(walletService.init()).rejects.toThrowError('no id found');
  }, 15000);

  it('init wallet with new unused invite', async () => {
    const id = Identifier.generate('id');
    const secret = 'secret';
    const name = 'test-did';
    const didCreator = new DidCreator(testValues.network.gateways, 'dev');
    const invite = await didCreator.createNewInviteForDid(id, name, secret);

    const temporaryConfigPath = './tmp/temporaryConfig';

    const newConfig = new LocalConfigService(temporaryConfigPath);
    await newConfig.init({
      invite: invite,
      name: name,
      keyPairs: [],
    });

    const walletService = new WalletService(newConfig);
    await walletService.init();
    // Expect DID to be created and thus walletService.did to be defined
    expect(walletService.did.id).toEqual(invite.id);

    if (exists(temporaryConfigPath)) {
      remove(temporaryConfigPath);
    }
  }, 20000);

  it('init wallet with new invalid invite', async () => {
    const invite = {
      id: 'invalid',
      secret: 'invalid',
      endpoint: testValues.network.gateways[0],
    };

    const temporaryConfigPath = './tmp/temporaryConfig';

    const newConfig = new LocalConfigService(temporaryConfigPath);
    await newConfig.init({
      invite: invite,
      name: 'invalid',
      keyPairs: [],
    });

    const walletService = new WalletService(newConfig);
    await expect(walletService.init()).rejects.toThrowError(
      'Could not create DID by invite'
    );

    if (exists(temporaryConfigPath)) {
      remove(temporaryConfigPath);
    }
  }, 20000);
});
