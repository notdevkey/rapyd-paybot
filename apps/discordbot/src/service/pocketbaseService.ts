import { CustomerCreate } from "./models/wallet";
import { PBCustomer } from "./models/pocketbase";
import axios from "axios";

// TODO: change to PocketBase uri
const uri = `${process.env.BASE_URI}/v1/user`;

// TODO: retrieve customer data from PocketBase
// TODO: create PocketBase service
export const retrieveCustomer = async (discordTag: string): Promise<PBCustomer> => {
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
    return {} as PBCustomer;
  }
}