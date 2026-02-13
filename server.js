import express from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import pool from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public', 'uploads', 'drivers'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Simple admin password
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
  const password = req.headers['x-admin-password'];
  if (password === ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

// Helper function to check database connection
const isDbConnected = async () => {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch {
    return false;
  }
};

// API Routes - Public

// Get all cars
app.get('/api/cars', async (req, res) => {
  const connected = await isDbConnected();
  if (!connected) {
    return res.status(500).json({ success: false, message: 'Database not connected' });
  }
  try {
    const { rows } = await pool.query('SELECT * FROM cars ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Fetch cars error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch cars' });
  }
});

// Get single car by ID
app.get('/api/cars/:id', async (req, res) => {
  const connected = await isDbConnected();
  if (!connected) {
    return res.status(404).json({ success: false, message: 'Car not found' });
  }
  try {
    const { rows } = await pool.query('SELECT * FROM cars WHERE id = $1', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch car' });
  }
});

// Search cars
app.get('/api/cars/search/:query', async (req, res) => {
  const connected = await isDbConnected();
  if (!connected) {
    return res.status(500).json({ success: false, message: 'Database not connected' });
  }
  try {
    const query = `%${req.params.query}%`;
    const { rows } = await pool.query(
      'SELECT * FROM cars WHERE available = true AND (name LIKE $1 OR model LIKE $1) ORDER BY price_per_day ASC',
      [query]
    );
    res.json({ success: true, data: rows });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to search cars' });
  }
});

// Get WhatsApp URL
app.get('/api/cars/:id/whatsapp', async (req, res) => {
  const connected = await isDbConnected();
  if (!connected) {
    return res.status(404).json({ success: false, message: 'Car not found' });
  }
  try {
    const { rows } = await pool.query('SELECT whatsapp_number, name, model FROM cars WHERE id = $1', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
    
    const car = rows[0];
    const phoneNumber = car.whatsapp_number.replace(/[^0-9]/g, '');
    const message = `Hi, I'm interested in renting the ${car.name} ${car.model}. Is it available?`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    res.json({ success: true, data: { whatsappUrl, phoneNumber } });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to generate WhatsApp URL' });
  }
});

// Admin Routes

app.get('/api/admin/cars', authenticateAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM cars ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch cars' });
  }
});

app.post('/api/admin/cars', authenticateAdmin, async (req, res) => {
  try {
    const { name, model, year, price_per_day, whatsapp_number, images, description, available, start_date, end_date } = req.body;
    
    const imagesJson = images ? JSON.stringify(images) : '[]';
    
    const result = await pool.query(
      `INSERT INTO cars (name, model, year, price_per_day, whatsapp_number, images, description, available, start_date, end_date) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
      [name, model, year, price_per_day, whatsapp_number, imagesJson, description || '', available !== false, start_date || null, end_date || null]
    );
    
    res.json({ success: true, message: 'Car added successfully', id: result.rows[0].id });
  } catch (error) {
    console.error('Add car error:', error);
    res.status(500).json({ success: false, message: 'Failed to add car' });
  }
});

app.put('/api/admin/cars/:id', authenticateAdmin, async (req, res) => {
  try {
    const { name, model, year, price_per_day, whatsapp_number, images, description, available, start_date, end_date } = req.body;
    
    const imagesJson = images ? JSON.stringify(images) : '[]';
    
    await pool.query(
      `UPDATE cars SET name = $1, model = $2, year = $3, price_per_day = $4, whatsapp_number = $5, images = $6, description = $7, available = $8, start_date = $9, end_date = $10 WHERE id = $11`,
      [name, model, year, price_per_day, whatsapp_number, imagesJson, description || '', available !== false, start_date || null, end_date || null, req.params.id]
    );
    
    res.json({ success: true, message: 'Car updated successfully' });
  } catch (error) {
    console.error('Update car error:', error);
    res.status(500).json({ success: false, message: 'Failed to update car: ' + error.message });
  }
});

app.delete('/api/admin/cars/:id', authenticateAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM cars WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Car deleted successfully' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete car' });
  }
});

app.post('/api/admin/cars/:id/photo', authenticateAdmin, upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  
  try {
    const photoUrl = `/uploads/cars/${req.file.filename}`;
    await pool.query('UPDATE cars SET image_url = $1 WHERE id = $2', [photoUrl, req.params.id]);
    res.json({ success: true, photoUrl });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to save photo' });
  }
});

app.post('/api/admin/verify', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, message: 'Valid password' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' });
  }
});

// Drivers Routes

app.get('/api/admin/drivers', authenticateAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM drivers ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch drivers' });
  }
});

app.post('/api/admin/drivers', authenticateAdmin, async (req, res) => {
  try {
    const { name, phone, email, license_number, vehicle_assigned, status, photo_url } = req.body;
    
    const result = await pool.query(
      `INSERT INTO drivers (name, phone, email, license_number, vehicle_assigned, status, photo_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [name, phone || '', email || '', license_number || '', vehicle_assigned || '', status || 'available', photo_url || '']
    );
    
    res.json({ success: true, message: 'Driver added successfully', id: result.rows[0].id });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to add driver' });
  }
});

app.put('/api/admin/drivers/:id', authenticateAdmin, async (req, res) => {
  try {
    const { name, phone, email, license_number, vehicle_assigned, status, photo_url } = req.body;
    
    await pool.query(
      `UPDATE drivers SET name = $1, phone = $2, email = $3, license_number = $4, vehicle_assigned = $5, status = $6, photo_url = $7 WHERE id = $8`,
      [name, phone || '', email || '', license_number || '', vehicle_assigned || '', status || 'available', photo_url || '', req.params.id]
    );
    
    res.json({ success: true, message: 'Driver updated successfully' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update driver' });
  }
});

app.delete('/api/admin/drivers/:id', authenticateAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM drivers WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Driver deleted successfully' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete driver' });
  }
});

