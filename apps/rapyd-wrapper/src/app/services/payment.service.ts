import { Transaction, TransactionCreate } from '../../models/payment.model';
import RapydResponse from '../../models/rapyd.model';

export const createPayment = async (
  payment: TransactionCreate
): Promise<RapydResponse<Transaction>> => {
  try {
    // TODO: create user here

    console.log(payment);

    return;
  } catch (e) {
    throw new Error(e);
  }
};
