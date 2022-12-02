import { SlashCommandBuilder } from "discord.js";
import { retrieveEWallet } from "../service/walletService";
import { Command } from "../interfaces/Command";
import rapydApi from "../service/rapydApi";

export const hello: Command = {
  data: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Hello method for testing if the bot works"),
  async run(interaction) {
    await interaction.reply({ content: "Hello world!" });

    // const result = await retrieveEWallet('ewallet_e0245b1b0cb5df10c16cf71c1ea7cca7');
    const result = await rapydApi.wallets.details('ewallet_e0245b1b0cb5df10c16cf71c1ea7cca7');
    console.log(result);
  },
};
