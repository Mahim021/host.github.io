/**
 * Project Model - Database schema for portfolio projects
 * 
 * Purpose:
 * - Define structure for storing project information in MongoDB
 * - Validate project data before saving
 * - Used by admin dashboard to add/edit/delete projects
 * - Queried by frontend to display project portfolio
 * 
 * Collection: 'projects' in MongoDB
 */

const mongoose = require('mongoose');

// Define the schema structure for a project document
const projectSchema = new mongoose.Schema({
    // Project title (e.g., "E-commerce Platform")
    title: {
        type: String,
        required: true // Must be provided when creating a project
    },

    // Detailed description of what the project does
    description: {
        type: String,
        required: true
    },

    // Array of technology names used in the project
    // Example: ["React", "Node.js", "MongoDB"]
    technologies: [{
        type: String
    }],

    // URL to project image/screenshot (optional)
    image: {
        type: String,
        default: '' // Empty string if no image provided
    },

    // URL to live/deployed version of the project (optional)
    liveUrl: {
        type: String,
        default: ''
    },

    // URL to GitHub repository (optional)
    githubUrl: {
        type: String,
        default: ''
    },

    // Whether this project should be featured/highlighted
    featured: {
        type: Boolean,
        default: false
    },

    // Custom ordering number (lower = appears first)
    // Allows admin to control display order
    order: {
        type: Number,
        default: 0
    },

    // Timestamp when project was added to database
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Export the model to be used in routes
// Creates a 'projects' collection in MongoDB
module.exports = mongoose.model('Project', projectSchema);