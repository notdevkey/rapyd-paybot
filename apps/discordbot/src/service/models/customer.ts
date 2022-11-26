export interface Contacts {
  data: ContactsData[];
  url: string;
}

export interface ContactsData {
  id: string;
  firstName: string;
  contactType: string;
  phoneNumber: string;
  email: string;
  identificationType: string;
  identificationNumber: string;
  ewallet: string;
  createdAt: number;
  metadata: string;
  verificationStatus: string;
  sendNotifications: boolean;
}

export interface PBCustomer {
  id: string;
  name: string;
  ewallet: string;
  ewalletReferenceId: string;
}