/**
 * Experiences Routes - CRUD operations for work experiences
 * 
 * Purpose:
 * - Manage professional/educational experience data in MongoDB
 * - Public endpoints for frontend to display experience timeline
 * - Protected endpoints for admin to add/edit/delete experiences
 * 
 * Endpoints:
 * - GET    /api/experiences      - Get all experiences (public)
 * - POST   /api/experiences      - Create experience (admin only)
 * - PUT    /api/experiences/:id  - Update experience (admin only)
 * - DELETE /api/experiences/:id  - Delete experience (admin only)
 */

const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');
const authMiddleware = require('../middleware/auth');

// ============ GET ALL EXPERIENCES ============
// GET /api/experiences
// Public access - No authentication required
// Used by portfolio frontend to display experience timeline
router.get('/', async(req, res) => {
    try {
        // Find all experiences, sort by order (ascending) then by date (newest first)
        // This allows admin to control display order or show chronologically
        const experiences = await Experience.find().sort({ order: 1, createdAt: -1 });
        res.json(experiences);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ============ CREATE EXPERIENCE ============
// POST /api/experiences
// Protected - Requires admin authentication (JWT token)
// Used by admin dashboard to add new work/education experiences
router.post('/', authMiddleware, async(req, res) => {
    try {
        // Create new experience document from request body
        const experience = new Experience(req.body);
        // Save to MongoDB
        await experience.save();
        // Return created experience with 201 status code
        res.status(201).json(experience);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ============ UPDATE EXPERIENCE ============
// PUT /api/experiences/:id
// Protected - Requires admin authentication (JWT token)
// Used by admin dashboard to edit existing experiences
router.put('/:id', authMiddleware, async(req, res) => {
    try {
        // Find by ID and update with new data
        // new: true returns the updated document instead of the original
        // runValidators: true ensures schema validation on update
        const experience = await Experience.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true, runValidators: true }
        );
        if (!experience) {
            return res.status(404).json({ message: 'Experience not found' });
        }
        res.json(experience);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ============ DELETE EXPERIENCE ============
// DELETE /api/experiences/:id
// Protected - Requires admin authentication (JWT token)
// Used by admin dashboard to remove experiences from timeline
router.delete('/:id', authMiddleware, async(req, res) => {
    try {
        // Find and remove experience by MongoDB _id
        const experience = await Experience.findByIdAndDelete(req.params.id);
        if (!experience) {
            return res.status(404).json({ message: 'Experience not found' });
        }
        res.json({ message: 'Experience deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;