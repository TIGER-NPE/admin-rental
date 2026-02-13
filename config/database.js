import pg from 'pg';

const { Pool } = pg;

// Parse DATABASE_URL if available, otherwise use individual vars
const getPoolConfig = () => {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (databaseUrl) {
    // Parse the connection string
    const params = new URL(databaseUrl);
    return {
      host: params.hostname,
      user: params.username,
      password: params.password,
      database: params.pathname.slice(1),
      port: params.port || 5432,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };
  }
  
  // Fallback to individual environment variables
  return {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'car_rental',
    port: process.env.DB_PORT || 5432,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  };
};

const pool = new Pool(getPoolConfig());

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

export default pool;
