/* eslint-disable @typescript-eslint/ban-types */

import { Request, Response } from 'express';
import { Transaction, TransactionCreate, TransactionSetStatus } from '../../models/payment.model';
import RapydResponse from '../../models/rapyd.model';
import { CreatePaymentInput, RetrievePaymentInput, SetPaymentStatusInput } from '../schema/payment.schema';
import { createPayment, retrievePayment, setPaymentStatus } from '../services/payment.service';

export const createPaymentHandler = async (
  req: Request<{}, {}, CreatePaymentInput['body']>,
  res: Response<RapydResponse<Transaction>>
) => {
  try {
    console.log(req.body);

    const paymentToCreate: TransactionCreate = {
      source_ewallet: req.body.source_ewallet,
      amount: req.body.amount,
      currency: req.body.currency,
      destination_ewallet: req.body.destination_ewallet,
    };

    const payment = await createPayment(paymentToCreate);
    return res.send(payment);
  } catch (e) {
    console.log(e);
    return res.status(500).send(e.message);
  }
};

// TODO: chage response to correct transaction response
export const retrievePaymentHandler = async (
  req: Request<RetrievePaymentInput['params']>,
  res: Response<RapydResponse<Transaction>>
) => {
  try {
    const pid = req.params.paymentId;
    const wid = req.params.walletId;

    const payment = await retrievePayment(wid, pid);
    return res.send(payment);
  } catch (e) {
    console.log(e);
    return res.status(500).send(e.message);
  }
};

export const setPaymentStatusHandler = async (
  req: Request<{}, {}, SetPaymentStatusInput['body']>,
  res: Response<RapydResponse<Transaction>>
) => {
  try {
    console.log(req.body);

    const paymentToSetStatus: TransactionSetStatus = {
      id: req.body.id,
      status: req.body.status,
    };

    const payment = await setPaymentStatus(paymentToSetStatus);
    return res.send(payment);
  } catch (e) {
    console.log(e);
    return res.status(500).send(e.message);
  }
};