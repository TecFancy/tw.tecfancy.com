#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require("node:os");

const env = process.env;

// Get the project root directory path
const projectRoot = path.resolve(__dirname, '..');
process.chdir(projectRoot);

// Define log directory and PID file path
const LOG_DIR = path.join(projectRoot, 'log');
const PID_FILE = path.join(LOG_DIR, 'startlocal.pid');

// Create log directory if it doesn't exist
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Get command line arguments
const args = process.argv.slice(2);
const command = args[0];

if (!command) {
    console.error('Please provide a command argument: start or stop');
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
        console.error(`Unknown command: ${command}`);
        console.error('Available commands: start, stop');
        process.exit(1);
}

// Start the process function
function startProcess() {
    // Check if there is already a running process
    if (fs.existsSync(PID_FILE)) {
        const existingPid = parseInt(fs.readFileSync(PID_FILE, 'utf-8'), 10);
        if (isProcessRunning(existingPid)) {
            console.error(`ERROR: Process is already running (PID: ${existingPid})`);
            process.exit(1);
        } else {
            console.log('Finding orphaned PID file, deleting...');
            fs.unlinkSync(PID_FILE);
        }
    }

    // Generate log file name with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const LOG_FILE = path.join(LOG_DIR, `startlocal-${timestamp}.log`);

    // Define the command and arguments to run
    const commandToRun = 'npm';
    const argsToRun = ['run', 'start:local'];

    // Create write streams for logging
    const out = fs.openSync(LOG_FILE, 'a');
    const err = fs.openSync(LOG_FILE, 'a');

    // Start the child process
    const child = spawn(commandToRun, argsToRun, {
        detached: true,
        stdio: ['ignore', out, err],
    });

    // Write the PID to the PID file
    fs.writeFileSync(PID_FILE, child.pid.toString(), 'utf-8');

    // Let the child process run in the background
    child.unref();

    console.log(`The 'start:local' command is Running in background, PID: ${child.pid}`);
    console.log(`Log file: ${LOG_FILE}`);
    console.log('Use `stop` command to stop the process');
}

// TODO remove this duplicated code (src/lib/index.ts)
function getInstances() {
    const instancesRoot = env.INSTANCES_ROOT || os.homedir();
    const BASE_DATA_DIR = instancesRoot && path.isAbsolute(instancesRoot)
        ? path.join(instancesRoot, '.TiddlyWikis')
        : path.join(os.homedir(), '.TiddlyWikis');

    if (!fs.existsSync(BASE_DATA_DIR)) return [];

    const INSTANCES_FILE = path.join(BASE_DATA_DIR, 'instances.json');
    if (!fs.existsSync(INSTANCES_FILE)) return [];

    try {
        return JSON.parse(fs.readFileSync(INSTANCES_FILE, 'utf-8') || '[]');
    } catch (err) {
        console.log(`Error reading instances file: ${err.message}`);
        return [];
    }
}

function stopMainProcess() {
    // Check if the PID file exists
    if (!fs.existsSync(PID_FILE)) {
        console.error('ERROR: Main PID file does not exist, process may not be running');
    } else {
        // Read the PID from the file
        const pid = parseInt(fs.readFileSync(PID_FILE, 'utf-8'), 10);

        if (!isProcessRunning(pid)) {
            console.error(`ERROR: Main process (PID: ${pid}) not found`);
            fs.unlinkSync(PID_FILE);
        } else {
            terminateProcess(pid, 'main process');
        }
    }
}

// Stop a single process
function terminateProcess(pid, processName) {
    if (!isProcessRunning(pid)) {
        console.warn(`WARN: ${processName} (PID: ${pid}) is not running.`);
        return;
    }

    try {
        // Send SIGTERM signal to the process
        process.kill(pid, 'SIGTERM');
        console.log(`Waiting for ${processName} to stop...`);

        // Wait for the process to stop
        const checkInterval = setInterval(() => {
            if (!isProcessRunning(pid)) {
                clearInterval(checkInterval);
                console.log(`${processName} (PID: ${pid}) has stopped.`);
                // Delete PID file if it's the main process
                if (processName === 'main process') {
                    fs.unlinkSync(PID_FILE);
                }
            }
        }, 1000);

        // Timeout handling (e.g. force kill after 10 seconds)
        setTimeout(() => {
            if (isProcessRunning(pid)) {
                console.warn(`${processName} (PID: ${pid}) did not stop in time, attempting to force kill...`);
                try {
                    process.kill(pid, 'SIGKILL');
                    console.log(`${processName} (PID: ${pid}) has been force killed.`);
                } catch (err) {
                    console.error(`ERROR: Could not force kill ${processName} (PID: ${pid}), reason: ${err.message}`);
                }
            }
        }, 10000);
    } catch (err) {
        console.error(`ERROR: Could not stop ${processName} (PID: ${pid}), reason: ${err.message}`);
    }
}

// Stop the process function
function stopProcess() {
    const instances = getInstances();

    // Stop the main process
    stopMainProcess();

    // Stop all TiddlyWiki instances process
    if (instances.length > 0) {
        console.log(`\nStopping ${instances.length} TiddlyWiki instances...`);
        instances.forEach(instance => {
            if (instance.pid) {
                terminateProcess(instance.pid, `Instance: "${instance.twName}"`);
            } else {
                console.warn(`Instance "${instance.twName}" does not have PID information, skipping.`);
            }
        });

        // Optional: clear instances.json file or update as needed
        // fs.writeFileSync(path.join(process.cwd(), 'tiddlywiki-instances', 'instances.json'), '[]', 'utf-8');
    } else {
        console.log('Don\'t find any instances that need to be stopped.');
    }
}

// Check if a process is running
function isProcessRunning(pid) {
    try {
        process.kill(pid, 0);
        return true;
    } catch (err) {
        if (err.code === 'ESRCH') {
            // The process is not exist
             return false;
        } else if (err.code === 'EPERM') {
            // The process exists, but we don't have permission to signal it
            return true;
        } else {
            // Unexpected error
            console.error(`Error checking process ${pid}:`, err);
            return false;
        }
    }
}
