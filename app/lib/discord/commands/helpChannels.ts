import {
  APIBaseInteraction,
  InteractionType,
  RESTPostAPIApplicationCommandsJSONBody,
  PermissionFlagsBits,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  APIInteractionResponse,
  APIChatInputApplicationCommandInteractionData,
  Routes,
  APIApplicationCommandInteractionDataSubcommandOption,
  APIApplicationCommandInteractionDataChannelOption,
  APIChannel,
  MessageFlags,
  InteractionResponseType,
} from "discord-api-types/v10";
import type { Bot } from "../bot";
import { Command } from "../command";
import { addHelpChannel } from "../queries/addHelpChannel.query";
import { removeHelpChannel } from "../queries/removeHelpChannel.query";

export default class HelpChannelCommands
  implements Command<APIChatInputApplicationCommandInteractionData>
{
  definition: RESTPostAPIApplicationCommandsJSONBody = {
    name: "help-channels",
    description: "Configures which channels are help channels",
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
    type: ApplicationCommandType.ChatInput,
    options: [
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: "list",
        description: "Lists the configured help channels",
      },
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: "add",
        description: "Adds a channel as a help channel",
        options: [
          {
            type: ApplicationCommandOptionType.Channel,
            name: "channel",
            description: "The channel to add",
            required: true,
          },
        ],
      },
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: "remove",
        description: "Removes a channel from the help channels",
        options: [
          {
            type: ApplicationCommandOptionType.Channel,
            name: "channel",
            description: "The channel to remove",
            required: true,
          },
        ],
      },
    ],
  };

  private async resolveChannel(
    bot: Bot,
    interaction: APIBaseInteraction<
      InteractionType,
      APIChatInputApplicationCommandInteractionData
    >,
    subCommand: APIApplicationCommandInteractionDataSubcommandOption
  ): Promise<APIChannel> {
    // check the resolved data in the interaction
    if (interaction.data?.resolved?.channels) {
      const entries = Object.entries(interaction.data.resolved.channels);

      if (entries.length === 1) {
        return entries[0][1] as APIChannel;
      }
    }

    const channelOption = subCommand.options?.at(
      0
    ) as APIApplicationCommandInteractionDataChannelOption;

    if (!channelOption) {
      throw new Error("No channel specified");
    }

    return (await bot.get(Routes.channel(channelOption.value))) as APIChannel;
  }

  async execute(
    bot: Bot,
    interaction: APIBaseInteraction<
      InteractionType,
      APIChatInputApplicationCommandInteractionData
    >,
    respond: (value: APIInteractionResponse) => void
  ): Promise<void> {
    if (!interaction.data) {
      respond(bot.errorResponse());
      return;
    }

    // check the subcommand
    const subCommand = interaction.data.options?.at(
      0
    ) as APIApplicationCommandInteractionDataSubcommandOption;

    if (!subCommand) {
      respond(bot.errorResponse("Missing command option"));
      return;
    }

    switch (subCommand.name) {
      case "list":
        respond({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            flags: MessageFlags.Ephemeral,
            embeds: [
              {
                color: 0x0ccb93,
                title: "Help Channels",
                description:
                  bot["help-channels"].size === 0
                    ? "There are currently no active help channels"
                    : `Heres a list of the current help channels:\n${[
                        ...bot["help-channels"],
                      ]
                        .map((x) => `- <#${x}>`)
                        .join("\n")}`,
              },
            ],
          },
        });
        break;
      case "add": {
        const channel = await this.resolveChannel(bot, interaction, subCommand);

        if (bot["help-channels"].has(channel.id)) {
          respond({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
              flags: MessageFlags.Ephemeral,
              content: `The channel <#${channel.id}> is already marked as a help channel!`,
            },
          });
          return;
        }

        respond(bot.defer());

        await addHelpChannel(bot.edgedb, {
          channelId: channel.id,
          channelName: channel.name!,
        });

        bot["help-channels"].add(channel.id);

        await bot.editReply(interaction, {
          content: `The channel <#${channel.id}> has been added!`,
        });
        break;
      }
      case "remove": {
        const channel = await this.resolveChannel(bot, interaction, subCommand);

        if (!bot["help-channels"].has(channel.id)) {
          respond({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
              flags: MessageFlags.Ephemeral,
              content: `The channel <#${channel.id}> is not marked as a help channel!`,
            },
          });
          return;
        }

        respond(bot.defer());

        await removeHelpChannel(bot.edgedb, {
          channelId: channel.id,
        });

        bot["help-channels"].delete(channel.id);

        await bot.editReply(interaction, {
          content: `The channel <#${channel.id}> has been removed!`,
        });
        break;
      }
    }
  }
}
