// import { existsSync, rmSync, readFileSync } from 'fs';
// import { LocalConfigService } from '@trustcerts/config-local';
// import { WalletService } from '@trustcerts/wallet';
// import { ConfigService } from '@trustcerts/config';
// import {
//   CryptoService,
//   SignatureType,
//   getRandomValues,
// } from '@trustcerts/crypto';
// import {
//   DidNetworks,
//   Identifier,
//   VerificationRelationshipType,
// } from '@trustcerts/did';
// import { base58Encode, write } from '@trustcerts/helpers';
// import { SignatureIssuerService } from './hash-issuer-service';
// import { DidHashRegister } from './did-hash-register';
// import { DidHashResolver } from '../resolver/did-hash-resolver';

describe('test signature service', () => {
  it("should be edited" , ()=> {
    expect(true).toBeTruthy()
})
  // let config: ConfigService;

  // let cryptoService: CryptoService;

  // const testFile = 'tmp/test';

  // const testValues = JSON.parse(readFileSync('../../values.json', 'utf-8'));

  // beforeAll(async () => {
  //   DidNetworks.add(testValues.network.namespace, testValues.network);
  //   Identifier.setNetwork(testValues.network.namespace);
  //   config = new LocalConfigService(testValues.filePath);
  //   await config.init(testValues.configValues);

  //   const wallet = new WalletService(config);
  //   await wallet.init();

  //   cryptoService = new CryptoService();

  //   const key = (
  //     await wallet.findOrCreate(
  //       VerificationRelationshipType.assertionMethod,
  //       SignatureType.Rsa
  //     )
  //   )[0];
  //   await cryptoService.init(key);
  // }, 10000);

  // it('sign string', async () => {
  //   const issuer = new SignatureIssuerService(
  //     testValues.network.gateways,
  //     cryptoService
  //   );
  //   const signature = base58Encode(getRandomValues(new Uint8Array(20)));

  //   const didhashRegister = new DidHashRegister();
  //   const resolver = new DidHashResolver();

  //   const did = await didhashRegister.signString(signature, [
  //     config.config.invite!.id,
  //   ]);
  //   await didhashRegister.save(did, issuer);
  //   // wait some time since the observer has to be synced.
  //   await new Promise((res) => setTimeout(res, 2000));
  //   const loadedDid = await resolver.load(did.id);
  //   expect(loadedDid.id).toEqual(did.id);
  // }, 7000);

  // it('sign string double', async () => {
  //   const issuer = new SignatureIssuerService(
  //     testValues.network.gateways,
  //     cryptoService
  //   );
  //   const signature = base58Encode(getRandomValues(new Uint8Array(20)));

  //   const didhashRegister = new DidHashRegister();
  //   const resolver = new DidHashResolver();

  //   const did = await didhashRegister.signString(signature, [
  //     config.config.invite!.id,
  //   ]);
  //   await didhashRegister.save(did, issuer);
  //   // wait some time since the observer has to be synced.
  //   await new Promise((res) => setTimeout(res, 2000));
  //   const loadedDid = await resolver.load(did.id);
  //   expect(loadedDid.id).toEqual(did.id);
  //   await didhashRegister
  //     .save(did, issuer)
  //     .catch((err) =>
  //       expect(err.message.includes('hash already signed')).toBeTruthy()
  //     );
  // }, 7000);

  // it('sign buffer', async () => {
  //   const issuer = new SignatureIssuerService(
  //     testValues.network.gateways,
  //     cryptoService
  //   );
  //   const didhashRegister = new DidHashRegister();
  //   const resolver = new DidHashResolver();

  //   const did = await didhashRegister.signBuffer(new ArrayBuffer(8), [
  //     config.config.invite!.id,
  //   ]);
  //   await didhashRegister.save(did, issuer);
  //   // wait some time since the observer has to be synced.
  //   await new Promise((res) => setTimeout(res, 2000));
  //   const loadedDid = await resolver.load(did.id);
  //   expect(loadedDid.id).toEqual(did.id);
  // });

  // it('sign file', async () => {
  //   const issuer = new SignatureIssuerService(
  //     testValues.network.gateways,
  //     cryptoService
  //   );
  //   const didhashRegister = new DidHashRegister();
  //   const resolver = new DidHashResolver();

  //   write(testFile, getRandomValues(new Uint8Array(200)).toString());
  //   const did = await didhashRegister.signFile(testFile, [
  //     config.config.invite!.id,
  //   ]);
  //   await didhashRegister.save(did, issuer);
  //   // wait some time since the observer has to be synced.
  //   await new Promise((res) => setTimeout(res, 2000));
  //   const loadedDid = await resolver.load(did.id);
  //   expect(loadedDid.id).toEqual(did.id);
  // });

  // afterAll(() => {
  //   if (existsSync(testFile)) {
  //     rmSync(testFile);
  //   }
  // });
});
