document.addEventListener('DOMContentLoaded', () => {

    /* ============================================
       REVEAL ANIMATIONS (Intersection Observer)
       ============================================ */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


    /* ============================================
       DARK MODE TOGGLE
       ============================================ */
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon   = document.getElementById('theme-icon');
    const html        = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next    = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeIcon(next);
    });

    function updateThemeIcon(theme) {
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }


    /* ============================================
       HAMBURGER MENU
       ============================================ */
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    hamburger.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            hamburger.classList.remove('open');
        });
    });

    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.remove('open');
            hamburger.classList.remove('open');
        }
    });


    /* ============================================
       SMOOTH SCROLL
       ============================================ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                window.scrollTo({ top: targetEl.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });


    /* ============================================
       ACTIVE NAV HIGHLIGHT ON SCROLL
       ============================================ */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle(
                        'active',
                        link.getAttribute('href') === `#${entry.target.id}`
                    );
                });
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(section => sectionObserver.observe(section));


    /* ============================================
       CONTACT FORM
       Calls /api/contact — a Vercel serverless
       function that holds the key server-side.
       The key is NEVER in this file.
       ============================================ */
    const form      = document.getElementById('contact-form');
    const success   = document.getElementById('form-success');
    const submitBtn = form.querySelector('.submit-btn');
    const btnText   = form.querySelector('.btn-text');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name    = document.getElementById('name').value.trim();
        const email   = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        // Inline validation
        let hasError = false;
        ['name', 'email', 'message'].forEach(id => {
            const field = document.getElementById(id);
            if (!field.value.trim()) {
                field.style.borderColor = '#ef4444';
                field.addEventListener('input', () => { field.style.borderColor = ''; }, { once: true });
                hasError = true;
            }
        });
        if (hasError) return;

        // Loading state
        submitBtn.disabled = true;
        btnText.textContent = 'Sending…';

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ name, email, subject, message })
            });

            const data = await res.json();

            if (data.success) {
                success.classList.add('visible');
                form.reset();
                setTimeout(() => success.classList.remove('visible'), 6000);
            } else {
                throw new Error(data.message || 'Submission failed');
            }

        } catch (err) {
            console.error('Contact form error:', err);
            alert('Oops — something went wrong. Please email me directly at aaya.elsh@gmail.com');
        } finally {
            submitBtn.disabled = false;
            btnText.textContent = 'Send Message';
        }
    });


    /* ============================================
       HERO PARALLAX
       ============================================ */
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.backgroundPositionY = `${window.scrollY * 0.4}px`;
        }
    });

});
