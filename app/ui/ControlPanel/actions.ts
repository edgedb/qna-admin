"use server";

import { auth } from "@/app/lib/edgedb";
import {
  deleteDraft as delDraftFromDB,
  upsertDraft as upsertDraftInDB,
  createQNA,
} from "@/app/lib/db/drafts";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteDraft(draftId: string) {
  await delDraftFromDB(draftId);
  revalidatePath("/drafts");
  redirect("/drafts");
}

export async function upsertDraft(threadId: string, content: any) {
  await upsertDraftInDB(threadId, content);
}

export async function publishQNA(content: any) {
  await createQNA(content);
  revalidatePath("/qnas");
  redirect("/qnas");
}
