import { getThread } from "@/app/api/threads";
import Message from "@/app/components/Message";
import ThreadControls from "@/app/components/ThreadControls";
import { format } from "date-fns";
import { auth } from "../../edgedb";

export default async function Thread({ params }: { params: { slug: string } }) {
  const thread = await getThread(params.slug);

  const session = auth.getSession();

  return thread ? (
    <div className="pt-2 pb-0 px-4 bg-activeElement rounded relative grow mb-4 max-w-[calc(100vw-592px)]">
      <div className="flex flex-grow justify-between pr-[266px]">
        <h3 className="mb-1.5">{thread.title}</h3>
        <span className="text-xs mt-0.5 text-[#f5ab56] opacity-60 pt-[3px]">
          {format(thread.messages[0].created_at, "dd-MM-yyyy")}
        </span>
      </div>
      <ThreadControls id={thread.id} token={session.authToken} />
      {thread.messages.map((msg) => (
        <Message key={msg.id} msg={msg} />
      ))}
    </div>
  ) : null;
}
