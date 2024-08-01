// import dotenv from "dotenv";
// import { REST } from "@discordjs/rest";
// import { Routes } from "discord-api-types/v10";

// dotenv.config();
// dotenv.config({ path: ".env.prod" });

// if (!process.env.DISCORD_TOKEN) {
//   console.error("DISCORD_TOKEN environment variable is not set.");
//   process.exit(1);
// }

// if (!process.env.DISCORD_CLIENT_ID) {
//   console.error("DISCORD_CLIENT_ID environment variable is not set.");
//   process.exit(1);
// }

// const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

// // for guild-based commands
// // rest
// //   .delete(
// //     Routes.applicationGuildCommand(
// //       process.env.DISCORD_CLIENT_ID!,
// //       process.env.DISCORD_GUILD_ID!,
// //       "1157365753314553900"
// //     )
// //   )
// //   .then(() => console.log("Successfully deleted guild command"))
// //   .catch(console.error);

// // for global commands
// rest
//   .delete(Routes.applicationCommand(process.env.DISCORD_CLIENT_ID, "commandId"))
//   .then(() => console.log("Successfully deleted global command"))
//   .catch(console.error);
