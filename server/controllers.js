
const pool = require('./db');
const { v4: uuidv4 } = require('uuid'); // Assume user might install uuid, or we use Date.now() fallback

// Helper to generate IDs if uuid package isn't present
const generateId = () => Date.now().toString();

// --- AUTH CONTROLLER ---
exports.authController = {
  login: async (req, res) => {
    const { role } = req.body;
    try {
      // Demo Logic: Find the first user with this role
      const result = await pool.query('SELECT * FROM users WHERE role = $1 LIMIT 1', [role]);
      
      if (result.rows.length > 0) {
        // Map snake_case DB columns to camelCase for frontend
        const u = result.rows[0];
        res.json({
          id: u.id, role: u.role, name: u.name, phone: u.phone, email: u.email, 
          companyName: u.company_name, isVerified: u.is_verified, complianceStatus: u.compliance_status
        });
      } else {
        // Create a new temp user for demo if seed data missing
        const newId = generateId();
        const newUser = { 
          id: newId, role, name: 'New User', phone: '', 
          companyName: 'New Company', isVerified: true, complianceStatus: 'APPROVED' 
        };
        await pool.query(
          'INSERT INTO users (id, role, name, phone, company_name, is_verified, compliance_status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [newUser.id, newUser.role, newUser.name, newUser.phone, newUser.companyName, newUser.isVerified, newUser.complianceStatus]
        );
        res.json(newUser);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  },
  
  register: async (req, res) => {
    const { role, name, phone, email, companyName } = req.body;
    const id = generateId();
    try {
      await pool.query(
        'INSERT INTO users (id, role, name, phone, email, company_name, is_verified, compliance_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [id, role, name, phone, email, companyName, false, 'SUBMITTED']
      );
      res.json({ id, role, name, phone, email, companyName, isVerified: false, complianceStatus: 'SUBMITTED' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Registration failed' });
    }
  },

  updateProfile: async (req, res) => {
    const { id } = req.params;
    const { name, phone, email, companyName } = req.body;
    try {
      const result = await pool.query(
        'UPDATE users SET name = COALESCE($1, name), phone = COALESCE($2, phone), email = COALESCE($3, email), company_name = COALESCE($4, company_name) WHERE id = $5 RETURNING *',
        [name, phone, email, companyName, id]
      );
      if (result.rows.length > 0) {
        const u = result.rows[0];
        res.json({
          id: u.id, role: u.role, name: u.name, phone: u.phone, email: u.email, 
          companyName: u.company_name, isVerified: u.is_verified, complianceStatus: u.compliance_status
        });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Update failed' });
    }
  }
};

// --- SHIPPER CONTROLLER ---
exports.shipperController = {
  getMyLoads: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('SELECT * FROM shipments WHERE shipper_id = $1 ORDER BY created_at DESC', [id]);
      // Map back to frontend expected format if needed
      const loads = result.rows.map(row => ({
        id: row.id, route: row.route, cargo: row.cargo, price: row.price, status: row.status, color: row.color, shipperId: row.shipper_id
      }));
      res.json(loads);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch loads' });
    }
  },

  postLoad: async (req, res) => {
    const { route, cargo, price } = req.body; // Expect simplified body for demo
    const id = `#KW-${Math.floor(100000 + Math.random() * 900000)}`;
    const shipperId = 'demo-shipper'; // In real app, get from auth token/session
    
    try {
      await pool.query(
        'INSERT INTO shipments (id, route, cargo, price, status, color, shipper_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [id, route, cargo, price, 'Finding Driver', 'text-blue-600 bg-blue-50', shipperId]
      );
      res.json({ id, route, cargo, price, status: 'Finding Driver', color: 'text-blue-600 bg-blue-50', shipperId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to post load' });
    }
  },

  getAvailableDrivers: async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM users WHERE role = 'DRIVER'");
      const drivers = result.rows.map(u => ({
         id: u.id, name: u.name, phone: u.phone, companyName: u.company_name
      }));
      res.json(drivers);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch drivers' });
    }
  }
};

// --- DRIVER CONTROLLER ---
exports.driverController = {
  getAvailableJobs: async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM shipments WHERE status = 'Finding Driver'");
      const jobs = result.rows.map(row => ({
        id: row.id, route: row.route, cargo: row.cargo, price: row.price, status: row.status, shipperId: row.shipper_id
      }));
      res.json(jobs);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  },

  getMyTrips: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('SELECT * FROM shipments WHERE driver_id = $1', [id]);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch trips' });
    }
  }
};

// --- LOGISTICS OWNER CONTROLLER ---
exports.logisticsController = {
  getFleet: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('SELECT * FROM vehicles WHERE owner_id = $1', [id]);
      const fleet = result.rows.map(v => ({
        id: v.id, make: v.make, model: v.model, plate: v.plate, capacity: v.capacity, 
        type: v.type, status: v.status, image: v.image, ownerId: v.owner_id
      }));
      res.json(fleet);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch fleet' });
    }
  },

  addVehicle: async (req, res) => {
    const { make, model, plate, capacity, type, status, image, ownerId } = req.body;
    const id = generateId();
    try {
      await pool.query(
        'INSERT INTO vehicles (id, make, model, plate, capacity, type, status, image, owner_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [id, make, model, plate, capacity, type, status, image, ownerId]
      );
      res.json({ id, make, model, plate, capacity, type, status, image, ownerId });
    } catch (err) {
      res.status(500).json({ error: 'Failed to add vehicle' });
    }
  },

  deleteVehicle: async (req, res) => {
    const { vehicleId } = req.params;
    try {
      await pool.query('DELETE FROM vehicles WHERE id = $1', [vehicleId]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete vehicle' });
    }
  }
};

// --- MARKET CONTROLLER (Shared) ---
exports.marketController = {
  getAllProducts: async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM products');
      const products = result.rows.map(p => ({
        id: p.id, name: p.name, price: p.price, stock: p.stock, category: p.category, 
        image: p.image, ownerId: p.owner_id, seller: p.seller
      }));
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  },

  addProduct: async (req, res) => {
    const { name, price, stock, category, image, ownerId, seller } = req.body;
    const id = generateId();
    try {
      await pool.query(
        'INSERT INTO products (id, name, price, stock, category, image, owner_id, seller) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [id, name, price, stock, category, image, ownerId, seller]
      );
      res.json({ id, name, price, stock, category, image, ownerId, seller });
    } catch (err) {
      res.status(500).json({ error: 'Failed to add product' });
    }
  },

  updateProduct: async (req, res) => {
    const { id } = req.params;
    const { name, price, stock } = req.body;
    try {
      const result = await pool.query(
        'UPDATE products SET name = $1, price = $2, stock = $3 WHERE id = $4 RETURNING *',
        [name, price, stock, id]
      );
      if (result.rows.length > 0) {
        const p = result.rows[0];
        res.json({
          id: p.id, name: p.name, price: p.price, stock: p.stock, category: p.category, 
          image: p.image, ownerId: p.owner_id, seller: p.seller
        });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Update failed' });
    }
  },

  deleteProduct: async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM products WHERE id = $1', [id]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Delete failed' });
    }
  }
};
