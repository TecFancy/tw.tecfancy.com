import startApps from "./test-pm2-start-apps.mjs";

const NODE_ENV = process.env.NODE_ENV;
const NAMESPACE = process.env.NAMESPACE;

const mwsAppArgsMap = {
    development: 'dev',
    production: 'start',
};

startApps([
    {
        appName: 'MWS (Multi Wiki Server)',
        script: 'next',
        args: [mwsAppArgsMap[NODE_ENV]],
        env: {
            NODE_ENV,
        },
        namespace: NAMESPACE,
    }
]);
