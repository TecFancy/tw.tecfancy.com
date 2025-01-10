const fs = require('fs');
const path = require('path');

// Path settings
const packageJsonPath = path.resolve(__dirname, 'package.json');
const backupPath = path.resolve(__dirname, 'package.json.backup');

// Check if the backup file exists
if (fs.existsSync(backupPath)) {
    // Restore the original package.json
    fs.copyFileSync(backupPath, packageJsonPath);
    // Remove the backup file
    fs.unlinkSync(backupPath);
}
