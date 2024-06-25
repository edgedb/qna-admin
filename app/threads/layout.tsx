import { getThreads } from "../lib/db/threads";
import Search from "../ui/Search";
import ThreadCard from "../ui/ThreadCard";

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

  return (
    <div className="pt-10 px-4 flex gap-6">
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
