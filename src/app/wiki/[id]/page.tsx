import fs from "fs";
import { join } from "path";

import './styles.css';

interface Params {
    id: string;
}

const WikiIFramePage = async ({ params }: { params: Promise<Params> }) => {
    const { id } = await params;
    const BASE_DATA_DIR = join(process.cwd(), 'tiddlywiki-instances');
    const INSTANCES_FILE = join(BASE_DATA_DIR, 'instances.json');
    const data = JSON.parse(fs.readFileSync(INSTANCES_FILE, 'utf-8') || '[]') as Instances;
    const currentInstance = data.find((instance: Instance) => instance.id === id);

    const renderIframe = (title: string, port: number) => port
        ? <iframe className="wiki-iframe" src={`http://localhost:${port}`} title={title} />
        : null;

    return typeof currentInstance?.port === 'number' && renderIframe(currentInstance.twName, currentInstance.port);
};

export default WikiIFramePage;
