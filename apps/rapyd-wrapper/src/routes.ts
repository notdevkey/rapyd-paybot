import { Express, Request, Response } from 'express';
import {
  createPaymentHandler,
  retrievePaymentHandler,
} from './app/controllers/payment.controller';
import {
  createWalletHandler,
  getAllWalletsHandler,
  retrieveWalletHandler,
} from './app/controllers/wallet.controller';

import validateResource from './app/middleware/validateResource';
import {
  createPaymentSchema,
  retrievePaymentSchema,
} from './app/schema/payment.schema';
import {
  createWalletSchema,
  getAllWalletsSchema,
  retrieveWalletSchema,
} from './app/schema/wallet.schema';

const routes = (app: Express) => {
  app.get('/check', (req: Request, res: Response) => res.sendStatus(200));

  app.get(
    '/api/wallets',
    validateResource(getAllWalletsSchema),
    getAllWalletsHandler
  );
  // wallet endpoints
  app.post(
    '/api/wallets',
    validateResource(createWalletSchema),
    createWalletHandler
  );
  app.get(
    '/api/wallets/:walletId',
    validateResource(retrieveWalletSchema),
    retrieveWalletHandler
  );

  // payment endpoints
  app.post(
    '/api/payments',
    validateResource(createPaymentSchema),
    createPaymentHandler
  );
  app.get(
    '/api/:walletId/payments/:paymentId',
    validateResource(retrievePaymentSchema),
    retrievePaymentHandler
  );
};

export default routes;
