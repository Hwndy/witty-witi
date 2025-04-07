const cors = require('cors');

// CORS Configuration
const corsOptions = {
  origin: [
    'https://witty-witi.vercel.app',
    'https://witty-witi-git-main-hwndy.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Export the CORS middleware with options
module.exports = cors(corsOptions);
