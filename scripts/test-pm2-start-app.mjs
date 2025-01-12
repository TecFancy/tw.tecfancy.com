import pm2 from "pm2";

/**
 * Start the application with PM2
 * @param params
 * @param {string} params.appName - Name of the application
 * @param {string} params.script - Path to the script
 * @param {string[]} params.args - Arguments to pass to the script
 * @param {Object} params.env - Environment variables to set
 */
const startApp = (params) => {
    const appName = params.appName;
    const script = params.script;
    const args = params.args;
    const env = params.env;

    pm2.connect((err) => {
        if (err) {
            console.error('PM2 connection error:', err);
            process.exit(2);
        }

        pm2.start({
            name: appName,
            script,
            args,
            env: { ...env, PORT: 4236 },
            namespace: 'mws',
        }, (err) => {
            if (err) {
                console.error('Start MWS (Multi Wiki Server) error:', err);
                process.exit(2);
            }

            console.log(`Started ${appName} with PM2, visit http://localhost:${env.PORT}/`);

            // Disconnect from PM2
            pm2.disconnect();
        });
    });
};

export default startApp;
