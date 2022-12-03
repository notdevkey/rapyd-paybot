/* eslint-disable @typescript-eslint/no-var-requires */

import RapydResponse from '../../models/rapyd.model';
import { Wallet, WalletCreate } from '../../models/wallet.model';

import axios from 'axios';

import { validateEnv } from '../../utils/validate-env';
import { getRequestHeaders } from './rapyd.service';

export const createWallet = async (
  wallet: WalletCreate
): Promise<RapydResponse<Wallet>> => {
  try {
    // TODO: create user here

    console.log(wallet);

    if (!validateEnv) return;

    const client = axios.create({
      baseURL: process.env.BASE_URI
    });
    
    let walletCreated: RapydResponse<Wallet>;
    await client.post<RapydResponse<Wallet>>('/user', wallet, {
      headers: getRequestHeaders('post', '/v1/user', JSON.parse(JSON.stringify(wallet)))
    }).then((response) => {
      console.log(response);
      walletCreated = response.data;
    }).catch((e) => {
      console.error(e);
    });

    return walletCreated;
  } catch (e) {
    throw new Error(e);
  }
};

export const retrieveWallet = async (
  walletId: string
): Promise<RapydResponse<Wallet>> => {
  try {
    // TODO: create user here

    console.log(walletId);

    if (!validateEnv) return;

    const client = axios.create({
      baseURL: process.env.BASE_URI
    });
    
    let walletRetrieved: RapydResponse<Wallet>;
    await client.get<RapydResponse<Wallet>>(`/user/${walletId}`, {
      headers: getRequestHeaders('get', `/v1/user/${walletId}`, JSON.parse(JSON.stringify('')))
    }).then((response) => {
      console.log(response);
      walletRetrieved = response.data;
    }).catch((e) => {
      console.error(e);
    });

    return walletRetrieved;
  } catch (e) {
    throw new Error(e);
  }
};