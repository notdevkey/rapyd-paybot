import axios from 'axios';
import { Transaction, TransactionCreate } from '../../models/payment.model';
import RapydResponse from '../../models/rapyd.model';

import { validateEnv } from '../../utils/validate-env';
import { getRequestHeaders } from '../services/rapyd.service';

export const createPayment = async (
  payment: TransactionCreate
): Promise<RapydResponse<Transaction>> => {
  try {
    console.log(payment);

    if (!validateEnv) return;

    const client = axios.create({
      baseURL: process.env.BASE_URI,
    });

    let paymentCreated: RapydResponse<Transaction>;
    await client
      .post<RapydResponse<Transaction>>('/account/transfer', payment, {
        headers: getRequestHeaders(
          'post',
          '/v1/account/transfer',
          JSON.parse(JSON.stringify(payment))
        ),
      })
      .then((response) => {
        console.log(response);
        paymentCreated = response.data;
      })
      .catch((e) => {
        console.error(e);
      });

    return paymentCreated;
  } catch (e) {
    throw new Error(e);
  }
};

export const retrievePayment = async (
  walletId: string,
  paymentId: string
): Promise<RapydResponse<Transaction>> => {
  try {
    console.log(walletId, paymentId);

    if (!validateEnv) return;

    const client = axios.create({
      baseURL: process.env.BASE_URI,
    });

    let paymentRetrieved: RapydResponse<Transaction>;
    await client
      .get<RapydResponse<Transaction>>(`/user/${walletId}/transactions/${paymentId}`, {
        headers: getRequestHeaders(
          'get',
          `/v1/user/${walletId}/transactions/${paymentId}`,
          JSON.parse(JSON.stringify(''))
        ),
      })
      .then((response) => {
        console.log(response);
        paymentRetrieved = response.data;
      })
      .catch((e) => {
        console.error(e);
      });

    return paymentRetrieved;
  } catch (e) {
    throw new Error(e);
  }
};