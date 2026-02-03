
const API_URL = 'http://localhost:5000/api';

// Helper function with timeout
const fetchWithTimeout = (url: string, options: RequestInit = {}, timeout = 10000): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timeoutId));
};

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

  loginWithEmail: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(`Login failed: ${res.status}`);
    return res.json();
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
  getShipperLoads: async () => {
    const res = await fetchWithTimeout(`${API_URL}/shipper/loads`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) throw new Error(`Failed to fetch loads: ${res.status}`);
    return res.json();
  },
  postLoad: async (loadData: any) => {
    const res = await fetchWithTimeout(`${API_URL}/shipper/loads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(loadData),
    });
    if (!res.ok) throw new Error(`Failed to post load: ${res.status}`);
    return res.json();
  },
  getAvailableDrivers: async () => {
    const res = await fetch(`${API_URL}/shipper/drivers`);
    if (!res.ok) throw new Error(`Failed to fetch drivers: ${res.status}`);
    return res.json();
  },
  getLoadBids: async (loadId: string) => {
    const res = await fetchWithTimeout(`${API_URL}/shipper/loads/${loadId}/bids`);
    if (!res.ok) throw new Error(`Failed to fetch bids: ${res.status}`);
    return res.json();
  },
  acceptBid: async (loadId: string, bidId: string) => {
    const res = await fetchWithTimeout(`${API_URL}/shipper/bids/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ loadId, bidId }),
    });
    if (!res.ok) throw new Error(`Failed to accept bid: ${res.status}`);
    return res.json();
  },

  // --- DRIVER ACTIONS ---
  getAvailableJobs: async () => {
    const res = await fetchWithTimeout(`${API_URL}/driver/jobs`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) throw new Error(`Failed to fetch jobs: ${res.status}`);
    return res.json();
  },
  getDriverTrips: async () => {
    const res = await fetchWithTimeout(`${API_URL}/driver/trips`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) throw new Error(`Failed to fetch trips: ${res.status}`);
    return res.json();
  },
  getDriverStats: async () => {
    const res = await fetchWithTimeout(`${API_URL}/driver/stats`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) throw new Error(`Failed to fetch stats: ${res.status}`);
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
    const res = await fetchWithTimeout(`${API_URL}/logistics/${ownerId}/fleet`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) throw new Error(`Failed to fetch fleet: ${res.status}`);
    return res.json();
  },
  addVehicle: async (vehicle: any) => {
    const res = await fetch(`${API_URL}/logistics/fleet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(vehicle),
    });
    return res.json();
  },
  deleteVehicle: async (vehicleId: string) => {
    await fetch(`${API_URL}/logistics/fleet/${vehicleId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
  },
  getLogisticsStats: async () => {
    const res = await fetch(`${API_URL}/logistics/stats`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return res.json();
  },
  getLogisticsDrivers: async () => {
    const res = await fetch(`${API_URL}/logistics/drivers`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return res.json();
  },
  getLogisticsListings: async () => {
    const res = await fetch(`${API_URL}/logistics/listings`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return res.json();
  },
  getLogisticsAnalytics: async () => {
    const res = await fetch(`${API_URL}/logistics/analytics`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return res.json();
  },
  acceptJob: async (jobId: string, ownerId: string) => {
    // This is for logistics/driver accepting a job
    return { success: true };
  },
  deleteVehicleListing: async (id: string) => {
    const res = await fetch(`${API_URL}/logistics/listings/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) throw new Error(`Failed to delete listing: ${res.status}`);
    return res.json();
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
  deleteDriverListing: async (id: string) => {
    const res = await fetch(`${API_URL}/driver/listings/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) throw new Error(`Failed to delete listing: ${res.status}`);
    return res.json();
  },

  getAvailableFleets: async () => {
    const res = await fetch(`${API_URL}/shipper/vehicle-listings`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) throw new Error(`Failed to fetch fleets: ${res.status}`);
    return res.json();
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
    const res = await fetchWithTimeout(`${API_URL}/products`);
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
    return res.json();
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
  purchaseProducts: async (items: any[]) => {
    const res = await fetch(`${API_URL}/products/buy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ items }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Purchase failed');
    }
    return res.json();
  },
  // --- WALLET ACTIONS ---
  getWallet: async (userId: string) => {
    const res = await fetchWithTimeout(`${API_URL}/wallets/${userId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) throw new Error(`Failed to fetch wallet: ${res.status}`);
    return res.json();
  },
  getSupportedBanks: async () => {
    const res = await fetchWithTimeout(`${API_URL}/wallets/banks`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) throw new Error(`Failed to fetch banks: ${res.status}`);
    return res.json();
  },
  getWalletTransactions: async (userId: string) => {
    const res = await fetchWithTimeout(`${API_URL}/wallets/${userId}/transactions`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) throw new Error(`Failed to fetch transactions: ${res.status}`);
    return res.json();
  },
  withdrawFunds: async (userId: string, amount: number, method: string, details?: any) => {
    const res = await fetch(`${API_URL}/wallets/withdraw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ userId, amount, method, details }),
    });
    return res.json();
  },

  // --- PAYMENT ACTIONS ---
  getPaymentOperators: async () => {
    const res = await fetch(`${API_URL}/payments/operators`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return res.json();
  },
  initiatePayment: async (paymentData: any) => {
    const res = await fetch(`${API_URL}/payments/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(paymentData),
    });
    return res.json();
  },
  verifyPayment: async (chargeId: string) => {
    const res = await fetch(`${API_URL}/payments/verify/${chargeId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return res.json();
  },
  getShipperStats: async () => {
    const res = await fetchWithTimeout(`${API_URL}/shipper/stats`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) throw new Error(`Failed to fetch stats: ${res.status}`);
    return res.json();
  },
  getLogisticsServices: async () => {
    const res = await fetchWithTimeout(`${API_URL}/shipper/logistics-services`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) throw new Error(`Failed to fetch logistics services: ${res.status}`);
    return res.json();
  },
  getShipperBids: async () => {
    const res = await fetchWithTimeout(`${API_URL}/shipper/bids`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) throw new Error(`Failed to fetch bids: ${res.status}`);
    return res.json();
  },
  rateDriver: async (loadId: string, rating: number, comment: string) => {
    const res = await fetch(`${API_URL}/shipper/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ loadId, rating, comment }),
    });
    return res.json();
  },
  bookService: async (serviceId: string) => {
    const res = await fetch(`${API_URL}/shipper/services/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ serviceId }),
    });
    return res.json();
  },

  // --- PUBLIC MARKETPLACE (No Auth Required) ---
  getPublicCargoListings: async () => {
    const res = await fetchWithTimeout(`${API_URL}/marketplace/cargo`);
    if (!res.ok) throw new Error(`Failed to fetch cargo listings: ${res.status}`);
    const data = await res.json();
    console.log('[API] Public cargo listings received:', { count: data?.length, data });
    return data;
  },
  getPublicProducts: async () => {
    const res = await fetchWithTimeout(`${API_URL}/marketplace/products`);
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
    return res.json();
  },
  getPublicVehicleListings: async () => {
    const res = await fetchWithTimeout(`${API_URL}/marketplace/vehicles`);
    if (!res.ok) throw new Error(`Failed to fetch vehicle listings: ${res.status}`);
    return res.json();
  },
  getPublicLogisticsServices: async () => {
    const res = await fetchWithTimeout(`${API_URL}/marketplace/services`);
    if (!res.ok) throw new Error(`Failed to fetch logistics services: ${res.status}`);
    return res.json();
  },
  getPublicMarketplaceAll: async () => {
    const res = await fetchWithTimeout(`${API_URL}/marketplace/all`);
    if (!res.ok) throw new Error(`Failed to fetch all marketplace items: ${res.status}`);
    return res.json();
  },
  getAdminStats: async () => {
    const res = await fetchWithTimeout(`${API_URL}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) throw new Error(`Failed to fetch admin stats: ${res.status}`);
    return res.json();
  },
  getAdminUsers: async (search = '') => {
    const res = await fetchWithTimeout(`${API_URL}/admin/users?search=${search}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) throw new Error(`Failed to fetch admin users: ${res.status}`);
    return res.json();
  },
  toggleUserStatus: async (userId: string) => {
    const res = await fetchWithTimeout(`${API_URL}/admin/users/${userId}/toggle-status`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) throw new Error(`Failed to toggle user status: ${res.status}`);
    return res.json();
  },
};