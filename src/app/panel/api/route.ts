import { createInstance } from "@/lib";

export const dynamic = 'force-static';
 
export async function POST(request: Request) {
  const bodyData = await request.json();
  const result = await createInstance(bodyData);
  return Response.json({ data: result });
}
