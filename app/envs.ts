if (!process.env.APPLICATION_ID) {
  throw new Error("APPLICATION_ID env var not configured");
}
export const applicationId = process.env.APPLICATION_ID;

if (!process.env.DISCORD_CLIENT_PUBLIC_KEY) {
  throw new Error("DISCORD_CLIENT_PUBLIC_KEY env var not configured");
}
export const discordClientPublicKey = process.env.DISCORD_CLIENT_PUBLIC_KEY;

if (!process.env.DISCORD_TOKEN) {
  throw new Error(`DISCORD_TOKEN env var not configured`);
}
export const discordToken = process.env.DISCORD_TOKEN;

if (!process.env.DISCORD_GUILD_ID) {
  throw new Error("DISCORD_GUILD_ID env var not configured");
}
export const discordGuildId = process.env.DISCORD_GUILD_ID;

if (!process.env.DISCORD_MODERATION_ACCESS_ROLES) {
  throw new Error("DISCORD_MODERATION_ACCESS_ROLES env var not configured");
}
export const authorizedRoleIds =
  process.env.DISCORD_MODERATION_ACCESS_ROLES.split(",");

if (!process.env.REVIEW_CHANNEL_ID) {
  throw new Error("REVIEW_CHANNEL_ID env var not configured");
}
export const reviewChannelId = process.env.REVIEW_CHANNEL_ID;
