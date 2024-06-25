import { codeBlock, oneLine } from "common-tags";
import { getThread } from "@/app/lib/db/threads";
import { getTags } from "@/app/lib/db/tags";

const openAiKey = process.env.OPENAI_KEY;

export async function POST(req: Request) {
  try {
    if (!openAiKey) throw new Error("Missing environment variable OPENAI_KEY");

    const requestData = await req.json();

    if (!requestData) throw new Error("Missing request data");

    const { id, uiPrompt } = requestData;

    const messages = (await getThread(id))?.messages.map((msg) => msg.content);

    const msgStr = messages?.join("\n\n");

    const tags = (await getTags()).map((tag) => tag.name);

    // Moderate the content to comply with OpenAI T&C
    const sanitizedUiPrompt = uiPrompt.trim();

    const prompt = codeBlock`
      ${oneLine`${sanitizedUiPrompt}`}

      Conversation: """
      ${msgStr}
      """

      Available tags: """
      ${tags}
      """
      `;

    const completionOptions = {
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
      temperature: 0.1,
      stream: true,
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(completionOptions),
    });

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
      },
    });
  } catch (error: any) {
    console.error(error);

    return new Response(error.message, {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
