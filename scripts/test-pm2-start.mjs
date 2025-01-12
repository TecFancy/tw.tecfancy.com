import startApps from "./test-pm2-start-app.mjs";

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
]).then(() => {
    console.log('Successfully started');
}).catch((error) => {
    console.error(`Error starting apps: ${error.message}`);
    process.exit(1);
}).finally(() => {
    process.exit(0);
});
