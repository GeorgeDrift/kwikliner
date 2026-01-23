# Quick Setup & Testing Guide

## What Was Changed

### Files Modified:
1. **backend/index.js** - Added marketplace routes
2. **frontend/services/api.ts** - Added public API methods
3. **frontend/pages/dashboards/driver/Index.tsx** - Integrated public cargo
4. **frontend/pages/dashboards/shipper/Index.tsx** - Integrated public cargo
5. **frontend/pages/dashboards/logistics/Index.tsx** - Integrated public cargo

### Files Created:
1. **backend/controllers/marketplaceController.js** - Public marketplace logic
2. **backend/routes/marketplaceRoutes.js** - Public API endpoints

## Testing Instructions

### Step 1: Verify Backend is Running
```bash
# Navigate to backend directory
cd backend

# The server should be running on http://localhost:5000/api
# Check if marketplace endpoints are accessible:
# - http://localhost:5000/api/marketplace/cargo
# - http://localhost:5000/api/marketplace/products
```

### Step 2: Test Public Cargo Endpoint
Open your browser and navigate to:
```
http://localhost:5000/api/marketplace/cargo
```

You should see a JSON response with all available cargo listings (shipper posts with status "Bidding Open" or "Finding Driver").

### Step 3: Log in as Shipper and Post a Job
1. Navigate to application (driver dashboard assumed at home page)
2. Log in as a **Shipper**
3. Go to **Loads** or **Load Postings** tab
4. Click **Post Load** (or similar)
5. Fill in the form:
   - Route: "Lilongwe to Blantyre"
   - Cargo: "Maize Flour"
   - Weight: "500"
   - Price: "250000"
   - Status: Should auto-set to "Bidding Open" or "Finding Driver"
6. Click Post/Submit

### Step 4: Verify Cargo Appears in All Dashboards

#### As Driver:
1. Log out and log in as **Driver**
2. Click **Kwik Shop** in sidebar
3. Select **CARGO** tab (it's already highlighted)
4. **Verify**: You should see the cargo you just posted
5. Features available:
   - See cargo details (route, weight, price)
   - Click "Submit Bid" or "Accept Job"
   - Price shown as "Open to Bids" if not specified

#### As Different Shipper:
1. Log out and log in as a **Different Shipper** (if available)
2. Go to **Marketplace** or **Kwik Shop**
3. **Verify**: You see the cargo posted by the other shipper

#### As Logistics Owner:
1. Log out and log in as **Logistics Owner**
2. Check **Browse Jobs** or **Marketplace** section
3. **Verify**: Cargo posts visible

### Step 5: Verify Real-time Updates
1. Keep one browser tab open as a Driver with Kwik Shop > Cargo tab
2. In another browser tab, log in as Shipper
3. Post a new cargo
4. Check the Driver tab - within 10 seconds, new cargo should appear

### Step 6: Test Bid/Accept Flow
1. As Driver, click on a cargo item
2. Click "Submit Bid" button
3. Enter bid amount
4. Verify bid is recorded
5. As Shipper, navigate to Loads
6. Find the cargo you posted
7. Check "Bids" section
8. Verify driver's bid appears

## Expected Results

### Database Query Results
Run this SQL to verify data is being stored correctly:
```sql
SELECT id, route, cargo, weight, price, status, created_at 
FROM shipments 
WHERE status IN ('Bidding Open', 'Finding Driver')
ORDER BY created_at DESC;
```

You should see all active cargo postings.

### API Response Structure
Each cargo item in the response should have:
```json
{
  "id": "#KW-XXXXXX",           // Unique shipment ID
  "shipper_id": "uuid",          // Shipper who posted it
  "route": "Origin to Destination",
  "cargo": "Cargo Type",
  "weight": 500,                 // Weight value
  "price": 250000,               // Price value (null for open bids)
  "status": "Bidding Open",      // Must be active status
  "created_at": "ISO timestamp",
  "pickup_date": "YYYY-MM-DD",
  "pickup_type": "Standard",
  "order_ref": "reference",
  "color": "CSS classes"
}
```

### Frontend Display
In the Kwik Shop Cargo tab, each item should show:
- [ ] Cargo name/type (from cargo field)
- [ ] Location (from route field)
- [ ] Price (or "Open to Bids")
- [ ] "Submit Bid" or "Accept Job" button
- [ ] Provider: "Verified Shipper"
- [ ] Route and weight details

## Troubleshooting

### "Cannot get /api/marketplace/cargo"
- Check that backend server is running
- Verify marketplaceRoutes.js exists in backend/routes/
- Verify backend/index.js has the marketplace import and route registration

### Cargo posts not appearing in dashboard
- Check browser console for API errors
- Verify the public API endpoint returns data
- Check that you have shipments with status "Bidding Open" or "Finding Driver" in database

### Data not updating
- Check if the 10-second refresh interval is working (check browser Network tab)
- Verify endpoint is being called correctly
- Check for CORS issues in browser console

### Bid/Accept not working
- Ensure you're logged in as the correct role (driver for bidding)
- Check that handleAcceptJob and handleBid functions are properly connected
- Verify backend endpoints for bidding still work

## Key Endpoints for Reference

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | /api/marketplace/cargo | None | Get all active cargo |
| GET | /api/marketplace/products | None | Get all products |
| GET | /api/marketplace/vehicles | None | Get all vehicles for hire |
| GET | /api/marketplace/services | None | Get all logistics services |
| POST | /api/shipper/loads | Shipper | Post new cargo (existing) |
| POST | /api/driver/bids | Driver | Submit bid on cargo (existing) |

## Success Criteria

✅ Shipper can post a job to "Bidding Open" or "Finding Driver" status
✅ Cargo appears in driver's Kwik Shop Cargo tab within 10 seconds
✅ Cargo visible in shipper's marketplace view
✅ Cargo visible in logistics owner's job board
✅ All users see the same cargo listings
✅ Drivers can submit bids
✅ Data persists across page refreshes
✅ No authentication required for cargo viewing

## Support Commands

To clear all test data:
```bash
# SSH into database and run:
DELETE FROM shipments WHERE status IN ('Bidding Open', 'Finding Driver');
```

To restart backend:
```bash
# Terminal 1: Stop server (Ctrl+C)
# Terminal 1: Start again
npm start
# or node index.js
```

To force frontend reload:
```javascript
// In browser console
localStorage.clear();
window.location.reload();
```
