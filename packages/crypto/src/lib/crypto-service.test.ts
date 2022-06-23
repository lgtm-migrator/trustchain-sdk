import { CryptoService } from '@trustcerts/crypto';
import { testKey, content, contentSignature } from './test-values';

let cryptoService: CryptoService;

describe('test crypto-service.ts', () => {
  it('test cryptoService.init', async () => {
    cryptoService = new CryptoService();
    await cryptoService.init(testKey);
    expect(cryptoService.keyPair.privateKey).toBeDefined();
    expect(cryptoService.keyPair.publicKey).toBeDefined();
    expect(cryptoService.fingerPrint).toEqual(testKey.identifier);
  }, 7000);

  describe('test', () => {
    beforeAll(async () => {
      cryptoService = new CryptoService();
      await cryptoService.init(testKey);
    }, 10000);
    it('test sign', async () => {
      const contentSigned = await cryptoService.sign(content);
      expect(contentSigned).toEqual(contentSignature);
    }, 7000);
    it('test getPublicKey', async () => {
      expect(await cryptoService.getPublicKey()).toEqual(testKey.publicKey);
    }, 7000);
  });
});
