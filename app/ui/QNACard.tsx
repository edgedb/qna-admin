"use client";

import Link from "next/link";
import { ArrowRightIcon } from "./icons";
import { cn } from "./utils";
import type { DraftEssential } from "../lib/db/drafts";

export default function QNACard({
  data,
  baseHref,
}: {
  data: DraftEssential;
  baseHref: string;
}) {
  const { id, title, question, linkedTags } = data;

  return (
    <Link
      href={`${baseHref}/${id}`}
      className="rounded flex py-3 pl-3 pr-1.5 mb-4 items-center bg-element hover:bg-activeElement transition-colors justify-between"
    >
      <div className="w-fit relative">
        <div
          className={cn(
            "text-xs flex gap-2",
            linkedTags.length ? "mb-1.5" : ""
          )}
        >
          {linkedTags.map(({ name, disabled }) => (
            <span
              key={`${id}-${name}`}
              className={`${
                disabled ? "text-placeholder" : "text-accentGreen"
              }`}
            >
              #{name}
            </span>
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
