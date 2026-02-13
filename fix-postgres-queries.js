// This script converts the server.js queries to PostgreSQL syntax
// Run: node fix-postgres-queries.js

import fs from 'fs';

const content = fs.readFileSync('server.js', 'utf8');

let fixed = content
  // Convert [rows] to { rows }
  .replace(/const \[rows\] = await pool\.query\(/g, 'const { rows } = await pool.query(')
  .replace(/const \[result\] = await pool\.query\(/g, 'const result = await pool.query(')
  
  // Convert INSERT result.insertId to result.rows[0].id
  .replace(/result\.insertId/g, 'result.rows[0].id')
  
  // Convert ? placeholders to $1, $2, etc.
  // This is a simple replacement - may need manual review for complex queries
  .replace(/\?, /g, (match, offset) => {
    const count = (content.substring(0, content.indexOf(match) + 3).match(/\?/g) || []).length;
    return `$${count}, `;
  })
  .replace(/\?\\,/g, (match, offset) => {
    const count = (content.substring(0, content.indexOf(match) + 3).match(/\?/g) || []).length;
    return `$${count},`;
  })
  .replace(/\\?, \\?\\?/g, '?, ?') // Skip escaped
  .replace(/\\?, '\\);/g, (match) => {
    const count = (content.substring(0, content.indexOf(match) + 3).match(/\?/g) || []).length;
    return `$${count}` + match.substring(2);
  })
  .replace(/\\?', \\?'/g, (match) => {
    const count = (content.substring(0, content.indexOf(match) + 3).match(/\?/g) || []).length;
    return `$${count}'` + match.substring(2);
  });

fs.writeFileSync('server.js', fixed);
console.log('Fixed PostgreSQL queries in server.js');
