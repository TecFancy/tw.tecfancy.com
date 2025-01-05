import fs from "fs";
import { join } from "path";

import './styles.css';

interface Params {
    id: string;
}

const WikiIFramePage = ({ params }: { params: Params }) => {
    const { id } = params;
    const BASE_DATA_DIR = join(process.cwd(), 'tiddlywiki-instances');
    const INSTANCES_FILE = join(BASE_DATA_DIR, 'instances.json');
    const data = JSON.parse(fs.readFileSync(INSTANCES_FILE, 'utf-8') || '[]') as Instances;
    const currentInstance = data.find((instance: Instance) => instance.id === id);

    const renderIframe = (port: number) => port
        ? <iframe className="wiki-iframe" src={`http://localhost:${port}`}/>
        : null;

    return (
        <div className="wiki-container">
            {typeof currentInstance?.port === 'number' && renderIframe(currentInstance.port)}
        </div>
    );
};

export default WikiIFramePage;
