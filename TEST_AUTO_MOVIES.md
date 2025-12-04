# How to Test Auto Movie Addition System

## Prerequisites

1. **Backend server must be running**
   ```bash
   cd server
   npm run server
   ```

2. **At least one theatre must exist in the database**
   - Go to `/theatres` page
   - Or add a theatre via the admin panel

3. **You must be logged in as admin**
   - Email: `kushkore.work@gmail.com`

## Method 1: Manual Trigger via API (Recommended for Testing)

### Option A: Using Browser Console

1. **Open your browser** and go to `http://localhost:5173/admin`
2. **Open Developer Tools** (F12)
3. **Go to Console tab**
4. **Run this command:**
   ```javascript
   fetch('http://localhost:3000/api/show/auto-add', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${await window.Clerk?.session?.getToken()}`
     }
   })
   .then(res => res.json())
   .then(data => console.log('Result:', data))
   .catch(err => console.error('Error:', err))
   ```

### Option B: Using Postman/Thunder Client

1. **URL:** `POST http://localhost:3000/api/show/auto-add`
2. **Headers:**
   - `Content-Type: application/json`
   - `Authorization: Bearer YOUR_CLERK_TOKEN`
3. **Body:** (empty)
4. **Send Request**

### Option C: Using cURL

```bash
curl -X POST http://localhost:3000/api/show/auto-add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN"
```

## Method 2: Using Admin Dashboard Button (Easiest) ✅

I've added a button to the admin dashboard for easy testing!

1. **Go to Admin Dashboard**: `http://localhost:5173/admin`
2. **Click the "Auto Add Movies" button** (top right, next to "Admin Dashboard" title)
3. **Confirm** when prompted
4. **Wait for success message** showing how many movies and shows were created
5. **Check the results** - movies should appear on the home page and movies page

## Method 3: Check Server Logs

After triggering, check your server console for:
```
Starting automatic movie addition...
Auto-add complete: X movies added, Y shows created
```

## How to Verify It Worked

### 1. Check Movies Page
- Go to `/movies` 
- You should see new movies listed
- Each movie should have showtimes

### 2. Check Home Page
- Go to `/`
- Movies should appear in "Now Showing" section

### 3. Check Individual Movie
- Click on any movie
- You should see available showtimes for the next 7 days
- Times: 10:00, 13:30, 17:00, 20:30

### 4. Check Different Theatres
- Go to `/theatres`
- Select different theatres
- Each theatre should have different movies (3-5 movies each)

### 5. Check Seat Maps
- Go to a movie → Select date/time → "Buy Tickets"
- Each theatre should have a unique seat layout
- Different row/column counts
- Different aisle positions

### 6. Check Admin Dashboard
- Go to `/admin`
- "Total Bookings" and "Active Shows" should update
- "Active Shows" section should show new movies

## What Gets Created

For each theatre:
- **3-5 movies** (randomly assigned)
- **7 days** of shows
- **4 showtimes per day** (10:00, 13:30, 17:00, 20:30)
- **Unique seat map** (if doesn't exist)

**Total shows per theatre**: 3-5 movies × 7 days × 4 showtimes = **84-140 shows per theatre**

## Troubleshooting

### "No theatres found"
- Add at least one theatre first
- Go to `/theatres` and add a theatre

### "Network Error"
- Make sure backend server is running on port 3000
- Check `VITE_BASE_URL` in client `.env` file

### "Not authorized"
- Make sure you're logged in as admin
- Email must be: `kushkore.work@gmail.com`

### No movies showing
- Check server console for errors
- Verify TMDB_API_KEY is set in server `.env`
- Check if movies were actually created in database

## Expected Results

After running auto-add:
- ✅ Movies appear on home page
- ✅ Movies appear on movies page  
- ✅ Each theatre has different movies
- ✅ Each theatre has unique seat maps
- ✅ Shows created for next 7 days
- ✅ 4 showtimes per day per movie
- ✅ Old shows (older than 7 days) are cleaned up

