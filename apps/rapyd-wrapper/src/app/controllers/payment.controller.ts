/* eslint-disable @typescript-eslint/ban-types */

import { Request, Response } from 'express';
import { TransactionCreate } from '../../models/payment.model';
import { CreatePaymentInput, RetrievePaymentInput } from '../schema/payment.schema';
import { createPayment, retrievePayment } from '../services/payment.service';

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

export const retrievePaymentHandler = async (
  req: Request<RetrievePaymentInput['params']>,
  res: Response
) => {
  try {
    const pid = req.params.paymentId;
    const wid = req.params.walletId;

    const payment = await retrievePayment(wid, pid);
    return res.send(payment.data);
  } catch (e) {
    console.log(e);
    return res.status(500).send(e.message);
  }
};