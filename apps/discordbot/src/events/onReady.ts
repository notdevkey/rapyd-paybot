import { ActivityType, Client, REST, Routes } from "discord.js";
import { CommandList } from "../commands";

export const onReady = async (bot: Client) => {
  const rest = new REST({ version: "9" }).setToken(
    process.env.DISCORD_BOT_TOKEN as string
  );

  const commandData = CommandList.map((command) => command.data.toJSON());

  await rest.put(
    Routes.applicationGuildCommands(
      bot.user?.id || "missing id",
      process.env.DISCORD_GUILD_ID as string
    ),
    { body: commandData }
  );

  bot.user?.setActivity("your balls", { type: ActivityType.Watching });
  console.log("Discord ready!");
};
