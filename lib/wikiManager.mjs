// lib/wikiManager.js
import { spawn } from 'child_process';
import { join } from 'path';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

const instances = new Map();
const BASE_DATA_DIR = join(process.cwd(), 'tiddlywiki-instances');
const INSTANCES_FILE = join(BASE_DATA_DIR, 'instances.json');

// 确保基础数据目录存在
if (!existsSync(BASE_DATA_DIR)) {
  mkdirSync(BASE_DATA_DIR, { recursive: true });
}

// 加载已存在的实例
if (existsSync(INSTANCES_FILE)) {
  const data = JSON.parse(readFileSync(INSTANCES_FILE, 'utf-8'));
  data.forEach((instance) => {
    const { id, port, dataDir } = instance;
    if (existsSync(dataDir)) {
      const server = spawn('npx', ['tiddlywiki', dataDir, '--listen', port], {
        cwd: dataDir,
        shell: true,
        stdio: 'inherit',
      });

      instances.set(id, { id, port, dataDir, process: server, url: `http://localhost:${port}` });

      server.on('close', () => {
        instances.delete(id);
        rmSync(dataDir, { recursive: true, force: true });
        saveInstances();
      });
    }
  });
}

const saveInstances = () => {
  const data = Array.from(instances.values()).map(({ id, port, dataDir }) => ({
    id,
    port,
    dataDir,
  }));
  writeFileSync(INSTANCES_FILE, JSON.stringify(data, null, 2), 'utf-8');
};

const getAvailablePort = () => {
  const startPort = 9000;
  while (true) {
    const port = startPort++;
    let inUse = false;
    for (let instance of instances.values()) {
      if (instance.port === port) {
        inUse = true;
        break;
      }
    }
    if (!inUse) {
      return port;
    }
  }
};

export const createInstance = async () => {
  const id = uuidv4();
  const port = getAvailablePort();
  const dataDir = join(BASE_DATA_DIR, id);

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
  const server = spawn('npx', ['tiddlywiki', dataDir, '--listen', port], {
    cwd: dataDir,
    shell: true,
    stdio: 'inherit',
  });

  const instance = {
    id,
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

export const deleteInstance = (id) => {
  const instance = instances.get(id);
  if (instance) {
    instance.process.kill();
    instances.delete(id);
    rmSync(instance.dataDir, { recursive: true, force: true });
    saveInstances();
    return true;
  }
  return false;
};

export const listInstances = () => {
  return Array.from(instances.values()).map(({ id, port, url }) => ({ id, port, url }));
};

export const getInstance = (id) => {
  return instances.get(id);
};
