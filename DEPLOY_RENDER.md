# Deploy Everything to Render.com (Backend + Frontend)

Now your app is configured to host **both backend and frontend** on Render!

## What Changed

1. **Backend** (`server.js`) now serves the React frontend from the `dist` folder
2. **Frontend** (`CarsPage.jsx`) uses relative API path `/api`
3. **Package.json** builds frontend before starting server

## Step 1: Build and Test Locally

```bash
# Build the frontend
npm run build

# Start the server (which now serves the frontend)
npm start
```

Visit: http://localhost:3000

## Step 2: Push to GitHub

```bash
git add .
git commit -m "Configure for full Render deployment"
git push origin master
```

## Step 3: Update Render Web Service

1. Go to your web service on Render
2. Click **"Settings"** tab
3. Scroll to **"Build Command"**
4. Change to: `npm install`
5. Scroll to **"Start Command"**
6. Change to: `npm start`
7. Click **"Save"**

Render will automatically:
1. Run `npm install`
2. Run `npm run build` (via `npm start`)
3. Start the server on port 3000

## Step 4: Access Your App

| Page | URL |
|------|-----|
| Homepage | `https://your-service.onrender.com/` |
| Admin Panel | `https://your-service.onrender.com/admin.html` |
| API | `https://your-service.onrender.com/api/cars` |
| Setup Database | `https://your-service.onrender.com/api/setup` |

## Step 5: Set Up Database

1. Visit: `https://your-service.onrender.com/api/setup`
2. You should see:
   ```json
   {"success":true,"message":"Database setup complete! Tables created: cars, drivers, terms"}
   ```

## Step 6: Add Your First Car

1. Go to `https://your-service.onrender.com/admin.html`
2. Password: `admin123`
3. Click **"Add New Car"**
4. Fill in details and upload a photo
5. Click **"Add Car"**

## Architecture

```
┌─────────────────────────────────────────┐
│              Render Web Service          │
│  ┌─────────────────────────────────┐    │
│  │         Node.js Server          │    │
│  │  ┌─────────────────────────┐    │    │
│  │  │   Express API Routes    │    │    │
│  │  │   /api/cars             │    │    │
│  │  │   /api/setup            │    │    │
│  │  └─────────────────────────┘    │    │
│  │  ┌─────────────────────────┐    │    │
│  │  │   Static Files (dist)   │    │    │
│  │  │   React Frontend        │    │    │
│  │  │   /admin.html           │    │    │
│  │  └─────────────────────────┘    │    │
│  └─────────────────────────────────┘    │
│                    │                    │
│                    ▼                    │
│         ┌──────────────────┐           │
│         │ PostgreSQL DB    │           │
│         │ (Free Instance)  │           │
│         └──────────────────┘           │
└─────────────────────────────────────────┘
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Make sure `npm run build` works locally |
| 404 on pages | Check SPA routing is enabled in server.js |
| API returns empty | Run `/api/setup` to create tables |
| CORS errors | CORS is enabled, should work |
| Images not showing | Check uploads folder permissions |

## Environment Variables on Render

Make sure these are set in your web service:

| Key | Value |
|-----|-------|
| DATABASE_URL | `postgres://...` (from PostgreSQL) |
| ADMIN_PASSWORD | `admin123` (or your choice) |

## URLs Summary

```
Frontend:     https://car-rental-api-pp6g.onrender.com/
Admin Panel:  https://car-rental-api-pp6g.onrender.com/admin.html
API:          https://car-rental-api-pp6g.onrender.com/api/cars
Setup:        https://car-rental-api-pp6g.onrender.com/api/setup
```
