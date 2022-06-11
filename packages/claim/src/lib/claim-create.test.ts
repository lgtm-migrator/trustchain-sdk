import { randomBytes } from 'crypto';
import { LocalConfigService } from '@trustcerts/config-local';
import { WalletService } from '@trustcerts/wallet';
import { readFileSync, writeFileSync } from 'fs';
import { CompressionType } from '@trustcerts/gateway';
import { promisify } from 'util';
import { ConfigService } from '@trustcerts/config';
import { CryptoService, SignatureType } from '@trustcerts/crypto';
import {
  DidNetworks,
  Identifier,
  VerificationRelationshipType,
} from '@trustcerts/did';
import { SignatureIssuerService } from '@trustcerts/did-hash';
import { SchemaIssuerService, DidSchemaRegister } from '@trustcerts/did-schema';
import {
  TemplateIssuerService,
  DidTemplateRegister,
} from '@trustcerts/did-template';
import { ClaimValues } from './claim-values';
import { ClaimIssuerService } from './claim-issuer-service';
import { ClaimVerifierService } from './claim-verifier-service';
import { Claim } from './claim';
import { base58Encode } from '@trustcerts/helpers';

/**
 * Test claim class.
 */
describe('claim', () => {
  it('should be edited', () => {
    expect(true).toBeTruthy();
  });
  let config: ConfigService;

  let cryptoService: CryptoService;

  const schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $ref: '#/definitions/wittekfz',
    definitions: {
      wittekfz: {
        type: 'object',
        additionalProperties: false,
        properties: {
          a: {
            type: 'string',
          },
          b: {
            type: 'string',
          },
          c: {
            type: 'string',
          },
          d: {
            type: 'string',
          },
          e: {
            type: 'string',
          },
          f: {
            type: 'string',
          },
          g: {
            type: 'string',
          },
          h: {
            type: 'string',
          },
          i: {
            type: 'string',
          },
          j: {
            type: 'string',
          },
          k: {
            type: 'string',
          },
          l: {
            type: 'string',
          },
          m: {
            type: 'string',
          },
          n: {
            type: 'string',
          },
          o: {
            type: 'string',
          },
          p: {
            type: 'string',
          },
          q: {
            type: 'string',
          },
          r: {
            type: 'string',
          },
          s: {
            type: 'string',
          },
          t: {
            type: 'string',
          },
          u: {
            type: 'string',
          },
          v: {
            type: 'string',
          },
        },
        required: [
          'a',
          'b',
          'c',
          'd',
          'e',
          'f',
          'g',
          'h',
          'i',
          'j',
          'k',
          'l',
          'm',
          'n',
          'o',
          'p',
          'q',
          'r',
          's',
          't',
          'u',
          'v',
        ],
        title: 'wittekfz',
      },
    },
  };

  const testValues = JSON.parse(readFileSync('./values.json', 'utf-8'));

  beforeAll(async () => {
    DidNetworks.add(testValues.network.namespace, testValues.network);
    Identifier.setNetwork(testValues.network.namespace);
    config = new LocalConfigService(testValues.filePath);
    await config.init(testValues.configValues);

    const wallet = new WalletService(config);
    await wallet.init();

    cryptoService = new CryptoService();
    // TODO put this in an extra function
    // get a key for assertion and a specific type
    const key = (
      await wallet.findOrCreate(
        VerificationRelationshipType.assertionMethod,
        SignatureType.Rsa
      )
    )[0];
    // init crypto service for assertion
    await cryptoService.init(key);
  }, 10000);

  async function createClaim(val: ClaimValues): Promise<Claim> {
    // TODO upload the file to an s3 or ipfs node so a huge file must not be encoded
    // const template = base58Encode(
    // readFileSync('./packages/claim/src/lib/test.pdf')
    // );
    const template = '<h1>hello</h1>';
    const host = 'https://verifier.witte.trustcerts.de';

    const clientSchema = new SchemaIssuerService(
      testValues.network.gateways,
      cryptoService
    );
    const schemaDid = DidSchemaRegister.create({
      controllers: [config.config.invite!.id],
    });
    schemaDid.setSchema(schema);
    await DidSchemaRegister.save(schemaDid, clientSchema);
    const client = new TemplateIssuerService(
      testValues.network.gateways,
      cryptoService
    );
    const templateDid = DidTemplateRegister.create({
      controllers: [config.config.invite!.id],
    });
    templateDid.schemaId = schemaDid.id;
    templateDid.template = template;
    templateDid.compression = {
      type: CompressionType.JSON,
    };
    await DidTemplateRegister.save(templateDid, client);
    await promisify(setTimeout)(1000);
    const claimIssuer = new ClaimIssuerService();
    const signatureIssuer = new SignatureIssuerService(
      testValues.network.gateways,
      cryptoService
    );
    return claimIssuer.create(templateDid, val, host, signatureIssuer, [
      config.config.invite!.id,
    ]);
  }

  it('create claim', async () => {
    // const val = {
    //   random: randomBytes(16).toString('hex'),
    //   prename: 'Max',
    //   surname: 'Mustermann',
    // };
    const val = {
      a: 'AG-1527-02',
      b: 'CG00124056',
      c: '01.01.2022',
      d: '30.05.2022',
      e: 'DIALLO MAMADOU YERO',
      f: 'O00562791',
      g: 'Dump Truck',
      h: 'Camions',
      i: 'CAMION',
      j: 'Rouge',
      k: 'Gazoil',
      l: 'LZZ5EXSD5NW962945',
      m: 'BENNE',
      n: 'Usage personnel',
      o: '2',
      p: '3',
      q: '24',
      r: '6',
      s: '40000',
      t: '3',
      u: '12000',
      v: '30.05.2027',
    };
    const claim = await createClaim(val);
    writeFileSync(
      'created.pdf',
      await claim.getPdf(readFileSync('./packages/claim/src/lib/test.pdf'))
    );
    expect(claim.values).toEqual(val);
    await promisify(setTimeout)(2000);
    const service = new ClaimVerifierService(
      'https://verifier.witte.trustcerts.de'
    );
    const claimLoaded = await service.get(
      claim.getUrl().replace('https://', '').split('/').slice(1).join('/')
    );
    const validation = claimLoaded.getValidation();
    expect(validation!.revoked).toBeUndefined();
  }, 15000);

  it('revoke a claim', async () => {
    const value = {
      random: randomBytes(16).toString('hex'),
      prename: 'Max',
      surname: 'Mustermann',
    };
    const claim = await createClaim(value);
    await promisify(setTimeout)(2000);
    const claimIssuer = new ClaimIssuerService();
    const signatureIssuer = new SignatureIssuerService(
      testValues.network.gateways,
      cryptoService
    );
    await claimIssuer.revoke(claim, signatureIssuer);
    await promisify(setTimeout)(2000);
    const service = new ClaimVerifierService('localhost');
    const claimLoaded = await service.get(
      claim.getUrl().split('/').slice(1).join('/')
    );
    const validation = claimLoaded.getValidation();
    expect(validation!.revoked).toBeDefined();
  }, 15000);
});
