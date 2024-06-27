import DraftPanel from "@/app/ui/DraftPanel";
import { getDraft } from "@/app/lib/db/drafts";
import { getActiveTags } from "@/app/lib/db/tags";
import { getPrompt } from "@/app/lib/db/prompt";

export default async function Draft({ params }: { params: { slug: string } }) {
  const draft = await getDraft(params.slug);
  const prompt = await getPrompt();
  const tags = await getActiveTags();

  return draft ? (
    <DraftPanel draft={draft!} tags={tags} prompt={prompt} />
  ) : (
    <p className="text-center mt-10">
      {`There is no draft with the id ${params.slug}.`}{" "}
    </p>
  );
}
