import { writeFileSync } from "fs";
import { homedir } from "os";
import { isAbsolute, join } from "path";
import initTiddlywiki from "./init-tiddlywiki";
import startTiddlywiki from "./start-tiddlywiki";
import getTiddlywikiInstances from "./get-tiddlywiki-instances";

export const dynamic = 'force-static';

export async function POST(request: Request) {
    const env = process.env;
    const instancesRoot = env.INSTANCES_ROOT || homedir();
    const BASE_DATA_DIR = instancesRoot && isAbsolute(instancesRoot)
        ? join(instancesRoot, '.TiddlyWikis')
        : join(homedir(), '.TiddlyWikis');
    const INSTANCES_FILE = join(BASE_DATA_DIR, 'instances.json');

    const bodyData = await request.json();

    const instance = await startTiddlywiki(await initTiddlywiki(bodyData.title));
    const instances = getTiddlywikiInstances();


    if (instance) {
        const result = instances.map(inst => {
            if (inst.id === instance.id) {
                inst.pid = instance.pid
            }
            return inst;
        });

        writeFileSync(INSTANCES_FILE, JSON.stringify((result), null, 2), 'utf-8');

        return Response.json({ data: result });
    } else {
        return Response.json({ data: [] });
    }
}
