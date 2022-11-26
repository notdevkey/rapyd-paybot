import { APIEmbedField, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { makeTransaction } from '../service/paymentService';
import { Command } from '../interfaces/Command';
import { PaymentCreate } from '../service/models/paymentCreate';
import { Transaction } from "../service/models/payment";
import { ErrorResponse } from '../service/models/error';

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
    .addIntegerOption((option) =>
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

    let message: APIEmbedField | APIEmbedField[] = [];
    let title: string = '';
    let description: string = '';
    if (!receiver) {
      // TODO: show no account error
      message = [
        { name: 'Error', value: 'The receiver does not have an account' }
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
      message: paymentMessage
    }
    const paymentCreated = await makeTransaction(transaction);
    // TODO: check if payment success
    // TODO: only for test purposes, remove sensitive data later
    if ((paymentCreated as Transaction).data != null) {
      const result = (paymentCreated as Transaction).data;
      message = [
        { name: 'Sender wallet', value: result.sourceEwalletID },
        { name: 'Receiver wallet', value: result.destinationEwalletID },
        { name: 'Transaction ID', value: result.id },
        { name: 'Ammount', value: result.amount.toString() },
        { name: 'Currency', value: result.currencyCode },
        { name: 'Transaction Status', value: result.status },
      ];
      title = 'Transaction successful!';
      description = `Hey, ${user.username}! The money has been successfully sent to ${receiver.username}!`;
    } else if ((paymentCreated as ErrorResponse).msg != null) {
      message = [
        { name: 'Error', value: (paymentCreated as ErrorResponse).msg }
      ];
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
