import {
  APIApplicationCommandInteractionData,
  APIBaseInteraction,
  APIEmbed,
  APIInteractionResponse,
  InteractionResponseType,
  InteractionType,
  MessageFlags,
  RESTPostAPIWebhookWithTokenJSONBody,
  Routes,
} from "discord-api-types/v10";
import { Command, loadCommands } from "./command";
import { REST, RESTOptions } from "@discordjs/rest";
import { Client, createClient } from "edgedb";
import { InteractionPromise } from "./interactionPromise";
import { getHelpChannels } from "./queries/getHelpChannels.query";
import { getEnvironment } from "../../../envs";

let bot: Bot | null = null;

export async function getBot(): Promise<Bot> {
  if (bot) {
    return bot;
  }

  bot = new Bot(createClient(), getEnvironment().discordToken);
  await bot.initialize();
  return bot;
}

export class Bot extends REST {
  public readonly edgedb: Client;
  public ["help-channels"]: Set<string> = new Set();
  public commands: Map<string, Command> = new Map();

  private token: string;
  private applicationId: string;

  constructor(edgedb: Client, token: string, options?: Partial<RESTOptions>) {
    super(options);

    this.applicationId = getEnvironment().discordClientId;

    this.edgedb = edgedb;
    this.token = token;
    this.setToken(this.token);
  }

  async initialize(): Promise<void> {
    await loadCommands(this);

    this["help-channels"] = new Set(
      (await getHelpChannels(this.edgedb)).map((c) => c.channel_id)
    );
  }

  processInteraction(
    interaction: APIBaseInteraction<InteractionType, any>
  ): InteractionPromise {
    switch (interaction.type) {
      case InteractionType.ApplicationCommand:
        const command = interaction as APIBaseInteraction<
          InteractionType,
          APIApplicationCommandInteractionData
        >;

        if (!command.data) {
          console.error("No command data found");
          return InteractionPromise.resolve(this.errorResponse());
        }

        const handler = this.commands.get(command.data.name);
        //map is empty
        if (!handler) {
          return InteractionPromise.resolve(
            this.errorResponse(
              `No command found with the name \`${command.data.name}\``
            )
          );
        }

        return new InteractionPromise((resolve, reject) => {
          try {
            handler.execute(this, command, resolve).catch((err) => {
              console.error(
                `Error executing command ${command.data!.name}: ${err}`,
                err
              );
            });
          } catch (err: any) {
            reject(err);
          }
        });
      default:
        return InteractionPromise.resolve(
          this.errorResponse("Unhandled or unimplemented action")
        );
    }
  }

  errorResponse(
    msg?: string,
    ephemeral: boolean = true
  ): APIInteractionResponse {
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        embeds: [this.errorEmbed(msg)],
        flags: ephemeral ? MessageFlags.Ephemeral : undefined,
      },
    };
  }

  errorEmbed(msg?: string): APIEmbed {
    return {
      title: "Error",
      description: msg ?? "There was an error executing your request",
      color: 0xff0000,
    };
  }

  defer(ephemeral: boolean = true): APIInteractionResponse {
    return {
      type: InteractionResponseType.DeferredChannelMessageWithSource,
      data: {
        flags: ephemeral ? MessageFlags.Ephemeral : undefined,
      },
    };
  }

  async followup(
    interaction: APIBaseInteraction<InteractionType, any>,
    data: RESTPostAPIWebhookWithTokenJSONBody
  ): Promise<void> {
    await this.post(Routes.webhook(this.applicationId, interaction.token), {
      body: data,
    });
  }

  async editReply(
    interaction: APIBaseInteraction<InteractionType, any>,
    data: RESTPostAPIWebhookWithTokenJSONBody
  ): Promise<void> {
    await this.patch(
      Routes.webhookMessage(this.applicationId, interaction.token, "@original"),
      {
        body: data,
      }
    );
  }
}
