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

// Email endpoint — aloldalakról '../send-email.php', főoldalról 'send-email.php'
const EMAIL_URL = (typeof SEND_EMAIL_URL !== 'undefined') ? SEND_EMAIL_URL : 'send-email.php';

// Contact Form Submission
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
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
            const response = await fetch(EMAIL_URL, { method: 'POST', body: formData });
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
}

function showMessage(message, type) {
    if (!formMessage) return;
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
            const response = await fetch(EMAIL_URL, { method: 'POST', body: formData });
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
    if (e.key === 'Escape') {
        closeQuoteModal();
        closeGallery();
    }
});

// ========================================
// Gallery Lightbox
// ========================================

const galleryData = [
    {
        title: 'Mennyezet hűtés-fűtés',
        images: [
            { src: 'images/mennyezet-futes-1.jpg', alt: 'Mennyezet hűtés-fűtés — rendszerlemez és csővezetékek' },
            { src: 'images/mennyezet-futes-2.jpg', alt: 'Mennyezet hűtés-fűtés — csőelrendezés szobában' },
            { src: 'images/mennyezet-futes-3.jpg', alt: 'Mennyezet hűtés-fűtés — teljes rendszer áttekintés' },
            { src: 'images/mennyezet-futes-4.jpg', alt: 'Mennyezet hűtés-fűtés — elosztó bekötés' },
            { src: 'images/mennyezet-futes-5.jpg', alt: 'Mennyezet hűtés-fűtés — kész szerkezet' },
        ]
    },
    {
        title: 'Padlófűtés — Valsir technológia',
        images: [
            { src: 'images/padlofutes-1.jpg', alt: 'Padlófűtés — Valsir cső fektetés sarokba' },
            { src: 'images/padlofutes-2.jpg', alt: 'Padlófűtés — spirális csőelrendezés' },
            { src: 'images/padlofutes-3.jpg', alt: 'Padlófűtés — szoba teljes lefedése' },
            { src: 'images/padlofutes-4.jpg', alt: 'Padlófűtés — csőbekötés részlet' },
        ]
    },
    {
        title: 'Kospel hőszivattyú telepítés',
        images: [
            { src: 'images/kospel-hoszivattyu-1.jpg', alt: 'Kospel hőszivattyú — kültéri egység elhelyezés' },
            { src: 'images/kospel-hoszivattyu-2.jpg', alt: 'Kospel hőszivattyú — telepítés folyamata' },
            { src: 'images/kospel-hoszivattyu-3.jpg', alt: 'Kospel hőszivattyú — csatlakoztatás' },
            { src: 'images/kospel-hoszivattyu-4.jpg', alt: 'Kospel hőszivattyú — hőközpont bekötés' },
            { src: 'images/kospel-hoszivattyu-5.jpg', alt: 'Kospel hőszivattyú — belső egység' },
            { src: 'images/kospel-hoszivattyu-6.jpg', alt: 'Kospel hőszivattyú — csőszerelés részlet' },
            { src: 'images/kospel-hoszivattyu-7.jpg', alt: 'Kospel hőszivattyú — vezérlés bekötés' },
            { src: 'images/kospel-hoszivattyu-8.jpg', alt: 'Kospel hőszivattyú — kész rendszer' },
        ]
    },
    {
        title: 'LG Therma V hőszivattyú szerviz',
        images: [
            { src: 'images/lg-therma-szerviz-1.jpg', alt: 'LG Therma V szerviz — diagnosztika' },
            { src: 'images/lg-therma-szerviz-2.jpg', alt: 'LG Therma V szerviz — egység megbontás' },
            { src: 'images/lg-therma-szerviz-3.jpg', alt: 'LG Therma V szerviz — vákuumszivattyú' },
            { src: 'images/lg-therma-szerviz-4.jpg', alt: 'LG Therma V szerviz — gázoldali ellenőrzés' },
            { src: 'images/lg-therma-szerviz-5.jpg', alt: 'LG Therma V szerviz — belső alkatrészek' },
            { src: 'images/lg-therma-szerviz-6.jpg', alt: 'LG Therma V szerviz — csőcsatlakozók' },
            { src: 'images/lg-therma-szerviz-7.jpg', alt: 'LG Therma V szerviz — keringető szivattyú' },
            { src: 'images/lg-therma-szerviz-8.jpg', alt: 'LG Therma V szerviz — elektromos vizsgálat' },
            { src: 'images/lg-therma-szerviz-9.jpg', alt: 'LG Therma V szerviz — újraindítás' },
            { src: 'images/lg-therma-szerviz-10.jpg', alt: 'LG Therma V szerviz — beállítás optimalizálás' },
            { src: 'images/lg-therma-szerviz-11.jpg', alt: 'LG Therma V szerviz — kész munka' },
        ]
    },
    {
        title: 'Kazáncsere — kondenzációs rendszer',
        images: [
            { src: 'images/kazancsere-1.jpg', alt: 'Kazáncsere — három kondenzációs kazán telepítve' },
            { src: 'images/kazancsere-2.jpg', alt: 'Kazáncsere — bekötés részlet' },
            { src: 'images/kazancsere-3.jpg', alt: 'Kazáncsere — kész rendszer' },
        ]
    },
];

let currentProject = 0;
let currentImage = 0;

function openGallery(projectIndex) {
    currentProject = projectIndex;
    currentImage = 0;
    const lightbox = document.getElementById('galleryLightbox');
    lightbox.style.display = 'flex';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderLightboxImage();
}

function closeGallery() {
    const lightbox = document.getElementById('galleryLightbox');
    lightbox.classList.remove('active');
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
}

function renderLightboxImage() {
    const project = galleryData[currentProject];
    const img = project.images[currentImage];
    const imgEl = document.getElementById('lightboxImg');
    const titleEl = document.getElementById('lightboxTitle');
    const counterEl = document.getElementById('lightboxCounter');

    imgEl.src = img.src;
    imgEl.alt = img.alt;
    titleEl.textContent = project.title;
    counterEl.textContent = `${currentImage + 1} / ${project.images.length}`;

    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    prevBtn.style.visibility = project.images.length > 1 ? 'visible' : 'hidden';
    nextBtn.style.visibility = project.images.length > 1 ? 'visible' : 'hidden';
}

function galleryPrev() {
    const total = galleryData[currentProject].images.length;
    currentImage = (currentImage - 1 + total) % total;
    renderLightboxImage();
}

function galleryNext() {
    const total = galleryData[currentProject].images.length;
    currentImage = (currentImage + 1) % total;
    renderLightboxImage();
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('galleryLightbox');
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') galleryPrev();
    if (e.key === 'ArrowRight') galleryNext();
});

// Touch swipe for lightbox
let touchStartX = 0;
document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    const lightbox = document.getElementById('galleryLightbox');
    if (!lightbox.classList.contains('active')) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
        dx < 0 ? galleryNext() : galleryPrev();
    }
}, { passive: true });

// Keyboard open on Enter/Space for project cards
document.querySelectorAll('.project-card').forEach((card, i) => {
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openGallery(i);
        }
    });
});
