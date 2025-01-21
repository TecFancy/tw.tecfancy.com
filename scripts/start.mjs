import startApps from "./start-apps.mjs";

const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 4236;
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
            PORT,
            NODE_ENV,
        },
        namespace: NAMESPACE,
    }
]);
