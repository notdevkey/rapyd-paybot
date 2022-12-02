import { Wallet, WalletCreate } from '../../models/wallet.model';

export const createWallet = async (wallet: WalletCreate): Promise<Wallet> => {
  try {
    // TODO: create user here

    console.log(wallet);

    return;
  } catch (e) {
    throw new Error(e);
  }
}