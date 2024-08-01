import createClient from "edgedb";

import { Bot } from "./bot";
import { getEnvironment } from "../../../envs";

let bot: Bot | null = null;

export async function getBot() {
  if (bot) {
    return bot;
  }

  bot = new Bot(createClient(), getEnvironment().discordToken);
  await bot.initialize();
}
