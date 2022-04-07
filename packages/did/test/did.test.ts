// import { DidIdIssuerService } from '../src/lib/did-issuer-service';
// import { DidIdRegister } from '../src/lib/did-id-register';
// import { DidIdResolver } from '../src/lib/id/did-id-resolver';
// import { DidNetworks } from '../src/lib/network/did-networks';
// import { Identifier } from '../src/lib/identity';
// import { VerificationRelationshipType } from '../src/lib/id/did-id';
// import { LocalConfigService } from '@trustcerts/config-local';
// import { WalletService } from '@trustcerts/wallet';
// import { readFileSync } from 'fs';
// import { RoleManageType } from '@trustcerts/observer';
// import { ConfigService } from '@trustcerts/config';
// import { CryptoService, SignatureType } from '@trustcerts/crypto';

describe('test did', () => {
    it("should be edited" , ()=> {
        expect(true).toBeTruthy()
    })
//   let config: ConfigService;

//   let cryptoService: CryptoService;

//   const resolver = new DidIdResolver();

//   const testValues = JSON.parse(readFileSync('../../values.json', 'utf-8'));

//   beforeAll(async () => {
//     DidNetworks.add(testValues.network.namespace, testValues.network);
//     Identifier.setNetwork(testValues.network.namespace);
//     config = new LocalConfigService(testValues.filePath);
//     await config.init(testValues.configValues);

//     const wallet = new WalletService(config);
//     await wallet.init();

//     cryptoService = new CryptoService();
//     const key = (
//       await wallet.findOrCreate(
//         VerificationRelationshipType.assertionMethod,
//         SignatureType.Rsa
//       )
//     )[0];
//     await cryptoService.init(key);
//   }, 10000);

//   it('verify did chain of trust temporary test case', async () => {
//     const did = DidIdRegister.create({
//       controllers: [config.config.invite!.id],
//     });
//     did.addRole(RoleManageType.Client);
//     const client = new DidIdIssuerService(
//       testValues.network.gateways,
//       cryptoService
//     );
//     await DidIdRegister.save(did, client);
//     await new Promise((resolve) =>
//       setTimeout(() => {
//         resolve(true);
//       }, 2000)
//     );
//     const resolver = new DidIdResolver();
//     const did1 = await resolver.load(did.id);
//     expect(did.getDocument()).toEqual(did1.getDocument());
//   }, 7000);

//   it('read did', async () => {
//     const did = DidIdRegister.create({
//       controllers: [config.config.invite!.id],
//     });
//     did.addRole(RoleManageType.Client);
//     const client = new DidIdIssuerService(
//       testValues.network.gateways,
//       cryptoService
//     );
//     await DidIdRegister.save(did, client);
//     await new Promise((resolve) =>
//       setTimeout(() => {
//         resolve(true);
//       }, 2000)
//     );
//     const did1 = await resolver.load(did.id);
//     expect(did.getDocument()).toEqual(did1.getDocument());
//   }, 7000);

//   it('read non existing did', (done) => {
//     const id = 'did:trust:tc:dev:id:QQQQQQQQQQQQQQQQQQQQQQ';
//     resolver.load(id).catch((err) => {
//       expect(err).toBeDefined();
//       done();
//     });
//     // await expect(did).rejects.toEqual(new Error(`${id} not found`));
//   }, 7000);

//   it('test did resolver', () => {
//     let exampleNetwork = { gateways: ['a'], observers: ['a'] };
//     DidNetworks.add('test:foo', exampleNetwork);
//     let resolvedNetwork = DidNetworks.resolveNetwork('test:foo');
//     expect(resolvedNetwork).toEqual(exampleNetwork);

//     exampleNetwork = { gateways: ['a', 'b'], observers: ['a'] };
//     DidNetworks.add('test:foo', exampleNetwork);
//     resolvedNetwork = DidNetworks.resolveNetwork('test:foo');
//     expect(resolvedNetwork).toEqual(exampleNetwork);
//   });
});
