import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { Transaction, TransactionCreate } from '../../models/payment.model';
import RapydResponse from '../../models/rapyd.model';

import { validateEnv } from '../../utils/validate-env';
import { getRequestHeaders } from '../services/rapyd.service';

const prisma = new PrismaClient();

export const createPayment = async (
  payment: TransactionCreate
): Promise<RapydResponse<Transaction>> => {
  try {
    console.log(payment);

    if (!validateEnv) return;

    const client = axios.create({
      baseURL: process.env.BASE_URI,
    });
    let paymentCreated;
    try {
      const { data } = await client.post<RapydResponse<Transaction>>(
        '/account/transfer',
        payment,
        {
          headers: getRequestHeaders(
            'post',
            '/v1/account/transfer',
            JSON.parse(JSON.stringify(payment))
          ),
        }
      );
      paymentCreated = data;
    } catch (e) {
      console.log(e.response);
    }

    await prisma.transaction.create({
      data: {
        amount: paymentCreated.data.amount,
        from: {
          connect: { id: paymentCreated.data.source_ewallet_id },
        },
        to: {
          connect: { id: paymentCreated.data.destination_ewallet_id },
        },
      },
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

    // let paymentRetrieved: RapydResponse<Transaction>;
    const { data: paymentRetrieved } = await client.get<
      RapydResponse<Transaction>
    >(`/user/${walletId}/transactions/${paymentId}`, {
      headers: getRequestHeaders(
        'get',
        `/v1/user/${walletId}/transactions/${paymentId}`,
        JSON.parse(JSON.stringify(''))
      ),
    });
    // .then((response) => {
    //   paymentRetrieved = response.data;
    // })
    // .catch((e) => {
    //   console.error(e);
    // });

    return paymentRetrieved;
  } catch (e) {
    throw new Error(e);
  }
};
