import startApp from "./test-pm2-start-app.mjs";

const NODE_ENV = process.env.NODE_ENV;

const mwsAppArgsMap = {
    development: 'dev',
    production: 'start',
};

startApp({
    appName: 'MWS (Multi Wiki Server)',
    script: 'node_modules/next/dist/bin/next',
    args: [mwsAppArgsMap[NODE_ENV]],
    env: {
        NODE_ENV,
    },
});
