import dotenv from "dotenv";
import { REST } from "@discordjs/rest";
import { loadCommandDefinitions } from "../command";
import { Routes } from "discord-api-types/v10";

dotenv.config();
dotenv.config({ path: ".env.local" });

if (!process.env.DISCORD_TOKEN) {
  console.error("DISCORD_TOKEN environment variable is not set.");
  process.exit(1);
}

var commands = await loadCommandDefinitions();

for (const command of commands) {
  console.log("Loaded command: " + command.definition.name);
}
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

await rest.put(
  Routes.applicationGuildCommands(
    process.env.APPLICATION_ID!,
    process.env.GUILD_ID!
  ),
  {
    body: commands.map((c) => c.definition),
  }
);

console.log("Successfully registered application commands.");
