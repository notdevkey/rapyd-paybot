import { APIEmbedField, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command } from '../interfaces/Command';

import { EWallet } from '../service/models/wallet';
import { CustomerCreate } from '../service/models/customerCreate';
import { ErrorResponse } from '../service/models/error';

import { createEWallet } from '../service/walletService';

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

    // create account
    const userToCreate: CustomerCreate = {
      ewallet_reference_id: user.tag,
      phone_number: `${countryCode as string}${phone as string}`,
      email: email as string,
      first_name: user.username
    }

    let message: APIEmbedField | APIEmbedField[] = [];
    let title: string = '';
    let description: string = '';
    const walletCreated = await createEWallet(userToCreate);

    // TODO: test code, remove later
    if ((walletCreated as EWallet).data != null) {
      const result = (walletCreated as EWallet).data;
      message = [
        { name: 'Wallet status', value: result.status },
        { name: 'Wallet type', value: result.type },
        { name: 'Wallet reference ID', value: result.ewalletReferenceID },
        { name: 'Name', value: result.contacts.data[0].firstName },
        { name: 'Email', value: result.contacts.data[0].email },
      ];
      title = 'Account Created!';
      description = `Hey, ${user.username}! Welcome to Rapyd Paybot!\nYour data below:`;
    } else if ((walletCreated as ErrorResponse).msg != null) {
      message = [
        { name: 'Error', value: (walletCreated as ErrorResponse).msg }
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
