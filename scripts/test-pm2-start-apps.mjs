import { promisify } from "util";
import pm2 from "pm2";

/**
 * @typedef {Object} AppConfig
 * @property {string} appName - Name of the application
 * @property {string} script - Path to the script
 * @property {string[]} args - Arguments to pass to the script
 * @property {Object} env - Environment variables
 * @property {string} [namespace='mws'] - Namespace for the application
 */

/**
 * Start multiple apps with PM2
 * @param {AppConfig[]} apps - Array of application configurations
 */
const startApps = async (apps) => {
    const pm2Connect = promisify(pm2.connect).bind(pm2);
    const pm2Start = promisify(pm2.start).bind(pm2);
    const pm2List = promisify(pm2.list).bind(pm2);
    const pm2Restart = promisify(pm2.restart).bind(pm2);
    const pm2Disconnect = promisify(pm2.disconnect).bind(pm2);

    try {
        // Connect to PM2
        await pm2Connect();
        console.log('Connected to PM2');

        // Get the list of existing apps
        const existingApps = await pm2List();

        for (const app of apps) {
            const { appName, script, args, env, namespace = 'mws' } = app;

            // Check if the app is already running
            const isAppRunning = existingApps.some((app) => app.name === appName && app.namespace === namespace);

            if (isAppRunning) {
                console.log(`${appName} is already running, attempting to restart...`);
                await pm2Restart(appName, { namespace });
                console.log(`${appName} restarted`);
            } else {
                await pm2Start({
                    name: appName,
                    script,
                    args,
                    env: { ...env, PORT: 4236 },
                    namespace,
                });
                console.log(`Started ${appName} with PM2, visit http://localhost:${env.PORT}/`);
            }
        }
    } catch (error) {
        console.error(`Error starting apps: ${error.message}`);
        process.exit(2);
    } finally {
        // Disconnect from PM2
        await pm2Disconnect();
        console.log('Disconnected from PM2');
    }
};

export default startApps;
