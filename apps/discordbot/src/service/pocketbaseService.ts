import { PrismaClient } from '@prisma/client';
import { PBCustomer } from './models/pocketbase';

const prisma = new PrismaClient();

// TODO: change to PocketBase uri
const uri = `${process.env.BASE_URI}/v1/user`;

// TODO: retrieve customer data from PocketBase
// TODO: create PocketBase service
export const retrieveCustomer = async (
  discordTag: string
): Promise<PBCustomer | undefined> => {
  const wallet = await prisma.wallet.findUnique({
    where: { referenceId: discordTag },
  });

  if (wallet) {
    return {
      id: wallet.id,
      ewallet: wallet.id,
      name: wallet.username,
      ewalletReferenceId: wallet.referenceId,
    };
  }
};
