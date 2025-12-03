# Testing Guide for New Features

## Prerequisites
1. Make sure both client and server are running:
   ```bash
   # Terminal 1 - Server
   cd server
   npm run dev

   # Terminal 2 - Client
   cd client
   npm run dev
   ```

2. Ensure you have:
   - A user account (login required for most features)
   - Some movies/shows in the database
   - Stripe keys configured (for payment testing)

---

## 1. Movie Search & Filters

### Global Search (Navbar)
1. **Test Search Icon**
   - Click the search icon in the Navbar (top right)
   - A modal should appear with a search input

2. **Test Search Functionality**
   - Type a movie title (e.g., "Avengers")
   - Results should appear in real-time as you type
   - Click on a result to navigate to movie details
   - Press `Escape` to close the modal
   - Click outside the modal to close it

3. **Test Empty States**
   - Search for a non-existent movie
   - Should show "No movies found" message
   - Clear search with X button

### Movies Page Filters
1. **Navigate to Movies Page**
   - Go to `/movies` route
   - You should see all movies with filter controls

2. **Test Search Bar**
   - Type in the search bar at the top
   - Movies should filter in real-time
   - Clear search with X button

3. **Test Filter Toggle**
   - Click "Filters" button
   - Filter panel should expand/collapse
   - Active filter count badge should appear

4. **Test Genre Filter**
   - Click on genre chips (Action, Drama, etc.)
   - Selected genres should highlight in red
   - Movies should filter by selected genres
   - Click again to deselect

5. **Test Rating Filter**
   - Use the rating slider
   - Set minimum rating (e.g., 7.0)
   - Only movies with that rating or higher should show
   - Check the rating display updates

6. **Test Sort Options**
   - Click different sort buttons:
     - Popularity
     - Rating
     - Release Date
     - Title
   - Movies should reorder accordingly
   - Active sort should be highlighted in red

7. **Test Clear Filters**
   - Apply multiple filters
   - Click "Clear All"
   - All filters should reset
   - All movies should show again

8. **Test Results Count**
   - Check "Showing X of Y movies" text
   - Should update as filters change

---

## 2. Booking Improvements

### Booking Cancellation
1. **Create a Test Booking**
   - Go to a movie detail page
   - Select date and time
   - Select seats
   - Complete booking (or leave unpaid)

2. **Test Cancellation**
   - Go to `/my-bookings`
   - Find an unpaid or upcoming booking
   - Click "Cancel" button
   - Confirm cancellation
   - Booking should show as "Cancelled"
   - Seats should be released

3. **Test Cancellation Restrictions**
   - Try to cancel a past show (should fail)
   - Try to cancel already cancelled booking (should fail)

### Booking Filters
1. **Navigate to My Bookings**
   - Go to `/my-bookings`
   - You should see filter buttons

2. **Test Each Filter**
   - Click "All Bookings" - shows everything
   - Click "Upcoming" - shows only future paid bookings
   - Click "Past" - shows only completed bookings
   - Click "Payment Pending" - shows unpaid bookings
   - Click "Cancelled" - shows cancelled bookings

3. **Test Results Count**
   - Check "Showing X of Y bookings" updates correctly

### QR Code & Ticket Download
1. **View QR Code**
   - Go to a paid booking
   - Click "View QR" button
   - Modal should show booking reference
   - Should display movie details and seats

2. **Download Ticket**
   - In QR modal or booking card
   - Click "Download" button
   - HTML file should download
   - Open file and verify ticket details

3. **Share Booking**
   - Click "Share" button
   - Should copy booking details to clipboard
   - Or open native share dialog (on mobile)
   - Verify shared text contains correct info

### Booking Status Badges
1. **Check Status Colors**
   - Upcoming: Blue badge
   - Completed: Green badge
   - Payment Pending: Yellow badge
   - Cancelled: Gray badge

---

## 3. Seat Selection Enhancements

### Visual Seat Map
1. **Navigate to Seat Selection**
   - Go to movie details
   - Select date and time
   - Click "Buy Tickets"
   - Should see seat layout page

2. **Test Screen Display**
   - Verify screen is shown at top
   - Should have gradient effect
   - "SCREEN" label should be visible

3. **Test Seat Legend**
   - Check legend shows:
     - Premium (yellow)
     - Standard (blue)
     - Economy (gray)
     - Selected (red)
     - Booked (gray, disabled)

### Seat Recommendations
1. **Select a Show Time**
   - Choose a time slot
   - Wait for seats to load

2. **Test Recommendation Button**
   - Click "Select Best Seats" button
   - Should auto-select center seats (C, D, E rows, seats 4-6)
   - Selected seats should highlight in red
   - Sparkle icon should appear on recommended seats

3. **Test Manual Selection**
   - Clear selections
   - Click individual seats
   - Recommended seats should still show sparkle icon

### Seat Type Pricing
1. **Check Seat Prices**
   - Hover over different seats
   - Tooltip should show seat ID, type, and price
   - Premium seats (A, B) should cost more
   - Economy seats (F-J) should cost less

2. **Test Booking Summary**
   - Select seats from different rows
   - Check booking summary shows:
     - Individual seat prices
     - Seat types (Premium/Standard/Economy)
     - Total amount

### Real-time Updates
1. **Test Seat Availability**
   - Open seat selection in two browser windows
   - Select seats in one window
   - Other window should update within 5 seconds
   - "Updated Xs ago" should show

