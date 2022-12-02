/* eslint-disable @typescript-eslint/ban-types */

import { Request, Response } from 'express';
import { TransactionCreate } from '../../models/payment.model';
import { CreatePaymentInput } from '../schema/payment.schema';
import { createPayment } from '../services/payment.service';

export const createPaymentHandler = async (
  req: Request<{}, {}, CreatePaymentInput['body']>,
  res: Response
) => {
  try {
    const paymentToCreate: TransactionCreate = {
      source_ewallet: req.body.source_ewallet,
      amount: req.body.amount,
      currency: req.body.currency,
      destination_ewallet: req.body.destination_ewallet,
    };

    const payment = await createPayment(paymentToCreate);
    return res.send(payment.data);
  } catch (e) {
    console.log(e);
    return res.status(500).send(e.message);
  }
};
