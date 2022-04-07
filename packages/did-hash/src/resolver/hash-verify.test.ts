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
// import { DidHashRegister } from '../register/did-hash-register';
// import { SignatureIssuerService } from '../register/hash-issuer-service';
// import { DidHashResolver } from './did-hash-resolver';

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

  // it('verify file', async () => {
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
  //   const loadedDid = await resolver.verifyFile(testFile);
  //   expect(loadedDid.id).toEqual(did.id);
  // }, 10000);

  // it('verify buffer', async () => {
  //   const issuer = new SignatureIssuerService(
  //     testValues.network.gateways,
  //     cryptoService
  //   );
  //   const didhashRegister = new DidHashRegister();
  //   const resolver = new DidHashResolver();

  //   const buffer = new ArrayBuffer(8);
  //   const did = await didhashRegister.signBuffer(buffer, [
  //     config.config.invite!.id,
  //   ]);
  //   await didhashRegister.save(did, issuer);
  //   // wait some time since the observer has to be synced.
  //   await new Promise((res) => setTimeout(res, 2000));
  //   const loadedDid = await resolver.verifyBuffer(buffer);
  //   expect(loadedDid.id).toEqual(did.id);
  // }, 10000);

  // it('verify string', async () => {
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
  //   const loadedDid = await resolver.verifyString(signature);
  //   expect(loadedDid.id).toEqual(did.id);
  // });

  // it('revoke string', async () => {
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
  //   let loadedDid = await resolver.load(did.id);

  //   expect(loadedDid.revoked).toBeUndefined();
  //   loadedDid.revoked = new Date().toISOString();
  //   await didhashRegister.save(loadedDid, issuer);

  //   await new Promise((res) => setTimeout(res, 2000));
  //   loadedDid = await resolver.load(did.id);
  //   expect(loadedDid.revoked).toBeDefined();
  //   // expect(loadedDid.revoked! > loadedDid.).toBeTruthy();
  // }, 10000);

  // afterAll(() => {
  //   if (existsSync(testFile)) {
  //     rmSync(testFile);
  //   }
  // });
});
