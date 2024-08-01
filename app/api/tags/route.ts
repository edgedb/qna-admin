export const dynamic = "force-dynamic";

import { getActiveTags } from "@/app/lib/db/tags";

export async function GET() {
  const data = await getActiveTags();
  return Response.json(data);
}
