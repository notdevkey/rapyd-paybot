import * as cryptojs from 'crypto-js';

const salt = cryptojs.lib.WordArray.random(12); // Randomly generated for each request.
const timestamp = (Math.floor(new Date().getTime() / 1000) - 10).toString(); // Current Unix time (seconds).

export const getRequestHeaders = (
  method: string,
  url: string,
  data: JSON,
  secretKey: string,
  accessKey: string
) => {
  const to_sign =
    method +
    url +
    salt +
    timestamp +
    accessKey +
    secretKey +
    JSON.stringify(data);
  let signature = cryptojs.enc.Hex.stringify(
    cryptojs.HmacSHA256(to_sign, secretKey)
  );
  console.log(signature, 'signature');

  signature = cryptojs.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(signature));

  return {
    accessKey,
    signature,
    salt,
    timestamp,
    'Content-Type': `application/json`,
  };
};
