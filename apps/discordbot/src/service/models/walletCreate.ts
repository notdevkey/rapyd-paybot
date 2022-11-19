export interface EWalletCreate {
  ewallet_reference_id: string;
  type: string;
  contact: Contact;
}

export interface Contact {
  phone_number: string;
  email: string;
  first_name: string;
  contact_type: string;
}
