import { EWalletCreate, Contact } from "./models/walletCreate";
import { EWallet } from "./models/wallet";
import { CustomerCreate } from "./models/customerCreate";
import { ErrorResponse } from "./models/error";
import { getRequestHeaders } from "./authService";
import axios from "axios";

// TODO: extraxt to env
const uri = `${process.env.BASE_URI}/v1/user`;

const instance = axios.create({
  baseURL: process.env.BASE_URI,
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
    headers: getRequestHeaders("post", uri, walletToCreate)
  }

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
    headers: getRequestHeaders("get", `${uri}/${walletId}`, "")
  }

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
    headers: getRequestHeaders("put", uri, eWallet)
  }

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