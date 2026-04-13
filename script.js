// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

// Contact Form Submission
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);

    if (!formData.get('name') || !formData.get('email') || !formData.get('message')) {
        showMessage('Kérjük, töltse ki az összes kötelező mezőt!', 'error');
        return;
    }

    const submitBtn = contactForm.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    showMessage('Küldés folyamatban...', 'success');

    try {
        const response = await fetch('send-email.php', { method: 'POST', body: formData });
        const result = await response.json();
        if (result.success) {
            showMessage('Köszönjük üzenetét! Hamarosan felvesszük Önnel a kapcsolatot.', 'success');
            contactForm.reset();
        } else {
            showMessage('Hiba történt a küldés során. Kérjük, hívjon minket: +36 70 616 5247', 'error');
        }
    } catch {
        showMessage('Hiba történt. Kérjük, hívjon minket: +36 70 616 5247', 'error');
    } finally {
        submitBtn.disabled = false;
    }
});

function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll reveal animation
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.service-card, .why-card, .detail-card, .testimonial-card, .value-card').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    revealObserver.observe(el);
});

// Quote Modal
function openQuoteModal(productType = '') {
    const modal = document.getElementById('quoteModal');
    const serviceField = document.getElementById('quoteService');

    if (productType && serviceField) {
        serviceField.value = productType;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeQuoteModal() {
    const modal = document.getElementById('quoteModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

const quoteForm = document.getElementById('quoteForm');
const quoteFormMessage = document.getElementById('quoteFormMessage');

if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(quoteForm);

        if (!formData.get('name') || !formData.get('phone')) {
            showQuoteMessage('Kérjük, adja meg nevét és telefonszámát!', 'error');
            return;
        }

        const submitBtn = quoteForm.querySelector('[type="submit"]');
        submitBtn.disabled = true;
        showQuoteMessage('Küldés folyamatban...', 'success');

        try {
            const response = await fetch('send-email.php', { method: 'POST', body: formData });
            const result = await response.json();
            if (result.success) {
                showQuoteMessage('Köszönjük! Hamarosan visszahívjuk.', 'success');
                quoteForm.reset();
                setTimeout(closeQuoteModal, 3000);
            } else {
                showQuoteMessage('Hiba a küldésnél. Hívjon minket: +36 70 616 5247', 'error');
            }
        } catch {
            showQuoteMessage('Hiba a küldésnél. Hívjon minket: +36 70 616 5247', 'error');
        } finally {
            submitBtn.disabled = false;
        }
    });
}

function showQuoteMessage(message, type) {
    quoteFormMessage.textContent = message;
    quoteFormMessage.className = `form-message ${type}`;
}

// Close modal on outside click or Escape
window.addEventListener('click', (e) => {
    const quoteModal = document.getElementById('quoteModal');
    if (e.target === quoteModal) closeQuoteModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeQuoteModal();
});
