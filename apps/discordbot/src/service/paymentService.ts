import {
  PaymentApprove,
  PaymentCreate,
  RapydTransactionCreate,
  RapydTransactionMetadata,
  Transaction,
} from './models/payment';

import WalletService from './walletService';
import { retrieveCustomer } from './pocketbaseService';

import { RapydResponse } from './models/rapydResponse';
import axios, { AxiosInstance } from 'axios';
import { validateEnv } from '../utils/validate-env';

class PaymentService {
  private uri!: string;
  private walletService!: WalletService;
  private client!: AxiosInstance;

  constructor() {
    if (!validateEnv) return;
    this.walletService = new WalletService();
    this.uri = `${process.env.WRAPPER_URI}/api`;
    this.client = axios.create({
      baseURL: this.uri,
    });
  }

  public makeTransaction = async (
    transaction: PaymentCreate
  ): Promise<RapydResponse<Transaction>> => {
    try {
      // customer data from PB
      const senderAccount = await retrieveCustomer(transaction.sender); // must return Fred's wallet
      const receiverAccount = await retrieveCustomer(transaction.receiver); // must return Lisais83's wallet

      // check if both sender and receiver accounts exist
      if (senderAccount == null || receiverAccount == null) {
        // TODO: return correct error response
        return {} as RapydResponse<Transaction>;
      }

      console.log(senderAccount.ewallet);
      console.log(receiverAccount.ewallet);

      // check if both sender and receiver wallets exist
      const senderWallet = await this.walletService.retrieveEWallet(
        senderAccount.ewallet
      );
      const receiverWallet = await this.walletService.retrieveEWallet(
        receiverAccount.ewallet
      );

      if (senderWallet.data == null || receiverWallet.data == null) {
        // TODO: return correct error response
        return {} as RapydResponse<Transaction>;
      }

      // proceed to payment
      const paymentToCreateMetadata: RapydTransactionMetadata = {
        message: transaction.message,
      };

      // TODO: determine currency when making payment
      const paymentToCreate: RapydTransactionCreate = {
        source_ewallet: senderWallet.data.id,
        amount: transaction.amount,
        currency: 'EUR',
        destination_ewallet: receiverWallet.data.id,
        //metadata: paymentToCreateMetadata,
      };

      console.log('Payment to be made:', paymentToCreate);

      let paymentResponse: RapydResponse<Transaction> | null;
      await this.client
        .post<RapydResponse<Transaction>>('/payments', paymentToCreate)
        .then((response) => {
          paymentResponse = response.data;
          console.log('Payment response: ', paymentResponse.data);
          console.log(paymentResponse.status);
        })
        .catch((e) => {
          if (axios.isAxiosError(e)) {
            console.error(e.message);
          } else {
            console.error('Unexpected Error occurerd');
          }
          paymentResponse = e;
        });

      return paymentResponse!;
    } catch (e) {
      console.log(e);
      // TODO: return correct error response
      return {} as RapydResponse<Transaction>;
    }
  };

  retrieveTransaction = async (
    transactionId: string
  ): Promise<RapydResponse<Transaction>> => {
    // TODO: implement

    // TODO: return correct error response
    return {} as RapydResponse<Transaction>;
  };

  public approveTransaction = async (
    transactionApprove: PaymentApprove
  ): Promise<RapydResponse<Transaction>> => {
    try {
      console.log('Payment to be approved:', transactionApprove);

      let paymentResponse: RapydResponse<Transaction> | null;
      await this.client
        .post<RapydResponse<Transaction>>('/payments/status', transactionApprove)
        .then((response) => {
          paymentResponse = response.data;
          console.log('Payment response: ', paymentResponse.data);
          console.log(paymentResponse.status);
        })
        .catch((e) => {
          if (axios.isAxiosError(e)) {
            console.error(e.message);
          } else {
            console.error('Unexpected Error occurerd');
          }
          paymentResponse = e;
        });

      return paymentResponse!;
    } catch (e) {
      console.log(e);
      // TODO: return correct error response
      return {} as RapydResponse<Transaction>;
    }
  };
}

export default PaymentService;
