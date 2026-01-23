# Architecture & Data Flow Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React + TypeScript)           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐│
│  │  Driver          │  │  Shipper         │  │  Logistics   ││
│  │  Dashboard       │  │  Dashboard       │  │  Dashboard   ││
│  │  (Index.tsx)     │  │  (Index.tsx)     │  │  (Index.tsx) ││
│  └────────┬─────────┘  └────────┬─────────┘  └──────┬───────┘│
│           │                     │                   │         │
│           └─────────────┬───────┴─────────────┬────┘         │
│                         │                     │               │
│                  ┌──────▼─────────────────────▼──────┐        │
│                  │   api.getPublicCargoListings()    │        │
│                  │   (via api.ts)                    │        │
│                  └──────┬──────────────────────────┬─┘        │
│                         │                        │            │
│                  HTTP GET Request (No Auth)      │            │
│                  to /api/marketplace/cargo       │            │
│                         │                        │            │
└─────────────────────────┼────────────────────────┼────────────┘
                          │                        │
                          ▼                        │
┌─────────────────────────────────────────────────┼────────────┐
│                    BACKEND (Express.js)        │            │
├─────────────────────────────────────────────────┼────────────┤
│                                                 │            │
│  index.js                                       │            │
│  ├─ Registers routes                          │            │
│  └─ app.use('/api/marketplace', routes)       │            │
│                                                 │            │
│  ┌──────────────────────────────────────┐      │            │
│  │  marketplaceRoutes.js                │      │            │
│  │  GET /cargo                          │◄─────┘            │
│  └────────────────┬─────────────────────┘                   │
│                   │                                         │
│  ┌────────────────▼──────────────────────┐                │
│  │  marketplaceController.js             │                │
│  │  getAllCargoListings()                │                │
│  │  - Queries shipments table            │                │
│  │  - Filters by status                  │                │
│  │  - Returns JSON response              │                │
│  └────────────────┬──────────────────────┘                │
│                   │                                        │
│  ┌────────────────▼──────────────────────┐               │
│  │   PostgreSQL Database                  │               │
│  │   shipments table                      │               │
│  │   WHERE status IN (                   │               │
│  │     'Bidding Open',                   │               │
│  │     'Finding Driver'                  │               │
│  │   )                                    │               │
│  └──────────────────────────────────────┘               │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

## Data Flow Sequence

### Scenario 1: Shipper Posts a Job

```
┌─────────┐         ┌─────────┐         ┌──────────┐         ┌────────┐
│ Shipper │         │Frontend │         │ Backend  │         │Database│
│         │         │         │         │          │         │        │
└────┬────┘         └────┬────┘         └────┬─────┘         └───┬────┘
     │                   │                    │                   │
     │─ Fill Form ─────> │                    │                   │
     │                   │                    │                   │
     │                   │─ POST /shipper/    │                   │
     │                   │   loads ──────────> │                   │
     │                   │                    │                   │
     │                   │                    │─ INSERT shipment ─> │
     │                   │                    │   status: "Bidding  │
     │                   │                    │   Open"            │
     │                   │                    │                   │
     │                   │                    │ <─ Confirm ────────│
     │                   │ <─ Response ───────│                   │
     │ <─ Success ───────│                    │                   │
     │                   │                    │                   │
```

### Scenario 2: Driver Views Cargo in Kwik Shop

```
┌────────┐         ┌─────────┐         ┌──────────┐         ┌────────┐
│ Driver │         │Frontend │         │ Backend  │         │Database│
│        │         │         │         │          │         │        │
└───┬────┘         └───┬─────┘         └────┬─────┘         └───┬────┘
    │                  │                    │                   │
    │─ Click Kwik ──> │                    │                   │
    │   Shop          │                    │                   │
    │                  │                    │                   │
    │                  │ componentDidMount()│                   │
    │                  │ call loadData()    │                   │
    │                  │                    │                   │
    │                  │─ GET /marketplace/ │                   │
    │                  │   cargo ──────────> │                   │
    │                  │ (No Auth header)   │                   │
    │                  │                    │                   │
    │                  │                    │─ SELECT * FROM ──> │
    │                  │                    │   shipments WHERE  │
    │                  │                    │   status IN        │
    │                  │                    │   ('Bidding Open', │
    │                  │                    │    'Finding Driver')│
    │                  │                    │                   │
    │                  │                    │ <─ Return rows ────│
    │                  │ <─ [Cargo items] ──│                   │
    │                  │                    │                   │
    │ <─ Display ─────│ (transform to      │                   │
    │   Cargo Items   │  MarketItem[])     │                   │
    │                  │                    │                   │
    │─ Scroll & View > │                    │                   │
    │                  │                    │                   │
```

### Scenario 3: Real-time Updates (Every 10 Seconds)

```
┌────────┐         ┌─────────┐         ┌──────────┐         ┌────────┐
│ Driver │         │Frontend │         │ Backend  │         │Database│
│        │         │         │         │          │         │        │
└───┬────┘         └───┬─────┘         └────┬─────┘         └───┬────┘
    │                  │                    │                   │
    │                  │ setInterval(       │                   │
    │                  │  loadData, 10000)  │                   │
    │                  │                    │                   │
    │                  ├─────────[10 sec]──→ │                   │
    │                  │ GET /marketplace/  │                   │
    │                  │   cargo ──────────> │                   │
    │                  │                    │─ Query with ────> │
    │                  │                    │  new timestamp    │
    │                  │                    │                   │
    │                  │                    │ <─ Return ────────│
    │                  │ <─ [Updated items]─│   updated list    │
    │                  │                    │                   │
    │ <─ Update ──────│  Re-render         │                   │
    │   Display        │  MarketTab         │                   │
    │                  │                    │                   │
```

