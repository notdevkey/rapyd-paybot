export interface TransactionCreate {
  source_ewallet: string;
  amount: number;
  currency: string;
  destination_ewallet: string;
}