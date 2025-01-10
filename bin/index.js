#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// 获取项目根目录路径
const projectRoot = path.resolve(__dirname, '..');
process.chdir(projectRoot);

// 定义日志文件夹和 PID 文件路径
const LOG_DIR = path.join(projectRoot, 'log');
const PID_FILE = path.join(LOG_DIR, 'startlocal.pid');

// 创建日志文件夹（如果不存在）
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

// 获取命令行参数
const args = process.argv.slice(2);
const command = args[0];

if (!command) {
    console.error('请提供一个命令参数: start 或 stop');
    process.exit(1);
}

switch (command) {
    case 'start':
        startProcess();
        break;
    case 'stop':
        stopProcess();
        break;
    default:
        console.error(`未知的命令: ${command}`);
        console.error('可用命令: start, stop');
        process.exit(1);
}

// 启动进程的函数
function startProcess() {
    // 检查是否已有运行中的进程
    if (fs.existsSync(PID_FILE)) {
        const existingPid = parseInt(fs.readFileSync(PID_FILE, 'utf-8'), 10);
        if (isProcessRunning(existingPid)) {
            console.error(`错误: 进程已经在运行 (PID: ${existingPid})`);
            process.exit(1);
        } else {
            console.log('发现孤立的 PID 文件，删除中...');
            fs.unlinkSync(PID_FILE);
        }
    }

    // 生成带有时间戳的日志文件名
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const LOG_FILE = path.join(LOG_DIR, `startlocal-${timestamp}.log`);

    // 定义要执行的命令和参数
    const commandToRun = 'npm';
    const argsToRun = ['run', 'start:local'];

    // 创建写入流用于日志记录
    const out = fs.openSync(LOG_FILE, 'a');
    const err = fs.openSync(LOG_FILE, 'a');

    // 启动子进程
    const child = spawn(commandToRun, argsToRun, {
        detached: true,
        stdio: ['ignore', out, err],
    });

    // 写入 PID 文件
    fs.writeFileSync(PID_FILE, child.pid.toString(), 'utf-8');

    // 让子进程在后台运行
    child.unref();

    console.log(`已在后台启动 'start:local'，PID: ${child.pid}`);
    console.log(`日志文件: ${LOG_FILE}`);
    console.log('可通过 `stop` 命令停止进程');
}

// 停止进程的函数
function stopProcess() {
    // 检查 PID 文件是否存在
    if (!fs.existsSync(PID_FILE)) {
        console.error('错误: PID 文件不存在，进程可能未运行');
        process.exit(1);
    }

    // 读取 PID
    const pid = parseInt(fs.readFileSync(PID_FILE, 'utf-8'), 10);

    if (!isProcessRunning(pid)) {
        console.error(`错误: 找不到 PID ${pid} 对应的运行进程`);
        fs.unlinkSync(PID_FILE);
        process.exit(1);
    }

    try {
        process.kill(pid, 'SIGTERM');
        console.log(`正在停止进程 PID: ${pid}...`);

        // 等待进程终止
        const checkInterval = setInterval(() => {
            if (!isProcessRunning(pid)) {
                clearInterval(checkInterval);
                console.log('进程已停止');
                fs.unlinkSync(PID_FILE);
            }
        }, 1000);

        // 超时处理（例如 10 秒后强制终止）
        setTimeout(() => {
            if (isProcessRunning(pid)) {
                console.warn('进程未能在指定时间内停止，尝试强制终止...');
                process.kill(pid, 'SIGKILL');
                fs.unlinkSync(PID_FILE);
                console.log('进程已被强制终止');
            }
        }, 10000);
    } catch (err) {
        console.error(`错误: 无法终止 PID ${pid}，原因: ${err.message}`);
        fs.unlinkSync(PID_FILE);
        process.exit(1);
    }
}

// 检查进程是否在运行
function isProcessRunning(pid) {
    try {
        process.kill(pid, 0);
        return true;
    } catch (err) {
        return false;
    }
}
