import { EWalletCreate, Contact } from "./models/walletCreate";
import { EWallet } from "./models/wallet";
import { CustomerCreate } from "./models/customerCreate";
import { ErrorResponse } from "./models/error";
import dotenv from 'dotenv';
import axios from "axios";

// TODO: extraxt to env
const uri = 'https://sandboxapi.rapyd.net/v1/user';
const access_key = '4C15ED203D6CA6141CF8';
const salt = 'b142ee4dcf99085d5507091a';
const timestamp = '1668855267';
const signature = 'NWZlYjA3MGRkYTM4MTFmNDNmMjk5NGE5Yjg5M2ZiMzQ5ZThhMDcxZjhkY2IxMzNjZGMwMjJiNzJmZWI3OGNiZg==';

const instance = axios.create({
  baseURL: uri,
});

export const createEWallet = async (customerData: CustomerCreate): Promise<EWallet | ErrorResponse> => {
  // TODO: implement
  const walletContact: Contact = {
    phone_number: customerData.phone_number,
    email: customerData.email,
    first_name: customerData.first_name,
    contact_type: "personal",
  };
  
  const walletToCreate: EWalletCreate = {
    ewallet_reference_id: customerData.ewallet_reference_id,
    type: "person",
    contact: walletContact
  };

  // TODO: extract to some common place
  const config = {
    headers: { 
      'Content-Type': 'application/json',
      'access_key': access_key,
      'salt': salt,
      'timestamp': timestamp,
      'signature': signature,
    },
  };

  try {
    const response = await instance.post<EWallet>(uri, walletToCreate, config);

    // TODO: remove log
    console.log(response.data)
    return response.data;
  } catch(e) {
    const err: ErrorResponse = {
      msg: ''
    };
    if (axios.isAxiosError(e)) {
      err.msg = e.message;
    } else {
      err.msg = "Unexpected Error occurerd";
    }

    // TODO: remove log
    console.log(err.msg);
    return err;
  }
};

export const retrieveEWallet = async (walletId: string): Promise<EWallet | ErrorResponse> => {
  // TODO: implement

  // TODO: extract to some common place
  const config = {
    headers: { 
      'Content-Type': 'application/json',
      'access_key': access_key,
      'salt': salt,
      'timestamp': timestamp,
      'signature': signature,
    },
  };

  try {
    const response = await instance.get<EWallet>(`${uri}/${walletId}`, config);

    // TODO: remove log
    console.log(response.data)
    return response.data;
  } catch (e) {
    const err: ErrorResponse = {
      msg: ''
    };
    if (axios.isAxiosError(e)) {
      err.msg = e.message;
    } else {
      err.msg = "Unexpected Error occurerd";
    }

    // TODO: remove log
    console.log(err.msg);
    return err;
  }
};

export const updateEWallet = async (eWallet: EWallet): Promise<EWallet | ErrorResponse> => {
  // TODO: extract to some common place
  const config = {
    headers: { 
      'Content-Type': 'application/json',
      'access_key': access_key,
      'salt': salt,
      'timestamp': timestamp,
      'signature': signature,
    },
  };

  try {
    const response = await instance.put<EWallet>(uri, eWallet, config);

    // TODO: remove log
    console.log(response.data)
    return response.data;
  } catch (e) {
    const err: ErrorResponse = {
      msg: ''
    };
    if (axios.isAxiosError(e)) {
      err.msg = e.message;
    } else {
      err.msg = "Unexpected Error occurerd";
    }

    // TODO: remove log
    console.log(err.msg);
    return err;
  }
}