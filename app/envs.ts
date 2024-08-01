export interface Environment {
  discordClientId: string;
  discordClientPublicKey: string;
  discordToken: string;
  discordGuildId: string;
  authorizedRoleIds: string[];
  reviewChannelId: string;
}

export function getEnvironment(): Environment {
  if (!process.env.DISCORD_CLIENT_ID) {
    throw new Error("DISCORD_CLIENT_ID env var not configured");
  }
  const discordClientId = process.env.DISCORD_CLIENT_ID;
  
  if (!process.env.DISCORD_CLIENT_PUBLIC_KEY) {
    throw new Error("DISCORD_CLIENT_PUBLIC_KEY env var not configured");
  }
  const discordClientPublicKey = process.env.DISCORD_CLIENT_PUBLIC_KEY;
  
  if (!process.env.DISCORD_TOKEN) {
    throw new Error(`DISCORD_TOKEN env var not configured`);
  }
  const discordToken = process.env.DISCORD_TOKEN;
  
  if (!process.env.DISCORD_GUILD_ID) {
    throw new Error("DISCORD_GUILD_ID env var not configured");
  }
  const discordGuildId = process.env.DISCORD_GUILD_ID;
  
  if (!process.env.DISCORD_MODERATION_ACCESS_ROLES) {
    throw new Error("DISCORD_MODERATION_ACCESS_ROLES env var not configured");
  }
  const authorizedRoleIds =
    process.env.DISCORD_MODERATION_ACCESS_ROLES.split(",");
  
  if (!process.env.REVIEW_CHANNEL_ID) {
    throw new Error("REVIEW_CHANNEL_ID env var not configured");
  }
  const reviewChannelId = process.env.REVIEW_CHANNEL_ID;

  return {
    discordClientId,
    discordClientPublicKey,
    discordToken,
    discordGuildId,
    authorizedRoleIds,
    reviewChannelId,
  }
}
