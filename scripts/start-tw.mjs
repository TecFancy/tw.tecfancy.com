import { existsSync, readFileSync } from "fs";
import { homedir } from "os";
import { isAbsolute, join } from "path";
import startApps from "./start-apps.mjs";

const NODE_ENV = process.env.NODE_ENV;
const NAMESPACE = process.env.NAMESPACE;

const env = process.env;
const instancesRoot = env.INSTANCES_ROOT || homedir();
const BASE_DATA_DIR = instancesRoot && isAbsolute(instancesRoot)
    ? join(instancesRoot, '.TiddlyWikis')
    : join(homedir(), '.TiddlyWikis');
const INSTANCES_FILE = join(BASE_DATA_DIR, 'instances.json');

const getInstances = () => {
    if (!existsSync(BASE_DATA_DIR)) return [];

    if (!existsSync(INSTANCES_FILE)) return [];

    return JSON.parse(readFileSync(INSTANCES_FILE, 'utf-8') || '[]');
};

const instances = getInstances();
const twAppsConfig = instances.filter((inst) => !inst?.deleted).map(({ title, dataDir, port }) => ({
    appName: `TW: ${title}`,
    script: 'npx',
    args: ['tiddlywiki', dataDir, '--listen', `port=${port}`],
    env: {
        PORT: port,
        NODE_ENV,
    },
    namespace: NAMESPACE || 'mws',
}));

if (twAppsConfig.length > 0) {
    startApps(twAppsConfig);
}
