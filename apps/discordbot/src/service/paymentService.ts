import { RapydTransactionCreate, PaymentCreate, RapydTransactionMetadata } from './models/paymentCreate';
import { Transaction } from './models/payment';
import { ErrorResponse } from './models/error';
import { getRequestHeaders } from './authService';
import { EWallet } from './models/wallet';

import { retrieveEWallet } from './walletService';
import { retrieveCustomer } from './customerService';
import axios from 'axios';
import { PBCustomer } from './models/customer';

const uri = `${process.env.BASE_URI}/v1/account/transfer`;

export const makeTransaction = async (
  transaction: PaymentCreate
): Promise<Transaction | ErrorResponse> => {
  try {
    // TODO: retrieve customer data from PocketBase
    // TODO: create PocketBase service
    const senderAccount = await retrieveCustomer(transaction.sender); // must return Fred's wallet
	  const receiverAccount = await retrieveCustomer(transaction.receiver); // must return Lisais83's wallet
    
    // check if both sender and receiver accounts exist
    // TODO: this if statement is a bit sus, recheck later
    if (
      (senderAccount as ErrorResponse).msg != null ||
      (receiverAccount as ErrorResponse).msg != null ||
      ((senderAccount as PBCustomer) == null ||
        (receiverAccount as PBCustomer) == null)
    ) {
      return {
        msg: 'Either sender or receiver do not have an account',
      } as ErrorResponse;
    }

    console.log((senderAccount as PBCustomer).ewallet);
    console.log((receiverAccount as PBCustomer).ewallet);

    // check if both sender and receiver wallets exist
    const senderWallet = await retrieveEWallet((senderAccount as PBCustomer).ewallet);
    const receiverWallet = await retrieveEWallet((receiverAccount as PBCustomer).ewallet);

    // TODO: this if statement is a bit sus, recheck later
    if (
      (senderWallet as EWallet).data == null ||
        (receiverWallet as EWallet).data == null
    ) {
      return {
        msg: 'Either sender or receiver do not have a wallet',
      } as ErrorResponse;
    }

    // proceed to payment
    // TODO: determine currency when making payment
    const paymentToCreateMetadata: RapydTransactionMetadata = {
      message: transaction.message,
    }

    const paymentToCreate: RapydTransactionCreate = {
      source_ewallet: (senderWallet as EWallet).data.id,
      amount: transaction.amount,
      currency: 'EUR',
      destination_ewallet: (receiverWallet as EWallet).data.id,
      metadata: paymentToCreateMetadata,
    }

    const config = {
      headers: getRequestHeaders("POST", "/v1/account/transfer", paymentToCreate)
    }

    const response = await axios.post<Transaction>(uri, paymentToCreate, config); // uri

    // TODO: remove log
    console.log(response.data);
    return response.data;
  } catch (e) {
    const err: ErrorResponse = {
      msg: ''
    };
    if (axios.isAxiosError(e)) {
      err.msg = e.message;
    } else {
      err.msg = "Unexpected Error occurerd";
    }

    // TODO: remove log
    console.log(err.msg);
    console.log(e);
    return err;
  }
};

export const retrieveTransaction = async (
  transactionId: string
): Promise<Transaction | null> => {
  // TODO: implement
  return null;
};
