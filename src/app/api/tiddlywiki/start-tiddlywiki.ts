import { spawn } from "child_process";
import type { Instance } from "./get-tiddlywiki-instances";

const startTiddlywiki = async (instance: Instance) => {
    const { port, dataDir } = instance;
    const server = spawn('npx', ['tiddlywiki', dataDir, '--listen', `port=${port}`], {
        cwd: dataDir,
        shell: true,
        stdio: 'inherit',
    });
    const pid = server.pid;

    if (pid) {
        return {
            pid,
            ...instance,
        };
    } else {
        return null;
    }
};

export default startTiddlywiki;
