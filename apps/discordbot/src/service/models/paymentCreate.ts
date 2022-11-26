export interface RapydTransactionCreate {
  source_ewallet: string;
  amount: number;
  currency: string;
  destination_ewallet: string;
  metadata: RapydTransactionMetadata;
}

export interface RapydTransactionMetadata {
  message: string;
}

export interface PaymentCreate {
  sender: string;
  amount: number;
  receiver: string;
  message: string;
}