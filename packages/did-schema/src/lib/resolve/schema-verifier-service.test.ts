// import { ConfigService } from '@trustcerts/config';
// import { LocalConfigService } from '@trustcerts/config-local';
// import { CryptoService, SignatureType } from '@trustcerts/crypto';
// import {
//   DidNetworks,
//   Identifier,
//   VerificationRelationshipType,
// } from '@trustcerts/did';
// import { WalletService } from '@trustcerts/wallet';
// import { readFileSync } from 'fs';
// import { DidSchemaRegister } from '../register/did-schema-register';
// import { SchemaIssuerService } from '../register/schema-issuer-service';
// import { DidSchemaResolver } from './did-schema-resolver';


describe('test schema verifier service', () => {
  it("should be edited" , ()=> {
    expect(true).toBeTruthy()
})

  // let config: ConfigService;

  // let cryptoService: CryptoService;

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

  // it('verify schema', async () => {
  //   const client = new SchemaIssuerService(
  //     testValues.network.gateways,
  //     cryptoService
  //   );
  //   const did = DidSchemaRegister.create({
  //     controllers: [config.config.invite!.id],
  //   });
  //   did.setSchema({ foo: 'bar' });
  //   const res = await DidSchemaRegister.save(did, client);
  //   expect(res).toBeDefined();

  //   const resolver = new DidSchemaResolver();
  //   const resolvedId = await resolver.load(did.id);
  //   expect(resolvedId.getSchema()).toEqual(did.getSchema());
  // }, 7000);
});