"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { upsertDraft } from "@/app/lib/db/drafts";
import { deleteThread as deleteThreadInDB } from "@/app/lib/db/threads";

export async function createDraft(threadId: string) {
  const { id } = await upsertDraft(threadId, {});
  return redirect(`/drafts/${id}`);
}

export async function deleteThread(threadId: string) {
  await deleteThreadInDB(threadId);
  revalidatePath("/threads");
  return redirect(`/threads`);
}
