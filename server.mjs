import express from 'express';
import next from 'next';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { getInstance } from './lib/wikiManager.mjs';

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, turbopack: true });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // 反向代理 /wiki/:id/* 到对应的 TiddlyWiki 实例
  server.use('/wiki/:id', (req) => {
    const { id } = req.params;
    const instance = getInstance(id);

    if (instance) {
      const proxy = createProxyMiddleware({
        target: `http://localhost:${instance.port}`,
        changeOrigin: true,
        pathRewrite: (path) => path.replace(`/wiki/${id}`, ''),
        ws: true, // 如果 TiddlyWiki 使用 WebSockets
        logLevel: 'debug', // 可选，调试用
      });
      proxy(req, res, nextFn);
    } else {
      res.status(404).send('Wiki 实例未找到');
    }
  });

  // 处理所有其他路由
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
