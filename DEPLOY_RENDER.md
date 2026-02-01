# Deploy to Render.com - Step by Step

## What is Render?
Render offers **free PostgreSQL database** and **free Node.js web service**.

## Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Ready for Render"
# Create repository on GitHub.com
git remote add origin https://github.com/YOUR_USERNAME/car-rental.git
git push -u origin main
```

## Step 2: Create PostgreSQL Database on Render

1. Go to https://dashboard.render.com
2. Click **"New"** → **"PostgreSQL"**
3. Fill in:
   - **Name**: `car-rental-db` (or any name you want)
   - **Database**: `car_rental`
   - **User**: `postgres`
4. Click **"Create Database"**
5. Wait for it to finish creating (status: Available)

### WHERE TO FIND THE INTERNAL DATABASE URL:

After database is created, you will see a page with:
- **Connection** section
- **Internal Database URL** - COPY THIS!
- It looks like: `postgres://user:password@host:5432/car_rental`

**On the left sidebar or in the Connection section, look for:**
```
Internal Database URL: postgres://xxxxx@yyyy:5432/car_rental
```

Click the **copy button** or select and copy the URL.

## Step 3: Deploy Backend on Render

1. Go to https://dashboard.render.com
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `car-rental-api`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click **"Create Web Service"**

## Step 4: Add Environment Variables

1. In your web service dashboard, click **"Environment"** tab (left sidebar)
2. Scroll down to **"Environment Variables"**
3. Click **"Add"** and add:
   - **Key**: `DATABASE_URL`
   - **Value**: `postgres://user:password@host:5432/car_rental` (paste the URL you copied)
4. Click **"Add"** again:
   - **Key**: `ADMIN_PASSWORD`
   - **Value**: `admin123`
5. Click **"Save Changes"**
6. Your service will automatically restart

## Step 5: Set Up Database Tables

1. Go back to your PostgreSQL database dashboard
2. Click **"PSQL"** button (near the top)
3. A console will open
4. Copy ALL content from `config/schema.sql` file
5. Paste into the PSQL console
6. Press **Enter** to execute
7. You should see `INSERT 0 10` and `CREATE TABLE` messages

## Step 6: Deploy Frontend on Netlify (Free)

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Go to https://netlify.com
3. Drag the `dist` folder to the Netlify page

4. **IMPORTANT**: Update API URL:
   - Edit `src/pages/CarsPage.jsx`:
   ```javascript
   const API_BASE = 'https://your-render-service.onrender.com'
   ```
   - Rebuild: `npm run build`
   - Redploy to Netlify

## Testing Your Deployment

1. API: `https://your-render-service.onrender.com/api/cars`
   - Should return JSON with cars (empty if none added yet)

2. Frontend: `https://your-netlify-site.netlify.app`
   - Should show the homepage

3. Admin: `https://your-netlify-site.netlify.app/admin.html`
   - Password: `admin123`

## Adding Your First Car

1. Go to admin panel
2. Click **"Add New Car"**
3. Fill in the details
4. Click **"Add Car"**
5. The car will appear on the homepage!

## Environment Variables Summary

In Render web service dashboard → Environment:

| Key | Value |
|-----|-------|
| DATABASE_URL | `postgres://user:password@host:5432/car_rental` |
| ADMIN_PASSWORD | `admin123` |

## Troubleshooting

### "Connection refused"
- Check DATABASE_URL is correct (no spaces)
- Make sure database is "Available" (not "Creating")

### "Database does not exist"
- Make sure you ran the SQL schema in PSQL console
- The database name in URL must match what you created

### "Module not found: pg"
- Delete node_modules and package-lock.json
- Run `npm install` and commit
