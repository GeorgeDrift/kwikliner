const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../frontend/pages/dashboards/driver/Index.tsx');
const content = fs.readFileSync(filePath, 'utf8');

// Replace literal "\n" (backslash n) with actual newline character
const newContent = content.split('\\n').join('\n');

fs.writeFileSync(filePath, newContent);
console.log('Newlines fixed.');
