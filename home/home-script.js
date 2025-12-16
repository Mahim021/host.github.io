// Carousel functionality
const carouselWrapper = document.querySelector('.carousel-wrapper');
const navItems = document.querySelectorAll('.nav-item');
const dragHint = document.querySelector('.drag-hint');

let currentPage = 0;
const totalPages = 4;
let previousPage = 0; // Track page before Let's Talk
let isDragging = false;
let startX = 0;
let startY = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;

// Bottom panel variables (declared early so they can be used throughout)
const bottomPanel = document.getElementById('bottomPanel');
const dragHandle = document.querySelector('.panel-drag-handle');
let panelStartY = 0;
let panelDragging = false;
let panelExpanded = false;

// Set initial position
function setPositionByIndex() {
    currentTranslate = currentPage * -window.innerWidth;
    prevTranslate = currentTranslate;
    setCarouselPosition();
    updateActiveNav();
}

function setCarouselPosition() {
    carouselWrapper.style.transform = `translateX(${currentTranslate}px)`;
}

function updateActiveNav() {
    navItems.forEach((item, index) => {
        if (panelExpanded && index === 4) {
            // Let's Talk is active when panel is expanded
            item.classList.add('active');
        } else if (!panelExpanded && index === currentPage) {
            // Normal carousel navigation
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Navigation click handlers
navItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        if (index === 4) {
            // Let's Talk - expand bottom panel (overlay on current page)
            previousPage = currentPage;
            if (bottomPanel) {
                bottomPanel.classList.add('expanded');
                panelExpanded = true;
            }
            updateActiveNav();
            updateSidePanelLabels();
        } else {
            // Switching to another section - close Let's Talk panel
            if (panelExpanded && bottomPanel) {
                bottomPanel.classList.remove('expanded');
                panelExpanded = false;
            }
            currentPage = index;
            setPositionByIndex();
        }
    });
});

// Touch events
function touchStart(index) {
    return function(event) {
        isDragging = true;
        startX = event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        startY = event.type.includes('mouse') ? event.pageY : event.touches[0].clientY;
        animationID = requestAnimationFrame(animation);
        carouselWrapper.classList.add('no-transition');
        
        // Hide drag hint after first interaction
        if (dragHint) {
            dragHint.style.opacity = '0';
            setTimeout(() => {
                dragHint.style.display = 'none';
            }, 300);
        }
    }
}

function touchMove(event) {
    if (isDragging) {
        const currentX = event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        const currentY = event.type.includes('mouse') ? event.pageY : event.touches[0].clientY;
        const diffX = currentX - startX;
        const diffY = currentY - startY;
        
        // Determine if horizontal or vertical swipe
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe
            currentTranslate = prevTranslate + diffX;
        } else {
            // Vertical swipe - also navigate horizontally for now
            currentTranslate = prevTranslate + diffY;
        }
    }
}

function touchEnd() {
    isDragging = false;
    cancelAnimationFrame(animationID);
    carouselWrapper.classList.remove('no-transition');
    
    const movedBy = currentTranslate - prevTranslate;
    
    // Determine threshold for page change (25% of screen width)
    const threshold = window.innerWidth * 0.25;
    
    if (movedBy < -threshold && currentPage < totalPages - 1) {
        currentPage += 1;
    }
    
    if (movedBy > threshold && currentPage > 0) {
        currentPage -= 1;
    }
    
    setPositionByIndex();
}

function animation() {
    setCarouselPosition();
    if (isDragging) requestAnimationFrame(animation);
}

// Mouse events
carouselWrapper.addEventListener('mousedown', touchStart(0));
carouselWrapper.addEventListener('mousemove', touchMove);
carouselWrapper.addEventListener('mouseup', touchEnd);
carouselWrapper.addEventListener('mouseleave', touchEnd);

// Touch events
carouselWrapper.addEventListener('touchstart', touchStart(0));
carouselWrapper.addEventListener('touchmove', touchMove);
carouselWrapper.addEventListener('touchend', touchEnd);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentPage > 0) {
        currentPage -= 1;
        setPositionByIndex();
    } else if (e.key === 'ArrowRight' && currentPage < totalPages - 1) {
        currentPage += 1;
        setPositionByIndex();
    }
});

// Mouse wheel navigation disabled - use side panels or navbar for navigation

// Handle window resize
window.addEventListener('resize', () => {
    setPositionByIndex();
});

// Initialize
setPositionByIndex();

// Social icons interaction
const socialIcons = document.querySelectorAll('.social-icon');
socialIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
        e.stopPropagation();
        // Add your social media links here
        console.log('Social icon clicked:', icon.classList);
    });
});

// CV icon interaction
const cvIcon = document.querySelector('.cv-icon');
if (cvIcon) {
    cvIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        // Add your CV download link here
        console.log('CV icon clicked');
    });
}

// Side panel navigation
const sidePanelLeft = document.getElementById('leftPanel');
const sidePanelRight = document.getElementById('rightPanel');
const leftLabel = document.getElementById('leftLabel');
const rightLabel = document.getElementById('rightLabel');

const pageNames = ['HOME', 'ABOUT', 'WORK', 'EXPERIENCE'];

function updateSidePanelLabels() {
    if (panelExpanded) {
        // When Let's Talk is open, show navigation from the underlying page
        const prevPage = previousPage > 0 ? previousPage - 1 : 3;
        leftLabel.textContent = pageNames[prevPage];
        
        const nextPage = previousPage < 3 ? previousPage + 1 : 0;
        rightLabel.textContent = pageNames[nextPage];
    } else {
        // Circular navigation: HOME <-> ABOUT <-> WORK <-> EXPERIENCE <-> HOME
        const prevPage = currentPage === 0 ? 3 : currentPage - 1;
        leftLabel.textContent = pageNames[prevPage];
        
        const nextPage = currentPage === 3 ? 0 : currentPage + 1;
        rightLabel.textContent = pageNames[nextPage];
    }
}

