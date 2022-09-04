import { CryptoService, sortKeys } from '@trustcerts/crypto';
import { IssuerService, SignatureContent } from '@trustcerts/did';
import {
  HashGatewayApi,
  TransactionType,
  HashResponse,
  HashDidTransactionDto,
  DidHashStructure,
  AxiosError,
  SignatureType,
} from '@trustcerts/gateway';

export class SignatureIssuerService extends IssuerService {
  protected override api: HashGatewayApi;

  public timeout = 10000;

  constructor(gateways: string[], cryptoService: CryptoService) {
    super(gateways, cryptoService);
    this.api = new HashGatewayApi(this.apiConfiguration);
  }

  async persist(
    value: DidHashStructure,
    date = new Date().toISOString()
  ): Promise<HashResponse> {
    // TODO outsource this to the issuer service since the transaction schema of dids are equal
    const transaction: HashDidTransactionDto = {
      version: 1,
      body: {
        date,
        value,
        type: TransactionType.Hash,
        version: 1,
      },
      metadata: {
        version: 1,
      },
      signature: {
        type: SignatureType.Single,
        values: [],
      },
    };
    const content: SignatureContent = {
      date: transaction.body.date,
      type: transaction.body.type,
      value: transaction.body.value,
    };
    transaction.signature.values.push({
      signature: await this.cryptoService.sign(
        JSON.stringify(sortKeys(content))
      ),
      identifier: this.cryptoService.fingerPrint,
    });

    return this.api.gatewayHashControllerCreate(transaction).then(
      (res) => this.delay().then(() => res.data),
      (err: AxiosError) => {
        if (err.response) {
          return Promise.reject(err.response.data);
        } else {
          return Promise.reject(err);
        }
      }
    );
  }
}
