/* ============================================
   ENHANCED ANIMATIONS - #TextAnimation #InstaMagic
   ============================================
   
   This script includes:
   - Counter animations with easing
   - Typing effect for text elements
   - Intersection Observer for scroll-triggered animations
   - Staggered animations for grid items
   - Button ripple effects
   - Smooth scroll enhancements
   - Image zoom effects
   - Icon hover animations
   
   TO CUSTOMIZE:
   1. Animation Speed: Modify duration values (default: 2000ms for counters, 50ms for typing)
   2. Observer Threshold: Change threshold in observerOptions (0.1 = 10% visible)
   3. Stagger Delay: Adjust delay multiplier in staggerObserver (currently 100ms per item)
   4. Typing Speed: Set data-typing-speed attribute on elements (default: 50ms per character)
   
   USAGE:
   - Add 'data-animation="fade-in-up"' to elements for custom animation type
   - Add 'data-delay="0.5"' for custom delay
   - Add 'data-typing' attribute to enable typing effect
   - Add 'data-typing-speed="30"' for custom typing speed
   
   ============================================ */

// Counter Animation - Enhanced with easing
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const startTime = Date.now();
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    
    const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        const current = Math.floor(start + (target - start) * eased);
        
        element.textContent = current + (target >= 1000 ? '+' : '');
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = target + (target >= 1000 ? '+' : '');
        }
    };
    
    animate();
}

// Typing Effect - #TextAnimation
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    element.style.borderRight = '3px solid var(--primary-color)';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Blinking cursor effect
            let blinkCount = 0;
            const blinkInterval = setInterval(() => {
                element.style.borderRight = element.style.borderRight === 'none' 
                    ? '3px solid var(--primary-color)' 
                    : 'none';
                blinkCount++;
                if (blinkCount >= 6) {
                    clearInterval(blinkInterval);
                    element.style.borderRight = 'none';
                }
            }, 500);
        }
    }
    
    type();
}

// Enhanced Intersection Observer with staggered animations - #TextAnimation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            
            // Add appropriate animation class based on element type
            const element = entry.target;
            const animationType = element.dataset.animation || 'fade-in-up';
            
            // Staggered delay for grid items - #GlowUp
            const delay = element.dataset.delay || (index % 6) * 0.1;
            element.style.animationDelay = `${delay}s`;
            element.classList.add(animationType);
            
            // Animate counters
            const statNumbers = element.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                if (target && !stat.classList.contains('animated')) {
                    stat.classList.add('animated');
                    animateCounter(stat, target);
                }
            });
            
            // Typing effect for elements with data-typing attribute
            if (element.dataset.typing) {
                const originalText = element.textContent;
                typeWriter(element, originalText, parseInt(element.dataset.typingSpeed) || 50);
            }
        }
    });
}, observerOptions);

// Staggered animation observer for grid items - #GlowUp
const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll('.feature-card, .value-card, .service-detail-card, .process-step');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('fade-in-up');
                    item.style.animationDelay = `${index * 0.1}s`;
                }, index * 100);
            });
            staggerObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Button Ripple Effect - #InstaMagic
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    const rect = button.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');
    
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }
    
    button.appendChild(circle);
    
    // Remove ripple after animation
    setTimeout(() => {
        circle.remove();
    }, 600);
}

// Smooth Scroll Enhancement - #InstaMagic
function smoothScrollTo(target, offset = 80) {
    const element = document.querySelector(target);
    if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Observe elements when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Observe individual animated elements
    const animatedElements = document.querySelectorAll('.feature-card, .service-detail-card, .value-card, .process-step, .hero-stats, .mission-card, .contact-item, .section-header');
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
    
    // Observe grid containers for staggered animations
    const gridContainers = document.querySelectorAll('.features-grid, .values-grid, .services-detail-grid, .process-steps');
    gridContainers.forEach(container => staggerObserver.observe(container));

    // Enhanced smooth scroll for anchor links - #InstaMagic
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            smoothScrollTo(target, 80);
        });
    });
    
    // Add ripple effect to all buttons - #InstaMagic
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', createRipple);
    });

    // Mobile menu toggle (if needed in future)
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle) {
        const closeNav = () => {
            navLinks.classList.remove('active');
            mobileToggle.classList.remove('open');
            mobileToggle.setAttribute('aria-expanded', 'false');
        };

        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('open');
            const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            mobileToggle.setAttribute('aria-expanded', (!expanded).toString());
        });
        mobileToggle.setAttribute('aria-label', 'Toggle navigation');
        mobileToggle.setAttribute('aria-expanded', 'false');

        // Close menu when a link is clicked (for smooth single-page UX)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => closeNav());
        });

        // Close when clicking outside on mobile widths
        document.addEventListener('click', (e) => {
            const isToggle = mobileToggle.contains(e.target);
            const isMenu = navLinks.contains(e.target);
            const isMobile = window.matchMedia('(max-width: 768px)').matches;
            if (!isToggle && !isMenu && isMobile && navLinks.classList.contains('active')) {
                closeNav();
            }
        });
    }

    // Form validation enhancement
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            const inputs = contactForm.querySelectorAll('input[required], textarea[required], select[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ff4444';
                } else {
                    input.style.borderColor = '';
                }
            });

            if (!isValid) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    }

    // Enhanced Navbar scroll effect with glow - #NeonEffect (Dark Theme)
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 107, 53, 0.2)';
            navbar.style.backdropFilter = 'blur(15px)';
            navbar.style.background = 'rgba(26, 31, 46, 0.98)';
        } else {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(255, 107, 53, 0.1)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.background = 'rgba(26, 31, 46, 0.95)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Add image zoom effect to images - #InstaMagic
    document.querySelectorAll('img').forEach(img => {
        const wrapper = document.createElement('div');
        wrapper.className = 'image-zoom';
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
    });
    
    // Add icon hover effects - #InstaMagic
    document.querySelectorAll('.feature-icon, .value-icon, .service-icon-large, .contact-icon').forEach(icon => {
        icon.classList.add('icon-hover');
    });
    
    // Enhanced form input focus effects - #NeonEffect
    document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.01)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
    
    // Parallax effect for hero section - Enhanced - #InstaMagic
    let ticking = false;
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
    
    // Initialize typing effect for elements with data-typing attribute - #TextAnimation
    document.querySelectorAll('[data-typing]').forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        observer.observe(element);
    });
});

/* ============================================
   ADDITIONAL ENHANCEMENTS - #GlowUp
   ============================================ */

// Performance optimization: Use requestAnimationFrame for smooth animations
function optimizeAnimations() {
    // Add will-animate class to elements that will animate
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .feature-card, .btn');
    animatedElements.forEach(el => {
        el.classList.add('will-animate');
    });
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', optimizeAnimations);
} else {
    optimizeAnimations();
}

