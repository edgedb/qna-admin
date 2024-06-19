import { redirect } from "next/navigation";
import { deleteDraft, getDrafts } from "../drafts";
import { revalidatePath } from "next/cache";
import { auth } from "@/app/edgedb";

export const dynamic = "force-dynamic";

export const revalidate = 0;

export async function GET() {
  const data = await getDrafts();

  return Response.json(data);
}

export async function DELETE(draftId: string) {
  const session = auth.getSession();
  await deleteDraft(draftId, session.authToken!);
  revalidatePath("/drafts");
  redirect("/drafts");
}
