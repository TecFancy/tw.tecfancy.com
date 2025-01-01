import { spawn } from 'child_process';
import { join } from 'path';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import getPort from 'get-port';

const instances = new Map();
const BASE_DATA_DIR = join(process.cwd(), 'tiddlywiki-instances');
const INSTANCES_FILE = join(BASE_DATA_DIR, 'instances.json');

const isProcessRunning = (pid) => {
  try {
    process.kill(pid, 0); // 发送信号 0 不会实际终止进程
    return true;
  } catch (error) {
    return false;
  }
};

// 确保基础数据目录存在
if (!existsSync(BASE_DATA_DIR)) {
  mkdirSync(BASE_DATA_DIR, { recursive: true });
}

// 加载已存在的实例
if (existsSync(INSTANCES_FILE)) {
  const data = JSON.parse(readFileSync(INSTANCES_FILE, 'utf-8'));
  data.forEach(async (instance) => {
    const { id, pid, port, dataDir } = instance;
    console.log('isProcessRunning', pid, isProcessRunning(pid));
    if (existsSync(dataDir) && isProcessRunning(pid)) {
      instances.set(id, { id, pid, port, dataDir, url: `http://localhost:${port}` });
    } else {
      const server = spawn('npx', ['tiddlywiki', dataDir, '--listen', `port=${port}`], {
        cwd: dataDir,
        shell: true,
        stdio: 'inherit',
      });

      instances.set(id, { id, pid, port, dataDir, process: server, url: `http://localhost:${port}` });

      server.on('close', () => {
        instances.delete(id);
        rmSync(dataDir, { recursive: true, force: true });
        saveInstances();
      });
    }
  });
}

const saveInstances = () => {
  const data = Array.from(instances.values()).map(({ id, pid, port, dataDir }) => ({
    id,
    pid,
    port,
    dataDir,
  }));
  writeFileSync(INSTANCES_FILE, JSON.stringify(data, null, 2), 'utf-8');
};

/**
 * 获取一个可用的端口
 * @returns {Promise<number>} - 可用的端口号
 */
const getAvailablePort = async () => {
  // let startPort = await getPort();
  let port = await getPort();
  while (true) {
    if (!Array.from(instances.values()).some(instance => instance.port === port)) {
      return port;
    }
    port++;
  }
};

export const createInstance = async () => {
  const id = uuidv4();
  const port = await getAvailablePort();
  const dataDir = join(BASE_DATA_DIR, id);

  // 检查是否已有相同 dataDir 的实例在运行
  const existingInstance = Array.from(instances.values()).find(inst => inst.dataDir === dataDir);
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
      if (code === 0) resolve();
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

export const getInstance = (id) => {
  return instances.get(id);
};
