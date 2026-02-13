const mysql = require('mysql2/promise');

async function updateDrivers() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'car_rental'
  });

  const photos = {
    'John Mugabo': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    'Marie Mukasine': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    'Patrick Nzeyimana': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    'Alice Uwimana': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    'Bob Niyonkuru': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    'Claire Ingabire': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
    'David Habimana': 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200'
  };

  try {
    for (const [name, photo] of Object.entries(photos)) {
      await connection.query('UPDATE drivers SET photo_url = ? WHERE name = ?', [photo, name]);
      console.log(`✓ Updated ${name}`);
    }
    console.log('\nAll drivers have photos now!');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await connection.end();
  }
}

updateDrivers();
