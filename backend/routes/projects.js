/**
 * Projects Routes - CRUD operations for portfolio projects
 * 
 * Purpose:
 * - Manage project data in MongoDB
 * - Public endpoints for frontend to display projects
 * - Protected endpoints for admin to add/edit/delete projects
 * 
 * Endpoints:
 * - GET    /api/projects      - Get all projects (public)
 * - GET    /api/projects/:id  - Get single project (public)
 * - POST   /api/projects      - Create project (admin only)
 * - PUT    /api/projects/:id  - Update project (admin only)
 * - DELETE /api/projects/:id  - Delete project (admin only)
 */

const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const authMiddleware = require('../middleware/auth');

// ============ GET ALL PROJECTS ============
// GET /api/projects
// Public access - No authentication required
// Used by portfolio frontend to display all projects
router.get('/', async(req, res) => {
    try {
        // Find all projects, sort by order (ascending) then by creation date (newest first)
        const projects = await Project.find().sort({ order: 1, createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ============ GET SINGLE PROJECT ============
// GET /api/projects/:id
// Public access - No authentication required
// Used to fetch details of a specific project
router.get('/:id', async(req, res) => {
    try {
        // Find project by MongoDB _id
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ============ CREATE PROJECT ============
// POST /api/projects
// Protected - Requires admin authentication (JWT token)
// Used by admin dashboard to add new projects
router.post('/', authMiddleware, async(req, res) => {
    try {
        // Create new project from request body data
        const project = new Project(req.body);
        // Save to database
        await project.save();
        // Return the created project with 201 status
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ============ UPDATE PROJECT ============
// PUT /api/projects/:id
// Protected - Requires admin authentication (JWT token)
// Used by admin dashboard to edit existing projects
router.put('/:id', authMiddleware, async(req, res) => {
    try {
        // Find and update project in one operation
        // new: true returns the updated document
        // runValidators: true ensures schema validation runs on update
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true, runValidators: true }
        );
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ============ DELETE PROJECT ============
// DELETE /api/projects/:id
// Protected - Requires admin authentication (JWT token)
// Used by admin dashboard to remove projects
router.delete('/:id', authMiddleware, async(req, res) => {
    try {
        // Find and delete project by ID
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;