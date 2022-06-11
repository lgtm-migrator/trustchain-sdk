import { ConfigService } from '@trustcerts/config';
import { LocalConfigService } from '@trustcerts/config-local';
import { CryptoService, SignatureType } from '@trustcerts/crypto';
import {
  DidNetworks,
  Identifier,
  VerificationRelationshipType,
} from '@trustcerts/did';
import { DidSchemaRegister, SchemaIssuerService } from '@trustcerts/did-schema';
import {
  DidTemplateRegister,
  DidTemplateResolver,
  TemplateIssuerService,
} from '@trustcerts/did-template';
import { CompressionType } from '@trustcerts/gateway';
import { WalletService } from '@trustcerts/wallet';
import { JSONSchemaType } from 'ajv';
import { readFileSync } from 'fs';

class Name {
  name!: string;
}

describe('test template service', () => {
  let config: ConfigService;
  let cryptoService: CryptoService;

  const schema: JSONSchemaType<Name> = {
    type: 'object',
    properties: {
      name: { type: 'string' },
    },
    required: ['name'],
    additionalProperties: false,
  };

  const template = '<h1>Hello {{ name }}</h1>';

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
        SignatureType.Rsa
      )
    )[0];
    await cryptoService.init(key);
  }, 10000);

  it('verify', async () => {
    if (!config.config.invite) throw new Error();
    const clientSchema = new SchemaIssuerService(
      testValues.network.gateways,
      cryptoService
    );
    const schemaDid = DidSchemaRegister.create({
      controllers: [config.config.invite.id],
    });
    schemaDid.setSchema(schema);
    await DidSchemaRegister.save(schemaDid, clientSchema);
    const client = new TemplateIssuerService(
      testValues.network.gateways,
      cryptoService
    );
    const templateDid = DidTemplateRegister.create({
      controllers: [config.config.invite.id],
    });
    templateDid.schemaId = schemaDid.id;
    templateDid.template = template;
    templateDid.compression = {
      type: CompressionType.JSON,
    };
    await DidTemplateRegister.save(templateDid, client);
    const loadedTemplate = await new DidTemplateResolver().load(templateDid.id);

    expect(loadedTemplate.template).toEqual(template);
  });
});
