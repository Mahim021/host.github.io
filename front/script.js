// Get the elements
const portfolioTitle = document.getElementById("portfolioTitle");
const divider = document.querySelector(".divider");
const nameElement = document.getElementById("animatedTitle");
const subtitleElement = document.getElementById("animatedSubtitle");

// Animate portfolio title first
setTimeout(() => {
  portfolioTitle.classList.add("show");
}, 200);

// Animate divider
setTimeout(() => {
  divider.classList.add("show");
}, 1200);

// Animate name
setTimeout(() => {
  nameElement.classList.add("show");
}, 1500);

// Animate subtitle
setTimeout(() => {
  subtitleElement.classList.add("show");
}, 2200);

// Drag to navigate functionality
const pageWrapper = document.getElementById("pageWrapper");
let startY = 0;
let isDragging = false;

function handleDragStart(event) {
  isDragging = true;
  startY = event.type.includes('mouse') ? event.pageY : event.touches[0].clientY;
}

function handleDragMove(event) {
  if (!isDragging) return;
  
  const currentY = event.type.includes('mouse') ? event.pageY : event.touches[0].clientY;
  const diffY = startY - currentY;
  
  // Only allow upward drag
  if (diffY > 0) {
    const translateY = Math.min(diffY, window.innerHeight);
    pageWrapper.style.transform = `translateY(-${translateY}px)`;
    pageWrapper.style.transition = 'none';
  }
}

function handleDragEnd(event) {
  if (!isDragging) return;
  
  isDragging = false;
  const currentY = event.type.includes('mouse') ? event.pageY : event.changedTouches[0].clientY;
  const diffY = startY - currentY;
  
  // If dragged up more than 150px, navigate to home page
  if (diffY > 150) {
    pageWrapper.style.transition = 'transform 0.5s ease';
    pageWrapper.style.transform = 'translateY(-100vh)';
    setTimeout(() => {
      window.location.href = "../home/home.html";
    }, 500);
  } else {
    // Reset position
    pageWrapper.style.transition = 'transform 0.3s ease';
    pageWrapper.style.transform = 'translateY(0)';
  }
}

// Mouse events
pageWrapper.addEventListener('mousedown', handleDragStart);
pageWrapper.addEventListener('mousemove', handleDragMove);
pageWrapper.addEventListener('mouseup', handleDragEnd);
pageWrapper.addEventListener('mouseleave', handleDragEnd);

// Touch events
pageWrapper.addEventListener('touchstart', handleDragStart);
pageWrapper.addEventListener('touchmove', handleDragMove);
pageWrapper.addEventListener('touchend', handleDragEnd);
