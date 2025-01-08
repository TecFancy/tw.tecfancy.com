import fs from "fs";
import { join } from "path";
import GlobalClientLayout from "@/app/layouts/global-client";
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

    console.log('currentInstance', currentInstance);

    const renderIframe = (title: string, id: string, port: number) => port
        ? (
            <GlobalClientLayout id={id}>
                <iframe className="wiki-iframe" src={`http://localhost:${port}`} title={title}/>
            </GlobalClientLayout>
        )
        : null;

    return typeof currentInstance?.port === 'number' && renderIframe(currentInstance.twName, currentInstance.id, currentInstance.port);
};

export default WikiIFramePage;
