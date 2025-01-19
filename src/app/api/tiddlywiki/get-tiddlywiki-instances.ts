import { existsSync, readFileSync } from "fs";
import { homedir } from "os";
import { isAbsolute, join } from "path";

export interface Instance {
    id: string;
    pid?: number;
    port: number;
    dataDir: string;
    title: string;
    cmd: string;
}

const env = process.env;
const instancesRoot = env.INSTANCES_ROOT || homedir();
const BASE_DATA_DIR = instancesRoot && isAbsolute(instancesRoot)
    ? join(instancesRoot, '.TiddlyWikis')
    : join(homedir(), '.TiddlyWikis');
const INSTANCES_FILE = join(BASE_DATA_DIR, 'instances.json');

const getInstances = () => {
    if (!existsSync(BASE_DATA_DIR)) return [];

    if (!existsSync(INSTANCES_FILE)) return [];

    return JSON.parse(readFileSync(INSTANCES_FILE, 'utf-8') || '[]') as Instance[];
};

export default getInstances;
