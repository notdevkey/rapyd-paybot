export interface Transaction {
  id: string;
  status: string;
  amount: number;
  currency_code: string;
  destination_ewallet_id: string;
  destination_transaction_id: string;
  source_ewallet_id: string;
  source_transaction_id: string;
  transfer_response_at: number;
  created_at: number;
}

// create (wrapper API)
export interface RapydTransactionCreate {
  source_ewallet: string;
  amount: number;
  currency: string;
  destination_ewallet: string;
  //metadata?: RapydTransactionMetadata;
}

export interface RapydTransactionMetadata {
  message: string;
}

// create (ds client)
export interface PaymentCreate {
  sender: string;
  amount: number;
  receiver: string;
  message: string;
}

// approve
export interface PaymentApprove {
  id: string;
  status: string;
}