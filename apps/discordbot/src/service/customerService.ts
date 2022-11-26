import { CustomerCreate } from "./models/customerCreate";
import { PBCustomer } from "./models/customer";
import { ErrorResponse } from "./models/error";
import { getRequestHeaders } from "./authService";
import axios from "axios";

// TODO: change to PocketBase uri
const uri = `${process.env.BASE_URI}/v1/user`;

export const retrieveCustomer = async (discordTag: string): Promise<PBCustomer | ErrorResponse> => {
  // TODO: implement this method
  // TODO: remove hardcoded values
  if (discordTag == "devkey#1604") {
    // receiver account
    return {
      id: '12345',
      name: 'Lisais83',
      ewallet: 'ewallet_e0245b1b0cb5df10c16cf71c1ea7cca7',
      ewalletReferenceId: 'devkey#1604',
    } as PBCustomer;
  } else if (discordTag == "Lisais83#9674") {
    // sender account
    return {
      id: '12345',
      name: 'Fredricks',
      ewallet: 'ewallet_417a3391e8f804aed23abebfcb71b828',
      ewalletReferenceId: 'Lisais83#9674',
    } as PBCustomer;
  } else {
    return {
      msg: 'Oppa privet, a nodokļus kurš maksās?',
    } as ErrorResponse;
  }
}