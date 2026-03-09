/**
 * Admin Model - Database schema for admin users
 * 
 * Purpose:
 * - Store admin credentials securely with hashed passwords
 * - Handle authentication for admin dashboard access
 * - Provide methods for password hashing and verification
 * - Ensure only authorized users can modify portfolio content
 * 
 * Collection: 'admins' in MongoDB
 * Security: Uses bcrypt for password hashing (never stores plain text passwords)
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema structure for an admin user document
const adminSchema = new mongoose.Schema({
    // Admin email address - used for login
    email: {
        type: String,
        required: true,
        unique: true // Ensures no duplicate admin emails
    },

    // Hashed password - NEVER store plain text passwords
    // This will be automatically hashed before saving (see pre-save hook below)
    password: {
        type: String,
        required: true
    },

    // Timestamp when admin account was created
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// ============ PRE-SAVE HOOK ============
// Automatically hash password before saving to database
// This runs every time an admin document is saved
adminSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    // Prevents re-hashing the already hashed password
    if (!this.isModified('password')) return next();

    // Hash password with bcrypt (salt rounds = 10)
    // Higher salt rounds = more secure but slower
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// ============ INSTANCE METHODS ============

/**
 * Compare submitted password with hashed password in database
 * Used during login to verify credentials
 * 
 * @param {string} candidatePassword - Plain text password from login form
 * @returns {boolean} - True if password matches, false otherwise
 */
adminSchema.methods.comparePassword = async function(candidatePassword) {
    // bcrypt.compare safely compares plain text with hashed password
    return await bcrypt.compare(candidatePassword, this.password);
};

// Export the model to be used in authentication routes
// Creates an 'admins' collection in MongoDB
module.exports = mongoose.model('Admin', adminSchema);