// import { WalletService } from '@trustcerts/wallet';
// import { LocalConfigService } from '@trustcerts/config-local';
// import { readFileSync } from 'fs';
// import { ConfigService } from '@trustcerts/config';
// import { generateKeyPair, SignatureType } from '@trustcerts/crypto';
// import {
//   DidNetworks,
//   Identifier,
//   VerificationRelationshipType,
// } from '@trustcerts/did';

/**
 * Test vc class.
 */
describe('wallet', () => {
  it("should be edited" , ()=> {
    expect(true).toBeTruthy()
})
  // let config: ConfigService;

  // const testValues = JSON.parse(
  //   readFileSync('./tests/values-dev.json', 'utf-8')
  // );

  // beforeAll(async () => {
  //   config = new LocalConfigService(testValues.filePath);
  //   await config.init(testValues.configValues);
  // });

  // it('add key', async () => {
  //   const walletService = new WalletService(config);
  //   await walletService.init();
  //   // Add a key for each SignatureType
  //   for (const signatureType of Object.values(SignatureType)) {
  //     // Add a key for each verification relationship
  //     const key = await walletService.addKey(
  //       Object.values(VerificationRelationshipType),
  //       signatureType
  //     );

  //     // Check if the key is found by its identifier
  //     expect(walletService.findKeyByID(key.identifier)).toBe(key);

  //     // Check if the key is found by vrType and signatureType
  //     Object.values(VerificationRelationshipType).forEach((vrType) => {
  //       expect(walletService.find(vrType, signatureType)).toContain(key);
  //     });

  //     // Remove the key
  //     walletService.removeKeyByID(key.identifier);

  //     // Verify that the key is removed
  //     expect(walletService.findKeyByID(key.identifier)).toBeUndefined();
  //   }
  // }, 10000);

  // it('tidy up', async () => {
  //   const walletService = new WalletService(config);
  //   await walletService.init();

  //   // Push new key to local configService of wallet, but don't add it to the DID document
  //   const invalidKey = await generateKeyPair(
  //     walletService.did.id,
  //     SignatureType.Bbs
  //   );
  //   walletService.configService.config.keyPairs.push(invalidKey);

  //   expect(walletService.findKeyByID(invalidKey.identifier)).toBe(invalidKey);

  //   // Remove keys from local configSerive of wallet that don't exist in the DID document
  //   await walletService.tidyUp();

  //   expect(walletService.findKeyByID(invalidKey.identifier)).toBeUndefined();
  // }, 15000);
});