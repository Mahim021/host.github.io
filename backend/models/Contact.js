/**
 * Contact Model - Database schema for contact form submissions
 * 
 * Purpose:
 * - Store messages sent through portfolio contact form
 * - Allow admin to view, track, and manage incoming messages
 * - Track read/unread status of messages
 * - Maintain message history and timestamps
 * 
 * Collection: 'contacts' in MongoDB
 */

const mongoose = require('mongoose');

// Define the schema structure for a contact message document
const contactSchema = new mongoose.Schema({
    // Name of the person sending the message
    name: {
        type: String,
        required: true // Must be provided when submitting form
    },

    // Email address of the sender (for replying)
    email: {
        type: String,
        required: true
    },

    // The actual message content from the visitor
    message: {
        type: String,
        required: true
    },

    // Whether admin has read this message
    // Used to highlight new/unread messages in admin dashboard
    read: {
        type: Boolean,
        default: false // New messages are unread by default
    },

    // Timestamp when message was submitted
    // Helps admin see when each message arrived
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Export the model to be used in routes
// Creates a 'contacts' collection in MongoDB
module.exports = mongoose.model('Contact', contactSchema);