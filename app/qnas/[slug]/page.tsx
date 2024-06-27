import { getQna } from "@/app/lib/db/qnas";
import { getActiveTags } from "@/app/lib/db/tags";
import QNAPanel from "@/app/ui/QNAPanel";

export default async function QNA({ params }: { params: { slug: string } }) {
  const qna = await getQna(params.slug);
  const tags = await getActiveTags();

  return (
    <div className="pt-10 px-4 max-w-[900px] m-auto">
      {qna ? (
        <QNAPanel qna={qna} tags={tags} />
      ) : (
        <p className="text-center">
          {`There is no QNA with the id ${params.slug}.`}{" "}
        </p>
      )}
    </div>
  );
}
