"use client";

import Link from "next/link";
import { ArrowRightIcon } from "./icons";
import { cn } from "../utils";

export default function QNACard({
  qna,
  baseHref,
}: {
  qna: any;
  baseHref: string;
}) {
  const { title, question, tags } = qna;

  return (
    <Link
      href={`${baseHref}/${qna.id}`}
      className="rounded flex py-3 pl-3 pr-1.5 mb-4 items-center bg-element hover:bg-activeElement transition-colors justify-between"
    >
      <div className="w-fit relative">
        <div
          className={cn(
            "text-xs text-accentOrange flex gap-2",
            tags.length && "mb-1.5"
          )}
        >
          {tags.map((tag: string) => (
            <span key={`${qna.id}-${tag}`}>#{tag}</span>
          ))}
        </div>
        <p className="line-clamp-1 text-elipsis my-0">
          <span className="font-medium mr-2 text-title">Title:</span>
          {`${title ?? "-"}`}
        </p>
        <p className="line-clamp-2 text-elipsis mb-0">
          <span className="font-medium mr-2 text-title">Question:</span>
          {question}
        </p>
      </div>
      <ArrowRightIcon className="text-text ml-2" />
    </Link>
  );
}
