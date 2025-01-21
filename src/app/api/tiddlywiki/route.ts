import { writeFileSync } from "fs";
import { homedir } from "os";
import { isAbsolute, join } from "path";
import initTiddlywiki from "./init-tiddlywiki";
import startTiddlywiki from "./start-tiddlywiki";
import getTiddlywikiInstances from "./get-tiddlywiki-instances";
import stopTiddlywiki from "@/app/api/tiddlywiki/stop-tiddlywiki";

const env = process.env;
const instancesRoot = env.INSTANCES_ROOT || homedir();
const BASE_DATA_DIR = instancesRoot && isAbsolute(instancesRoot)
    ? join(instancesRoot, '.TiddlyWikis')
    : join(homedir(), '.TiddlyWikis');
const INSTANCES_FILE = join(BASE_DATA_DIR, 'instances.json');

export const dynamic = 'force-static';

export async function POST(request: Request) {

    const bodyData = await request.json();

    const instance = await initTiddlywiki({ title: bodyData.title, subtitle: bodyData?.subtitle });
    await startTiddlywiki();
    const instances = getTiddlywikiInstances();

    writeFileSync(INSTANCES_FILE, JSON.stringify((instances), null, 2), 'utf-8');

    return Response.json({ data: { instance, instances } });
}

export async function DELETE(request: Request) {
    const { id } = await request.json();
    const instances = getTiddlywikiInstances();

    let deletedInstanceTitle = '';
    const updatedInstances = instances.map((inst) => {
        if (inst.id === id) {
            inst.deleted = true;
            deletedInstanceTitle = `TW: ${inst.title}`;
        }
        return inst;
    });
    writeFileSync(INSTANCES_FILE, JSON.stringify(updatedInstances, null, 2), 'utf-8');

    console.log('deleted', deletedInstanceTitle)

    await stopTiddlywiki({ title: deletedInstanceTitle });

    return Response.json({ data: { instances: updatedInstances } });
}
