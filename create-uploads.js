const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'public', 'uploads', 'drivers');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads folder:', uploadsDir);
} else {
  console.log('Uploads folder exists:', uploadsDir);
}
