"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { dbUpsertDraft } from "@/app/lib/db/drafts";
import { dbDeleteThread } from "@/app/lib/db/threads";

export async function createDraftAction(threadId: string) {
  const { id } = await dbUpsertDraft(threadId, {});
  return redirect(`/drafts/${id}`);
}

export async function deleteThreadAction(threadId: string) {
  await dbDeleteThread(threadId);
  revalidatePath("/threads");
  return redirect(`/threads`);
}
