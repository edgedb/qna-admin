import { APIMessage, APIThreadChannel, Routes } from "discord-api-types/v10";
import { Bot } from "../bot";

const downloadingInProgress = new Set<string>();

const downloadThreadMessages = async (
  bot: Bot,
  thread: APIThreadChannel
): Promise<APIMessage[] | undefined> => {
  if (downloadingInProgress.has(thread.id)) {
    return;
  }

  downloadingInProgress.add(thread.id);

  try {
    const messages: APIMessage[] = [];

    let messagePointer: string | undefined = undefined;

    while (true) {
      const result = (await bot.get(Routes.channelMessages(thread.id), {
        query: new URLSearchParams(
          messagePointer
            ? {
                limit: "100",
                before: messagePointer,
              }
            : { limit: "100" }
        ),
      })) as APIMessage[];

      if (result.length === 0) {
        break;
      }

      messages.push(...result);

      messagePointer = result[result.length - 1].id;

      if (result.length !== 100) {
        break;
      }
    }

    return messages.reverse();
  } finally {
    downloadingInProgress.delete(thread.id);
  }
};

export default downloadThreadMessages;
