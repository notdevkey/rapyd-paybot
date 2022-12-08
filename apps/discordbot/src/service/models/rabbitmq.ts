export interface TransactionRabbitMQResponse {
  id: string;
  data: TransactionRabbitMQData;
  type: WebhookType;
  status: string;
  created_at: number;
  trigger_operation_id: string;
}

export interface TransactionRabbitMQData {
  id: string;
  status: string;
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

export enum WebhookType {
  TRANSFER_FUNDS_BETWEEN_EWALLETS_RESPONSE,
  TRANSFER_FUNDS_BETWEEN_EWALLETS_CREATED,
}