// Left panel navigation
if (sidePanelLeft) {
    sidePanelLeft.addEventListener('click', () => {
        if (panelExpanded) {
            // From LET'S TALK, go to previous page in carousel
            bottomPanel.classList.remove('expanded');
            panelExpanded = false;
            currentPage = previousPage > 0 ? previousPage - 1 : 3;
            setPositionByIndex();
        } else {
            // Circular navigation: go to previous page (wraps around)
            currentPage = currentPage === 0 ? 3 : currentPage - 1;
            setPositionByIndex();
        }
    });
}

// Right panel navigation
if (sidePanelRight) {
    sidePanelRight.addEventListener('click', () => {
        if (panelExpanded) {
            // From LET'S TALK, go to next page in carousel
            bottomPanel.classList.remove('expanded');
            panelExpanded = false;
            currentPage = previousPage < 3 ? previousPage + 1 : 0;
            setPositionByIndex();
        } else {
            // Circular navigation: go to next page (wraps around)
            currentPage = currentPage === 3 ? 0 : currentPage + 1;
            setPositionByIndex();
        }
    });
}

// Bottom panel functionality
if (bottomPanel && dragHandle) {
    // Drag functionality - only on the drag handle and panel itself
    const handleDragStart = (e) => {
        panelDragging = true;
        panelStartY = e.type.includes('mouse') ? e.pageY : e.touches[0].pageY;
        if (e.type.includes('mouse')) {
            e.preventDefault();
        }
    };
    
    dragHandle.addEventListener('mousedown', handleDragStart);
    bottomPanel.addEventListener('mousedown', handleDragStart);
    
    document.addEventListener('mousemove', (e) => {
        if (panelDragging) {
            e.preventDefault();
            const currentY = e.pageY;
            const diffY = panelStartY - currentY;
            
            if (diffY > 50 && !panelExpanded) {
                // Dragging up - expand panel and save current page
                previousPage = currentPage;
                bottomPanel.classList.add('expanded');
                panelExpanded = true;
                panelDragging = false;
                updateActiveNav();
                updateSidePanelLabels();
            } else if (diffY < -50 && panelExpanded) {
                // Dragging down - collapse panel and stay on previous page
                bottomPanel.classList.remove('expanded');
                panelExpanded = false;
                panelDragging = false;
                updateActiveNav();
                updateSidePanelLabels();
            }
        }
    });
    
    document.addEventListener('mouseup', () => {
        panelDragging = false;
    });
    
    // Touch support
    const handleTouchStart = (e) => {
        panelDragging = true;
        panelStartY = e.touches[0].pageY;
    };
    
    dragHandle.addEventListener('touchstart', handleTouchStart);
    bottomPanel.addEventListener('touchstart', handleTouchStart);
    
    document.addEventListener('touchmove', (e) => {
        if (panelDragging) {
            const currentY = e.touches[0].pageY;
            const diffY = panelStartY - currentY;
            
            if (diffY > 50 && !panelExpanded) {
                previousPage = currentPage;
                bottomPanel.classList.add('expanded');
                panelExpanded = true;
                panelDragging = false;
                updateActiveNav();
                updateSidePanelLabels();
            } else if (diffY < -50 && panelExpanded) {
                bottomPanel.classList.remove('expanded');
                panelExpanded = false;
                panelDragging = false;
                updateActiveNav();
                updateSidePanelLabels();
            }
        }
    });
    
    document.addEventListener('touchend', () => {
        panelDragging = false;
    });
    
    // Click on collapsed panel to expand it
    bottomPanel.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!panelExpanded) {
            previousPage = currentPage;
            bottomPanel.classList.add('expanded');
            panelExpanded = true;
            updateActiveNav();
            updateSidePanelLabels();
        }
    });
    
    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
        if (panelExpanded && !bottomPanel.contains(e.target)) {
            // Check if click is not on any navbar item
            const clickedNav = e.target.closest('.navbar');
            if (!clickedNav) {
                bottomPanel.classList.remove('expanded');
                panelExpanded = false;
                updateActiveNav();
                updateSidePanelLabels();
            }
        }
    });
}

// Update labels on navigation
const originalSetPositionByIndex = setPositionByIndex;
setPositionByIndex = function() {
    // Update active nav immediately before animation
    updateActiveNav();
    originalSetPositionByIndex();
    updateSidePanelLabels();
};

// Initialize labels
updateSidePanelLabels();

// CTA Button Handlers
const downloadCvBtn = document.getElementById('downloadCvBtn');
const getInTouchBtn = document.getElementById('getInTouchBtn');

if (downloadCvBtn) {
    downloadCvBtn.addEventListener('click', () => {
        // Trigger CV download
        const cvUrl = '../Assets/Resume_of_Ariful_Alam.pdf';
        const link = document.createElement('a');
        link.href = cvUrl;
        link.download = 'Resume_of_Ariful_Alam.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

if (getInTouchBtn) {
    getInTouchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Open Let's Talk panel
        previousPage = currentPage;
        if (bottomPanel) {
            bottomPanel.classList.add('expanded');
            panelExpanded = true;
            updateActiveNav();
            updateSidePanelLabels();
        }
    });
}
