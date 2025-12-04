# Quick Fix: Movies Not Showing

## Problem
Movies aren't showing because there are no **shows** in the database yet.

## Solution

### Step 1: Seed Theatres (if not done)
```bash
cd server
node scripts/seedTheatres.js
```

### Step 2: Run Auto Add Movies
1. Go to: `http://localhost:5173/admin`
2. Click **"Auto Add Movies"** button (top right)
3. Wait for success message

### Step 3: Check Results
- Go to `/movies` - should see movies
- Go to `/` - movies should appear on home page

## How Movies Work

Movies come from **shows** in the database:
- `/api/show/all` gets all shows
- Extracts unique movies from those shows
- If no shows exist → no movies display

## Manual Check

Test the API directly:
```bash
# Check if shows exist
curl http://localhost:3000/api/show/all

# Should return JSON with movies array
```

## Troubleshooting

**"No theatres found" error:**
- Run: `node scripts/seedTheatres.js`

**Movies still not showing:**
- Check server console for errors
- Verify TMDB_API_KEY is set
- Check if shows were created in database
- Refresh the page (Ctrl+F5)

