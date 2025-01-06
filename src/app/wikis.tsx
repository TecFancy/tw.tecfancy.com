import Link from "next/link";

import fs from "fs";
import { join } from "path";

const Wikis = () => {
    const BASE_DATA_DIR = join(process.cwd(), 'tiddlywiki-instances');
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
