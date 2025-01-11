import fs, {existsSync, writeFileSync} from 'fs';
import net from 'net';
import express from 'express';
import { spawn } from 'child_process';
import { isAbsolute, join } from "path";
import { homedir } from "node:os";
import next from 'next';

const env = process.env;
const protocol = env.PROTOCOL || 'http';
const domain = env.DOMAIN || 'localhost';
const port = env.PORT || 8080;
const instancesRoot = env.INSTANCES_ROOT || homedir();
const dev = env.NODE_ENV !== 'production';
const app = next({ dev, turbopack: dev });
const handle = app.getRequestHandler();

const BASE_DATA_DIR = instancesRoot && isAbsolute(instancesRoot)
    ? join(instancesRoot, '.TiddlyWikis')
    : join(homedir(), '.TiddlyWikis');

const INSTANCES_FILE = join(BASE_DATA_DIR, 'instances.json');

// Helper function: check if a port is open
const isPortOpen = (port, host) => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, host);
  });
};

// Helper 函数：等待端口开放
// Helper function: wait for a port to open
const waitForPort = async (port, host, retries = 10, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    const open = await isPortOpen(port, host);
    if (open) {
      return true;
    }
    await new Promise(res => setTimeout(res, delay));
  }
  return false;
};

const loadInstances = async () => {
  let data = [];
  if (fs.existsSync(INSTANCES_FILE)) {
    data = JSON.parse(fs.readFileSync(INSTANCES_FILE, 'utf-8') || '[]');
    for (const instance of data) {
      const { port, dataDir } = instance;
      if (!fs.existsSync(dataDir)) {
        console.warn(`Data directory not found: ${dataDir}`);
        continue;
      }

      // 启动 TW 实例
      const inst = spawn('npx', ['tiddlywiki', dataDir, '--listen', `port=${port}`], {
        cwd: dataDir,
        shell: true,
        stdio: 'inherit',
      });

      // 等待端口开放
      const started = await waitForPort(port, domain, 20, 500);
      if (started) {
        console.log(`TiddlyWiki instance started on port ${port}`);
        instance.pid = inst.pid;
      } else {
        console.error(`Failed to start TiddlyWiki instance on port ${port}`);
      }
    }
  }
  return data;
};

app.prepare().then(async () => {
  try {
    // Wait for all TW instances to start
    const updatedInstancesData = await loadInstances();

    if (existsSync(INSTANCES_FILE)) {
      writeFileSync(INSTANCES_FILE, JSON.stringify(updatedInstancesData, null, 2), 'utf-8');
    }

    const server = express();

    // Handle all other routes
    server.all('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on ${protocol}://${domain}:${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1); // Exit with error
  }
});
