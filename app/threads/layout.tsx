import { getThreads } from "../api/threads";
import Search from "../components/Search";
import ThreadCard from "../components/ThreadCard";

export const dynamic = "force-dynamic";

export default async function Layout({
  children,
  searchParams,
}: Readonly<{
  children: React.ReactNode;
  searchParams?: {
    query?: string;
    // page?: string;
  };
}>) {
  const query = searchParams?.query || ""; // doesnt work in the layout

  const threads = await getThreads(query);
  console.log("DIDI THREADS", threads.length);
  return (
    <div className="pt-12 px-4 flex gap-6">
      <div className="w-fit">
        <Search className="mb-6" placeholder="Search for threads..." />
        {threads.map((thread) => (
          <ThreadCard key={thread.id} thread={thread} />
        ))}
      </div>
      {children}
    </div>
  );
}
