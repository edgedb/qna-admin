"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRightIcon } from "./icons";
import { ThreadEssential } from "../lib/db/threads";

export default function ThreadCard({
  thread,
  page,
}: {
  thread: ThreadEssential;
  page?: number;
}) {
  const pathname = usePathname();
  const segment = pathname.split("/").pop();
  const pageParam = page ? `?page=${page}` : "";
  const { id, messages } = thread;

  return (
    <Link
      href={`/threads/${id}${pageParam}`}
      className={`rounded flex py-3 pl-3 pr-1.5 mb-4 items-center hover:bg-activeElement transition-colors ${
        segment === id ? `bg-activeElement` : "bg-element"
      }`}
    >
      <div className="grow">
        <p className="line-clamp-2 text-elipsis m-0">
          {messages[0].content || messages[1].content || ""}
        </p>
      </div>
      <ArrowRightIcon className="text-text shrink-0" />
    </Link>
  );
}
