// Migration script to add availability date columns to the cars table
// Run this script to update an existing database

const pool = require('./config/database');

async function migrate() {
  try {
    console.log('Starting migration...');
    
    // Add start_date column
    await pool.query(`
      ALTER TABLE cars 
      ADD COLUMN IF NOT EXISTS start_date DATE AFTER available
    `);
    console.log('Added start_date column');
    
    // Add end_date column
    await pool.query(`
      ALTER TABLE cars 
      ADD COLUMN IF NOT EXISTS end_date DATE AFTER start_date
    `);
    console.log('Added end_date column');
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

migrate();
