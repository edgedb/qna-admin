import {
  APIEmbed,
  APIMessage,
  APIThreadChannel,
  Routes,
} from "discord-api-types/v10";
import type { Bot } from "../bot";
import { SuggestThreadReturns } from "../queries/suggestThread.query";
import { getEnvironment } from "../../../../envs";

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
        value: `${process.env.BASE_URL}/threads/${thread.id}`,
      },
    ],
    color: 0x0ccb93,
  };

  const reviewChannelId = getEnvironment().reviewChannelId;

  const message = (await bot.post(Routes.channelMessages(reviewChannelId), {
    body: {
      embeds: [embed],
    },
  })) as APIMessage;

  const reviewThread = (await bot.post(
    Routes.threads(reviewChannelId, message.id),
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
