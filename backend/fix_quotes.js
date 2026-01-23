const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../frontend/pages/dashboards/driver/Index.tsx');
const content = fs.readFileSync(filePath, 'utf8');

// Replace \" with "
// Also check for any other weird escapes like \\n which we already fixed?
// Just replace \" globally.

const newContent = content.split('\\"').join('"');

fs.writeFileSync(filePath, newContent);
console.log('Quotes fixed.');
