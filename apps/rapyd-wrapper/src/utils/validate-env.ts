export function validateEnv() {
  const requiredVars = [
    'DISCORD_BOT_TOKEN',
    'DISCORD_CLIENT_ID',
    'DISCORD_GUILD_ID',
    'ACCESS_KEY',
    'SECRET_KEY',
    'BASE_URI',
  ];

  for (const envVar of requiredVars) {
    if (!envVar) {
      console.warn(`Missing ${envVar} environment variable`);
      return false;
    }
  }
  return true;
}
