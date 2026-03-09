/**
 * Contact Routes - Handle contact form submissions and message management
 * 
 * Purpose:
 * - Store contact form messages from portfolio visitors
 * - Allow admin to view, track, and manage incoming messages
 * - Mark messages as read/unread
 * - Delete old or spam messages
 * 
 * Endpoints:
 * - POST   /api/contact/submit    - Submit contact form (public)
 * - GET    /api/contact           - Get all messages (admin only)
 * - PATCH  /api/contact/:id/read  - Mark message as read (admin only)
 * - DELETE /api/contact/:id       - Delete message (admin only)
 */

const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const authMiddleware = require('../middleware/auth');

// ============ SUBMIT CONTACT FORM ============
// POST /api/contact/submit
// Public access - Anyone can send a message
// Used by portfolio contact form to save visitor messages
router.post('/submit', async(req, res) => {
    try {
        // Create new contact message from form data
        // Expected fields: name, email, message
        const contact = new Contact(req.body);
        // Save to MongoDB (new messages are unread by default)
        await contact.save();
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ============ GET ALL MESSAGES ============
// GET /api/contact
// Protected - Requires admin authentication (JWT token)
// Used by admin dashboard to view all contact messages
router.get('/', authMiddleware, async(req, res) => {
    try {
        // Get all messages, sorted by newest first
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ============ MARK MESSAGE AS READ ============
// PATCH /api/contact/:id/read
// Protected - Requires admin authentication (JWT token)
// Used by admin dashboard to mark messages as read after viewing
router.patch('/:id/read', authMiddleware, async(req, res) => {
    try {
        // Update the 'read' field to true
        // new: true returns the updated document
        const contact = await Contact.findByIdAndUpdate(
            req.params.id, { read: true }, { new: true }
        );
        res.json(contact);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ============ DELETE MESSAGE ============
// DELETE /api/contact/:id
// Protected - Requires admin authentication (JWT token)
// Used by admin dashboard to remove messages
router.delete('/:id', authMiddleware, async(req, res) => {
    try {
        // Remove message from database
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;