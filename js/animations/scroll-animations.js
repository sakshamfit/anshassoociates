// ANSH ASSOCIATES - Scroll Animations
// Handles GSAP ScrollTrigger animations for knowledge cards and other elements

import { gsap } from './vendor/gsap.min.js';
import { ScrollTrigger } from './vendor/ScrollTrigger.min.js';

gsap.registerPlugin(ScrollTrigger);

export function initGSAPAnimations() {
    // Animate elements with knowledge-card class on scroll
    gsap.utils.toArray('.knowledge-card').forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                end: "bottom 60%",
                scrub: 1,
                // markers: true, // Uncomment for debugging
            }
        });
    });

    // Animate property cards with staggered effect
    gsap.utils.toArray('.property-card').forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            delay: index * 0.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: card,
                start: "top 80%",
                end: "bottom 60%",
                once: true,
            }
        });
    });

    // Animate service cards
    gsap.utils.toArray('.serv-card, .or-card').forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            y: 40,
            duration: 0.7,
            delay: index * 0.08,
            ease: "power3.out",
            scrollTrigger: {
                trigger: card,
                start: "top 80%",
                end: "bottom 60%",
                once: true,
            }
        });
    });

    // Animate about cards
    gsap.utils.toArray('.about-card').forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            x: index % 2 === 0 ? -50 : 50,
            duration: 0.8,
            delay: index * 0.1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: card,
                start: "top 80%",
                end: "bottom 60%",
                once: true,
            }
        });
    });

    // Animate testimonial blocks
    gsap.utils.toArray('.test-block').forEach((block, index) => {
        gsap.from(block, {
            opacity: 0,
            y: 40,
            duration: 0.7,
            delay: index * 0.1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: block,
                start: "top 80%",
                end: "bottom 60%",
                once: true,
            }
        });
    });

    // Animate contact information blocks
    gsap.utils.toArray('.cin-info, .con-form, .con-quote, .col-center, .col-map').forEach((elem, index) => {
        gsap.from(elem, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            delay: index * 0.08,
            ease: "power2.out",
            scrollTrigger: {
                trigger: elem,
                start: "top 80%",
                end: "bottom 60%",
                once: true,
            }
        });
    });

    // Animate header elements on load
    gsap.from("#logoSlot", {
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
        delay: 0.5
    });

    gsap.from(".nav-link", {
        opacity: 0,
        y: -20,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.8
    });

    // Animate hero section elements
    gsap.from(".hero-copy", {
        opacity: 0,
        y: 50,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.5
    });

    gsap.from(".hero-side", {
        opacity: 0,
        x: 50,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.7
    });

    gsap.from(".hero-script", {
        opacity: 0,
        rotation: -10,
        y: 30,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.9
    });

    gsap.from(".hero-scroll", {
        opacity: 0,
        y: 30,
        duration: 1.2,
        ease: "power4.out",
        delay: 1.1
    });

    // Animate signature section
    gsap.from(".signature-grid li", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
        delay: 1.3
    });

    // Add hover effects to cards
    const enhanceCardHover = (selector) => {
        gsap.utils.toArray(selector).forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    scale: 1.03,
                    duration: 0.4,
                    ease: "power2.out"
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    scale: 1,
                    duration: 0.4,
                    ease: "power2.out"
                });
            });
        });
    };

    enhanceCardHover('.property-card');
    enhanceCardHover('.serv-card');
    enhanceCardHover('.or-card');
    enhanceCardHover('.about-card');
    enhanceCardHover('.test-block');
    enhanceCardHover('.cin-info');

    // Initialize Lenis smooth scroll
    if (typeof Lenis !== 'undefined') {
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
    }
}