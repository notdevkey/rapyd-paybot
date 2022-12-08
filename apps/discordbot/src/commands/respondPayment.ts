import { APIEmbedField, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command } from '../interfaces/Command';
import { PaymentApprove, PaymentCreate, Transaction } from "../service/models/payment";
import PaymentService from '../service/paymentService';

export const respondPayment: Command = {
  data: new SlashCommandBuilder()
    .setName('approve-payment')
    .setDescription('Approve transaction from a user')
    .addStringOption((option) =>
      option
        .setName('payment_id')
        .setDescription('The id of the payment you want to approve')
    ),
  run: async (interaction) => {
    await interaction.deferReply();
    const { user } = interaction;
    const paymentId = interaction.options.get('payment_id')?.value as string;

    const paymentService = new PaymentService();

    let message: APIEmbedField | APIEmbedField[] = [];
    let title: string = '';
    let description: string = '';
    if (!paymentId) {
      // TODO: show no account error
      message = [
        { name: 'Error', value: 'The payment ID is required' }
      ];
      title = 'Approval Failed';
      description = `Hey, ${user.username}! The payment ID is required!`;
      return;
    } 
    // TODO: get user's and receiver's ewallets here
    
    // TODO: make transaction   
    const transaction: PaymentApprove = {
        id: paymentId,
        status: 'accept'
    }
    const paymentApproved = await paymentService.approveTransaction(transaction);
    // TODO: check if payment success
    // TODO: only for test purposes, remove sensitive data later
    if (paymentApproved.data != null) {
      const result = paymentApproved.data;
      message = [
        { name: 'Sender wallet', value: result.source_ewallet_id },
        { name: 'Receiver wallet', value: result.destination_ewallet_id },
        { name: 'Transaction ID', value: result.source_transaction_id },
        { name: 'Ammount', value: result.amount.toString() },
        { name: 'Currency', value: result.currency_code },
        { name: 'Transaction Status', value: result.status },
      ];
      title = 'Transaction approval successful!';
    } else if (paymentApproved.status != null) {
      message = [
        { name: 'Error', value: paymentApproved.status.message }
      ];
      title = 'Approval Failed';
    } else {
      // TODO: introduce proper error handling
      message = [
        { name: 'Error', value: 'unknown error' }
      ];
      title = 'Approval Failed';
    }

    const paymentRequestEmbed = new EmbedBuilder();
    paymentRequestEmbed.setTitle(title);
    paymentRequestEmbed.setDescription(description);
    paymentRequestEmbed.setFields(message);
    
    paymentRequestEmbed.setAuthor({
      name: user.tag,
      iconURL: user.displayAvatarURL(),
    });

    await interaction.editReply({ embeds: [paymentRequestEmbed] });
  },
};
