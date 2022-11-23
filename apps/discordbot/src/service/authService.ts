import * as crypto from "crypto-js";

const salt = crypto.lib.WordArray.random(12);
const idempotency = new Date().getTime().toString();
//const timestamp = (Math.floor(new Date().getTime() / 1000) - 10).toString();
const timestamp = Math.round(new Date().getTime() / 1000).toString();
const accessKey: string = process.env.ACCESS_KEY!;
const secretKey: string = process.env.SECRET_KEY!;

const getSignature = (method: string, uri: string, data: any): string => {
  let requestData = JSON.stringify(data).trim();
  requestData = requestData == '{}' ? '' : requestData;

  const toSign = method.toLowerCase() + uri + salt + timestamp + accessKey + secretKey + requestData;

  /**
    let hash = crypto.createHmac('sha256', secretKey);
    hash.update(toSign);
    const signature = Buffer.from(hash.digest("hex")).toString("base64")
  */

  let signature: string = crypto.enc.Hex.stringify(
    crypto.HmacSHA256(toSign, secretKey)
  );
  signature = crypto.enc.Base64.stringify(
    crypto.enc.Utf8.parse(signature)
  );
  return signature;
}

export const getRequestHeaders = (method: string, uri: string, data: any) => {
  return { 
    'Content-Type': 'application/json',
    'access_key': accessKey,
    'salt': salt.toString(),
    'timestamp': timestamp,
    'signature': getSignature(method, uri, data),
  };
}