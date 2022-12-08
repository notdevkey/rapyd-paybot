export interface EWallet {
  id: string;
  status: string;
  accounts: any[];
  verification_status: string;
  type: string;
  metadata: string;
  ewallet_reference_id: string;
  contacts: ContactsData;
}

export interface ContactsData {
  data: Contacts[];
  hasMore: boolean;
  totalCount: number;
  url: string;
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

// create (wrapper API)
export interface EWalletCreate {
  ewallet_reference_id: string;
  type: string;
  contact: Contact;
}

export interface Contact {
  phone_number: string;
  email: string;
  password: string;
  first_name: string;
  contact_type: string;
}

// create (ds client)
export interface CustomerCreate {
  ds_tag: string;
  phone_number: string;
  email: string;
  username: string;
  password: string;
}

// update (WRAPPER API)
export interface EWalletUpdate {
  email: string;
  ewallet: string;
  ewallet_reference_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}
