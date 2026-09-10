// ANSH ASSOCIATES - Main JavaScript File
// Handles initialization of Lenis smooth scroll, ScrollTrigger, and other interactive elements

import { initGSAPAnimations } from './animations/scroll-animations.js';
import { initKnowledgeGraph } from './knowledge-graph/knowledge-visualization.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Initialize GSAP animations for scroll-triggered reveals
    initGSAPAnimations();

    // Initialize knowledge graph if container exists
    const knowledgeContainer = document.getElementById('knowledge-graph');
    if (knowledgeContainer) {
        initKnowledgeGraph('knowledge-graph', {
            backgroundColor: 0xfffdf8, // Very light cream
            nodeColor: 0x8B0000, // ANSH Associates deep red
            connectionColor: 0xCD5C5C, // Lighter red for connections
            nodeSize: 14,
            connectionSize: 2
        });
    }

    // Add knowledge-card class to elements that should trigger animations
    const elementsToEnhance = [
        '.property-card',
        '.serv-card',
        '.or-card',
        '.eyebrow',
        '.heading',
        '.sub',
        '.cta',
        '.feature-item',
        '.property-title',
        '.property-location',
        '.property-price'
    ];

    elementsToEnhance.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('knowledge-card');
        });
    });

    // Handle mobile menu toggle
    const menuBtn = document.querySelector('.menu-btn');
    const mobileMenu = document.getElementById('mobileMenu');
    const body = document.body;

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('is-open');
            body.classList.toggle('menu-open');
        });
    }

    // Handle language switching
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            langBtns.forEach(b => b.classList.remove('is-active'));
            // Add active class to clicked button
            btn.classList.add('is-active');

            // Store language preference
            const lang = btn.getAttribute('data-lang');
            localStorage.setItem('preferredLanguage', lang);

            // Optional: Trigger language change event
            document.dispatchEvent(new CustomEvent('languageChange', { detail: { lang } }));
        });
    });

    // Initialize language from storage on load
    const storedLang = localStorage.getItem('preferredLanguage');
    if (storedLang) {
        const storedLangBtn = document.querySelector(`.lang-btn[data-lang="${storedLang}"]`);
        if (storedLangBtn) {
            langBtns.forEach(btn => btn.classList.remove('is-active'));
            storedLangBtn.classList.add('is-active');
        }
    }

    // Handle property inquiry form submission
    const inquiryForm = document.getElementById('propertyInquiryForm');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form values
            const formData = new FormData(inquiryForm);
            const data = Object.fromEntries(formData);

            // Here you would typically send this data to a backend service
            // For now, we'll show a success message
            alert('Thank you for your inquiry! Our team will contact you shortly.');

            // Reset form
            inquiryForm.reset();
        });
    }

    // Add scroll progress indicator (optional)
    // const progressBar = document.createElement('div');
    // progressBar.className = 'scroll-progress';
    // progressBar.innerHTML = '<div class="progress-bar"></div>';
    // document.body.appendChild(progressBar);

    // Update progress on scroll
    // lenis.on('scroll', ({ scroll, limit }) => {
    //     const progress = scroll / limit;
    //     document.querySelector('.progress-bar').style.width = `${progress * 100}%`;
    // });

    // Reveal elements on load for initial view
    setTimeout(() => {
        const revealElements = document.querySelectorAll('[data-reveal]');
        revealElements.forEach(el => {
            el.classList.add('visible');
        });
    }, 300);
});

// Handle hash-based navigation for sections
document.addEventListener('click', (e) => {
    if (e.target.matches('[data-goto]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('data-goto');
        const targetElement = document.getElementById(targetId.substring(1)); // Remove #

        if (targetElement) {
            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu && mobileMenu.classList.contains('is-open')) {
                mobileMenu.classList.remove('is-open');
                document.body.classList.remove('menu-open');
            }

            // Scroll to element
            targetElement.scrollIntoView({ behavior: 'smooth' });

            // Update URL hash
            history.pushState(null, '', `#${targetId}`);
        }
    }
});

// Initialize on hash change (for direct links)
window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    if (hash) {
        const targetElement = document.getElementById(hash.substring(1));
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
});