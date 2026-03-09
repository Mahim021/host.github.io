/**
 * Experience Model - Database schema for work experiences
 * 
 * Purpose:
 * - Store professional work experience and educational history
 * - Managed through admin dashboard
 * - Displayed in Experience section of portfolio
 * - Supports chronological ordering
 * 
 * Collection: 'experiences' in MongoDB
 */

const mongoose = require('mongoose');

// Define the schema structure for an experience document
const experienceSchema = new mongoose.Schema({
    // Job title or position held
    // Example: "Full Stack Developer", "Software Engineer"
    role: {
        type: String,
        required: true
    },

    // Company or organization name
    // Example: "Google", "Freelance", "KUET"
    company: {
        type: String,
        required: true
    },

    // Time period of employment/study
    // Example: "Jan 2023 - Present", "2019 - 2023"
    duration: {
        type: String,
        required: true
    },

    // Detailed description of responsibilities and achievements
    description: {
        type: String,
        required: true
    },

    // Array of technologies/skills used in this role
    // Example: ["React", "Python", "AWS"]
    technologies: [{
        type: String
    }],

    // Custom ordering number for display sequence
    // Lower numbers appear first (allows chronological or custom ordering)
    order: {
        type: Number,
        default: 0
    },

    // Timestamp when experience was added to database
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Export the model to be used in routes
// Creates an 'experiences' collection in MongoDB
module.exports = mongoose.model('Experience', experienceSchema);