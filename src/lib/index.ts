import { join } from "path";
import {mkdirSync, readFileSync, rmSync, writeFileSync} from "fs";
import { spawn } from "child_process";

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
        process.kill(pid, 0); // 发送信号 0 不会实际终止进程
        return true;
    } catch (error: unknown) {
        console.error('check process running error', error);
        return false;
    }
};

const saveInstances = () => {
    const data = Array.from(instances.values()).map(({ id, pid, port, dataDir }) => ({
        id,
        pid,
        port,
        dataDir,
    }));
    console.log('saveInstances', data, INSTANCES_FILE);
    writeFileSync(INSTANCES_FILE, JSON.stringify(data, null, 2), 'utf-8');
};

export const createInstance = async () => {
    const id = uuidv4();
    const port = await getAvailablePort();
    const dataDir = join(BASE_DATA_DIR, id);
    const instanceFileData = JSON.parse(readFileSync(INSTANCES_FILE, 'utf-8') || '[]') as Instances;
    instanceFileData.forEach((instance: Instance) => {
        if (instance?.id) {
            instances.set(instance.id, instance);
        }
    });

    // 检查是否已有相同 dataDir 的实例在运行
    const existingInstance = Array.from(instances.values()).find(inst => inst.dataDir === dataDir);
    console.log('id', id);
    console.log('port', port);
    console.log('dataDir', dataDir);
    console.log('instanceFileData', instanceFileData);
    console.log('instances', instances);
    console.log('existingInstance', existingInstance);

    if (existingInstance && isProcessRunning(existingInstance.pid)) {
        throw new Error(`Data directory ${dataDir} 已有运行中的实例。`);
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
            else reject(new Error(`TiddlyWiki 初始化失败，代码 ${code}`));
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
        process: server,
        url: `http://localhost:${port}`,
    };

    instances.set(id, instance);
    saveInstances();

    server.on('close', () => {
        instances.delete(id);
        rmSync(dataDir, { recursive: true, force: true });
        saveInstances();
    });

    return instance;
};
