import HelloService from "../service/helloService";
import { SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces/Command";

export const hello: Command = {
  data: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Hello method for testing if the bot works"),
  async run(interaction) {
    await interaction.reply({ content: "Hello world!" });

    const helloService = new HelloService();

    // const result = await retrieveEWallet('ewallet_e0245b1b0cb5df10c16cf71c1ea7cca7');
    const result = await helloService.checkService();
  },
};
