import Thread from "./Thread";
import ControlPanel from "./ControlPanel";

interface DraftPanelProps {
  draft: any;
  tags: { id: string; name: string }[];
}

export default function DraftPanel({ draft, tags }: DraftPanelProps) {
  const { thread } = draft;
  const tagsOptions = tags.map(({ name }) => name);

  return (
    <div className="flex flex-col pt-4 pb-3">
      <section className="grid grid-cols-main gap-4">
        <Thread title={thread.title} messages={thread.messages} />
        <ControlPanel draft={draft} tagsOptions={tagsOptions} />
      </section>
    </div>
  );
}
