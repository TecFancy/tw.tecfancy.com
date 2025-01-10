const { execSync } = require('child_process');

try {
    console.log('Merge dependencies and devDependencies...');
    execSync('node merge-deps.js', { stdio: 'inherit' });

    console.log('Building project...');
    execSync('npm run prepare', { stdio: 'inherit' });

    console.log('Published successfully.');
} catch (error) {
    console.error('Error during publishing:', error);
    process.exit(1);
} finally {
    console.log('Restoring package.json...');
    try {
        execSync('node restore-package.js', { stdio: 'inherit' });
        console.log('package.json has been restored.');
    } catch (restoreError) {
        console.error('Failed to restore package.json:', restoreError);
        process.exit(1);
    }
}
