/**
 * Ralph Ngirazi - Portfolio Scripts
 * Handles:
 * 1. Responsive mobile navigation toggle & auto-close on link click
 * 2. Active navigation link highlight on scroll
 * 3. Direct email contact form submission via FormSubmit AJAX with mailto fallback
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const menuIcon = document.getElementById('menu-icon');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-link');
    const header = document.getElementById('header');
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnIcon = document.getElementById('btn-icon');
    const formStatus = document.getElementById('form-status');

    // =========================================================================
    // 1. Mobile Navigation
    // =========================================================================

    /**
     * Toggles the mobile navigation menu open/close
     */
    function toggleMobileMenu() {
        if (!navLinks || !menuIcon) return;
        const isActive = navLinks.classList.toggle('active');
        
        // Toggle icon between bars and close X
        if (isActive) {
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-xmark');
            menuIcon.setAttribute('aria-expanded', 'true');
        } else {
            menuIcon.classList.remove('fa-xmark');
            menuIcon.classList.add('fa-bars');
            menuIcon.setAttribute('aria-expanded', 'false');
        }
    }

    /**
     * Closes the mobile navigation menu if it is currently open
     */
    function closeMobileMenu() {
        if (!navLinks || !menuIcon) return;
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuIcon.classList.remove('fa-xmark');
            menuIcon.classList.add('fa-bars');
            menuIcon.setAttribute('aria-expanded', 'false');
        }
    }

    // Toggle menu on hamburger click
    if (menuIcon) {
        menuIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });
    }

    // Close menu when clicking any navigation link (allows user to scroll down smoothly)
    navItems.forEach((link) => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Also close menu when logo is clicked to scroll to top
    const logoLink = document.getElementById('logo');
    if (logoLink) {
        logoLink.addEventListener('click', () => {
            closeMobileMenu();
        });
    }

    // Close menu if user clicks anywhere outside of header/nav
    document.addEventListener('click', (e) => {
        if (header && !header.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Close mobile menu on ESC key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });

    // Ensure menu state resets if viewport is resized to desktop width
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

    // =========================================================================
    // 2. Active Link on Scroll
    // =========================================================================
    const sections = document.querySelectorAll('section');

    function highlightActiveNavLink() {
        const scrollPosition = window.scrollY + 180;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navItems.forEach((link) => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveNavLink);

    // =========================================================================
    // 3. Contact Form Submission (Sending Emails Directly to Ralph)
    // =========================================================================
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear previous status
            formStatus.className = 'form-status';
            formStatus.textContent = '';

            const name = document.getElementById('user-name').value.trim();
            const email = document.getElementById('user-email').value.trim();
            const subject = document.getElementById('user-subject').value.trim();
            const message = document.getElementById('user-message').value.trim();

            if (!name || !email || !subject || !message) {
                showFormStatus('Please fill in all fields before submitting.', 'error');
                return;
            }

            // Set loading state on button
            submitBtn.disabled = true;
            btnText.textContent = 'Sending...';
            btnIcon.className = 'fa-solid fa-spinner fa-spin';

            showFormStatus('Sending your message directly to Ralph...', 'info');

            const payload = {
                name: name,
                email: email,
                subject: `Portfolio Message: ${subject}`,
                message: message,
                _subject: `New Portfolio Contact: ${subject} (from ${name})`,
                _template: 'table'
            };

            try {
                // Submit to FormSubmit endpoint for ralphngirazi@gmail.com
                const response = await fetch('https://formsubmit.co/ajax/ralphngirazi@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok && (data.success === 'true' || data.success === true || response.status === 200)) {
                    showFormStatus('Message sent successfully! Thank you, Ralph will get back to you shortly.', 'success');
                    contactForm.reset();
                    btnText.textContent = 'Message Sent!';
                    btnIcon.className = 'fa-solid fa-check';
                } else {
                    throw new Error(data.message || 'Server error occurred');
                }
            } catch (error) {
                console.warn('FormSubmit AJAX submission failed, offering direct email fallback:', error);
                
                // Fallback: If network issue occurs, trigger mailto so message is never lost
                showFormStatus(
                    'Direct submission encountered a network issue. Opening your email app to send directly...',
                    'info'
                );

                const mailtoUrl = `mailto:ralphngirazi@gmail.com?subject=${encodeURIComponent(
                    `[Portfolio] ${subject}`
                )}&body=${encodeURIComponent(
                    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
                )}`;

                setTimeout(() => {
                    window.location.href = mailtoUrl;
                }, 1000);

                btnText.textContent = 'Opening Email...';
                btnIcon.className = 'fa-solid fa-envelope';
            } finally {
                // Restore submit button after 4 seconds
                setTimeout(() => {
                    submitBtn.disabled = false;
                    btnText.textContent = 'Send Message';
                    btnIcon.className = 'fa-solid fa-paper-plane';
                }, 4000);
            }
        });
    }

    /**
     * Helper to show form status messages
     * @param {string} message - Message text
     * @param {'success' | 'error' | 'info'} type - Status type
     */
    function showFormStatus(message, type) {
        if (!formStatus) return;
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
    }
});
