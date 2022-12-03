export interface Wallet {
  id: string;
  status: string;
  accounts: any[];
  verification_status: string;
  type: string;
  metadata: string;
  ewallet_reference_id: string;
  contacts: Contacts[];
}

export interface Contacts {
  id: string;
  first_name: string;
  contact_type: string;
  phone_number: string;
  email: string;
  identification_type: string;
  identification_number: string;
  ewallet: string;
  created_at: number;
  metadata: string;
  verification_status: string;
  send_notifications: boolean;
}

// create
export interface WalletCreate {
  ewallet_reference_id: string;
  type: string;
  contact: ContactCreate;
}

export interface ContactCreate {
  phone_number: string;
  email: string;
  first_name: string;
  contact_type: string;
}

// update
export interface WalletUpdate {
  email: string;
  ewallet: string;
  ewallet_reference_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}