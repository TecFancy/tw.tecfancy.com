#!/usr/bin/env node

const { spawnSync } = require('child_process');
const path = require('path');
const os = require("os");

const env = process.env;
const protocol = env.NEXT_PUBLIC_PROTOCOL || 'http';
const domain = env.NEXT_PUBLIC_DOMAIN || 'localhost';

// Get the project root directory path
const projectRoot = path.resolve(__dirname, '..');
process.chdir(projectRoot);

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
async function startProcess() {
    // Define the command and arguments to run
    const commandToRun = 'npm';
    const argsToRun = ['run', 'start'];

    console.log('Starting...')

    spawnSync(commandToRun, argsToRun, {
        detached: true,
        stdio: 'ignore',
   });

    console.log(`The server is Running in background, visit ${protocol}://${domain}:4236`);
    console.log('Use `stop` command to stop the process');
    console.log(`TiddlyWikis will be stored in ${os.homedir()}/.TiddlyWikis`);
}

// Stop the process function
async function stopProcess() {
    const commandToRun = 'npm';
    const argsToRun = ['run', 'stop'];

    console.log('Stopping...')

    spawnSync(commandToRun, argsToRun, {
        detached: true,
        stdio: 'ignore',
    });

    console.log('The server is stopped')
}
