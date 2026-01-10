
// --- IN-MEMORY DATABASE ---

let users = [
  { id: 'demo-shipper', role: 'SHIPPER', name: 'John Shipper', phone: '+265 999 123', email: 'john@shipper.com', companyName: 'Malawi Exports', isVerified: true },
  { id: 'demo-driver', role: 'DRIVER', name: 'Musa Driver', phone: '+265 888 321', email: 'musa@driver.com', companyName: 'Independent', isVerified: true, truck: '30T Flatbed', location: 'Lilongwe' },
  { id: 'demo-logistics_owner', role: 'LOGISTICS_OWNER', name: 'Fleet Dynamics Ltd', phone: '+265 111 222', email: 'fleet@dynamics.com', companyName: 'Fleet Dynamics', isVerified: true },
  { id: 'demo-hardware_owner', role: 'HARDWARE_OWNER', name: 'KwikSpares Central', phone: '+265 777 888', email: 'shop@kwikspares.com', companyName: 'KwikSpares', isVerified: true }
];

let products = [
  { id: '1', name: 'GPS Tracker v4', price: '45000', stock: 12, category: 'Tech', image: 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80&w=400', ownerId: 'demo-hardware_owner', seller: 'KwikSpares Central' },
  { id: '2', name: 'Heavy-Duty 20T Jack', price: '85000', stock: 5, category: 'Hardware', image: 'https://images.unsplash.com/photo-1635773103130-1845943f6067?auto=format&fit=crop&q=80&w=400', ownerId: 'demo-hardware_owner', seller: 'KwikSpares Central' },
  { id: 'c1', name: 'Industrial Generator', price: '1500000', stock: 2, category: 'Power', image: 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80&w=400', ownerId: 'other-1', seller: 'Power Systems Ltd' },
  { id: 'c2', name: 'Solar Water Pump', price: '450000', stock: 15, category: 'Agri', image: 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80&w=400', ownerId: 'other-2', seller: 'Agri-Tech Solutions' },
];

let vehicles = [
  { id: '1', make: 'Volvo', model: 'FH16', plate: 'MC 9982', capacity: '30T', type: 'Flatbed', status: 'Available', image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=400', ownerId: 'demo-logistics_owner' },
  { id: '2', make: 'Scania', model: 'R450', plate: 'BZ 2231', capacity: '45T', type: 'Tanker', status: 'On Trip', image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=400', ownerId: 'demo-logistics_owner' }
];

let shipments = [
  { id: '#KW-900224', route: 'Lilongwe → Blantyre', cargo: 'Fertilizer (12T)', price: 'MWK 450,000', status: 'In Transit', color: 'text-blue-600 bg-blue-50', shipperId: 'demo-shipper' },
  { id: '#KW-900226', route: 'Lilongwe → Lusaka', cargo: 'Equipment (4T)', price: 'USD 1,200', status: 'Finding Driver', color: 'text-blue-600 bg-blue-50', shipperId: 'demo-shipper' },
  { id: '#KW-JB-103', route: 'Lusaka → Lilongwe', cargo: 'Maize (25T)', price: 'USD 900', status: 'Finding Driver', color: 'text-green-600 bg-green-50', shipperId: 'other-shipper' }
];

// --- AUTH CONTROLLER ---
exports.authController = {
  login: (req, res) => {
    const { role } = req.body;
    const user = users.find(u => u.role === role);
    if (user) return res.json(user);
    
    // Create temp user if not found for demo purposes
    const newUser = { id: Date.now().toString(), role, name: 'New User', phone: '', isVerified: true, complianceStatus: 'APPROVED' };
    users.push(newUser);
    res.json(newUser);
  },
  
  register: (req, res) => {
    const newUser = { id: Date.now().toString(), ...req.body, isVerified: false, complianceStatus: 'SUBMITTED' };
    users.push(newUser);
    res.json(newUser);
  },

  updateProfile: (req, res) => {
    const { id } = req.params;
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...req.body };
      res.json(users[index]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  }
};

// --- SHIPPER CONTROLLER ---
exports.shipperController = {
  // Get loads posted by a specific shipper
  getMyLoads: (req, res) => {
    const { id } = req.params;
    const myLoads = shipments.filter(s => s.shipperId === id);
    res.json(myLoads);
  },

  // Create a new load/shipment
  postLoad: (req, res) => {
    const newLoad = { 
      id: `#KW-${Math.floor(100000 + Math.random() * 900000)}`, 
      ...req.body,
      status: 'Finding Driver',
      color: 'text-blue-600 bg-blue-50',
      createdAt: new Date()
    };
    shipments.unshift(newLoad);
    res.json(newLoad);
  },

  // Get list of drivers for hiring
  getAvailableDrivers: (req, res) => {
    const drivers = users.filter(u => u.role === 'DRIVER');
    res.json(drivers);
  }
};

// --- DRIVER CONTROLLER ---
exports.driverController = {
  // Get available jobs (loads with status 'Finding Driver')
  getAvailableJobs: (req, res) => {
    // In a real app, exclude jobs blocked by the driver or already taken
    const jobs = shipments.filter(s => s.status === 'Finding Driver');
    res.json(jobs);
  },

  // Get jobs assigned to this driver
  getMyTrips: (req, res) => {
    const { id } = req.params;
    // Assuming shipments have a 'driverId' field when assigned
    const trips = shipments.filter(s => s.driverId === id);
    res.json(trips);
  }
};

// --- LOGISTICS OWNER CONTROLLER ---
exports.logisticsController = {
  // Get fleet vehicles
  getFleet: (req, res) => {
    const { id } = req.params;
    const myFleet = vehicles.filter(v => v.ownerId === id);
    res.json(myFleet);
  },

  addVehicle: (req, res) => {
    const newVehicle = { id: Date.now().toString(), ...req.body };
    vehicles.push(newVehicle);
    res.json(newVehicle);
  },

  deleteVehicle: (req, res) => {
    const { vehicleId } = req.params;
    vehicles = vehicles.filter(v => v.id !== vehicleId);
    res.json({ success: true });
  }
};

// --- MARKET CONTROLLER (Shared) ---
exports.marketController = {
  getAllProducts: (req, res) => {
    res.json(products);
  },

  addProduct: (req, res) => {
    const newProduct = { id: Date.now().toString(), ...req.body };
    products.push(newProduct);
    res.json(newProduct);
  },

  updateProduct: (req, res) => {
    const { id } = req.params;
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...req.body };
      res.json(products[index]);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  },

  deleteProduct: (req, res) => {
    const { id } = req.params;
    products = products.filter(p => p.id !== id);
    res.json({ success: true });
  }
};
