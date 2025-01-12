import { promisify } from "util";
import pm2 from "pm2";

const NAMESPACE = process.env.NAMESPACE;

const stopApp = async (id) => {
    const pm2Connect = promisify(pm2.connect).bind(pm2);
    const pm2Stop = promisify(pm2.stop).bind(pm2);
    const pm2Disconnect = promisify(pm2.disconnect).bind(pm2);

    try {
        // Connect to PM2
        await pm2Connect();
        console.log('Connected to PM2');

        // Stop the app
        await pm2Stop(id || NAMESPACE);
        if (!!id) {
            console.log(`Stopped app with id: ${id}`);
        } else {
            console.log(`Stopped apps with namespace: ${NAMESPACE}`);
        }
    } catch (error) {
        console.error(`Error stopping app: ${error.message}`);
        process.exit(3);
    } finally {
        // Disconnect from PM2
        await pm2Disconnect();
        console.log('Disconnected from PM2');
    }
};

export default stopApp;
