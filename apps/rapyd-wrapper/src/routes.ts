import { Express, Request, Response } from 'express';
import { createWalletHandler } from './app/controllers/wallet.controller';

import validateResource from './app/middleware/validateResource';
import { createWalletSchema } from './app/schema/wallet.schema';

const routes = (app: Express) => {
  app.get('/check', (req: Request, res: Response) => res.sendStatus(200));

  // wallet endpoints
  app.post('/api/wallets', validateResource(createWalletSchema), createWalletHandler);
}

export default routes;