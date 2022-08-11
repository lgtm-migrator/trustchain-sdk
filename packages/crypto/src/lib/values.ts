import { isBrowser } from '@trustcerts/helpers';
import { webcrypto } from 'crypto';

// declare module 'crypto' {
//   // eslint-disable-next-line @typescript-eslint/no-namespace
//   namespace webcrypto {
//     const subtle: SubtleCrypto;
//     function getRandomValues(array: Uint8Array): Uint8Array;
//   }
// }

/**
 * Define the required objects based on the environment (if browser or nodejs)
 */
let subtle: SubtleCrypto;
let getRandomValues: (array?: Uint8Array) => Uint8Array;

if (!isBrowser()) {
  subtle = webcrypto.subtle;
  getRandomValues = (array: Uint8Array = new Uint8Array(32)): Uint8Array =>
    webcrypto.getRandomValues(array);
} else {
  subtle = window.crypto.subtle;
  getRandomValues = (array: Uint8Array = new Uint8Array(32)): Uint8Array => {
    return window.crypto.getRandomValues(array);
  };
}

/**
 * Defaults hash algorithm that is used for signatures and hashing.
 */
const hashAlgorithm = 'SHA-256';

export { hashAlgorithm, getRandomValues, subtle };
