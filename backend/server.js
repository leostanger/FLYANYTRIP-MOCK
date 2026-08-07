require('dotenv').config();

// Fix for Prisma BigInt serialization
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const flightRoutes = require('./routes/flight.routes');
const bookingRoutes = require('./routes/booking.routes');
const paymentRoutes = require('./routes/payment.routes');
const couponRoutes = require('./routes/coupon.routes');
const hotelRoutes = require('./routes/hotel.routes');

// Prisma ORM Routes
const usersRoutes = require('./routes/users.routes');
const travellersRoutes = require('./routes/travellers.routes');
const bookingsRoutes = require('./routes/bookings.routes');
const flightBookingsRoutes = require('./routes/flightBookings.routes');
const userStatsRoutes = require('./routes/userStats.routes');

const app = express();

// Root route (Top level for Vercel preview)
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Flyantrip Backend is active and running!' });
});

// Middlewares for Security and Performance
app.use(helmet()); // Secure HTTP headers

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://flyanytrip-frontend.vercel.app',
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN
].filter(Boolean);

// Enable standard CORS middleware with dynamic origin validation
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) || 
                      origin.startsWith('http://localhost:') || 
                      origin.startsWith('http://127.0.0.1:') || 
                      origin.endsWith('.vercel.app') ||
                      origin.endsWith('.netlify.app') ||
                      origin.endsWith('.pages.dev') ||
                      origin.includes('flyanytrip');
                      
    if (isAllowed || process.env.NODE_ENV !== 'production' || process.env.CORS_ORIGIN === '*') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With']
}));

app.use(express.json({ limit: '50mb' })); // Body parser with payload limit
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('short')); // Simplified request logging to reduce terminal clutter

app.use('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Flyantrip Backend is running!' });
});

app.use('/api/flights', flightRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/hotels', hotelRoutes);

// Prisma ORM Endpoints
app.use('/api/v2/users', usersRoutes);
app.use('/api/v2/travellers', travellersRoutes);
app.use('/api/v2/bookings', bookingsRoutes);
app.use('/api/v2/flight-bookings', flightBookingsRoutes);
app.use('/api/v2/user-stats', userStatsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start Server
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    
    // Check Database Connection
    try {
      const prisma = require('./config/prisma');
      await prisma.$connect();
      console.log('✅ Database is connected successfully.');
    } catch (error) {
      console.error('❌ Database is NOT connected:', error.message);
    }
  });
}

// Global Process Safety Guards (Prevents Node.js Process Crash on Async Failures)
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ Unhandled Rejection caught at process level:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('⚠️ Uncaught Exception caught at process level:', error.stack || error.message);
});

// Export app for Vercel / serverless deployments
module.exports = app;
