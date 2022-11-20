import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command } from '../interfaces/Command';

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
    const amount = interaction.options.get('amount', true).value;
    const message = interaction.options.get('message')?.value;

    const paymentRequestEmbed = new EmbedBuilder();
    paymentRequestEmbed.setTitle('Payment request');
    if (message) {
      paymentRequestEmbed.setDescription(message.toString());
    }
    if (amount) {
      paymentRequestEmbed.setFields([
        { name: 'Amount', value: amount.toString() },
      ]);
    }
    paymentRequestEmbed.setAuthor({
      name: user.tag,
      iconURL: user.displayAvatarURL(),
    });

    await interaction.editReply({ embeds: [paymentRequestEmbed] });
  },
};
