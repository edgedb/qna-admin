"use server";

import { redirect } from "next/navigation";
import { upsertDraft, deleteDraft as delDraft } from "../api/drafts";
import { deleteThread as delThread } from "../api/threads";
import { auth } from "../edgedb";
import { revalidatePath, revalidateTag } from "next/cache";

// threads
export async function deleteThread(threadId: string) {
  const session = auth.getSession();
  await delThread(threadId, session.authToken!);
  return redirect("/threads");
}

// drafts
export async function createDraft(threadId: string) {
  const session = auth.getSession();

  const { id } = await upsertDraft(threadId, {}, session.authToken!);
  revalidateTag("drafts");
  return redirect(`/drafts/${id}`);
}

export async function deleteDraft(draftId: string) {
  const session = auth.getSession();
  await delDraft(draftId, session.authToken!);
  revalidatePath("/drafts");
  // redirect("/drafts");
}
