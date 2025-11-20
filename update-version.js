const fs = require('fs');
const path = require('path');

// Generate new version based on current timestamp
const version = new Date().toISOString().replace(/[:.]/g, '-');
const buildTime = new Date().toISOString();

const versionData = {
  version: version,
  buildTime: buildTime
};

// Write to public/version.json
fs.writeFileSync(
  path.join(__dirname, 'public', 'version.json'),
  JSON.stringify(versionData, null, 2)
);

console.log(`Version updated to: ${version}`);