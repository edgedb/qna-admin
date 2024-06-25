import { getThread } from "@/app//threads";
import Message from "@/app/ui/Message";
import ThreadControls from "@/app/ui/Thread/ThreadControls";
import { format } from "date-fns";

export default async function Thread({ params }: { params: { slug: string } }) {
  const thread = await getThread(params.slug);

  return thread ? (
    <div className="pt-2 pb-0 px-4 bg-activeElement rounded relative grow mb-4 max-w-[calc(100vw-592px)]">
      <div className="flex justify-between mb-2 items-center">
        <span className="text-xs text-[#f5ab56] opacity-60 ml-3">
          {format(thread.messages[0].created_at, "dd-MM-yyyy")}
        </span>
        <ThreadControls id={thread.id} />
      </div>
      {thread.messages.map((msg) => (
        <Message key={msg.id} msg={msg} />
      ))}
    </div>
  ) : null;
}
