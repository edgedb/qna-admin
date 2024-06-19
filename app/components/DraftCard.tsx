"use client";

import Link from "next/link";
import { ArrowRightIcon } from "../assets/icons";

export default function DraftCard({ draft }: { draft: any }) {
  const { title, question, answer, tags } = draft;

  return (
    <Link
      href={`/drafts/${draft.id}`}
      className="rounded flex pt-2 pb-1 px-3 mb-4 items-center bg-element hover:bg-activeElement transition-colors"
    >
      <div className="w-[1000px] relative">
        <p className="line-clamp-1 text-elipsis">
          <span className="font-medium mr-2 text-title">Title:</span>
          {`${title ?? "-"}`}
        </p>
        <p className="line-clamp-2 text-elipsis mb-0">
          <span className="font-medium mr-2 text-title">Question:</span>
          {question}
        </p>
        <p className="line-clamp-2 text-elipsis mb-0">
          <span className="font-medium mr-2 text-title">Answer:</span>
          {answer || "-"}
        </p>
        <div className="absolute top-1.5 right-4 flex gap-2">
          {tags.map((tag: string) => (
            <span key={`${draft.id}-${tag}`}>#{tag}</span>
          ))}
        </div>
      </div>
      <ArrowRightIcon className="text-text" />

      {/* <div className="flex flex-col gap-2 items-end ml-3">
        <button>
          <DeleteIcon className="text-red-800" />
        </button>
        <button className="bg-accentGreen px-2 rounded">Draft</button>
      </div> */}
    </Link>
  );
}
