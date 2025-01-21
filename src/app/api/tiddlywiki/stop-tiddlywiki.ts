import { spawn } from "child_process";

interface ParamsType {
    title?: string;
}

const stopTiddlywiki = async (params: ParamsType): Promise<void> => {
    spawn('npm', ['run', 'stop'], {
        shell: true,
        stdio: 'inherit',
        env: { ...process.env, DELETED_TIDDLYWIKI_TITLE: params.title },
    });
};

export default stopTiddlywiki;
