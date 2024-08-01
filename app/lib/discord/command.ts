import {
  APIApplicationCommandInteractionData,
  APIBaseInteraction,
  APIInteractionResponse,
  InteractionType,
  RESTPostAPIApplicationCommandsJSONBody,
} from "discord-api-types/v10";
import type { Bot } from "./bot";
import commands from "./commands";

export interface Command<Interaction = APIApplicationCommandInteractionData> {
  definition: RESTPostAPIApplicationCommandsJSONBody;
  execute: (
    bot: Bot,
    interaction: APIBaseInteraction<InteractionType, Interaction>,
    respond: (value: APIInteractionResponse) => void
  ) => Promise<void>;
}

export async function loadCommands(bot: Bot): Promise<void> {
  for (const command of commands) {
    var cmd = new command();

    console.log(`loaded command ${cmd.definition.name}`);

    bot.commands.set(cmd.definition.name, cmd);
  }
}

export async function loadCommandDefinitions(): Promise<Command[]> {
  const cmds: Command[] = [];

  for (const command of commands) {
    var cmd = new command();

    console.log(`loaded command ${cmd.definition.name}`);

    cmds.push(cmd);
  }

  return cmds;
}