## State Management

### Driver Dashboard State
```javascript
const [marketItems, setMarketItems] = useState<any[]>([]);
  // Contains all cargo and hardware items

const [marketFilter, setMarketFilter] = useState('Cargo');
  // Currently selected filter (Cargo, Hardware, etc.)

const [jobs, setJobs] = useState<any[]>([]);
  // All jobs/shipments for browsing
```

### Data Transformation Pipeline

**Raw Database Row:**
```javascript
{
  id: "#KW-123456",
  shipper_id: "uuid-xxx",
  route: "Lilongwe to Blantyre",
  cargo: "Maize Flour",
  weight: 500,
  price: 250000,
  status: "Bidding Open",
  created_at: "2024-01-23T10:30:00Z"
}
```

**Transformed to MarketItem:**
```javascript
{
  id: "#KW-123456",
  name: "Maize Flour",           // from cargo
  cat: "Cargo",                  // hardcoded
  type: "Cargo",                 // hardcoded
  price: 250000,                 // parsed from price
  priceStr: "250000",            // formatted price string
  img: "https://images.unsplash.com/...", // default cargo image
  location: "Lilongwe to Blantyre",  // from route
  provider: "Verified Shipper",  // hardcoded
  details: "Route: Lilongwe to Blantyre | Weight: 500",
  weight: 500,
  date: "1/23/2024"              // formatted created_at
}
```

**MarketTab Filtering:**
```javascript
// Filter by category
marketItems.filter(i => 
  marketFilter === 'All' || i.cat === marketFilter
)
```

## API Response Format

### GET /api/marketplace/cargo

**Status Code:** 200 OK

**Headers:**
```
Content-Type: application/json
```

**Body (JSON Array):**
```json
[
  {
    "id": "#KW-123456",
    "shipper_id": "550e8400-e29b-41d4-a716-446655440000",
    "route": "Lilongwe to Blantyre",
    "cargo": "Maize Flour",
    "weight": 500,
    "price": 250000,
    "status": "Bidding Open",
    "created_at": "2024-01-23T10:30:45.123Z",
    "pickup_date": "2024-01-24",
    "pickup_type": "Standard",
    "order_ref": "ORD-2024-001",
    "color": "text-blue-600 bg-blue-50"
  },
  {
    "id": "#KW-123457",
    "shipper_id": "550e8400-e29b-41d4-a716-446655440001",
    "route": "Blantyre to Mzuzu",
    "cargo": "Rice",
    "weight": 1000,
    "price": null,
    "status": "Finding Driver",
    "created_at": "2024-01-23T11:00:00.000Z",
    "pickup_date": "2024-01-25",
    "pickup_type": "Standard",
    "order_ref": "ORD-2024-002",
    "color": "text-orange-600 bg-orange-50"
  }
]
```

## Error Handling

### Frontend Error Handling
```javascript
const [cargoSource, _] = await Promise.all([
  api.getPublicCargoListings().catch(() => []),  // Returns empty array on error
  // other requests...
]);

// Fallback to authenticated endpoint if public fails
const cargoSource = publicCargoData.length > 0 ? publicCargoData : allJobs;
```

### Backend Error Handling
```javascript
try {
  const result = await pool.query(SQL_QUERY);
  res.json(result.rows);  // 200 with data or empty array
} catch (err) {
  console.error(err);
  res.status(500).json({ error: 'Failed to fetch cargo listings' });
}
```

## Performance Considerations

### Database Query Optimization
- **Columns Selected:** Only necessary fields (id, shipper_id, route, cargo, weight, price, status, created_at, pickup_date, pickup_type, order_ref, color)
- **Filtering:** WHERE status IN ('Bidding Open', 'Finding Driver') - Indexed on status
- **Ordering:** ORDER BY created_at DESC - Indexed on created_at
- **Expected Result Size:** Typically 10-100 items

### Frontend Optimization
- **Lazy Loading:** Consider pagination for large result sets (future enhancement)
- **Caching:** No caching implemented (can be added with Redis)
- **Refresh Interval:** 10 seconds (configurable in loadData useEffect)
- **Re-renders:** Only MarketTab component re-renders when marketItems change

## Security Model

### Public Access
- ✅ No authentication required for viewing cargo
- ✅ No sensitive user data in response (shipper_id only, no email/phone)
- ✅ Read-only endpoint (GET method)

### Protected Operations
- 🔒 Posting cargo: Requires shipper role authentication
- 🔒 Bidding: Requires driver role authentication
- 🔒 Accepting bids: Requires shipper role authentication

## Future Scalability

### Pagination Implementation
```sql
SELECT ... 
FROM shipments 
WHERE status IN ('Bidding Open', 'Finding Driver')
ORDER BY created_at DESC
LIMIT 20 OFFSET 0;  -- Page 1: 0-20, Page 2: 20-40, etc.
```

### Caching Strategy
```javascript
// Add Redis caching
const cargoCache = await redis.get('marketplace:cargo');
if (cargoCache) return JSON.parse(cargoCache);

const data = await db.query(SQL);
await redis.setex('marketplace:cargo', 300, JSON.stringify(data));  // 5 min TTL
```

### Search Implementation
```sql
SELECT ... 
FROM shipments 
WHERE status IN ('Bidding Open', 'Finding Driver')
AND (route ILIKE $1 OR cargo ILIKE $1)  -- Fuzzy search
ORDER BY created_at DESC;
```
