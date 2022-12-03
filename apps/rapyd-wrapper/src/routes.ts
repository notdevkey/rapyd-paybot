import { Express, Request, Response } from 'express';
import { createPaymentHandler } from './app/controllers/payment.controller';
import { createWalletHandler, retrieveWalletHandler } from './app/controllers/wallet.controller';

import validateResource from './app/middleware/validateResource';
import { createPaymentSchema } from './app/schema/payment.schema';
import { createWalletSchema, retrieveWalletSchema } from './app/schema/wallet.schema';

const routes = (app: Express) => {
  app.get('/check', (req: Request, res: Response) => res.sendStatus(200));

  // wallet endpoints
  app.post('/api/wallets', validateResource(createWalletSchema), createWalletHandler);
  app.get('/api/wallets/:walletId', validateResource(retrieveWalletSchema), retrieveWalletHandler);

  // payment endpoints
  app.post('/api/payments', validateResource(createPaymentSchema), createPaymentHandler);

}

export default routes;