2. **Test Occupied Seats**
   - Select a seat
   - In another window, same seat should show as occupied
   - Should not be clickable

---

## 4. Payment Improvements

### Promo Codes
1. **Create a Test Promo Code** (via database or admin)
   ```javascript
   // Example promo code structure
   {
     code: "WELCOME10",
     discountType: "PERCENTAGE",
     discountValue: 10,
     minAmount: 50,
     validUntil: new Date("2025-12-31"),
     isActive: true
   }
   ```

2. **Test Promo Code Application**
   - Go to seat selection
   - Select seats (ensure total > minimum amount)
   - Enter promo code in "Promo Code" field
   - Click "Apply"
   - Should show success message
   - Discount should appear in summary
   - Total should reduce

3. **Test Invalid Promo Codes**
   - Enter invalid code → Should show error
   - Enter expired code → Should show error
   - Enter code with amount below minimum → Should show error
   - Try to use code that reached usage limit → Should show error

4. **Test Promo Code Removal**
   - Apply a valid code
   - Click "Remove" next to applied code
   - Code should clear
   - Discount should be removed

### Loyalty Points
1. **Check Loyalty Points Display**
   - Login to account
   - Go to seat selection
   - Should see "Use Loyalty Points" section
   - Should show available points

2. **Test Loyalty Points Toggle**
   - Toggle "Use Loyalty Points" switch
   - Should calculate discount (max 50% of total)
   - Discount should appear in summary
   - Should show how many points will be used

3. **Test Points Calculation**
   - Points = 1% of booking amount
   - 1 point = $0.01 discount
   - Max discount = 50% of booking total
   - Verify calculations in summary

4. **Test Points After Booking**
   - Complete a paid booking
   - Check loyalty points increase
   - Points should be awarded after payment

### Payment Retry
1. **Create Unpaid Booking**
   - Select seats
   - Start checkout but don't complete payment
   - Or let payment link expire

2. **Test Retry Payment**
   - Go to `/my-bookings`
   - Find unpaid booking
   - If payment link exists: Click "Pay Now"
   - If no link: Click "Retry Payment"
   - Should redirect to new Stripe checkout

3. **Test Multiple Retries**
   - Retry payment multiple times
   - Should create new payment session each time
   - Retry count should increment

---

## Integration Testing

### Complete Booking Flow
1. **Full Booking with Discounts**
   - Search for a movie
   - Filter by genre
   - Select movie
   - Choose date/time
   - Use "Select Best Seats"
   - Apply promo code
   - Toggle loyalty points
   - Verify total calculation
   - Complete payment
   - Check booking in "My Bookings"
   - View QR code
   - Download ticket
   - Share booking

2. **Booking Cancellation Flow**
   - Create booking
   - Cancel booking
   - Verify seats released
   - Check refund amount
   - Verify loyalty points refunded (if used)

3. **Real-time Seat Updates**
   - Open two browser windows
   - Both select same show
   - Select seats in window 1
   - Window 2 should update automatically
   - Complete booking in window 1
   - Window 2 should show seats as booked

---

## Common Issues & Solutions

### Issue: Search not working
- **Check**: Movies are loaded in context
- **Solution**: Verify `shows` array in AppContext

### Issue: Promo code not applying
- **Check**: Promo code exists in database
- **Check**: Minimum amount requirement
- **Check**: Code is active and not expired

### Issue: Loyalty points not showing
- **Check**: User is logged in
- **Check**: User document exists in database
- **Solution**: Points are created on first booking

### Issue: Seat updates not real-time
- **Check**: Both windows on same show
- **Check**: Polling interval (5 seconds)
- **Solution**: Refresh if needed

### Issue: Payment retry not working
- **Check**: Booking exists and is unpaid
- **Check**: Stripe keys are configured
- **Check**: Network connection

---

## Database Setup for Testing

### Create Test Promo Codes
```javascript
// In MongoDB or via API
db.promocodes.insertMany([
  {
    code: "WELCOME10",
    discountType: "PERCENTAGE",
    discountValue: 10,
    minAmount: 0,
    validUntil: new Date("2025-12-31"),
    isActive: true,
    description: "10% off for new users"
  },
  {
    code: "SAVE20",
    discountType: "FIXED",
    discountValue: 20,
    minAmount: 100,
    validUntil: new Date("2025-12-31"),
    isActive: true,
    description: "$20 off on orders over $100"
  }
])
```

---

## Browser Testing Checklist

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (if on Mac)
- [ ] Mobile responsive (Chrome DevTools)
- [ ] Test on actual mobile device

---

## Performance Testing

1. **Search Performance**
   - Test with 100+ movies
   - Verify search is fast (< 300ms)

2. **Filter Performance**
   - Apply multiple filters
   - Verify smooth UI updates

3. **Real-time Updates**
   - Test with multiple concurrent users
   - Verify seat updates don't lag

---

## Security Testing

1. **Authentication**
   - Try accessing bookings without login
   - Verify proper error handling

2. **Authorization**
   - Try cancelling another user's booking
   - Should fail with "Unauthorized"

3. **Input Validation**
   - Try invalid promo codes
   - Try negative seat selections
   - Verify proper validation

---

## Notes

- All features require user authentication (except browsing movies)
- Stripe test mode keys should be used for payment testing
- Real-time updates use polling (5-second interval)
- Loyalty points are awarded after successful payment
- Promo codes are case-insensitive (converted to uppercase)

