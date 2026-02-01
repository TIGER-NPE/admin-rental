# Deploy Backend to Render.com (Free)

## Architecture

```
┌──────────────────┐          ┌──────────────────┐
│   Netlify        │   API    │   Render         │
│   (Frontend)     │ ───────► │   (Backend)      │
│                  │          │                  │
│ car-rental.netlify.app      │ car-rental-api.onrender.com
└──────────────────┘          └────────┬─────────┘
                                       │
                                       ▼
                              ┌──────────────────┐
                              │   PostgreSQL     │
                              │   (Free DB)      │
                              └──────────────────┘
```

## Step 1: Deploy Backend to Render

### 1.1 Push Code to GitHub

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin master
```

### 1.2 Create Web Service on Render

1. Go to https://dashboard.render.com
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `car-rental-api`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Click **"Create Web Service"**

### 1.3 Add Environment Variables

1. Click **"Environment"** tab
2. Add:
   - `DATABASE_URL` = (from your PostgreSQL database)
   - `ADMIN_PASSWORD` = `admin123`

### 1.4 Create PostgreSQL Database

1. Click **"New"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `car_rental`
   - **Instance type**: **Free**
   - **Storage**: **1 GB**
3. Click **"Create Database"**
4. Copy **Internal Database URL** and add to web service environment

### 1.5 Set Up Database Tables

Visit: `https://car-rental-api-pp6g.onrender.com/api/setup`

Expected response:
```json
{"success":true,"message":"Database setup complete! Tables created: cars, drivers, terms"}
```

### 1.6 Verify Backend

Visit: `https://car-rental-api-pp6g.onrender.com/api/cars`

Expected: `{"success":true,"data":[]}`

---

## Step 2: Deploy Frontend to Netlify

### 2.1 Update API URL

Edit [`src/pages/CarsPage.jsx`](src/pages/CarsPage.jsx):
```javascript
const API_BASE = 'https://car-rental-api-pp6g.onrender.com';
```

### 2.2 Build and Deploy

```bash
npm run build
```

Then:
1. Go to https://app.netlify.com
2. Drag `dist` folder to deploy

Or connect GitHub for automatic deployments.

---

## URLs Summary

| Service | URL |
|---------|-----|
| Frontend (Netlify) | `https://your-site.netlify.app` |
| Admin Panel | `https://your-site.netlify.app/admin.html` |
| Backend API (Render) | `https://car-rental-api-pp6g.onrender.com/api/cars` |
| Database Setup | `https://car-rental-api-pp6g.onrender.com/api/setup` |

---

## Adding Cars

1. Go to `https://your-site.netlify.app/admin.html`
2. Password: `admin123`
3. Click **"Add New Car"**
4. Fill in details and submit
