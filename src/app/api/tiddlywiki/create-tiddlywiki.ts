import { isAbsolute, join } from "path";
import { homedir } from "os";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import getPort from "get-port";
import {v4 as uuidv4} from "uuid";
import {spawn} from "child_process";

interface Instance {
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

const getAvailablePort = async (instances: Instance[]) => {
    let port = await getPort();
    while (true) {
        if (!instances.some(instance => instance.port === port)) {
            return port;
        }
        port++;
    }
};

const isProcessRunning = (pid: number) => {
    try {
        // Sending signal 0 to a PID will raise an exception if the process does not exist
        process.kill(pid, 0);
        return true;
    } catch (error: unknown) {
        console.error('check process running error', error);
        return false;
    }
};

const createTiddlywiki = async (params: { title: string }) => {
    const { title } = params;
    const instances = getInstances();

    const id = uuidv4();
    const port = await getAvailablePort(instances);
    const dataDir = join(BASE_DATA_DIR, id);
    const existingInstance = instances.find(inst => inst.dataDir === dataDir);
    if (existingInstance?.pid && isProcessRunning(existingInstance.pid)) {
        throw new Error(`Data directory ${dataDir} already has a running instance.`);
    }

    mkdirSync(dataDir, { recursive: true });

    const createdInst = await new Promise((resolve, reject) => {
        const init = spawn('npx', ['tiddlywiki', dataDir, '--init', 'server'], {
            cwd: dataDir,
            shell: true,
            stdio: 'inherit',
        });

        init.on('close', (code) => {
            if (code === 0) resolve(true);
            else reject(new Error(`TiddlyWiki initialization failed, code ${code}`));
        });
    });

    if (createdInst) {
        instances.push({
            id,
            port,
            dataDir,
            title,
            cmd: 'tiddlywiki',
        });
    }

    writeFileSync(INSTANCES_FILE, JSON.stringify(instances, null, 2), 'utf-8');
};

export default createTiddlywiki;
