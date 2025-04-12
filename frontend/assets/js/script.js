// Content Data
const content = {
    greetings: {
        morning: "Good Morning",
        afternoon: "Good Afternoon",
        evening: "Good Evening"
    },
    quotes: [
        "The best investment you can make is in yourself.",
        "Invest in your dreams, not your fears.",
        "The stock market is filled with individuals who know the price of everything, but the value of nothing.",
        "Don't put all your eggs in one basket.",
        "The best time to plant a tree was 20 years ago. The second best time is now.",
        "Price is what you pay. Value is what you get."
    ]
};

// Utility Functions
const getRandomItem = array => array[Math.floor(Math.random() * array.length)];

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return content.greetings.morning;
    if (hour < 18) return content.greetings.afternoon;
    return content.greetings.evening;
};

// Animation Observer
const createIntersectionObserver = (elements, options = {}) => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    elements.forEach(element => observer.observe(element));
};

// Dynamic Content Updates
const updateDynamicContent = () => {
    // Update greeting
    const greetingElement = document.querySelector('.greeting');
    if (greetingElement) {
        const greeting = getGreeting();
        greetingElement.textContent = greeting;
        greetingElement.dataset.text = greeting;
    }

    // Update quote
    const quoteElement = document.querySelector('.quote');
    if (quoteElement) {
        const quote = getRandomItem(content.quotes);
        quoteElement.textContent = quote;
        quoteElement.dataset.text = quote;
    }
};

// Scroll Handling
let lastScrollY = window.scrollY;
let ticking = false;

const handleNavbarScroll = () => {
    const currentScrollY = window.scrollY;
    const greetingContainer = document.querySelector('.greeting-container');
    const scrollThreshold = 50;

    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrollingDown = currentScrollY > lastScrollY;
            
            if (greetingContainer) {
                if (scrollingDown && currentScrollY > scrollThreshold) {
                    greetingContainer.classList.add('hidden');
                } else {
                    greetingContainer.classList.remove('hidden');
                }
            }

            lastScrollY = currentScrollY;
            ticking = false;
        });

        ticking = true;
    }
};

// Card Hover Effects
const initializeCardEffects = () => {
    const cards = document.querySelectorAll('.feature-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-10px)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
};

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Initial content update
    updateDynamicContent();
    
    // Set up scroll animations
    createIntersectionObserver(document.querySelectorAll('.feature-card, .section-title'), {
        threshold: 0.1
    });
    
    // Initialize card effects
    initializeCardEffects();
    
    // Set up content rotation
    setInterval(updateDynamicContent, 10000); // Update every 10 seconds

    // Initialize greeting visibility
    const greetingContainer = document.querySelector('.greeting-container');
    if (greetingContainer && window.scrollY < 50) {
        greetingContainer.classList.remove('hidden');
    }
});

// Scroll event listener
window.addEventListener('scroll', handleNavbarScroll, { passive: true }); 