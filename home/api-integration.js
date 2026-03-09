/**
 * API Integration for Portfolio
 * Fetches projects and experiences from the backend API and dynamically renders them
 */

const API_BASE_URL = 'https://api.taptoquit.me/api';

// Fetch and display projects
async function loadProjects() {
    try {
        const response = await fetch(`${API_BASE_URL}/projects`);
        if (!response.ok) throw new Error('Failed to fetch projects');

        const projects = await response.json();
        renderProjects(projects);
    } catch (error) {
        console.error('Error loading projects:', error);
        // Keep hardcoded projects as fallback
    }
}

// Fetch and display experiences
async function loadExperiences() {
    try {
        const response = await fetch(`${API_BASE_URL}/experiences`);
        if (!response.ok) throw new Error('Failed to fetch experiences');

        const experiences = await response.json();
        renderExperiences(experiences);
    } catch (error) {
        console.error('Error loading experiences:', error);
        // Keep hardcoded experiences as fallback
    }
}

// Render projects in the DOM
function renderProjects(projects) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = ''; // Clear existing projects

    projects.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card';

                // Determine if project has an image or needs an overlay icon
                const imageStyle = project.imageUrl ?
                    `background-image: url('${project.imageUrl}'); background-size: cover; background-position: center;` :
                    '';

                const overlayIcon = !project.imageUrl ? `
            <div class="project-overlay">
                <i class="fa-solid fa-code"></i>
            </div>
        ` : '';

                projectCard.innerHTML = `
            <div class="project-image" style="${imageStyle}">
                ${overlayIcon}
            </div>
            <div class="project-content">
                <div class="project-info-box">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tags">
                        ${project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        ${project.githubUrl && project.githubUrl !== '#' ? `
                            <a href="${project.githubUrl}" class="project-link" target="_blank">
                                <i class="fa-brands fa-github"></i> View Code
                            </a>
                        ` : ''}
                        ${project.liveUrl && project.liveUrl !== '#' ? `
                            <a href="${project.liveUrl}" class="project-link" target="_blank">
                                <i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        projectsGrid.appendChild(projectCard);
    });
}

// Render experiences in the DOM
function renderExperiences(experiences) {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    timeline.innerHTML = ''; // Clear existing experiences

    experiences.forEach(experience => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';

        timelineItem.innerHTML = `
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <div class="timeline-date">${experience.duration}</div>
                <h3>${experience.role}</h3>
                <h4>${experience.company}</h4>
                <p>${experience.description}</p>
            </div>
        `;

        timeline.appendChild(timelineItem);
    });
}

// Initialize data loading when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    loadExperiences();
});