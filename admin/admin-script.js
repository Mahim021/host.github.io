/**
 * Admin Dashboard JavaScript - Frontend logic for portfolio admin panel
 * 
 * Purpose:
 * - Handle admin authentication (login/logout)
 * - Manage CRUD operations for projects and experiences
 * - Display and manage contact messages
 * - Communicate with backend API
 * 
 * Features:
 * - JWT token-based authentication stored in localStorage
 * - Dynamic form generation for adding/editing items
 * - Real-time UI updates after data changes
 * - Modal system for create/edit operations
 */

// ============ CONFIGURATION ============

// Backend API base URL
const API_URL = 'https://api.taptoquit.me/api';

// Global state variables
let authToken = localStorage.getItem('adminToken'); // JWT token for authenticated requests
let currentSection = 'projects'; // Currently active section (projects/experiences/messages)
let editingId = null; // ID of item being edited (null when creating new)

// ============ INITIAL AUTHENTICATION CHECK ============

// Check if user is already logged in (has valid token in localStorage)
if (authToken) {
    // Token exists - show dashboard directly
    showDashboard();
} else {
    // No token - show login page
    document.getElementById('loginPage').style.display = 'flex';
}

// ============ LOGIN HANDLER ============

/**
 * Handle login form submission
 * - Sends credentials to backend API
 * - Receives JWT token on success
 * - Stores token in localStorage for persistent login
 * - Shows dashboard or error message
 */
document.getElementById('loginForm').addEventListener('submit', async(e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');

    try {
        // Send login request to backend
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Login successful - store token and show dashboard
            authToken = data.token;
            localStorage.setItem('adminToken', authToken); // Persist token for future sessions
            showDashboard();
        } else {
            // Login failed - show error message
            errorEl.textContent = data.message || 'Login failed';
        }
    } catch (error) {
        // Network error - backend might not be running
        errorEl.textContent = 'Connection error. Make sure backend is running.';
    }
});

// ============ DASHBOARD DISPLAY ============

/**
 * Show the dashboard and hide login page
 * - Hides login form
 * - Displays dashboard interface
 * - Loads initial section (projects)
 */
function showDashboard() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('dashboardPage').style.display = 'flex';
    loadSection('projects'); // Load projects section by default
}

// ============ LOGOUT HANDLER ============

/**
 * Handle admin logout
 * - Removes JWT token from localStorage
 * - Reloads page to show login screen
 */
document.querySelector('.logout').addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    authToken = null;
    location.reload(); // Reload to reset all state
});

// ============ NAVIGATION SYSTEM ============

/**
 * Handle sidebar navigation clicks
 * - Switch between Projects, Experiences, and Messages sections
 * - Update active state on navigation items
 * - Load appropriate data for selected section
 */
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.dataset.section;
        if (section) {
            // Update active nav item styling
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            // Load the selected section
            loadSection(section);
        }
    });
});

// ============ SECTION LOADER ============

/**
 * Load a specific dashboard section
 * - Updates current section state
 * - Shows/hides appropriate content sections
 * - Updates page title
 * - Fetches and displays section data
 * 
 * @param {string} section - Section name: 'projects', 'experiences', or 'messages'
 */
function loadSection(section) {
    currentSection = section;

    // Hide all sections, then show the selected one
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById(`${section}Section`).classList.add('active');

    // Update page title based on section
    const titles = {
        projects: 'Projects Management',
        experiences: 'Experiences Management',
        messages: 'Contact Messages'
    };
    document.getElementById('sectionTitle').textContent = titles[section];


    // Show/hide add button for messages
    document.getElementById('addNewBtn').style.display =
        section === 'messages' ? 'none' : 'block';

    if (section === 'projects') loadProjects();
    else if (section === 'experiences') loadExperiences();
    else if (section === 'messages') loadMessages();
}

