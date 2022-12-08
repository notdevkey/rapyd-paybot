/* eslint-disable @typescript-eslint/ban-types */

import { Request, Response } from 'express';
import { paymentCreated, paymentResponded } from '../constants';
import {
  TransactionWebhookResponse,
  WebhookType,
} from '../../models/webhook.model';

import * as amqp from 'amqplib/callback_api';

export const paymentWebhook = async (
  req: Request<{}, {}, TransactionWebhookResponse>,
  res: Response
) => {
  try {
    console.log(req.body);
    const uri = process.env.RABBITMQ_URI as string;

    amqp.connect(uri, (err0, connection) => {
      if (err0) throw err0;

      connection.createChannel((err1, channel) => {
        if (err1) throw err1;

        if (req.body.type == 'TRANSFER_FUNDS_BETWEEN_EWALLETS_CREATED') {
          channel.sendToQueue(
            paymentCreated,
            Buffer.from(JSON.stringify(req.body))
          );
        }
        if (req.body.type == 'TRANSFER_FUNDS_BETWEEN_EWALLETS_RESPONSE') {
          channel.sendToQueue(
            paymentResponded,
            Buffer.from(JSON.stringify(req.body))
          );
        }
      });

      process.on('beforeExit', () => {
        console.log('closed connection');
        connection.close();
      });
    });

    res.sendStatus(200).end();
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message).end();
  }
};
