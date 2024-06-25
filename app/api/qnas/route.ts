import { getQnas } from "../db/qnas";

export async function GET() {
  const data = await getQnas();

  return Response.json(data);
}
