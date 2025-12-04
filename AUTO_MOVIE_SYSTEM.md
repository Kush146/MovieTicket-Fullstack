# Automatic Movie Addition System

## Overview
This system automatically adds 4-5 movies per day to different theatres, with each theatre having unique seat maps and different movie selections.

## Features

### 1. **Automatic Daily Movie Addition**
- Runs every day at 2:00 AM via Inngest cron job
- Fetches popular/now-playing movies from TMDB API
- Assigns 3-5 movies randomly to each theatre
- Creates shows for the next 7 days with 4 showtimes per day (10:00, 13:30, 17:00, 20:30)
- Automatically cleans up shows older than 7 days

### 2. **Theatre-Specific Movies**
- Each theatre gets a different set of movies (3-5 movies)
- Movies are randomly assigned to ensure variety
- No two theatres will have exactly the same movie lineup

### 3. **Unique Seat Maps Per Theatre**
- Each theatre gets its own unique seat map layout
- Different row/column configurations
- Different aisle positions
- Different seat type distributions (Premium, Standard, Economy)
- Seat maps are generated based on theatre ID for consistency

### 4. **Real-Time Seat Availability**
- Seat availability updates every 2 seconds
- Shows which seats are booked in real-time
- Updates automatically when other users book seats

## API Endpoints

### Manual Trigger (Admin Only)
```
POST /api/show/auto-add
```
Manually trigger the auto-add process (useful for testing)

### Real-Time Seat Availability
```
GET /api/show/:showId/seats
```
Returns current seat availability for a show with timestamp

## How It Works

### Daily Schedule
1. **2:00 AM Daily**: Inngest cron job triggers `autoAddMoviesDaily`
2. **Cleanup**: Removes shows older than 7 days
3. **Fetch Movies**: Gets popular/now-playing movies from TMDB
4. **Assign to Theatres**: Randomly assigns 3-5 movies to each theatre
5. **Generate Seat Maps**: Creates unique seat map for each theatre (if not exists)
6. **Create Shows**: Creates shows for next 7 days with 4 showtimes per day

### Seat Map Generation
- Uses theatre ID as seed for consistent but unique layouts
- Generates different row/column counts (8-16 rows, 12-20 columns)
- Different aisle positions
- Seat types: Premium (first 2 rows), Standard (middle), Economy (last 2 rows)

### Real-Time Updates
- Frontend polls `/api/show/:showId/seats` every 2 seconds
- Backend returns current `occupiedSeats` object
- UI updates automatically to show booked/available seats

## Configuration

### Environment Variables Required
- `TMDB_API_KEY`: Your TMDB API key
- `INNGEST_EVENT_KEY`: Inngest event key (for scheduled jobs)

### Inngest Setup
The scheduled function is registered in `server/inngest/index.js`:
```javascript
{ cron: "0 2 * * *" } // Every day at 2 AM
```

## Testing

### Manual Trigger
1. Login as admin
2. Call `POST /api/show/auto-add`
3. Check logs for movies and shows created

### Verify Results
- Check `/api/show/all` to see all shows
- Check individual movie pages to see showtimes
- Check seat selection page to see real-time updates

## Files Created/Modified

### New Files
- `server/utils/seatMapGenerator.js` - Generates unique seat maps
- `server/utils/autoMovieAdder.js` - Main auto-add logic

### Modified Files
- `server/inngest/index.js` - Added scheduled function
- `server/controllers/showController.js` - Added seat availability endpoint
- `server/routes/showRoutes.js` - Added new routes
- `client/src/pages/SeatLayout.jsx` - Updated polling frequency

## Notes

- The system requires at least one theatre to be added before it can run
- Movies are fetched from TMDB's now-playing and popular endpoints
- Shows are created for the next 7 days only
- Old shows are automatically cleaned up
- Each theatre maintains its own seat map across all shows

