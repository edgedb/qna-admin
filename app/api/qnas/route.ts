import { getQnas } from "@/app/lib/db/qnas";

export async function GET() {
  const data = await getQnas(1);
  return Response.json(data);
}