// Load Projects
async function loadProjects() {
    try {
        const response = await fetch(`${API_URL}/projects`);
        const projects = await response.json();

        const html = projects.map(project => `
            <div class="item-card">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="technologies">
                    ${project.technologies.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                </div>
                <div class="item-actions">
                    <button class="btn-edit" onclick="editItem('${project._id}', 'project')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="deleteItem('${project._id}', 'project')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');

        document.getElementById('projectsList').innerHTML = html || '<p>No projects yet.</p>';
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Load Experiences
async function loadExperiences() {
    try {
        const response = await fetch(`${API_URL}/experiences`);
        const experiences = await response.json();
        
        const html = experiences.map(exp => `
            <div class="item-card">
                <h3>${exp.role}</h3>
                <p><strong>${exp.company}</strong></p>
                <p>${exp.duration}</p>
                <p>${exp.description}</p>
                <div class="technologies">
                    ${exp.technologies.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                </div>
                <div class="item-actions">
                    <button class="btn-edit" onclick="editItem('${exp._id}', 'experience')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="deleteItem('${exp._id}', 'experience')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');

        document.getElementById('experiencesList').innerHTML = html || '<p>No experiences yet.</p>';
    } catch (error) {
        console.error('Error loading experiences:', error);
    }
}

// Load Messages
async function loadMessages() {
    try {
        const response = await fetch(`${API_URL}/contact`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const messages = await response.json();
        
        const html = messages.map(msg => `
            <div class="message-card ${msg.read ? '' : 'unread'}">
                <div class="message-header">
                    <strong>${msg.name}</strong>
                    <span class="message-date">${new Date(msg.createdAt).toLocaleString()}</span>
                </div>
                <div class="message-email">${msg.email}</div>
                <div class="message-text">${msg.message}</div>
                <div class="item-actions">
                    ${!msg.read ? `<button class="btn-edit" onclick="markAsRead('${msg._id}')">
                        <i class="fas fa-check"></i> Mark as Read
                    </button>` : ''}
                    <button class="btn-delete" onclick="deleteMessage('${msg._id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');

        document.getElementById('messagesList').innerHTML = html || '<p>No messages yet.</p>';
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

// Add New Button
document.getElementById('addNewBtn').addEventListener('click', () => {
    editingId = null;
    showModal();
});

// Show Modal
function showModal() {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const formFields = document.getElementById('formFields');

    if (currentSection === 'projects') {
        modalTitle.textContent = editingId ? 'Edit Project' : 'Add New Project';
        formFields.innerHTML = `
            <div class="form-group">
                <label>Title</label>
                <input type="text" name="title" id="title" required>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea name="description" id="description" required></textarea>
            </div>
            <div class="form-group">
                <label>Technologies (comma separated)</label>
                <input type="text" name="technologies" id="technologies" placeholder="React, Node.js, MongoDB">
            </div>
            <div class="form-group">
                <label>Live URL</label>
                <input type="url" name="liveUrl" id="liveUrl">
            </div>
            <div class="form-group">
                <label>GitHub URL</label>
                <input type="url" name="githubUrl" id="githubUrl">
            </div>
        `;
    } else if (currentSection === 'experiences') {
        modalTitle.textContent = editingId ? 'Edit Experience' : 'Add New Experience';
        formFields.innerHTML = `
            <div class="form-group">
                <label>Role</label>
                <input type="text" name="role" id="role" required>
            </div>
            <div class="form-group">
                <label>Company</label>
                <input type="text" name="company" id="company" required>
            </div>
            <div class="form-group">
                <label>Duration</label>
                <input type="text" name="duration" id="duration" placeholder="Jan 2023 - Present" required>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea name="description" id="description" required></textarea>
            </div>
            <div class="form-group">
                <label>Technologies (comma separated)</label>
                <input type="text" name="technologies" id="technologies">
            </div>
        `;
    }

    modal.style.display = 'block';

    // Load data if editing
    if (editingId) {
        loadItemData();
    }
}

// Load Item Data for Editing
async function loadItemData() {
    const endpoint = currentSection === 'projects' ? 'projects' : 'experiences';
    try {
        const response = await fetch(`${API_URL}/${endpoint}/${editingId}`);
        const data = await response.json();

        Object.keys(data).forEach(key => {
            const field = document.getElementById(key);
            if (field) {
                if (key === 'technologies') {
                    field.value = data[key].join(', ');
                } else {
                    field.value = data[key] || '';
                }
            }
        });
    } catch (error) {
        console.error('Error loading item:', error);
    }
}

// Close Modal
document.querySelector('.close').addEventListener('click', closeModal);
document.querySelector('.cancel-btn').addEventListener('click', closeModal);

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('itemForm').reset();
    editingId = null;
}

// Submit Form
document.getElementById('itemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {};

    formData.forEach((value, key) => {
        if (key === 'technologies') {
            data[key] = value.split(',').map(t => t.trim()).filter(t => t);
        } else {
            data[key] = value;
        }
    });

    const endpoint = currentSection === 'projects' ? 'projects' : 'experiences';
    const url = editingId ? `${API_URL}/${endpoint}/${editingId}` : `${API_URL}/${endpoint}`;
    const method = editingId ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            closeModal();
            loadSection(currentSection);
        } else {
            alert('Error saving item');
        }
    } catch (error) {
        console.error('Error saving:', error);
        alert('Connection error');
    }
});

// Edit Item
async function editItem(id, type) {
    editingId = id;
    currentSection = type === 'project' ? 'projects' : 'experiences';
    showModal();
}

// Delete Item
async function deleteItem(id, type) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const endpoint = type === 'project' ? 'projects' : 'experiences';

    try {
        const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.ok) {
            loadSection(currentSection);
        }
    } catch (error) {
        console.error('Error deleting:', error);
    }
}

// Mark Message as Read
async function markAsRead(id) {
    try {
        await fetch(`${API_URL}/contact/${id}/read`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        loadMessages();
    } catch (error) {
        console.error('Error marking as read:', error);
    }
}

// Delete Message
async function deleteMessage(id) {
    if (!confirm('Delete this message?')) return;

    try {
        await fetch(`${API_URL}/contact/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        loadMessages();
    } catch (error) {
        console.error('Error deleting message:', error);
    }
}