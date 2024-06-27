import {
  InteractionResponseType,
  InteractionType,
} from "discord-api-types/v10";
import { Bot } from "@/app/lib/discord/bot";
import { discordClientPublicKey, discordToken } from "@/app/envs";
import { NextResponse } from "next/server";
import createClient from "edgedb";
import { verifyInteractionRequest } from "@/app/lib/discord/verify-interaction-request";

const bot = new Bot(createClient(), discordToken);
await bot.initialize();

export async function POST(req: Request) {
  const verifyResult = await verifyInteractionRequest(
    req,
    discordClientPublicKey
  );

  if (!verifyResult.isValid || !verifyResult.interaction) {
    return new NextResponse("Invalid request", { status: 401 });
  }

  const { interaction } = verifyResult;

  if (interaction.type === InteractionType.Ping) {
    // The `PING` message is used during the initial webhook handshake, and is
    // required to configure the webhook in the developer portal.
    return NextResponse.json({ type: InteractionResponseType.Pong });
  }

  try {
    const result = await bot.processInteraction(interaction);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: `An error occurred: ${err.message}`,
        flags: 1 << 6,
      },
    });
  }
}
