import dotenv from "dotenv";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";

dotenv.config();
dotenv.config({ path: ".env.local" });

if (!process.env.DISCORD_TOKEN) {
  console.error("DISCORD_TOKEN environment variable is not set.");
  process.exit(1);
}

if (!process.env.APPLICATION_ID) {
  console.error("APPLICATION_ID environment variable is not set.");
  process.exit(1);
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

// for guild-based commands
// rest
//   .delete(
//     Routes.applicationGuildCommand(
//       process.env.APPLICATION_ID!,
//       process.env.DISCORD_GUILD_ID!,
//       "commandId"
//     )
//   )
//   .then(() => console.log("Successfully deleted guild command"))
//   .catch(console.error);

// for global commands
rest
  .delete(Routes.applicationCommand(process.env.APPLICATION_ID, "commandId"))
  .then(() => console.log("Successfully deleted global command"))
  .catch(console.error);
