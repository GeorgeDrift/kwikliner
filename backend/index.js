const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Route Imports
const authRoutes = require('./routes/authRoutes');
const shipperRoutes = require('./routes/shipperRoutes');
const driverRoutes = require('./routes/driverRoutes');
const logisticsRoutes = require('./routes/logisticsRoutes');
const hardwareRoutes = require('./routes/hardwareRoutes');
const walletRoutes = require('./routes/walletRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/shipper', shipperRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/logistics', logisticsRoutes);
app.use('/api/products', hardwareRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', require('./routes/adminRoutes'));

// Health Check
app.get('/', (req, res) => {
  res.send('KwikLiner Backend API v1.1 Modular - Running');
});

const http = require('http');
const socket = require('./socket');

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!', details: err.message });
});

const server = http.createServer(app);
socket.init(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
