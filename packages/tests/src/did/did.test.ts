import { ConfigService } from '@trustcerts/config';
import { LocalConfigService } from '@trustcerts/config-local';
import { CryptoService, defaultCryptoKeyService } from '@trustcerts/crypto';
import {
  DidId,
  DidIdIssuerService,
  DidIdRegister,
  DidIdResolver,
  DidNetworks,
  DidRoles,
  Identifier,
  VerificationRelationshipType,
} from '@trustcerts/did';
import { WalletService } from '@trustcerts/wallet';
import { readFileSync } from 'fs';

describe('test did', () => {
  let config: ConfigService;

  let cryptoService: CryptoService;

  const resolver = new DidIdResolver();

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

  it('verify did chain of trust temporary test case', async () => {
    if (!config.config.invite) throw Error();
    const did = DidIdRegister.create({
      controllers: [config.config.invite.id],
    });
    did.addRole(DidRoles.Client);
    const client = new DidIdIssuerService(
      testValues.network.gateways,
      cryptoService
    );
    await DidIdRegister.save(did, client);
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve(true);
      }, 2000)
    );
    const resolver = new DidIdResolver();
    const did1 = await resolver.load(did.id);
    expect(did.getDocument()).toEqual(did1.getDocument());
  }, 7000);

  it('read did', async () => {
    if (!config.config.invite) throw Error();
    const did = DidIdRegister.create({
      controllers: [config.config.invite.id],
    });
    did.addRole(DidRoles.Client);
    const client = new DidIdIssuerService(
      testValues.network.gateways,
      cryptoService
    );
    expect(client.getId()).toEqual(cryptoService.fingerPrint.split('#')[0]);
    await DidIdRegister.save(did, client);
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve(true);
      }, 2000)
    );
    const did1 = await resolver.load(did.id, { doc: false });
    expect(did.getDocument()).toEqual(did1.getDocument());
    const did2 = await resolver.load(did.id, { doc: true });
    expect(did.getDocument()).toEqual(did2.getDocument());
  }, 7000);

  it('read non existing did', (done) => {
    const id = 'did:trust:tc:dev:id:QQQQQQQQQQQQQQQQQQQQQQ';
    resolver.load(id).catch((err) => {
      expect(err).toBeDefined();
      done();
    });
    // await expect(did).rejects.toEqual(new Error(`${id} not found`));
  }, 7000);

  it('test did resolver', () => {
    let exampleNetwork = { gateways: ['a'], observers: ['a'] };
    DidNetworks.add('test:foo', exampleNetwork);
    let resolvedNetwork = DidNetworks.resolveNetwork('test:foo');
    expect(resolvedNetwork).toEqual(exampleNetwork);

    exampleNetwork = { gateways: ['a', 'b'], observers: ['a'] };
    DidNetworks.add('test:foo', exampleNetwork);
    resolvedNetwork = DidNetworks.resolveNetwork('test:foo');
    expect(resolvedNetwork).toEqual(exampleNetwork);
  });

  it('test DidCachedService', async () => {
    // TODO: DidCachedService is not used yet by did resolver
    expect(true).toBeTruthy();
  }, 7000);

  it('test createByInvite', async () => {
    // TODO
  }, 7000);

  it('read invalid did', async () => {
    // RegExp: ^did:trust:[:a-z]*[1-9A-HJ-NP-Za-km-z]{22}$

    const invalidDIDs = [
      'invalid',
      'invalid did',
      'no:trust:tc:dev:id:aaaaaaaaaaaaaaaaaaaaaa', // not starting with did:trust
      'did:foo:tc:dev:id:aaaaaaaaaaaaaaaaaaaaaa', // not starting with did:trust
      'Did:trust:tc:dev:id:aaaaaaaaaaaaaaaaaaaaaa', // did not lower case
      'did:Trust:tc:dev:id:aaaaaaaaaaaaaaaaaaaaaa', // trust not lower case
      'did:trust:TC:dev:id:aaaaaaaaaaaaaaaaaaaaaa', // tc not lower case
      'did:trust:TC:dev:iD:aaaaaaaaaaaaaaaaaaaaaa', // id not lower case
      'did:trust:tc:dev:id:aaaaaaaaaaaaaaaaaaaaa', // too short (<22)
      'did:trust:tc:dev:id:aaaaaaaaaaaaaaaaaaaaaaa', // identifier too long (>22)
      'did:trust:tc:dev:id:aaaaaaaaaaaaaaaaaaaaa0', // invalid chars (not base58)
      'did:trust:tc:dev:id:aaaaaaaaaaaaaaaaaaaaaO', // invalid chars (not base58)
      'did:trust:tc:dev:id:aaaaaaaaaaaaaaaaaaaaal', // invalid chars (not base58)
      'did:trust:tc:dev:id:aaaaaaaaaaaaaaaaaaaaaI', // invalid chars (not base58)
      'did:trust:tc:dev:id:aaaaaaaaaaaaaaaaaaaaa/', // invalid chars (not base58)
      'did:trust:tc:dev:id:aaaaaaaaaaaaaaaaaaaaa+', // invalid chars (not base58)
      'did:trust:tctctctctct:dev:id:aaaaaaaaaaaaaaaaaaaaaa', // namespace part long (>10)
      'did:trust:tc:devdevdevde:id:aaaaaaaaaaaaaaaaaaaaaa', // namespace part long (>10)
      'did:trust:tc:dev:idididididi:aaaaaaaaaaaaaaaaaaaaaa', // namespace part long (>10)
      'did:trust::dev:id:aaaaaaaaaaaaaaaaaaaaaa', // no primary namespace specified
      'did:trust:tc:dev:foo:aaaaaaaaaaaaaaaaaaaaaa', // did type not 'id'
    ];

    for (const did of invalidDIDs) {
      expect(() => new DidId(did)).toThrowError();
    }
  }, 7000);
});
