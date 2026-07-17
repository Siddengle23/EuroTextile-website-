// 1. SMART NAVIGATION BAR
// Shrinks the navbar slightly when the user scrolls down for a sleeker look
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.padding = '10px 50px';
        navbar.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        navbar.style.transition = 'all 0.3s ease';
    } else {
        navbar.style.padding = '20px 50px';
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
    }
});


// 2. SCROLL REVEAL ANIMATIONS
// Selects all the elements we want to animate
const revealElements = document.querySelectorAll('.product-card, .card, section h2');

// Adds the hidden class to them before the user scrolls to them
revealElements.forEach((el) => {
    el.classList.add('reveal-hidden');
});

// Creates the observer that watches when elements enter the screen
const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        // If the element is visible on the screen
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target); // Stops animating it once it has appeared
        }
    });
}, {
    threshold: 0.15 // Triggers the animation when 15% of the card is visible
});

// Tells the observer to watch all our selected elements
revealElements.forEach(el => revealOnScroll.observe(el));