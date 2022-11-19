import { TransactionCreate } from "./models/paymentCreate";
import { Transaction } from "./models/payment";

export const makeTransaction = async (transaction: TransactionCreate): Promise<Transaction | null> => {
  // TODO: implement
  return null;
};

export const retrieveTransaction = async (transactionId: string): Promise<Transaction | null> => {
  // TODO: implement
  return null;
};