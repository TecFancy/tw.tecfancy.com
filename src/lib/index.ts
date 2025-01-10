import { join } from "path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { spawn } from "child_process";

import dayjs from "dayjs";
import getPort from "get-port";
import { v4 as uuidv4 } from "uuid";

const instances = new Map();
const BASE_DATA_DIR = join(process.cwd(), 'tiddlywiki-instances');
const INSTANCES_FILE = join(BASE_DATA_DIR, 'instances.json');

const getAvailablePort = async () => {
    let port = await getPort();
    while (true) {
        if (!Array.from(instances.values()).some(instance => instance.port === port)) {
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

const generateTiddlyWikiTimestamp = () => {
    return dayjs().format('YYYYMMDDHHmmssSSS');
};

const updateInstanceTitle = (params: { dataDir: string; twName: string; }) => {
    const siteTitleTid = [
        `created: ${generateTiddlyWikiTimestamp()}`,
        `modified: ${generateTiddlyWikiTimestamp()}`,
        'title: $:/SiteTitle',
        'type: text/vnd.tiddlywiki',
        '',
        params.twName,
    ].join('\n');
    const filePath = join(params.dataDir, 'tiddlers', '$__SiteTitle.tid');
    writeFileSync(filePath, siteTitleTid, 'utf-8');
};

const updateInstanceSubTitle = (params: { dataDir: string; twSubtitle: string; }) => {
    const siteSubtitleTid = [
        `created: ${generateTiddlyWikiTimestamp()}`,
        `modified: ${generateTiddlyWikiTimestamp()}`,
        'title: $:/SiteSubtitle',
        'type: text/vnd.tiddlywiki',
        '',
        params.twSubtitle || 'a non-linear personal web notebook',
    ].join('\n');
    const filePath = join(params.dataDir, 'tiddlers', '$__SiteSubtitle.tid');
    writeFileSync(filePath, siteSubtitleTid, 'utf-8');
};

const saveInstances = () => {
    const data = Array.from(instances.values()).map(({ id, pid, port, dataDir, twName }) => ({
        id,
        pid,
        port,
        dataDir,
        twName,
    }));
    writeFileSync(INSTANCES_FILE, JSON.stringify(data, null, 2), 'utf-8');
};

export const getInstances = () => {
    const BASE_DATA_DIR = join(process.cwd(), 'tiddlywiki-instances');
    if (!existsSync(BASE_DATA_DIR)) return [];

    const INSTANCES_FILE = join(BASE_DATA_DIR, 'instances.json');
    if (!existsSync(INSTANCES_FILE)) return [];

    return JSON.parse(readFileSync(INSTANCES_FILE, 'utf-8') || '[]') as Instances;
};

export const createInstance = async (params: { twName: string, twSubtitle: string }) => {
    const id = uuidv4();
    const port = await getAvailablePort();
    const dataDir = join(BASE_DATA_DIR, id);

    // 检查是否已有相同 dataDir 的实例在运行
    const existingInstance = Array.from(instances.values()).find(inst => inst.dataDir === dataDir);
    if (existingInstance && isProcessRunning(existingInstance.pid)) {
        throw new Error(`Data directory ${dataDir} already has a running instance.`);
    }

    mkdirSync(dataDir, { recursive: true });

    // 初始化 TiddlyWiki 数据目录
    await new Promise((resolve, reject) => {
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

    // 启动 TiddlyWiki 服务器
    const server = spawn('npx', ['tiddlywiki', dataDir, '--listen', `port=${port}`], {
        cwd: dataDir,
        shell: true,
        stdio: 'inherit',
    });
    const pid = server.pid;

    const instance = {
        id,
        pid,
        port,
        dataDir,
        twName: params.twName,
        process: server,
        url: `http://localhost:${port}`,
    };

    // Update the instance title and subtitle
    updateInstanceTitle({ dataDir, twName: params.twName });
    updateInstanceSubTitle({ dataDir, twSubtitle: params.twSubtitle });

    // If there are no instances in memory, load them from disk
    const instancesData = getInstances();
    if (instances.size === 0 && instancesData.length > 0) {
        instancesData.forEach(({ id, pid, port, dataDir, twName }) => {
            instances.set(id, { id, pid, port, dataDir, twName });
        });
    }

    // Add the new instance to the in-memory list
    instances.set(id, instance);

    saveInstances();

    return { instance, instances: Array.from(instances.values()) };
};

/**
 * Delete an instance by ID
 */
export const deleteInstance = async (params: { instanceId: string }) => {
    const instancesFileData = getInstances();
    const instance = instancesFileData?.find(inst => inst.id === params.instanceId);

    if (!instance) {
        throw new Error(`Instance ${params.instanceId} not found.`);
    }

    if (isProcessRunning(Number(instance.pid))) {
        process.kill(Number(instance.pid));
    }

    const filteredInstances = instancesFileData.filter(inst => inst.id !== params.instanceId);
    instances.delete(params.instanceId);
    writeFileSync(INSTANCES_FILE, JSON.stringify(filteredInstances, null, 2), 'utf-8');

    // TODO: Move the instance data directory to the trash

    return filteredInstances;
};

(async () => {
    const instancesData = getInstances();
    instancesData.forEach(({ id, pid, port, dataDir, twName }) => {
        instances.set(id, { id, pid, port, dataDir, twName });
    });
})();
