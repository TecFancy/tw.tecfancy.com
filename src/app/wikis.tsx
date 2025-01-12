import Link from "next/link";

import fs from "fs";
import { isAbsolute, join } from "path";
import os from "os";

const Wikis = () => {
    const env = process.env;
    const instancesRoot = env.INSTANCES_ROOT || os.homedir();
    const BASE_DATA_DIR = instancesRoot && isAbsolute(instancesRoot)
        ? join(instancesRoot, '.TiddlyWikis')
        : join(os.homedir(), '.TiddlyWikis');
    if (!fs.existsSync(BASE_DATA_DIR)) return null;

    const INSTANCES_FILE = join(BASE_DATA_DIR, 'instances.json');
    if (!fs.existsSync(INSTANCES_FILE)) return null;

    const data = JSON.parse(fs.readFileSync(INSTANCES_FILE, 'utf-8') || '[]') as Instances;

    return (
        <div>
            <h2>Wikis</h2>
            <ul>
                {data?.map((instance: Instance) => (
                    <li key={instance.id}>
                        <Link target="_blank" href={`/wiki/${instance.id}`}>
                            {instance.twName}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Wikis;
