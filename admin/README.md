# RentACar Admin Panel

Separate admin panel for managing car listings in the RentACar platform.

## Setup

```bash
cd admin
npm install
```

## Configuration

Create a `.env` file in this directory:

```env
VITE_API_URL=http://localhost:3000/api
```

## Development

```bash
npm run dev
```

The admin panel will be available at http://localhost:5174

## Production Build

```bash
npm run build
```

The built files will be in the `dist` folder, which can be deployed to any static hosting service (Netlify, Vercel, etc.)

## API Connection

The admin panel connects to the main API server at `http://localhost:3000/api` by default. Configure the `VITE_API_URL` environment variable to point to your production API server.

## Features

- Login with admin password
- Add new cars with all details
- Edit existing car information
- Delete cars from the database
- Toggle car availability
- View all cars in a table format
