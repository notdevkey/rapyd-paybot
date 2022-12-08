import * as amqp from 'amqplib/callback_api';
import { validateEnv } from '../../utils/validate-env';

class RabbitMQService {
  private _channel: amqp.Channel;

  constructor() {
    if (!validateEnv) return;
    const username = process.env.RABBITMQ_USER;
    const password = process.env.RABBITMQ_PASS;

    amqp.connect(`amqp://${username}:${password}@localhost:5672`, (err0, connection) => {
      if (err0) {
        throw err0;
      }

      connection.createChannel((err1, channel) => {
        if (err1) {
          throw err1;
        }

        this._channel = channel;
        //
      });
    });
  }

  //
}

export default RabbitMQService;