import { getQnas, getQnasPages } from "@/app/lib/db/qnas";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const currentPage = Number(searchParams.get("page")) || 1;
  const tag = searchParams.get("tag") || undefined;
  const query = searchParams.get("query") || undefined;
  const data = await getQnas({ currentPage, tag, query });

  if (currentPage === 1) {
    const pages = await getQnasPages({ tag, query });
    return Response.json({ data, totalPages: pages });
  }

  return Response.json({ data });
}
