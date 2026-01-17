
const API_URL = 'http://localhost:5000/api';

export const api = {
  // --- AUTH ---
  login: async (role: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      return await res.json();
    } catch (e) {
      return { id: 'offline', role, name: 'Offline User', isVerified: true };
    }
  },
  updateProfile: async (id: string, data: any) => {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // --- SHIPPER ACTIONS ---
  getShipperLoads: async (shipperId: string) => {
    const res = await fetch(`${API_URL}/shipper/${shipperId}/loads`);
    return res.json();
  },
  postLoad: async (loadData: any) => {
    const res = await fetch(`${API_URL}/shipper/loads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loadData),
    });
    return res.json();
  },
  getAvailableDrivers: async () => {
    const res = await fetch(`${API_URL}/shipper/drivers`);
    return res.json();
  },
  getLoadBids: async (loadId: string) => {
    try {
      const res = await fetch(`${API_URL}/shipper/loads/${loadId}/bids`);
      return await res.json();
    } catch (e) { return []; }
  },
  acceptBid: async (loadId: string, bidId: string) => {
    const res = await fetch(`${API_URL}/shipper/loads/${loadId}/bids/${bidId}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return res.json();
  },

  // --- DRIVER ACTIONS ---
  getAvailableJobs: async () => {
    try {
      const res = await fetch(`${API_URL}/driver/jobs`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      return await res.json();
    } catch { return []; }
  },
  getDriverTrips: async () => {
    const res = await fetch(`${API_URL}/driver/trips`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return res.json();
  },
  bidOnLoad: async (loadId: string, bidData: any) => {
    const res = await fetch(`${API_URL}/driver/bids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ loadId, ...bidData }),
    });
    return res.json();
  },
  driverCommitToJob: async (loadId: string, decision: 'COMMIT' | 'DECLINE', reason?: string) => {
    const res = await fetch(`${API_URL}/driver/jobs/commit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ loadId, decision, reason }),
    });
    return res.json();
  },
  updateTripxStatus: async (loadId: string, status: string) => {
    const res = await fetch(`${API_URL}/driver/jobs/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ loadId, status }),
    });
    return res.json();
  },


  // --- LOGISTICS ACTIONS ---
  getFleet: async (ownerId: string) => {
    const res = await fetch(`${API_URL}/logistics/${ownerId}/fleet`);
    return res.json();
  },
  addVehicle: async (vehicle: any) => {
    const res = await fetch(`${API_URL}/logistics/fleet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicle),
    });
    return res.json();
  },
  deleteVehicle: async (vehicleId: string) => {
    await fetch(`${API_URL}/logistics/fleet/${vehicleId}`, { method: 'DELETE' });
  },
  acceptJob: async (jobId: string, ownerId: string) => {
    // This is for logistics/driver accepting a job
    return { success: true };
  },

  // --- TRUCK HIRING FLOW ---
  postVehicleAvailability: async (data: any) => {
    const res = await fetch(`${API_URL}/driver/availability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getAvailableFleets: async () => {
    // Fetch list of trucks available for hire
    // Mocking for now as backend might not have it
    return [
      { id: 'av-1', company: 'Logistics Pro', routes: 'LLW - BT', capacity: '30T', price: 'MWK 20000/day' },
      { id: 'av-2', company: 'Fast Haul', routes: 'Mzuzu - LLW', capacity: '15T', price: 'MWK 15000/day' }
    ];
  },
  hireTruck: async (listingId: string, hireData: any) => {
    // Shipper hires a truck -> Creates a shipment with status 'Waiting for Confirmation'
    // This interacts with POST /shipper/loads but with specific 'hire' flag or assigned driver
    return { success: true };
  },
  approveHireRequest: async (jobId: string) => {
    // Logistics/Driver approves the hire -> Updates status to 'Pending Deposit'
    return { success: true };
  },

  // --- MARKET/HARDWARE ACTIONS ---
  getProducts: async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch (e) { return []; }
  },
  createProduct: async (product: any) => {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return res.json();
  },
  updateProduct: async (id: string, updates: any) => {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },
  deleteProduct: async (id: string) => {
    await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
  },
  // --- WALLET ACTIONS ---
  getWallet: async (userId: string) => {
    const res = await fetch(`${API_URL}/wallets/${userId}`);
    return res.json();
  },
  getWalletTransactions: async (userId: string) => {
    const res = await fetch(`${API_URL}/wallets/${userId}/transactions`);
    return res.json();
  },
  withdrawFunds: async (userId: string, amount: number, method: string) => {
    const res = await fetch(`${API_URL}/wallets/withdraw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, amount, method }),
    });
    return res.json();
  },
};
