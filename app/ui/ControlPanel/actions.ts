"use server";

import { dbDeleteDraft, dbCreateQNA } from "@/app/lib/db/drafts";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteDraftAction(draftId: string) {
  await dbDeleteDraft(draftId);
  revalidatePath("/drafts");
  redirect("/drafts");
}

export async function publishQNAAction(content: any) {
  const { id } = await dbCreateQNA(content);
  return redirect(`/qnas/${id}`);
}
