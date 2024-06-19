"use client";

import Link from "next/link";
import { ArrowRightIcon, DeleteIcon } from "../assets/icons";
import { useSelectedLayoutSegment } from "next/navigation";

export default function ThreadCard({ thread }: { thread: any }) {
  const segment = useSelectedLayoutSegment();

  const { title } = thread;

  return (
    <Link
      href={`/threads/${thread.id}`}
      className={`rounded flex pt-2 pb-1 px-3 mb-4 items-center hover:bg-activeElement transition-colors ${
        segment === thread.id ? `bg-activeElement` : "bg-element"
      }`}
    >
      <div className="w-[440px]">
        <h4>
          <span className="font-medium mr-2">Title:</span>
          {title}
        </h4>
        <p className="line-clamp-2 text-elipsis">
          <span className="font-medium mr-2 ">Messages:</span>
          {thread.messages[0].displayed_content}; <br />
          {thread.messages[1].displayed_content}
        </p>
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
