import { DraftT } from "../lib/db/drafts";
import { Prompt } from "../lib/db/prompt";
import { defaultPrompt } from "../lib/utils";
import ControlPanel from "./ControlPanel";
import Message from "./Message";

interface DraftPanelProps {
  draft: NonNullable<DraftT>;
  prompt: Prompt | null;
  tags: { name: string }[];
}

export default function DraftPanel({ draft, tags, prompt }: DraftPanelProps) {
  const { thread } = draft!;
  const tagsOptions = tags.map(({ name }) => name);

  return (
    <div className="flex flex-col pt-4 pb-3 m-auto max-w-[1666px]">
      <section className="grid grid-cols-main gap-4">
        <div className="mt-7">
          {thread.messages.map((msg) => (
            <Message key={msg.id} msg={msg} editable={true} />
          ))}
        </div>
        <ControlPanel
          draft={draft!}
          tagsOptions={tagsOptions}
          defaultPrompt={prompt?.content || defaultPrompt}
        />
      </section>
    </div>
  );
}
