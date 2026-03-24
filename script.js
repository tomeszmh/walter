// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

// Form Submission
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        message: formData.get('message')
    };

    if (!data.name || !data.email || !data.message) {
        showMessage('Kérjük, töltse ki az összes kötelező mezőt!', 'error');
        return;
    }

    showMessage('Küldés folyamatban...', 'success');

    // In a real application, send to server:
    // fetch('/api/contact', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data)
    // })
    // .then(response => response.json())
    // .then(data => {
    //     showMessage('Köszönjük üzenetét! Hamarosan felvesszük Önnel a kapcsolatot.', 'success');
    //     contactForm.reset();
    // })
    // .catch(error => {
    //     showMessage('Hiba történt. Kérjük, próbálja újra később.', 'error');
    // });

    setTimeout(() => {
        showMessage('Köszönjük üzenetét! Hamarosan felvesszük Önnel a kapcsolatot.', 'success');
        contactForm.reset();
    }, 1000);
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
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
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
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.service-card, .why-card, .product-card, .brand-card, .calc-card, .featured-card, .testimonial-card, .value-card, .process-step').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    revealObserver.observe(el);
});

// Quote Modal Functions
function openQuoteModal(productType = '') {
    const modal = document.getElementById('quoteModal');
    const quoteProduct = document.getElementById('quoteProduct');

    if (productType && quoteProduct) {
        quoteProduct.value = productType;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeQuoteModal() {
    const modal = document.getElementById('quoteModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Quote Form Submission
const quoteForm = document.getElementById('quoteForm');
const quoteFormMessage = document.getElementById('quoteFormMessage');

if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(quoteForm);
        const data = Object.fromEntries(formData.entries());

        if (!data.name || !data.email || !data.phone || !data.product || !data.propertyType || !data.area) {
            showQuoteMessage('Kérjük, töltse ki az összes kötelező mezőt!', 'error');
            return;
        }

        showQuoteMessage('Árajánlatkérés küldése folyamatban...', 'success');

        // In production, send to server
        setTimeout(() => {
            showQuoteMessage('Köszönjük árajánlatkérését! Részletes árajánlatunkat 24 órán belül emailben küldjük.', 'success');
            quoteForm.reset();
            setTimeout(closeQuoteModal, 4000);
        }, 1500);
    });
}

function showQuoteMessage(message, type) {
    quoteFormMessage.textContent = message;
    quoteFormMessage.className = `form-message ${type}`;
    quoteFormMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const quoteModal = document.getElementById('quoteModal');
    const calculatorModal = document.getElementById('calculatorModal');

    if (e.target === quoteModal) closeQuoteModal();
    if (e.target === calculatorModal) closeCalculator();
});

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeQuoteModal();
        closeCalculator();
    }
});

