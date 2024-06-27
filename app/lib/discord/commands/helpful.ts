import {
  APIBaseInteraction,
  APIChatInputApplicationCommandInteractionData,
  APIInteractionResponse,
  APIThreadChannel,
  ApplicationCommandType,
  ChannelType,
  InteractionResponseType,
  InteractionType,
  MessageFlags,
  RESTPostAPIApplicationCommandsJSONBody,
} from "discord-api-types/v10";
import { Command } from "../command";
import { Bot } from "../bot";
import { isHelpfulThread } from "../queries/isHelpfulThread.query";
import downloadThreadMessages from "../utils/downloadThread";
import { suggestThread } from "../queries/suggestThread.query";
import createReviewCard from "../utils/reviewCard";
import { addReviewCard } from "../queries/addReviewCard.query";

export default class HelpfulCommand
  implements Command<APIChatInputApplicationCommandInteractionData>
{
  definition: RESTPostAPIApplicationCommandsJSONBody = {
    name: "helpful",
    description: "Suggests the current thread as a helpful thread",
    type: ApplicationCommandType.ChatInput,
  };

  async execute(
    bot: Bot,
    interaction: APIBaseInteraction<
      InteractionType,
      APIChatInputApplicationCommandInteractionData
    >,
    respond: (value: APIInteractionResponse) => void
  ): Promise<void> {
    if (!interaction.member) {
      respond({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: "This command must be run in a thread",
          flags: MessageFlags.Ephemeral,
        },
      });
      return;
    }

    // check if we have the channel information
    if (!interaction.channel) {
      respond({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: "This command must be run in a thread",
          flags: MessageFlags.Ephemeral,
        },
      });
      return;
    }

    // check if the channel type is a thread
    if (interaction.channel.type !== ChannelType.PublicThread) {
      respond({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: "This command must be run in a thread",
          flags: MessageFlags.Ephemeral,
        },
      });
      return;
    }

    const threadChannel = interaction.channel as APIThreadChannel;

    // verify the thread is in a valid help channel
    if (
      !threadChannel.parent_id ||
      !bot["help-channels"].has(threadChannel.parent_id)
    ) {
      let ids: string[] = [];
      bot["help-channels"].forEach((val) => ids.push(val));

      respond({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          embeds: [
            bot.errorEmbed(
              `${threadChannel.parent_id}, ${bot["help-channels"].size}, ${ids}}`
            ),
          ],
        },
      });
    }

    respond(bot.defer());

    // has it already been marked as helpful?
    const thread = await isHelpfulThread(bot.edgedb, {
      threadId: threadChannel.id,
    });

    if (thread) {
      await bot.editReply(interaction, {
        embeds: [
          bot.errorEmbed("This thread has already been marked as helpful!"),
        ],
      });
      return;
    }

    const messages = await downloadThreadMessages(bot, threadChannel);

    const refMessage = messages && messages[0].referenced_message;

    if (refMessage) {
      messages[0] = refMessage;
    }

    console.log(JSON.stringify(messages));

    const threadSuggestion = await suggestThread(bot.edgedb, {
      messages: messages,
      suggestorId: interaction.member.user.id,
      suggestorName: interaction.member.user.username,
      threadId: threadChannel.id,
    });

    const reviewCard = await createReviewCard(bot, threadSuggestion);

    await addReviewCard(bot.edgedb, {
      messageId: reviewCard.message.id,
      reviewThreadId: reviewCard.thread.id,
      threadId: threadSuggestion.id,
    });

    await bot.editReply(interaction, {
      content: "Your feedback has been recorded! Thank you!",
    });
  }
}
