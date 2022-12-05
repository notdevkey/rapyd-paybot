import {
  Contact,
  CustomerCreate,
  EWallet,
  EWalletCreate,
} from './models/wallet';
import { RapydResponse, RapydResponseStatus } from './models/rapydResponse';

import { validateEnv } from '../utils/validate-env';

import axios, { AxiosInstance } from 'axios';

class WalletService {
  private uri!: string;
  private client!: AxiosInstance;

  constructor() {
    // TODO: handle invalid env variables
    if (!validateEnv) return;
    this.uri = `${process.env.WRAPPER_URI}/api`;
    this.client = axios.create({
      baseURL: this.uri,
    });
  }

  public createEWallet = async (
    customerData: CustomerCreate
  ): Promise<RapydResponse<EWallet>> => {
    const walletContact: Contact = {
      phone_number: customerData.phone_number,
      email: customerData.email,
      first_name: customerData.username,
      contact_type: 'personal',
    };

    const walletToCreate: EWalletCreate = {
      ewallet_reference_id: customerData.ds_tag,
      type: 'person',
      contact: walletContact,
    };

    let walletResponse: RapydResponse<EWallet> | null;
    await this.client
      .post<RapydResponse<EWallet>>('/wallets', walletToCreate)
      .then((response) => {
        walletResponse = response.data;
        // TODO: test log, remove
        console.log('Wallet response:', walletResponse.data);
        console.log(walletResponse.status);
      })
      .catch((e) => {
        if (axios.isAxiosError(e)) {
          console.error(e.message);
        } else {
          console.error('Unexpected Error occurerd');
        }
        walletResponse = e;
      });

    return walletResponse!;
  };

  public retrieveEWallet = async (
    walletId: string
  ): Promise<RapydResponse<EWallet>> => {
    let walletResponse: RapydResponse<EWallet> | null;
    await this.client
      .get<RapydResponse<EWallet>>(`/wallets/${walletId}`)
      .then((response) => {
        walletResponse = response.data;
        // TODO: test log, remove
        console.log(walletResponse.data);
        console.log(walletResponse.status);
      })
      .catch((e) => {
        if (axios.isAxiosError(e)) {
          console.error(e.message);
        } else {
          console.error('Unexpected Error occurerd');
        }
        walletResponse = e;
      });

    return walletResponse!;
  };

  public updateEWallet = async (
    eWallet: EWallet
  ): Promise<RapydResponse<EWallet>> => {
    // TODO: implement update on server

    return {} as RapydResponse<EWallet>;
  };
}

export default WalletService;
