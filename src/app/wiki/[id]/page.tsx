import fs from "fs";
import { join } from "path";

const WikiIFramePage = async ({ params }: any) => {
    const { id } = await params;
    const BASE_DATA_DIR = join(process.cwd(), 'tiddlywiki-instances');
    const INSTANCES_FILE = join(BASE_DATA_DIR, 'instances.json');
    const data = JSON.parse(fs.readFileSync(INSTANCES_FILE, 'utf-8') || '[]');
    const currentInstance = data.find((instance: any) => instance.id === id);

    return (
        <div>
            <iframe src={`http://localhost:${currentInstance.port}`} />
        </div>
    );
};

export default WikiIFramePage;
