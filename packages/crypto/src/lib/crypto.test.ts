import {
  CryptoService,
  SignatureType,
  verifySignature,
  importKey,
  getHash,
  getHashFromFile,
  getHashFromArrayBuffer,
  generateCryptoKeyPair,
  generateKeyPair,
  getFingerPrint,
  sortKeys,
  getBitsFromPassphrase,
} from '@trustcerts/crypto';
import { exists, read, write, remove } from '@trustcerts/helpers';
import { exportKey } from './key';
import { signInput } from './sign';

describe('test crypto', () => {
  let cryptoService: CryptoService;

  const testKey = {
    identifier: 'testKey',
    signatureType: SignatureType.Rsa,
    privateKey: {
      key_ops: ['sign'],
      ext: true,
      kty: 'RSA',
      n: '3oyB2RQWMtIgWnBMY16bSLgdLYx6IR8GOURqrhIjqAU4w4W_SubyNSGUxkZKVx-8lurmc6E9Z_hXL2gYH9bd2mCLWVY2CP0RvF3wAyIVfApV1AYaN2aSHsGRK-fMV5cIdjVOl2DZu-OwCIQZgpdOJ_j_bKXAaFqaf8Nu0U48PtgGI1uo8YBm9whtEMF1OfVHknaOezHYnKXVJPbLW710lLfnDbgP8jWXlO85R25XVmgYDEvYksIKrrKXyXhOLBviXwRAtkI7gj2qE0t75JiR1DKkMF88XmcWJguLAqeLWZBnHEGKpHOThAUNyPhccsKe36Y9jWpZmloEHZMtwqkc_Q',
      e: 'AQAB',
      d: 'RahTCEA6RoPwrn4R2tSE5DkEoPokS_Oq_gfFIGD7Gh8wSjq1ylsJGso9B-Z-ZFDBtbcmlLC2SLG5kFQToPufCzhGxZqvZRbZE02Pz1s-wEl33dpfIFIRkGDj8IsoMY5LjrxWshkVbbLxqWi3l2GGjApq4HXtCHy7eRwRtp-3Sa-8k1ghSVFCKzowomQkmQlPff3CVyzX828pDKPnzCDbXRzYLwJSnh58DUAw-OOZtpNe6N6otUgidYLlI42HuysZ0KBbkW5wSRhtjnnO5e8YHbSQ9zF0kNxBmQnJu1BqLo5JbThim4SxTXDlb6GATqP7rjCcDuQ1LRAKQ3x_WVk9wQ',
      p: '9rj82QHlgtj3hBdHABbSsuOLIKnjnMhshteFNdZziVRcLLe8q4YaJSpJ1xqQKLgmydLjdrBL6QDUXFCrhMUJyKlaToMGKaouDg4bbBPZhkIiCRodXfor0yj3m0VlhnhnPcZc6yJX1EvAncPS0GG9zdh1QOb7EsdWkolgdhF5Re0',
      q: '5urRK4uVmyQ202CHD_kXaswIN0gDFAb0BiJAWG5hRnE9TFcGJGHo7RwVA2oZfdNrG22Xb9NM44Vw-ajp_6TcWYkCNsRs9PvbXEliw03uoWG1kbFNXZ69S-IRC0TGcxCafdfPolFCIyg3ORCHc-DxUaTIpuUBalOA8yncJYeSUVE',
      dp: 's6rAzpL3_NJdZP7CgIkeRJE5Zr7w9uJpTcSyyCL0HgSl3xaqOUo9zeS-wvsgEdcQwBZn-K2nifVFsDg6v0PxvQO-tL_rg_ne8fNJ-ul1lbShLnmq-x3MPkhuD894gHU70ZubXMu0o-_KQ9kvsvoKi1VfBbVvDxzEqY-LBE_zPX0',
      dq: 'e_rpcVrRaWmpMhZqjc3sn7-KTbwRQwh0rnJnX9Nr0PltsvYqaxBSkjP4qEuoAiGoKSLPIxAtAR-dR75EXKi0UjI4iRUvdt1eqo8QQtIt5GHkraOnaTOYaQyooAc-EXuBpz1e0sSUIPIvrCjOwQ2uI2q4_LqJ5v-MhYIdG91NVvE',
      qi: '3ObyvIPT9F5U0zSJHItHCw1SoqH6ZCtLjiQEPCsmEce6-WVqzhqcQkxHinZNVHhF0Mv1PuKmKXYchUmG5QJzh7W0Yu1vxZfzrPkUj5WtQRVpHtiFf1cORpDGTDcC4bvA2KQUWrB9-DpqE_VqyUPkfiFpnNflkA_v0SwiSZpl2OY',
      alg: 'RS256',
    },
    publicKey: {
      key_ops: ['verify'],
      ext: true,
      kty: 'RSA',
      n: '3oyB2RQWMtIgWnBMY16bSLgdLYx6IR8GOURqrhIjqAU4w4W_SubyNSGUxkZKVx-8lurmc6E9Z_hXL2gYH9bd2mCLWVY2CP0RvF3wAyIVfApV1AYaN2aSHsGRK-fMV5cIdjVOl2DZu-OwCIQZgpdOJ_j_bKXAaFqaf8Nu0U48PtgGI1uo8YBm9whtEMF1OfVHknaOezHYnKXVJPbLW710lLfnDbgP8jWXlO85R25XVmgYDEvYksIKrrKXyXhOLBviXwRAtkI7gj2qE0t75JiR1DKkMF88XmcWJguLAqeLWZBnHEGKpHOThAUNyPhccsKe36Y9jWpZmloEHZMtwqkc_Q',
      e: 'AQAB',
      alg: 'RS256',
    },
  };
  const testKeyFingerprint = '8aDvMauyyNgUz8TySdYc7xMUQromMHsRjZRRVSbt64AX';

  const content = 'Content to be signed';
  const differentContent = 'Different content';
  const contentSignature =
    '5WxXWt5En68FuQ24fPd14kzJmft4pjVDwMijZYpUeJTQh56mWjoWfyuFghhkQUL3u1qUZRxT62H93ipy4Fx5NUSx5fdUfdcRExdFNsngL9zG9xHo52EeBDQf87iiPUa4zvBLraRNt4jcRnuEphbZQhm58gNbgFckUivW8wyX2wvza5M9v16XVSvH5kMT1ULBxu6qhFdzaGRyVCnPeqYGgTdFFHryKX8wsgzoz8Q5K9VXV6kHRHepu7h5ZUZhZJHK6T5LSTBvKuWZzAZaaFXmq7BT3kq4SqGNyPN633CgGEec6YKaqYCFvHuFeV7SKvHrVYgyQJKCsZx22uipnP4E3n5bN2j6wT';
  const differentContentSignature =
    'B7Nmy9KSw4dPWgUAdXumuRRUkYzzwzPFYh4L59EuTueZFLayg4ZG9g2tSRaJUEPQ6QP5h9WgdhKRVBSumnrXii5QvX3tGmUXLw4dEPDT4m1399HNdphzUHY2LQm3FVnCpA34schmsiSkSbTiy1objQjpWjdVLiiPyLkqtWG23RM7ENbwV6vUjSN3JBejgi8VKTdsVpZuB73LZ1UtMWcZQSgECDNoQSULtugfjGamiUP6prpe5RdTLcaCavgcbzwTtSJ4iABENpcvE8B3QrWJQQyg4KJniQsHVVNfjHPQiCiiXwnXoyAu3YRAhexcnNCBcqL4zhjpE9ubfEaHPKQhimJxpTUhtR';

  const hashContent = 'Content to be hashed';
  const hashContentHash = '9ZmsGxYnoHgZsaHhGeusbhkR6YjMeYRk2HN2NZUM28DX';

  it('test cryptoService.init', async () => {
    cryptoService = new CryptoService();
    await cryptoService.init(testKey);

    expect(cryptoService.keyPair.privateKey).toBeDefined();
    expect(cryptoService.keyPair.publicKey).toBeDefined();
    expect(cryptoService.fingerPrint).toEqual(testKey.identifier);
  }, 7000);

  describe('test crypto package', () => {
    beforeAll(async () => {
      // const testKey = await generateKeyPair('testKey', SignatureType.Rsa);
      // console.log(JSON.stringify(testKey, null, 4));

      cryptoService = new CryptoService();
      await cryptoService.init(testKey);
    }, 10000);

    describe('test crypto-service.ts', () => {
      it('test sign', async () => {
        const contentSigned = await cryptoService.sign(content);
        expect(contentSigned).toEqual(contentSignature);

        const differentContentSigned = await cryptoService.sign(
          differentContent
        );
        expect(differentContentSigned).toEqual(differentContentSignature);
      }, 7000);

      it('test getPublicKey', async () => {
        expect(await cryptoService.getPublicKey()).toEqual(testKey.publicKey);
      }, 7000);
    });

    describe('test hash.ts', () => {
      it('test get hash', async () => {
        const hashed = await getHash(hashContent);

        expect(hashed).toEqual(hashContentHash);
      }, 7000);

      it('test get hash from file', async () => {
        const temporaryFilePath = './tmp/cryptoTestFile';
        write(temporaryFilePath, hashContent);
        const hashed = await getHashFromFile(temporaryFilePath);

        expect(hashed).toEqual(hashContentHash);

        if (exists(temporaryFilePath)) {
          remove(temporaryFilePath);
        }
      }, 7000);

      it('test get hash from array buffer', async () => {
        const enc = new TextEncoder();
        const buffer = enc.encode(hashContent).buffer;

        const hashed = await getHashFromArrayBuffer(buffer);

        expect(hashed).toEqual(hashContentHash);
      }, 7000);

      it('test sortKeys', async () => {
        // TODO: insert more edge cases / more complicated example?
        const unsortedJSON = '{"Z":"last","A":"first"}';
        const sortedJSON = '{"A":"first","Z":"last"}';

        const testObj = JSON.parse(unsortedJSON);
        expect(JSON.stringify(testObj)).not.toEqual(sortedJSON);
        expect(JSON.stringify(testObj)).toEqual(unsortedJSON);

        const sortedObj = sortKeys(testObj);
        expect(JSON.stringify(sortedObj)).not.toEqual(unsortedJSON);
        expect(JSON.stringify(sortedObj)).toEqual(sortedJSON);
      }, 7000);
    });
    describe('test key.ts', () => {
      it('test importKey', async () => {
        const key = await importKey(testKey.publicKey, 'jwk', ['verify']);
        expect(key).toBeDefined();
      }, 7000);

      it('test generateCryptoKeyPair', async () => {
        const cryptoKeyPair = await generateCryptoKeyPair();
        expect(cryptoKeyPair.privateKey).toBeDefined();
        expect(cryptoKeyPair.publicKey).toBeDefined();
      }, 7000);

      it('test generateKeyPair', async () => {
        for (const signatureType of Object.values(SignatureType)) {
          const testKey = await generateKeyPair('testKey', signatureType);
          expect(testKey.privateKey).toBeDefined();
          expect(testKey.publicKey).toBeDefined();
        }
      }, 7000);

      it('test getBitsFromPassphrase', async () => {
        const passphrase = 'passphrase';
        const salt = 'salt';
        const passphraseBits = new Uint8Array([
          199, 108, 22, 203, 167, 110, 102, 26, 50, 180, 118, 116, 52, 92, 32,
          167, 11, 78, 255, 1, 163, 167, 19, 214, 16, 167, 88, 249, 242, 227,
          59, 97,
        ]);
        const bits = await getBitsFromPassphrase(passphrase, salt);

        expect(new Uint8Array(bits)).toEqual(passphraseBits);
      }, 7000);

      it('test getFingerPrint', async () => {
        const fingerPrint = await getFingerPrint(
          await cryptoService.getPublicKey()
        );
        console.log(fingerPrint);
        expect(fingerPrint).toEqual(testKeyFingerprint);
      }, 7000);

      it('test exportKey', async () => {
        const exportedKey = await exportKey(cryptoService.keyPair.publicKey);
        expect(exportedKey).toEqual(testKey.publicKey);
      }, 7000);
    });

    describe('test sign.ts', () => {
      it('test verifySignature', async () => {
        const key = await importKey(await cryptoService.getPublicKey(), 'jwk', [
          'verify',
        ]);

        // Expect content to succeed verification
        const verificationResult = await verifySignature(
          content,
          contentSignature,
          key
        );
        expect(verificationResult).toBe(true);

        // Expect different content to fail verification
        const failedContentVerificationResult = await verifySignature(
          differentContent,
          contentSignature,
          key
        );
        expect(failedContentVerificationResult).toBe(false);

        // Expect different signature to fail verification
        const failedSignatureVerificationResult = await verifySignature(
          content,
          differentContentSignature,
          key
        );
        expect(failedSignatureVerificationResult).toBe(false);

        // Expect different content & different signature to succeed verification
        const differentVerificationResult = await verifySignature(
          differentContent,
          differentContentSignature,
          key
        );
        expect(differentVerificationResult).toBe(true);
      }, 7000);

      it('test signInput', async () => {
        const contentSigned = await signInput(
          content,
          cryptoService.keyPair.privateKey
        );
        expect(contentSigned).toEqual(contentSignature);
      }, 7000);
    });
  });
});
