import { getQna } from "@/app/lib/db/qnas";

export async function GET(
  _: Request,
  { params }: { params: { slug: string } }
) {
  const data = await getQna(params.slug);
  return Response.json(data);
}
