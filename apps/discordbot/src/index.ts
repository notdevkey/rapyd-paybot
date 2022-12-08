// Require the necessary discord.js classes
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
  Events,
  GatewayIntentBits,
} from 'discord.js';
import dotenv from 'dotenv';
import { onInteraction } from './events/onInteraction';
import { onReady } from './events/onReady';

import * as amqp from 'amqplib/callback_api';
import { paymentCreated, paymentResponded } from './utils/constants';
import {
  TransactionRabbitMQResponse,
  WebhookType,
} from './service/models/rabbitmq';
import { TextChannel } from 'discord.js';

dotenv.config();

(async () => {
  const bot = new Client({ intents: [GatewayIntentBits.Guilds] });

  bot.on(Events.ClientReady, (client) => onReady(client));

  bot.on(Events.InteractionCreate, async (interaction) =>
    onInteraction(interaction)
  );

  await bot.login(process.env.DISCORD_BOT_TOKEN);

  // TODO: extract to separate command
  const rbmqUri = process.env.RABBITMQ_URI as string;
  amqp.connect(rbmqUri, (err0, connection) => {
    if (err0) throw err0;

    connection.createChannel((err1, channel) => {
      if (err1) throw err1;

      // queue for payment created response
      channel.assertQueue(paymentCreated, { durable: false });
      channel.consume(paymentCreated, (msg) => {
        console.log('Discord bot received:');
        console.log(msg?.content.toString());

        if (msg != null) {
          //
          const response: TransactionRabbitMQResponse = JSON.parse(
            msg!.content.toString()
          );

          const paymentRequestEmbed = new EmbedBuilder();
          paymentRequestEmbed.setTitle('Transaction pending!');

          paymentRequestEmbed.setFields(
            {
              name: 'Sender',
              value: response.data.source_ewallet_id,
            },
            {
              name: 'Receiver',
              value: response.data.destination_ewallet_id,
            },
            {
              name: 'Amount',
              value: `${response.data.amount.toString()} ${
                response.data.currency
              }`,
            },
            {
              name: 'PAYMENT ID (use for approval)',
              value: `${response.data.id}`,
            }
          );

          paymentRequestEmbed.setDescription(
            `Use your payment ID ${response.data.id}`
          );

          (bot.channels.cache.get('1043644874844553246') as TextChannel).send({
            embeds: [paymentRequestEmbed],
          });
        }
      });

      // queue for payment accept / decline response
      channel.assertQueue(paymentResponded, { durable: false });
      channel.consume(paymentResponded, (msg) => {
        console.log('Discord bot received:');
        console.log(msg?.content.toString());

        if (msg != null) {
          const response: TransactionRabbitMQResponse = JSON.parse(
            msg!.content.toString()
          );

          const paymentRequestEmbed = new EmbedBuilder();
          paymentRequestEmbed.setTitle('Transaction approved!');

          paymentRequestEmbed.setFields(
            {
              name: 'Sender',
              value: response.data.source_ewallet_id,
            },
            {
              name: 'Receiver',
              value: response.data.destination_ewallet_id,
            },
            {
              name: 'Amount',
              value: `${response.data.amount.toString()} ${
                response.data.currency
              }`,
            }
          );

          paymentRequestEmbed.setDescription(
            `Your payment with ID ${response.data.id} has been APPROVED!`
          );

          (bot.channels.cache.get('1043644874844553246') as TextChannel).send({
            embeds: [paymentRequestEmbed],
          });
        }
      });
    });
  });
})();
