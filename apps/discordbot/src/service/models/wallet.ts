import { Contacts } from "./customer";

export interface EWallet {
  status: EWalletStatus;
  data: WalletData;
}

export interface WalletData {
  id: string;
  status: string;
  accounts: any[];
  verificationStatus: string;
  type: string;
  metadata: string;
  ewalletReferenceID: string;
  contacts: Contacts;
}

export interface EWalletStatus {
  errorCode: string;
  status: string;
  message: string;
  responseCode: string;
}
