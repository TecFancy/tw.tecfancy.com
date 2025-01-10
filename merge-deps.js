const fs = require('fs');
const path = require('path');

// Path settings
const packageJsonPath = path.resolve(__dirname, 'package.json');
const backupPath = path.resolve(__dirname, 'package.json.backup');

// Backup the original package.json
fs.copyFileSync(packageJsonPath, backupPath);

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Merge dependencies and devDependencies
packageJson.dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
};

// Remove devDependencies
delete packageJson.devDependencies;

// Write back the modified package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
