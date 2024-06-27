import { getPrompt } from "../lib/db/prompt";
import PromptPanel from "../ui/PromptPanel";

export default async function Prompt() {
  const prompt = await getPrompt();

  return <PromptPanel dbPrompt={prompt} />;
}
