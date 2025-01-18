import createTiddlywiki from "@/app/api/tiddlywiki/create-tiddlywiki";

export const dynamic = 'force-static';

export async function POST(request: Request) {
    const bodyData = await request.json();

    await createTiddlywiki(bodyData.title);

    return Response.json({ data: bodyData });
}
