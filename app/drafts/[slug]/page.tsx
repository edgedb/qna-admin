import DraftPanel from "@/app/ui/DraftPanel";
import { getDraft } from "@/app/lib/db/drafts";
import { getTags } from "@/app/lib/db/tags";

export default async function Draft({ params }: { params: { slug: string } }) {
  const draft = await getDraft(params.slug);
  const tags = await getTags();

  return draft ? <DraftPanel draft={draft} tags={tags} /> : null;
}
