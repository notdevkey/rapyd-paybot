// payment created webhook
export interface TransactionCreatedWebhookResponse {
  id: string;
  data: TransactionCreatedWebhookData;
  type: string;
  status: string;
  created_at: number;
  trigger_operation_id: string;
}

export interface TransactionCreatedWebhookData {
  id: string;
  amount: number;
  currency: string;
  timestamp: string;
  source_ewallet_id: string;
  source_phone_number: string;
  source_transaction_id: string;
  destination_ewallet_id: string;
  destination_phone_number: string;
  destination_transaction_id: string;
}

// payment responded webhook