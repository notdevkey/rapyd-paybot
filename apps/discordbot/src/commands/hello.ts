import { SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces/Command";

export const hello: Command = {
  data: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Hello method for testing if the bot works"),
  async run(interaction) {
    await interaction.reply({ content: "Hello world!" });
  },
};
