/**
 * Main Server File - Entry point for Portfolio Backend API
 * 
 * Purpose:
 * - Initialize Express server
 * - Connect to MongoDB database
 * - Set up middleware for CORS, JSON parsing
 * - Register API routes for authentication, projects, experiences, and contact
 * - Start the server on specified port
 * 
 * Author: Ariful Alam
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
// This keeps sensitive data (DB credentials, JWT secret) out of source code
dotenv.config();

// Initialize Express application
const app = express();

// ============ MIDDLEWARE SETUP ============

// Enable CORS - only allow requests from trusted frontend origins
const allowedOrigins = process.env.ALLOWED_ORIGINS ?
    process.env.ALLOWED_ORIGINS.split(',') :
    ['https://taptoquit.me', 'https://www.taptoquit.me'];

if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.push(
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://localhost:3000'
    );
}

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// Parse incoming JSON requests - Allows us to read req.body
app.use(express.json());

// Parse URL-encoded data from forms
app.use(express.urlencoded({ extended: true }));

// ============ DATABASE CONNECTION ============

// Connect to MongoDB using connection string from .env file
// Mongoose provides schema-based solution to model application data
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ============ API ROUTES ============

// Authentication routes - Admin login, token generation
app.use('/api/auth', require('./routes/auth'));

// Project routes - CRUD operations for portfolio projects
app.use('/api/projects', require('./routes/projects'));

// Experience routes - CRUD operations for work experiences
app.use('/api/experiences', require('./routes/experiences'));

// Contact routes - Handle contact form submissions and message management
app.use('/api/contact', require('./routes/contact'));

// ============ TEST ROUTE ============

// Root endpoint - Test if server is running
app.get('/', (req, res) => {
    res.json({ message: 'Portfolio Backend API Running' });
});

// ============ START SERVER ============

// Use PORT from environment variable, or default to 5000
const PORT = process.env.PORT || 5000;

// Start listening for incoming requests
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});