import {
  InteractionResponseType,
  InteractionType,
} from "discord-api-types/v10";
import { Bot } from "@/app/lib/discord/bot";
import { getEnvironment } from "../../../envs";
import createClient from "edgedb";
import { verifyInteractionRequest } from "@/app/lib/discord/verify-interaction-request";

const bot = new Bot(createClient(), getEnvironment().discordToken);
await bot.initialize();

export async function POST(req: Request) {
  const verifyResult = await verifyInteractionRequest(
    req,
    getEnvironment().discordClientPublicKey
  );

  if (!verifyResult.isValid || !verifyResult.interaction) {
    return new Response("Invalid request", { status: 401 });
  }

  const { interaction } = verifyResult;

  if (interaction.type === InteractionType.Ping) {
    // The `PING` message is used during the initial webhook handshake, and is
    // required to configure the webhook in the developer portal.
    return Response.json({ type: InteractionResponseType.Pong });
  }

  try {
    const result = await bot.processInteraction(interaction);

    return Response.json(result);
  } catch (err: any) {
    return Response.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: `An error occurred: ${err.message}`,
        flags: 1 << 6,
      },
    });
  }
}