// Calculator Functions
function openCalculator(type) {
    const modal = document.getElementById('calculatorModal');
    const content = document.getElementById('calculatorContent');

    let calculatorHTML = '';

    switch(type) {
        case 'cost':
            calculatorHTML = `
                <h3 style="padding: 2rem 2rem 0; font-size: 1.5rem; color: var(--charcoal);">Költségkalkulátor</h3>
                <form id="costCalculator" class="calculator-form">
                    <div class="form-group">
                        <label>Ingatlan típusa</label>
                        <select id="calcPropertyType" required>
                            <option value="">Válasszon</option>
                            <option value="csaladi">Családi ház</option>
                            <option value="lakas">Lakás</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Fűtendő alapterület (m²)</label>
                        <input type="number" id="calcArea" min="0" step="1" required>
                    </div>
                    <div class="form-group">
                        <label>Választott rendszer</label>
                        <select id="calcSystem" required>
                            <option value="">Válasszon</option>
                            <option value="hoszivattyu">Hőszivattyú</option>
                            <option value="klima">Klíma rendszer</option>
                            <option value="komplex">Komplex rendszer</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Jelenlegi éves fűtési költség (Ft)</label>
                        <input type="number" id="calcCurrentCost" min="0" step="1000" placeholder="Pl. 300000">
                    </div>
                    <button type="submit" class="calculator-btn">Számítás</button>
                </form>
                <div id="costResult" class="calc-result" style="display: none; margin: 0 2rem 2rem;"></div>
            `;
            break;
        case 'energy':
            calculatorHTML = `
                <h3 style="padding: 2rem 2rem 0; font-size: 1.5rem; color: var(--charcoal);">Energiatakarékossági kalkulátor</h3>
                <form id="energyCalculator" class="calculator-form">
                    <div class="form-group">
                        <label>Jelenlegi fűtési rendszer</label>
                        <select id="calcOldSystem" required>
                            <option value="">Válasszon</option>
                            <option value="gaz">Gáz</option>
                            <option value="villany">Villany</option>
                            <option value="fa">Fa/pellet</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Éves fűtési költség (Ft)</label>
                        <input type="number" id="calcAnnualCost" min="0" step="1000" required>
                    </div>
                    <div class="form-group">
                        <label>Fűtendő alapterület (m²)</label>
                        <input type="number" id="calcEnergyArea" min="0" step="1" required>
                    </div>
                    <button type="submit" class="calculator-btn">Számítás</button>
                </form>
                <div id="energyResult" class="calc-result" style="display: none; margin: 0 2rem 2rem;"></div>
            `;
            break;
        case 'sizing':
            calculatorHTML = `
                <h3 style="padding: 2rem 2rem 0; font-size: 1.5rem; color: var(--charcoal);">Hőszivattyú méretezés</h3>
                <form id="sizingCalculator" class="calculator-form">
                    <div class="form-group">
                        <label>Ingatlan típusa</label>
                        <select id="calcSizingType" required>
                            <option value="">Válasszon</option>
                            <option value="ujepitesu">Újépítésű (jó szigetelés)</option>
                            <option value="felujitott">Felújított (közepes)</option>
                            <option value="regi">Régi (gyenge szigetelés)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Fűtendő alapterület (m²)</label>
                        <input type="number" id="calcSizingArea" min="0" step="1" required>
                    </div>
                    <div class="form-group">
                        <label>Szobák száma</label>
                        <input type="number" id="calcRooms" min="1" step="1">
                    </div>
                    <div class="form-group">
                        <label>Emeletek száma</label>
                        <input type="number" id="calcFloors" min="1" step="1" value="1">
                    </div>
                    <button type="submit" class="calculator-btn">Számítás</button>
                </form>
                <div id="sizingResult" class="calc-result" style="display: none; margin: 0 2rem 2rem;"></div>
            `;
            break;
    }

    content.innerHTML = calculatorHTML;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    attachCalculatorListeners(type);
}

function attachCalculatorListeners(type) {
    const form = document.querySelector('.calculator-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        calculate(type);
    });
}

function calculate(type) {
    switch(type) {
        case 'cost': calculateCost(); break;
        case 'energy': calculateEnergy(); break;
        case 'sizing': calculateSizing(); break;
    }
}

function calculateCost() {
    const area = parseFloat(document.getElementById('calcArea').value);
    const system = document.getElementById('calcSystem').value;
    const currentCost = parseFloat(document.getElementById('calcCurrentCost').value) || 0;
    const resultDiv = document.getElementById('costResult');

    if (!area || !system) return;

    const basePrice = area * (system === 'hoszivattyu' ? 150000 : system === 'klima' ? 80000 : 200000);
    const installation = basePrice * 0.3;
    const total = basePrice + installation;
    const monthlySavings = currentCost > 0 ? (currentCost / 12) * 0.6 : 0;
    const paybackYears = currentCost > 0 ? (total / (currentCost * 0.6)) : 0;

    resultDiv.innerHTML = `
        <h4>Kalkuláció eredménye</h4>
        <div class="calc-result-value">${Math.round(total).toLocaleString('hu-HU')} Ft</div>
        <p><strong>Becsült beruházási költség:</strong></p>
        <ul style="text-align: left; margin-top: 0.75rem; list-style: none; padding: 0;">
            <li style="padding: 0.35rem 0; border-bottom: 1px solid var(--cream-dark);">Termék: ${Math.round(basePrice).toLocaleString('hu-HU')} Ft</li>
            <li style="padding: 0.35rem 0; border-bottom: 1px solid var(--cream-dark);">Szerelés: ${Math.round(installation).toLocaleString('hu-HU')} Ft</li>
            ${currentCost > 0 ? `<li style="padding: 0.35rem 0; border-bottom: 1px solid var(--cream-dark);">Havi megtakarítás: ${Math.round(monthlySavings).toLocaleString('hu-HU')} Ft</li>` : ''}
            ${paybackYears > 0 ? `<li style="padding: 0.35rem 0;">Visszafizetési idő: ~${Math.round(paybackYears)} év</li>` : ''}
        </ul>
        <p style="margin-top: 1rem; font-size: 0.8rem; color: var(--warm-gray);">
            * Becsült érték. Pontos árajánlatért kérjen ingyenes felmérést.
        </p>
    `;
    resultDiv.style.display = 'block';
}

