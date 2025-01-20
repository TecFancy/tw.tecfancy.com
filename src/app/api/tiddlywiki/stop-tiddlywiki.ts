import { spawn } from "child_process";

const stopTiddlywiki = async (): Promise<void> => {
    spawn('npm', ['run', 'stop:tw'], {
        shell: true,
        stdio: 'inherit',
        env: { ...process.env, TARGET: 'tiddlywiki' },
    });
};

export default stopTiddlywiki;
