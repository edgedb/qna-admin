"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import { ArrowRightIcon } from "./icons";

export default function ThreadCard({ thread }: { thread: any }) {
  const segment = useSelectedLayoutSegment();

  const { id, title, messages } = thread;

  return (
    <Link
      href={`/threads/${id}`}
      className={`rounded flex py-2 pl-2.5 pr-1.5 mb-4 items-center hover:bg-activeElement transition-colors ${
        segment === id ? `bg-activeElement` : "bg-element"
      }`}
    >
      <div className="w-[440px]">
        <h4 className="capitalize mb-1">{title}</h4>
        <p className="line-clamp-2 text-elipsis m-0">{messages[0].content}</p>
      </div>
      <ArrowRightIcon className="text-text" />
    </Link>
  );
}
