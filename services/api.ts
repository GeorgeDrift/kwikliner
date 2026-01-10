
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

  // --- DRIVER ACTIONS ---
  getAvailableJobs: async () => {
    const res = await fetch(`${API_URL}/driver/jobs`);
    return res.json();
  },
  getDriverTrips: async (driverId: string) => {
    const res = await fetch(`${API_URL}/driver/${driverId}/trips`);
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
};
