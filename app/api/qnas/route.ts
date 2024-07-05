import { getQnas } from "@/app/lib/db/qnas";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get("tag") || undefined;
  const query = searchParams.get("query") || undefined;

  const data = await getQnas({ tag, query });
  return Response.json(data);
}
