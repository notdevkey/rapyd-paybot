import { APIEmbedField, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command } from '../interfaces/Command';

import { CustomerCreate, EWallet } from '../service/models/wallet';

import WalletService from '../service/walletService';

export const registerAccount: Command = {
  data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Create your Rapyd Paybot account')
    .addStringOption((option) =>
      option
        .setName('email')
        .setDescription('Your email (to grant access to your account)')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('country_code')
        .setDescription('Your country code (e.g. +1)')
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName('phone')
        .setDescription('Your phone (for Multi-Factor authentication)')
        .setRequired(true)
    ),
    
  run: async (interaction) => {
    await interaction.deferReply();
    const { user } = interaction;
    const email = interaction.options.get('email', true).value;
    const countryCode = interaction.options.get('country_code', true).value;
    const phone = interaction.options.get('phone', true).value;

    // TODO: verify user inputed data
    const walletService = new WalletService();

    // create account
    const userToCreate: CustomerCreate = {
      ds_tag: user.tag,
      phone_number: `${countryCode as string}${phone as string}`,
      email: email as string,
      username: user.username
    }

    let message: APIEmbedField | APIEmbedField[] = [];
    let title: string = '';
    let description: string = '';
    const walletCreated = await walletService.createEWallet(userToCreate);

    // TODO: test code, remove later
    if (walletCreated.data != null) {
      const result = walletCreated.data;
      message = [
        { name: 'Wallet status', value: result.status },
        { name: 'Wallet type', value: result.type },
        { name: 'Wallet reference ID', value: result.ewallet_reference_id },
        { name: 'Name', value: result.contacts.data[0].first_name },
        { name: 'Email', value: result.contacts.data[0].email },
      ];
      title = 'Account Created!';
      description = `Hey, ${user.username}! Welcome to Rapyd Paybot!\nYour data below:`;
    } else {
      message = [
        { name: 'Error', value: walletCreated.status.message }
      ];
      title = 'Failed to Create Account';
      description = `Hey, ${user.username}! Some error occured when creating Rapyd Paybot account!`;
    }

    const accountCreateEmbed = new EmbedBuilder();
    accountCreateEmbed.setTitle(title);
    accountCreateEmbed.setDescription(description);
    accountCreateEmbed.setFields(message);
    
    accountCreateEmbed.setAuthor({
      name: user.tag,
      iconURL: user.displayAvatarURL(),
    });

    await interaction.editReply({ embeds: [accountCreateEmbed] });
  },
};
