# Car Rental Platform

A full-stack car rental platform with React frontend and Node.js/Express backend.

## Features

- Browse available cars with filters (price, seats, transmission)
- Check availability by selecting pickup date
- Book cars via WhatsApp
- Admin panel to manage cars, drivers, and terms
- Availability date range for cars
- Multi-language support

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MySQL
- **File Upload**: Multer

## Setup Instructions

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install admin dependencies
cd admin && npm install && cd ..
```

### 2. Configure Environment

Copy `.env.example` to `.env` and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=car_rental
PORT=3000
ADMIN_PASSWORD=admin123
```

### 3. Setup Database

Create the database and tables:

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE car_rental;

# Use the database
USE car_rental;

# Run the schema (copy content from config/schema.sql)
```

Or import the schema file:

```bash
mysql -u root -p car_rental < config/schema.sql
```

### 4. Build the Frontend

```bash
npm run build
```

This creates the `dist` folder with the compiled frontend.

### 5. Start the Server

```bash
# Development mode
npm run server

# Production mode (after building)
npm start
```

The server will run on http://localhost:3000

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin.html
- **Admin Password**: `admin123` (or as set in .env)

## API Endpoints

### Public API
- `GET /api/cars` - Get all cars
- `GET /api/cars/:id` - Get single car
- `GET /api/cars/search/:query` - Search cars
- `GET /api/cars/:id/whatsapp` - Get WhatsApp URL
- `GET /api/drivers/available` - Get available drivers
- `GET /api/terms` - Get terms and policies

### Admin API (requires `x-admin-password` header)
- `GET /api/admin/cars` - Get all cars
- `POST /api/admin/cars` - Add new car
- `PUT /api/admin/cars/:id` - Update car
- `DELETE /api/admin/cars/:id` - Delete car
- `POST /api/admin/cars/:id/photo` - Upload car photo
- `GET /api/admin/drivers` - Get all drivers
- `POST /api/admin/drivers` - Add driver
- `PUT /api/admin/drivers/:id` - Update driver
- `DELETE /api/admin/drivers/:id` - Delete driver
- `GET /api/admin/terms` - Get all terms
- `POST /api/admin/terms` - Add term
- `PUT /api/admin/terms/:id` - Update term
- `DELETE /api/admin/terms/:id` - Delete term
- `POST /api/admin/verify` - Verify admin password

## Availability Dates

Cars can have optional availability dates set in the admin panel:
- **Start Date**: The date from which the car becomes available
- **End Date**: The date until which the car is available

Cars will only be shown as available if the selected pickup date falls within this range.

## Production Hosting

For production hosting:

1. Set up a MySQL database on your hosting provider
2. Update `.env` with production database credentials
3. Build the frontend: `npm run build`
4. Start the server: `npm start`
5. Use a process manager like PM2: `pm2 start server.js`

## License

MIT
