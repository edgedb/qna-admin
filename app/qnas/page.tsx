import { getQnas, getQnasPages } from "../lib/db/qnas";
import QNACard from "../ui/QNACard";
import Pagination from "../ui/Pagination";
import Search from "../ui/Search";

export default async function QNAs({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await getQnasPages(query);
  const qnas = await getQnas({ currentPage, query });
  const noItems = !query && !qnas.length;

  return (
    <div className="pt-10 px-4 flex flex-col max-w-[900px] m-auto">
      <div className="w-full m-auto text-text min-h-[calc(100vh-216px)] h-full">
        {noItems ? (
          "There are no any QNAs."
        ) : (
          <>
            <Search className="mb-6" placeholder="Search for qnas..." />
            {qnas.map((qna) => (
              <QNACard key={qna.id} data={qna} baseHref="/qnas" />
            ))}
          </>
        )}
      </div>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
