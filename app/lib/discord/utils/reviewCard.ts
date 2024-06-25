import {
  APIEmbed,
  APIMessage,
  APIThreadChannel,
  Routes,
} from "discord-api-types/v10";
import { Bot } from "../bot";
import { SuggestThreadReturns } from "../queries/suggestThread.query";

const createReviewCard = async (
  bot: Bot,
  thread: SuggestThreadReturns
): Promise<{
  message: APIMessage;
  thread: APIThreadChannel;
}> => {
  const suggestor = thread.suggested_by.at(0);

  const embed: APIEmbed = {
    title: "Thread Review",
    description: `A new thread was deemed helpful${
      suggestor && ` by ${suggestor.name} (<@${suggestor.user_id}>)`
    }!`,
    fields: [
      {
        name: "Thread",
        value: `<#${thread.thread_id}>`,
      },
      {
        name: "Moderation link",
        value: `https://qna.edgedb.com/moderation/PLACEHOLDER`,
      },
    ],
    color: 0x0ccb93,
  };

  const message = (await bot.post(
    Routes.channelMessages(process.env.REVIEW_CHANNEL_ID!),
    {
      body: {
        embeds: [embed],
      },
    }
  )) as APIMessage;

  const reviewThread = (await bot.post(
    Routes.threads(process.env.REVIEW_CHANNEL_ID!, message.id),
    {
      body: {
        name: `Thread Review: ${thread.thread_id}`,
      },
    }
  )) as APIThreadChannel;

  return {
    message: message,
    thread: reviewThread,
  };
};

export default createReviewCard;
