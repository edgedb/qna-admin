import { getDraft } from "@/app/api/drafts";
import DraftPanel from "@/app/components/DraftPanel";

export default async function Draft({ params }: { params: { slug: string } }) {
  const draft = await getDraft(params.slug);

  return draft ? <DraftPanel draft={draft} /> : null;
}
