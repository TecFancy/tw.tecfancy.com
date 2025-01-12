import fs from "fs";
import { spawn } from "child_process";
import { isAbsolute, join } from "path";
import { homedir } from "os";
import waitForPort from "./wait-for-port.mjs";


const env = process.env;
const domain = env.DOMAIN || 'localhost';
const instancesRoot = env.INSTANCES_ROOT || homedir();

const BASE_DATA_DIR = instancesRoot && isAbsolute(instancesRoot)
    ? join(instancesRoot, '.TiddlyWikis')
    : join(homedir(), '.TiddlyWikis');

const INSTANCES_FILE = join(BASE_DATA_DIR, 'instances.json');

const loadInstances = async () => {
    let data = [];
    if (fs.existsSync(INSTANCES_FILE)) {
        data = JSON.parse(fs.readFileSync(INSTANCES_FILE, 'utf-8') || '[]');
        for (const [idx, instance] of data.entries()) {
            const { port, dataDir } = instance;
            if (!fs.existsSync(dataDir)) {
                console.warn(`Data directory not found: ${dataDir}`);
                continue;
            }

            console.log(`(${idx + 1}/${data.length}) Starting TiddlyWiki instances...`);

            // 启动 TW 实例
            const inst = spawn('npx', ['tiddlywiki', dataDir, '--listen', `port=${port}`], {
                cwd: dataDir,
                shell: true,
                stdio: 'inherit',
            });

            // 等待端口开放
            const started = await waitForPort(port, domain, 20, 500);
            if (started) {
                console.log(`(${idx + 1}/${data.length}) TiddlyWiki instance started on port ${port}`);
                instance.pid = inst.pid;
            } else {
                console.error(`Failed to start TiddlyWiki instance on port ${port}`);
            }
        }
    }
    return data;
};

export default loadInstances;
