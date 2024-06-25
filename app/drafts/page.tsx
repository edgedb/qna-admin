import { getDrafts, getDraftsPages } from "../lib/db/drafts";
import QNACard from "../ui/QNACard";
import Pagination from "../ui/Pagination";
import Search from "../ui/Search";

export default async function Drafts({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await getDraftsPages(query);
  const drafts = await getDrafts(query, currentPage);

  return (
    <div className="pt-10 px-4 flex flex-col gap-6 max-w-[900px] m-auto">
      <div className="w-full m-auto min-h-[calc(100vh-216px)]">
        <Search className="mb-6" placeholder="Search for drafts..." />
        {drafts.map((draft) => (
          <QNACard key={draft.id} qna={draft} baseHref="/drafts" />
        ))}
      </div>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
