import { createHmac, randomBytes } from 'node:crypto';
import { validateEnv } from '../../utils/validate-env';

/**
 * 
  const secret_key = process.env.SECRET_KEY;
  const base_url = process.env.BASE_URI;
 */

export const getRequestHeaders = (method: string, url: string, body: JSON = null) => {
  if (!validateEnv) return;
  const access_key = process.env.ACCESS_KEY;
  const secret_key = process.env.SECRET_KEY;

  const salt = randomBytes(8).toString('hex');
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = generateSignature(
    method,
    url,
    salt,
    timestamp,
    body || '',
    access_key,
    secret_key
  );
  
  return {
    'Accept': '*/*',
    'Content-Type': 'application/json',
    'access_key': access_key,
    'salt': salt,
    'timestamp': timestamp,
    'signature': signature,
  };
}

const generateSignature = (
  method: string,
  path: string,
  salt: string,
  timestamp: string,
  body: any,
  accessKey: string,
  secretKey: string,
): string => {
  let body_string = '';
  if (body) {
    body_string = JSON.stringify(body);
    body_string = body_string == '{}' ? '' : body_string.trim();
  }

  return hashSignature(
    method.toLowerCase() +
      path +
      salt +
      timestamp +
      accessKey +
      secretKey +
      body_string,
    secretKey
  );
};

const hashSignature = (signature: string, key: string): string => {
  const hash = createHmac('sha256', key);
  hash.update(signature);
  const hashSignature = Buffer.from(hash.digest('hex')).toString('base64');

  return hashSignature;
};
