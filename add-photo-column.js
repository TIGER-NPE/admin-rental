const mysql = require('mysql2/promise');

async function addPhotoColumn() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'car_rental'
  });

  try {
    // Add photo_url column if not exists
    await connection.query('ALTER TABLE drivers ADD COLUMN IF NOT EXISTS photo_url TEXT');
    console.log('✓ Added photo_url column to drivers table');

    // Update sample drivers with photos
    await connection.query(`
      UPDATE drivers SET photo_url = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' WHERE name = 'John Mugabo';
      UPDATE drivers SET photo_url = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' WHERE name = 'Marie Mukasine';
      UPDATE drivers SET photo_url = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200' WHERE name = 'Patrick Nzeyimana';
      UPDATE drivers SET photo_url = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200' WHERE name = 'Alice Uwimana';
      UPDATE drivers SET photo_url = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200' WHERE name = 'Bob Niyonkuru';
      UPDATE drivers SET photo_url = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200' WHERE name = 'Claire Ingabire';
      UPDATE drivers SET photo_url = 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200' WHERE name = 'David Habimana';
    `);
    console.log('✓ Updated sample drivers with photos');

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await connection.end();
    console.log('\nDone!');
  }
}

addPhotoColumn();
