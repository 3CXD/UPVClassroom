const { exec } = require('child_process');
const path = require('path');

const dbScriptPath = path.join(__dirname, 'db.sh');

const command = `
mysql -u root -p -e "DROP DATABASE IF EXISTS upvclassroom;" && 
mysql -u root -p < ${dbScriptPath}
`;

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error executing script: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Error: ${stderr}`);
        return;
    }
    console.log('Database migration completed successfully.');
});