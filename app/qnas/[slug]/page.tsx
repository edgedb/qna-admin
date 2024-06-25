import { getQNA } from "@/app/lib/db/qnas";
import { getTags } from "@/app/lib/db/tags";
import QNAPanel from "@/app/ui/QNAPanel";

export default async function QNA({ params }: { params: { slug: string } }) {
  const qna = await getQNA(params.slug);
  const tags = await getTags();

  return (
    <div className="pt-10 px-4 max-w-[900px] m-auto">
      {qna ? <QNAPanel qna={qna} tags={tags} /> : null}
    </div>
  );
}
