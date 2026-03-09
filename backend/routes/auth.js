/**
 * Authentication Routes - Handle admin login and initial setup
 * 
 * Purpose:
 * - POST /api/auth/login - Authenticate admin and generate JWT token
 * - POST /api/auth/setup - Create initial admin account (run once)
 * 
 * Security:
 * - Passwords are hashed with bcrypt
 * - JWT tokens expire after 24 hours
 * - Setup endpoint prevents duplicate admin creation
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// ============ LOGIN ENDPOINT ============
// POST /api/auth/login
// Public access - Anyone can attempt login
// Returns JWT token if credentials are valid
router.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;

        // Step 1: Find admin by email in database
        const admin = await Admin.findOne({ email });
        if (!admin) {
            // Don't reveal whether email exists (security best practice)
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Step 2: Verify password using bcrypt comparison
        // comparePassword() method is defined in Admin model
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Step 3: Generate JWT token with admin info
        // Token contains admin ID and email, expires in 24 hours
        const token = jwt.sign({ id: admin._id, email: admin.email },
            process.env.JWT_SECRET, // Secret key from .env file
            { expiresIn: '24h' }
        );

        // Step 4: Send token back to client
        // Client stores this token and sends it with future requests
        res.json({ token, message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ============ SETUP ENDPOINT ============
// POST /api/auth/setup
// Run this ONCE to create the first admin account
// Prevents creating multiple admins
router.post('/setup', async(req, res) => {
    try {
        // Check if admin already exists in database
        const adminExists = await Admin.findOne({});
        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Create new admin with credentials from .env file
        // Password will be automatically hashed by the pre-save hook in Admin model
        const admin = new Admin({
            email: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
            password: process.env.ADMIN_PASSWORD || 'admin123'
        });

        // Save to database
        await admin.save();
        res.json({ message: 'Admin created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;