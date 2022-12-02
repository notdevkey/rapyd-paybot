import { createHmac, randomBytes } from "node:crypto";

//import fetch from "node-fetch";
//import { RequestInfo, RequestInit } from "node-fetch";
//const fetch = (url: RequestInfo, init?: RequestInit) =>  import("node-fetch").then(({ default: fetch }) => fetch(url, init));


import { Transaction } from "./models/payment";
import { RapydTransactionCreate } from "./models/paymentCreate";
import { EWallet } from "./models/wallet";

async function fetchJson<JSON = unknown>(
  input: RequestInfo,
  init?: RequestInit & {
    json?: any;
  }
): Promise<JSON> {
  if (init?.json) {
    init.body = JSON.stringify(init.json);
    init.headers = { ...init.headers, "Content-Type": "application/json" };
  }

  const response = await fetch(input, init);
  const data = await response.json();

  if (response.ok) return data;

  console.error(data);
  throw new FetchError({
    message: response.statusText,
    response,
    data,
  });
}

class FetchError extends Error {
  response: Response;
  data: {
    message: string;
  };
  constructor({
    message,
    response,
    data,
  }: {
    message: string;
    response: Response;
    data: {
      message: string;
    };
  }) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchError);
    }

    this.name = "FetchError";
    this.response = response;
    this.data = data ?? { message: message };
  }
}

class Rapyd {
  constructor(
    private _access_key: string,
    private _secret_key: string,
    private _sandbox = false
  ) {}

  private request<T>(
    path: string,
    init?: RequestInit & {
      json?: any;
    }
  ) {
    if (!init) init = {};
    const base_url = `https://${this._sandbox ? 'sandbox' : ''}api.rapyd.net`;
    const method = init.method || 'GET';
    const salt = randomBytes(8).toString('hex');
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = this.generateSignature(
      method,
      path,
      salt,
      timestamp,
      init.json || init.body || ''
    );
    init.headers = {
      ...(init.headers || {}),
      access_key: this._access_key,
      salt,
      timestamp,
      signature,
    };
    return fetchJson<T>(base_url + path, init);
  }

  private generateSignature(
    method: string,
    path: string,
    salt: string,
    timestamp: string,
    body: any
  ): string {
    let body_string = '';
    if (body) {
      body_string = JSON.stringify(body);
      body_string = body_string == '{}' ? '' : body_string;
    }

    return this.hashSignature(
      method.toLowerCase() +
        path +
        salt +
        timestamp +
        this._access_key +
        this._secret_key +
        body_string,
      this._secret_key
    );
  }

  private hashSignature(signature: string, key: string): string {
    const hash = createHmac('sha256', key);
    hash.update(signature);
    const hashSignature = Buffer.from(hash.digest('hex')).toString('base64');

    return hashSignature;
  }

  // Rapyd API endpoints
  getTransactionDetails(transactionId: string, walletId: string): Promise<Transaction> {
    //return this.request<RapydResponse<Transaction>>(`/v1/user/${walletId}/transactions/${transactionId}`);
    return this.request<Transaction>(`/v1/user/${walletId}/transactions/${transactionId}`);
  }

  getWallet(walletId: string): Promise<EWallet> {
    return this.request<EWallet>(`/v1/user/${walletId}`);
  }

  createPayment(params: RapydTransactionCreate): Promise<Transaction> {
    return this.request<Transaction>("/v1/account/transfer", {
      method: "POST",
      json: params,
    });
  }
}

interface RapydResponse<T> {
  status: {
    error_code: string;
    status: string;
    message: string;
    response_code: string;
    operation_id: string;
  };
  data: T;
}

export default Rapyd;