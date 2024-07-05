import { format } from "date-fns";
import { getThread } from "@/app/lib/db/threads";
import Message from "@/app/ui/Message";
import ThreadControls from "@/app/ui/ThreadControls";
import Search from "@/app/ui/Search";
import ThreadCard from "@/app/ui/ThreadCard";
import { getThreads, getThreadsPages } from "@/app/lib/db/threads";
import Pagination from "@/app/ui/Pagination";

export default async function Thread({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await getThreadsPages(query);
  const threads = await getThreads(currentPage, query);
  const noItems = !query && !threads.length;
  const thread = params.slug ? await getThread(params.slug[0]) : undefined;

  return (
    <div className="grid grid-cols-main gap-4 w-full m-auto">
      <div className="w-full m-auto text-text min-h-[calc(100vh-216px)] h-full">
        {noItems ? (
          "There are no any threads."
        ) : (
          <div className="min-h-[calc(100vh-216px)] h-full">
            <Search className="mb-6" placeholder="Search for threads..." />
            {threads.map((thread) => (
              <ThreadCard key={thread.id} thread={thread} page={currentPage} />
            ))}
          </div>
        )}
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
      {thread ? (
        <div className="pt-2 pb-0 px-4 bg-activeElement rounded relative grow max-w-[900px]">
          <div className="flex justify-between mb-2 items-center">
            <span className="text-xs text-[#f5ab56] opacity-60 ml-4">
              {format(thread.messages[0].created_at, "dd-MM-yyyy")}
            </span>
            <ThreadControls id={thread.id} />
          </div>
          {thread.messages.map((msg) => (
            <Message key={msg.id} msg={msg} />
          ))}
        </div>
      ) : params?.slug !== undefined ? (
        <p>{`There is no thread with the id ${params.slug}.`} </p>
      ) : null}
    </div>
  );
}
