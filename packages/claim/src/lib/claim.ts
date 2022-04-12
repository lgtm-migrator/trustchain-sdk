import { toDataURL } from 'qrcode';
import { render } from 'mustache';
import { ClaimValues } from './claim-values';
import { Compress, JsonCompressor, Proto } from './compress';
import { CompressionType } from '@trustcerts/observer';
import { DidHash } from '@trustcerts/did-hash';
import { DidTemplate } from '@trustcerts/did-template';

/**
 * Class object to handle a claim
 */
export class Claim {
  /**
   * Url of the claim.
   */
  private url: any;

  /**
   * Information about the validation.
   */
  private hash?: DidHash;

  /**
   * Sets values based on compression algorithm.
   */
  constructor(
    public values: ClaimValues,
    private template: DidTemplate,
    host: string
  ) {
    let compressor: Compress;
    if (
      template.compression.type === CompressionType.PROTO &&
      template.compression.value
    ) {
      compressor = new Proto(JSON.parse(template.compression.value));
    } else {
      compressor = new JsonCompressor();
    }
    this.url = this.setUrl(
      host,
      template.id,
      compressor.compress<ClaimValues>(values)
    );
  }

  /**
   * Generates the qr code of a url.
   * @param url
   */
  private async getQRCode(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      toDataURL(
        url,
        {
          errorCorrectionLevel: 'L',
          color: {
            dark: '#000',
            light: '#0000',
          },
        },
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    });
  }

  /**
   * returns the template id of the claim.
   * @returns
   */
  public getTemplateId(): string {
    return this.template.id;
  }

  /**
   * Builds the url of the element.
   * @param templateDid
   * @param values
   */
  private setUrl(host: string, templateDid: string, values: string): string {
    return `${host}/${templateDid}#${encodeURIComponent(values)}`;
  }

  /**
   * Returns the url including the host, template reference and values.
   * @returns
   */
  public getUrl(): string {
    return this.url;
  }

  /**
   * Generates the html representation of a claim.
   */
  public async getHtml(): Promise<string> {
    const qrCode = await this.getQRCode(this.url);
    return render(this.template.template, {
      ...this.values,
      qrCode,
    });
  }

  /**
   * Sets the validation results of the claim
   * @param hash
   */
  public setValidation(hash: DidHash): void {
    this.hash = hash;
  }

  /**
   * Returns the validation information about the claim.
   * @returns
   */
  public getValidation(): DidHash | undefined {
    return this.hash;
  }
}
