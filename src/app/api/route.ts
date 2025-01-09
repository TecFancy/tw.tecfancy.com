import { createInstance, deleteInstance } from "@/lib";

export const dynamic = 'force-static';

export async function POST(request: Request) {
    const bodyData = await request.json();
    const result = await createInstance(bodyData);
    return Response.json({ data: result });
}

export async function DELETE(request: Request) {
    const { id } = await request.json();
    const result = await deleteInstance({ instanceId: id });
    return Response.json({ data: result });
}
