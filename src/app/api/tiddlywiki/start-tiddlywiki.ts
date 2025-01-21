import { spawn } from "child_process";

const startTiddlywiki = async () => {
    spawn('npm', ['run', 'start:tw'], {
        shell: true,
        stdio: 'inherit',
    });
};

export default startTiddlywiki;
