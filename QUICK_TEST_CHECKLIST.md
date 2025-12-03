# Quick Test Checklist

## 🚀 Setup
- [ ] Server running (`cd server && npm run dev`)
- [ ] Client running (`cd client && npm run dev`)
- [ ] User logged in
- [ ] Test promo codes created (see below)

---

## ✅ Feature 1: Movie Search & Filters

### Global Search
- [ ] Click search icon in Navbar
- [ ] Type movie name → See results
- [ ] Click result → Navigate to movie
- [ ] Press Escape → Modal closes

### Movies Page Filters
- [ ] Go to `/movies`
- [ ] Type in search bar → Movies filter
- [ ] Click "Filters" → Panel opens
- [ ] Select genre chips → Movies filter
- [ ] Move rating slider → Movies filter
- [ ] Click sort buttons → Movies reorder
- [ ] Click "Clear All" → Filters reset

---

## ✅ Feature 2: Booking Improvements

### Booking Cancellation
- [ ] Create a booking (or use existing unpaid)
- [ ] Go to `/my-bookings`
- [ ] Click "Cancel" → Confirm
- [ ] Booking shows as "Cancelled"

### Booking Filters
- [ ] Click "All Bookings" → Shows all
- [ ] Click "Upcoming" → Shows future only
- [ ] Click "Past" → Shows completed only
- [ ] Click "Payment Pending" → Shows unpaid only
- [ ] Click "Cancelled" → Shows cancelled only

### QR Code & Sharing
- [ ] Click "View QR" on paid booking
- [ ] Modal shows booking reference
- [ ] Click "Download" → File downloads
- [ ] Click "Share" → Details copied/shared

---

## ✅ Feature 3: Seat Selection

### Visual Seat Map
- [ ] Go to movie → Select date/time → "Buy Tickets"
- [ ] See screen at top
- [ ] See seat legend (Premium/Standard/Economy)

### Seat Recommendations
- [ ] Click "Select Best Seats" button
- [ ] Center seats auto-selected (C/D/E, seats 4-6)
- [ ] Sparkle icons on recommended seats

### Seat Pricing
- [ ] Hover over seats → See price tooltip
- [ ] Select different seat types
- [ ] Check booking summary shows correct prices

### Real-time Updates
- [ ] Open 2 browser windows
- [ ] Select seats in window 1
- [ ] Window 2 updates within 5 seconds
- [ ] "Updated Xs ago" shows

---

## ✅ Feature 4: Payment Improvements

### Promo Codes
- [ ] In seat selection, enter "WELCOME10"
- [ ] Click "Apply" → Success message
- [ ] Discount appears in summary
- [ ] Total reduces
- [ ] Click "Remove" → Code clears

### Loyalty Points
- [ ] See "Use Loyalty Points" section
- [ ] Toggle switch → Discount calculated
- [ ] Check max 50% discount limit
- [ ] Complete booking → Points earned

### Payment Retry
- [ ] Find unpaid booking in `/my-bookings`
- [ ] Click "Retry Payment" (if no link)
- [ ] Redirects to Stripe checkout

---

## 🎯 Create Test Promo Codes

### Option 1: Using MongoDB Shell
```javascript
use your_database_name

db.promocodes.insertOne({
  code: "WELCOME10",
  discountType: "PERCENTAGE",
  discountValue: 10,
  minAmount: 0,
  validUntil: new Date("2025-12-31"),
  isActive: true,
  description: "10% off for new users"
})
```

### Option 2: Using the Script
```bash
cd server
node scripts/createTestPromo.js
```

### Test Promo Codes:
- **WELCOME10** - 10% off (no minimum)
- **SAVE20** - $20 off (min $100)
- **MOVIE50** - 50% off, max $25 (min $50)

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Search not working | Check if movies are loaded |
| Promo code invalid | Verify code exists in database |
| Loyalty points not showing | User must be logged in |
| Seat updates slow | Wait 5 seconds (polling interval) |
| Payment retry fails | Check Stripe keys configured |

---

## 📱 Mobile Testing
- [ ] Test on mobile device
- [ ] Check responsive design
- [ ] Test touch interactions
- [ ] Verify share functionality

---

## ⚡ Performance
- [ ] Search responds quickly (< 300ms)
- [ ] Filters update smoothly
- [ ] Seat selection is responsive
- [ ] No lag when selecting seats

---

**Time to complete: ~15-20 minutes**