function calculateEnergy() {
    const oldSystem = document.getElementById('calcOldSystem').value;
    const annualCost = parseFloat(document.getElementById('calcAnnualCost').value);
    const area = parseFloat(document.getElementById('calcEnergyArea').value);
    const resultDiv = document.getElementById('energyResult');

    if (!oldSystem || !annualCost || !area) return;

    const savingsPercent = oldSystem === 'gaz' ? 0.5 : oldSystem === 'villany' ? 0.7 : 0.4;
    const newAnnualCost = annualCost * (1 - savingsPercent);
    const annualSavings = annualCost - newAnnualCost;
    const monthlySavings = annualSavings / 12;

    resultDiv.innerHTML = `
        <h4>Energiatakarékossági számítás</h4>
        <div class="calc-result-value">${Math.round(annualSavings).toLocaleString('hu-HU')} Ft/év</div>
        <p><strong>Várható megtakarítás:</strong></p>
        <ul style="text-align: left; margin-top: 0.75rem; list-style: none; padding: 0;">
            <li style="padding: 0.35rem 0; border-bottom: 1px solid var(--cream-dark);">Jelenlegi éves: ${Math.round(annualCost).toLocaleString('hu-HU')} Ft</li>
            <li style="padding: 0.35rem 0; border-bottom: 1px solid var(--cream-dark);">Új éves: ${Math.round(newAnnualCost).toLocaleString('hu-HU')} Ft</li>
            <li style="padding: 0.35rem 0; border-bottom: 1px solid var(--cream-dark);">Havi megtakarítás: ${Math.round(monthlySavings).toLocaleString('hu-HU')} Ft</li>
            <li style="padding: 0.35rem 0;">Megtakarítás: ${Math.round(savingsPercent * 100)}%</li>
        </ul>
        <p style="margin-top: 1rem; font-size: 0.8rem; color: var(--warm-gray);">
            * A megtakarítás az ingatlan szigetelésétől és használati szokásaitól függ.
        </p>
    `;
    resultDiv.style.display = 'block';
}

function calculateSizing() {
    const type = document.getElementById('calcSizingType').value;
    const area = parseFloat(document.getElementById('calcSizingArea').value);
    const rooms = parseFloat(document.getElementById('calcRooms').value) || 0;
    const floors = parseFloat(document.getElementById('calcFloors').value) || 1;
    const resultDiv = document.getElementById('sizingResult');

    if (!type || !area) return;

    const heatLoss = type === 'ujepitesu' ? 40 : type === 'felujitott' ? 60 : 100;
    const basePower = (area * heatLoss) / 1000;
    const recommendedPower = Math.ceil(basePower / 2) * 2;

    resultDiv.innerHTML = `
        <h4>Ajánlott teljesítmény</h4>
        <div class="calc-result-value">${recommendedPower} kW</div>
        <p><strong>Számítás részletei:</strong></p>
        <ul style="text-align: left; margin-top: 0.75rem; list-style: none; padding: 0;">
            <li style="padding: 0.35rem 0; border-bottom: 1px solid var(--cream-dark);">Alapterület: ${area} m²</li>
            <li style="padding: 0.35rem 0; border-bottom: 1px solid var(--cream-dark);">Szobák: ${rooms || 'Nincs megadva'}</li>
            <li style="padding: 0.35rem 0; border-bottom: 1px solid var(--cream-dark);">Emeletek: ${floors}</li>
            <li style="padding: 0.35rem 0; border-bottom: 1px solid var(--cream-dark);">Számított: ${basePower.toFixed(1)} kW</li>
            <li style="padding: 0.35rem 0;"><strong>Ajánlott: ${recommendedPower} kW</strong></li>
        </ul>
        <p style="margin-top: 1rem; font-size: 0.8rem; color: var(--warm-gray);">
            * Pontos méretezéshez helyszíni felmérés szükséges.
        </p>
    `;
    resultDiv.style.display = 'block';
}

function closeCalculator() {
    const modal = document.getElementById('calculatorModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}
