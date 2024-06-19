"use client";

import { useRouter } from "next/navigation";
// import { revalidateTag } from "next/cache";
// import { upsertDraft } from "../api/drafts";
import { createDraft, deleteThread } from "./actions";

export default function ThreadControls({
  id,
  token,
}: {
  id: string;
  token: string | null;
}) {
  return (
    <>
      <button
        onClick={() => deleteThread(id)}
        className="absolute top-1.5 right-[9.5rem] text-sm py-1 px-2 bg-accentRed rounded text-black hover:text-black hover:bg-[#c47c75] transition-colors"
      >
        DELETE THREAD
      </button>
      <button
        onClick={() => createDraft(id)}
        className="absolute top-1.5 right-4 text-sm py-1 px-2 bg-accentGreen rounded text-black hover:text-black hover:bg-[#2eaf89] transition-colors"
      >
        CREATE A DRAFT
      </button>
    </>
  );
}
