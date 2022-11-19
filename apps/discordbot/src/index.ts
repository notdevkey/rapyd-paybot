// Require the necessary discord.js classes
import { Client, Events, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { onInteraction } from './events/onInteraction';
import { onReady } from './events/onReady';

dotenv.config();

(async () => {
  const bot = new Client({ intents: [GatewayIntentBits.Guilds] });

  bot.on(Events.ClientReady, (client) => onReady(client));

  bot.on(Events.InteractionCreate, async (interaction) =>
    onInteraction(interaction)
  );

  await bot.login(process.env.DISCORD_BOT_TOKEN);
})();
