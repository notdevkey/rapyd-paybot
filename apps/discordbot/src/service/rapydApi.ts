import axios, { AxiosError, AxiosResponse } from 'axios';
import { createHmac, randomBytes } from "node:crypto";
// "rootDir": "./src/",

import { RapydTransactionCreate } from './models/paymentCreate';
import { Transaction } from './models/payment';
import { CustomerCreate } from './models/customerCreate';
import { EWallet } from './models/wallet';

const access_key = process.env.ACCESS_KEY;
const secret_key = process.env.SECRET_KEY;
const base_url = `https://sandboxapi.rapyd.net/v1`;

const generateHeaders = (path: string, method: string, body: JSON) => {
  const request_method = method || 'GET';
  const salt = randomBytes(8).toString('hex');
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = generateSignature(
    request_method,
    path,
    salt,
    timestamp,
    body
  );
  const idempotency = new Date().getTime().toString();

  const headers = {
    'Content-Type': 'application/json',
    'access_key': access_key,
    'salt': salt,
    'timestamp': timestamp,
    'signature': signature,
    'idempotency': idempotency,
  };
  return headers;
};

const generateSignature = (
  method: string,
  path: string,
  salt: string,
  timestamp: string,
  body: JSON
): string => {
  let body_string = '';
  if (body) {
    body_string = JSON.stringify(body);
    body_string = body_string == '{}' ? '' : body_string;
  }

  return hashSignature(
    method.toLowerCase() +
      path +
      salt +
      timestamp +
      access_key +
      secret_key +
      body_string,
    secret_key!
  );
}

const hashSignature = (signature: string, key: string): string => {
  const hash = createHmac('sha256', key);
  hash.update(signature);
  const hashSignature = Buffer.from(hash.digest('hex')).toString('base64');
  return hashSignature;
}

// TODO: cringe

axios.interceptors.request.use(
  (config) => {
    const headers = generateHeaders(
      config.method as string,
      config.url as string,
      config.data,
    );

    console.log(config.method);
    console.log(config.url);

    config.baseURL = base_url;
    config.headers!['Content-Type'] = headers['Content-Type'];
    config.headers!['access_key'] = headers.access_key;
    config.headers!['salt'] = headers.salt.toString();
    config.headers!['timestamp'] = headers.timestamp;
    config.headers!['signature'] = headers.signature;
    return config;
  },
  (err) => Promise.reject(err)
);

// axios.interceptors.response.use(
//   (res) => res,
//   (error: AxiosError) => {
//     const { data, status, config } = error.response!;
//     switch (status) {
//       case 400:
//         console.error(data);
//         break;
//       case 401:
//         console.error('unauthorised');
//         break;
//       case 404:
//         console.error('/not-found');
//         break;
//       case 500:
//         console.error('/server-error');
//         break;
//     }
//     return Promise.reject(error);
//   }
// );

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const request = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) =>
    axios.post<T>(url, body).then(responseBody),
};

// TODO: additional wallet endpoints
const wallets = {
  create: (data: CustomerCreate) => request.post<EWallet>('/user', data),
  details: (walletId: string) => request.get<EWallet>(`/user/${walletId}`),
};

// TODO: additional payment endpoints
const payments = {
  create: (data: RapydTransactionCreate) =>
    request.post<Transaction>('/account/transfer', data),
  details: (walletId: string, transactionId: string) =>
    request.get<Transaction>(`/user/${walletId}/transactions/${transactionId}`),
};

const rapydApi = {
  wallets,
  payments,
};

export default rapydApi;
