import { getQnas } from "../qnas";

export async function GET() {
  const data = await getQnas();

  return Response.json(data);
}
