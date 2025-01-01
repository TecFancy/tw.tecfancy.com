import { createInstance } from "@/lib";

export const dynamic = 'force-static';
 
export async function POST() {
  const result = await createInstance();
  return Response.json({ result });
}
