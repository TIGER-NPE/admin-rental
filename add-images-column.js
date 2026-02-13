const pool = require('./config/database');

async function addImagesColumn() {
  try {
    console.log('Adding images column to cars table...');
    
    // Add images column if it doesn't exist
    await pool.query(`
      ALTER TABLE cars 
      ADD COLUMN IF NOT EXISTS images JSON DEFAULT '[]'
    `);
    
    console.log('Successfully added images column to cars table');
    process.exit(0);
  } catch (error) {
    console.error('Error adding images column:', error.message);
    process.exit(1);
  }
}

addImagesColumn();
