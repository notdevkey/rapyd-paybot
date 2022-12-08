import { APIEmbedField, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command } from '../interfaces/Command';
import { PaymentCreate } from '../service/models/payment';
import PaymentService from '../service/paymentService';

export const requestPayment: Command = {
  data: new SlashCommandBuilder()
    .setName('request-payment')
    .setDescription('Request money from a user')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to request money from')
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName('amount')
        .setDescription('The amount you want to send')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('message')
        .setDescription('The message you want to send along the request')
    ),
  run: async (interaction) => {
    await interaction.deferReply();
    const { user } = interaction;
    const amount = interaction.options.get('amount', true).value as number;
    const paymentMessage = interaction.options.get('message')?.value as string;

    const receiver = interaction.options.getUser('user');

    const paymentService = new PaymentService();

    let message: APIEmbedField | APIEmbedField[] = [];
    let title: string = '';
    let description: string = '';
    if (!receiver) {
      // TODO: show no account error
      message = [
        { name: 'Error', value: 'The receiver does not have an account' },
      ];
      title = 'Transaction Failed';
      description = `Hey, ${user.username}! The receiver of your transaction does not have an account!`;
      return;
    }
    // TODO: get user's and receiver's ewallets here

    // TODO: make transaction
    const transaction: PaymentCreate = {
      sender: user.tag,
      amount: amount,
      receiver: receiver!.tag,
      message: paymentMessage,
    };
    const paymentCreated = await paymentService.makeTransaction(transaction);
    // TODO: check if payment success
    // TODO: only for test purposes, remove sensitive data later
    if (paymentCreated.data != null) {
      const result = paymentCreated.data;
      message = [
        { name: 'Sender wallet', value: result.source_ewallet_id },
        { name: 'Receiver wallet', value: result.destination_ewallet_id },
        { name: 'Transaction ID', value: result.source_transaction_id },
        { name: 'Ammount', value: result.amount.toString() },
        { name: 'Currency', value: result.currency_code },
        { name: 'Transaction Status', value: result.status },
      ];
      title = 'Transaction successful!';
      description = `Hey, ${user.username}! The money has been successfully sent to ${receiver.username}!`;
    } else if (paymentCreated.status != null) {
      message = [{ name: 'Error', value: paymentCreated.status.message }];
      title = 'Transactiond Failed';
      description = `Hey, ${user.username}! Some error occured when creating Transaction to ${receiver.username}!`;
    } else {
      // TODO: introduce proper error handling
      message = [{ name: 'Error', value: 'unknown error' }];
      title = 'Transactiond Failed';
      description = `Hey, ${user.username}! Some error occured when creating Transaction to ${receiver.username}!`;
    }

    const paymentRequestEmbed = new EmbedBuilder();
    paymentRequestEmbed.setTitle(title);
    if (message) {
      paymentRequestEmbed.setDescription(description);
    }
    if (amount) {
      paymentRequestEmbed.setFields(message);
    }
    paymentRequestEmbed.setAuthor({
      name: user.tag,
      iconURL: user.displayAvatarURL(),
    });

    await interaction.editReply({ embeds: [paymentRequestEmbed] });
  },
};
