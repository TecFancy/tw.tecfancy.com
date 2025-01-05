import {join} from "path";
import fs from "fs";

const Wikis = () => {
    const BASE_DATA_DIR = join(process.cwd(), 'tiddlywiki-instances');
    const INSTANCES_FILE = join(BASE_DATA_DIR, 'instances.json');
    const data = JSON.parse(fs.readFileSync(INSTANCES_FILE, 'utf-8') || '[]');

    return (
        <div>
            <h2>Wikis</h2>
            <ul>
                {data?.map((instance: any) => (
                    <li key={instance.id}>
                        <a target="_blank" href={`/wiki/${instance.id}`}>{instance.id}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Wikis;
