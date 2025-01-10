import fs from 'fs';
import net from 'net';
import express from 'express';
import { spawn } from 'child_process';
import { join } from "path";
import next from 'next';
import dotenv from 'dotenv';

const env = dotenv.config().parsed;
const port = env.PORT || process.env.PORT || 8080;
const dev = (env.NODE_ENV || process.env.NODE_ENV) !== 'production';
const app = next({ dev, turbopack: dev });
const handle = app.getRequestHandler();
const BASE_DATA_DIR = join(process.cwd(), 'tiddlywiki-instances');
const INSTANCES_FILE = join(BASE_DATA_DIR, 'instances.json');

// Helper 函数：检查端口是否开放
const isPortOpen = (port, host = 'localhost') => {
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
const waitForPort = async (port, host = 'localhost', retries = 10, delay = 1000) => {
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
      spawn('npx', ['tiddlywiki', dataDir, '--listen', `port=${port}`], {
        cwd: dataDir,
        shell: true,
        stdio: 'inherit',
      });

      // 等待端口开放
      const started = await waitForPort(port, 'localhost', 20, 500);
      if (started) {
        console.log(`TiddlyWiki instance started on port ${port}`);
      } else {
        console.error(`Failed to start TiddlyWiki instance on port ${port}`);
        // 根据需求决定是否抛出错误或继续
        // throw new Error(`TiddlyWiki instance failed to start on port ${port}`);
      }
    }
  }
  return data;
};

app.prepare().then(async () => {
  try {
    await loadInstances(); // 等待所有 TW 实例启动

    const server = express();

    // 处理所有其他路由
    server.all('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1); // 以错误代码退出
  }

  // const instances = loadInstances();
  //
  // const server = express();
  //
  // // 反向代理 /wiki/:id/* 到对应的 TiddlyWiki 实例
  // server.use('/wiki/:id', (req, res, nextFn) => {
  //   const { id } = req.params;
  //   if (instances?.[id]) {
  //     console.log('instances id', instances?.[id]);
  //     const proxy = createProxyMiddleware({
  //       target: `http://localhost:${instances[id].port}`,
  //       changeOrigin: true,
  //       pathRewrite: (path) => path.replace(`/wiki/${id}`, ''),
  //       ws: true, // 如果 TiddlyWiki 使用 WebSockets
  //       logLevel: 'debug', // 可选，调试用
  //     });
  //     console.log('proxy', proxy);
  //     proxy(req, res, nextFn).then(r => {
  //       console.log('proxy', r);
  //     });
  //   } else {
  //       res.status(404).send('Wiki 实例未找到');
  //   }
  // });
  //
  // // 处理所有其他路由
  // server.all('*', (req, res) => {
  //   return handle(req, res);
  // });
  //
  // server.listen(port, (err) => {
  //   if (err) throw err;
  //   console.log(`> Ready on http://localhost:${port}`);
  // });
});
