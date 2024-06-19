import { getDrafts } from "../api/drafts";
import DraftCard from "../components/DraftCard";
import Search from "../components/Search";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Drafts({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";

  // const drafts = await getDrafts(query);
  const res = await fetch("http://localhost:3000/api/drafts");

  const drafts = await res.json();

  return (
    <div className="pt-12 px-4 flex gap-6">
      <div className="w-fit">
        <Search className="mb-6" placeholder="Search for drafts..." />
        {drafts.map((draft) => (
          <DraftCard key={draft.id} draft={draft} />
        ))}
      </div>
    </div>
  );
}
