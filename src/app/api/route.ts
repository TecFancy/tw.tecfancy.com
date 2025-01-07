import { createInstance, getInstances } from "@/lib";

export const dynamic = 'force-static';

export async function POST(request: Request) {
    const bodyData = await request.json();
    const result = await createInstance(bodyData);
    return Response.json({ data: result });
}

export async function GET() {
    const instances = getInstances();
    return Response.json({ data: instances });
}
