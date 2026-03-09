/**
 * Authentication Middleware - Protect routes requiring admin access
 * 
 * Purpose:
 * - Verify JWT tokens on protected routes
 * - Extract admin info from valid tokens
 * - Reject unauthorized requests
 * - Used by all admin-only endpoints (create/update/delete operations)
 * 
 * Usage:
 * - Add as middleware to protected routes: router.post('/', authMiddleware, handler)
 * - Token must be sent in Authorization header as: "Bearer <token>"
 * 
 * Flow:
 * 1. Extract token from request header
 * 2. Verify token signature using JWT_SECRET
 * 3. If valid, attach admin data to request and proceed
 * 4. If invalid/missing, return 401 Unauthorized
 */

const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Step 1: Extract JWT token from Authorization header
    // Expected format: "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    // Optional chaining (?.) prevents error if header is missing
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Step 2: Check if token exists
    if (!token) {
        // No token provided - deny access
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Step 3: Verify token signature and decode payload
        // Throws error if token is invalid, expired, or tampered with
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Step 4: Attach admin info to request object
        // Makes admin data (id, email) available in route handlers
        req.admin = decoded;

        // Step 5: Token is valid - proceed to next middleware/route handler
        next();
    } catch (error) {
        // Token verification failed (invalid, expired, or wrong signature)
        res.status(401).json({ message: 'Token is not valid' });
    }
};