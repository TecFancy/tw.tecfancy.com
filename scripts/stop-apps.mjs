import { promisify } from "util";
import pm2 from "pm2";

const env = process.env;
const NAMESPACE = env.NAMESPACE;
const DELETED_TIDDLYWIKI_TITLE = env.DELETED_TIDDLYWIKI_TITLE;

const stopApp = async (id) => {
    const pm2Connect = promisify(pm2.connect).bind(pm2);
    const pm2Stop = promisify(pm2.stop).bind(pm2);
    const pm2Delete = promisify(pm2.delete).bind(pm2);
    const pm2Disconnect = promisify(pm2.disconnect).bind(pm2);

    try {
        // Connect to PM2
        await pm2Connect();
        console.log('Connected to PM2');

        // Stop and delete the TiddlyWiki instance
        if (DELETED_TIDDLYWIKI_TITLE) {
            await pm2Stop(DELETED_TIDDLYWIKI_TITLE);
            await pm2Delete(DELETED_TIDDLYWIKI_TITLE);
        }

        // Stop the app
        else {
            await pm2Stop(id || NAMESPACE);
        }

        if (!!id) {
            console.log(`Stopped app with id: ${id}`);
        } else if (!!DELETED_TIDDLYWIKI_TITLE) {
            console.log(`Stopped app with title: ${DELETED_TIDDLYWIKI_TITLE}`);
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
