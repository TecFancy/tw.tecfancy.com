import { isAbsolute, join } from "path";
import { homedir } from "os";
import { mkdirSync, writeFileSync } from "fs";
import { spawn } from "child_process";
import { v4 as uuidv4 } from "uuid";
import getPort from "get-port";
import getInstances, { Instance } from "./get-tiddlywiki-instances";

const env = process.env;
const instancesRoot = env.INSTANCES_ROOT || homedir();
const BASE_DATA_DIR = instancesRoot && isAbsolute(instancesRoot)
    ? join(instancesRoot, '.TiddlyWikis')
    : join(homedir(), '.TiddlyWikis');
const INSTANCES_FILE = join(BASE_DATA_DIR, 'instances.json');

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

const initTiddlywiki = async (params: { title: string }) => {
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

    const instance = {
        id,
        port,
        dataDir,
        title,
        cmd: 'tiddlywiki',
    };

    if (createdInst) instances.push(instance);

    writeFileSync(INSTANCES_FILE, JSON.stringify(instances, null, 2), 'utf-8');

    return instance;
};

export default initTiddlywiki;