app.post('/api/admin/drivers/:id/photo', authenticateAdmin, upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  
  try {
    const photoUrl = `/uploads/drivers/${req.file.filename}`;
    await pool.query('UPDATE drivers SET photo_url = $1 WHERE id = $2', [photoUrl, req.params.id]);
    res.json({ success: true, photoUrl });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to save photo' });
  }
});

app.get('/api/drivers/available', async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM drivers WHERE status = 'available' ORDER BY name");
    res.json({ success: true, data: rows });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch drivers' });
  }
});

// Terms Routes

app.get('/api/admin/terms', authenticateAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM terms ORDER BY display_order ASC');
    res.json({ success: true, data: rows });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch terms' });
  }
});

app.get('/api/terms', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM terms ORDER BY display_order ASC');
    res.json({ success: true, data: rows });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch terms' });
  }
});

app.post('/api/admin/terms', authenticateAdmin, async (req, res) => {
  try {
    const { title, content, display_order } = req.body;
    
    const result = await pool.query(
      `INSERT INTO terms (title, content, display_order) VALUES ($1, $2, $3) RETURNING id`,
      [title, content, display_order || 0]
    );
    
    res.json({ success: true, message: 'Term added successfully', id: result.rows[0].id });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to add term' });
  }
});

app.put('/api/admin/terms/:id', authenticateAdmin, async (req, res) => {
  try {
    const { title, content, display_order } = req.body;
    
    await pool.query(
      `UPDATE terms SET title = $1, content = $2, display_order = $3 WHERE id = $4`,
      [title, content, display_order || 0, req.params.id]
    );
    
    res.json({ success: true, message: 'Term updated successfully' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update term' });
  }
});

app.delete('/api/admin/terms/:id', authenticateAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM terms WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Term deleted successfully' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete term' });
  }
});

// Database Setup Route
app.get('/api/setup', async (req, res) => {
  try {
    // Create cars table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cars (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        year INTEGER NOT NULL,
        price_per_day DECIMAL(10, 2) NOT NULL,
        whatsapp_number VARCHAR(20) NOT NULL,
        images JSONB,
        description TEXT,
        location VARCHAR(100),
        seats INTEGER DEFAULT 5,
        doors INTEGER DEFAULT 4,
        transmission VARCHAR(50) DEFAULT 'Automatic',
        available BOOLEAN DEFAULT TRUE,
        start_date DATE,
        end_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create drivers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS drivers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(100),
        license_number VARCHAR(50),
        vehicle_assigned VARCHAR(100),
        photo_url TEXT,
        status VARCHAR(20) DEFAULT 'available',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create terms table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS terms (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        content TEXT NOT NULL,
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default terms
    await pool.query(`
      INSERT INTO terms (title, content, display_order) VALUES
      ('1. Eligibility', 'Renters must be 18 years or older.', 1),
      ('2. Booking', 'All bookings must be made through our website.', 2),
      ('3. Payment', 'Payment can be made via approved methods.', 3),
      ('4. Vehicle Use', 'Vehicles must be used legally.', 4),
      ('5. Fuel Policy', 'Vehicles are provided with a full tank.', 5),
      ('6. Rental Duration', 'The rental period starts at pickup.', 6),
      ('7. Insurance', 'Renters are responsible for minor damages.', 7),
      ('8. Contact Rules', 'Communication for booking via WhatsApp.', 8),
      ('9. Termination', 'Rental may be terminated if rules violated.', 9),
      ('10. General', 'We reserve the right to update these rules.', 10)
      ON CONFLICT DO NOTHING
    `);

    res.json({ 
      success: true, 
      message: 'Database setup complete! Tables created: cars, drivers, terms' 
    });
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
