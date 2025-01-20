import { promisify } from "util";
import { homedir } from "os";
import { join } from "path";
import { existsSync, readFileSync } from "fs";
import pm2 from "pm2";

const env = process.env;
const NAMESPACE = env.NAMESPACE;

const getStoppedInstanceTitle = async () => {
    const BASE_DATA_DIR = join(homedir(), '.TiddlyWikis');
    if (!existsSync(BASE_DATA_DIR)) return;

    const DELETED_INSTANCES_FILE = join(BASE_DATA_DIR, 'deleted-instances.json');
    if (!existsSync(DELETED_INSTANCES_FILE)) return;

    const deletedInstances = JSON.parse(readFileSync(DELETED_INSTANCES_FILE, 'utf8') || '{}');
    if (!deletedInstances) return;

    return `TW: ${deletedInstances?.title}`;
};

const stopApp = async (id) => {
    const pm2Connect = promisify(pm2.connect).bind(pm2);
    const pm2Stop = promisify(pm2.stop).bind(pm2);
    const pm2Delete = promisify(pm2.delete).bind(pm2);
    const pm2Disconnect = promisify(pm2.disconnect).bind(pm2);

    try {
        // Connect to PM2
        await pm2Connect();
        console.log('Connected to PM2');

        const stoppedInstanceTitle = await getStoppedInstanceTitle();

        // Stop and delete the TiddlyWiki instance
        if (stoppedInstanceTitle){
            await pm2Stop(stoppedInstanceTitle);
            await pm2Delete(stoppedInstanceTitle);
        }

        // Stop the app
        else {
            await pm2Stop(id || NAMESPACE);
        }

        if (!!id) {
            console.log(`Stopped app with id: ${id}`);
        } else if (!!stoppedInstanceTitle) {
            console.log(`Stopped app with title: ${stoppedInstanceTitle}`);
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
