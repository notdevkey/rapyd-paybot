import { Express, Request, Response } from 'express';
import {
  createPaymentHandler,
  retrievePaymentHandler,
  setPaymentStatusHandler,
} from './app/controllers/payment.controller';
import {
  paymentWebhook,
} from './app/controllers/webhook.controller';
import {
  createWalletHandler,
  deleteWalletHandler,
  getAllWalletsHandler,
  retrieveWalletHandler,
} from './app/controllers/wallet.controller';

import validateResource from './app/middleware/validateResource';
import {
  createPaymentSchema,
  retrievePaymentSchema,
  setPaymentStatusSchema
} from './app/schema/payment.schema';
import {
  createWalletSchema,
  deleteWalletSchema,
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
  app.delete(
    '/api/wallets',
    validateResource(deleteWalletSchema),
    deleteWalletHandler
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

  app.post(
    '/api/payments/status',
    validateResource(setPaymentStatusSchema),
    setPaymentStatusHandler
  );

  // webhook endpoints
  app.post('/api/webhook/payment', paymentWebhook);
};

export default routes;
