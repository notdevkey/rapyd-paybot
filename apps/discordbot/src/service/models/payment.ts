export interface Transaction {
  status: TransactionStatus;
  data: TransactionData;
}

export interface TransactionData {
  id: string;
  status: string;
  amount: number;
  currencyCode: string;
  destinationEwalletID: string;
  destinationTransactionID: string;
  sourceEwalletID: string;
  sourceTransactionID: string;
  transferResponseAt: number;
  createdAt: number;
}

export interface TransactionStatus {
  errorCode: string;
  status: string;
  message: string;
  responseCode: string;
}
