// ==================== МОБИЛЬНОЕ МЕНЮ ====================
const mobileBtn = document.getElementById('mobileMenuBtn');
const nav = document.getElementById('mainNav');

mobileBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
    mobileBtn.innerHTML = nav.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// ==================== SCROLL: ХЕДЕР И ПРОГРЕСС-БАР ====================
window.addEventListener('scroll', () => {
    document.getElementById('header').classList.toggle('scrolled', window.scrollY > 80);
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    document.querySelector('.progress-bar').style.width = (winScroll / height) * 100 + '%';
});

// ==================== АНИМАЦИЯ ПРИ ПРОКРУТКЕ (SCROLL REVEAL) ====================
const reveals = document.querySelectorAll('.scroll-reveal');
const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('revealed');
    });
}, { threshold: 0.1 });
reveals.forEach(r => obs.observe(r));

// ==================== ПЛАВНАЯ ПРОКРУТКА ПО ЯКОРЯМ ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const offset = document.querySelector('header').offsetHeight;
            window.scrollTo({
                top: target.offsetTop - offset,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== КНОПКА "ЗАКАЗАТЬ РАСЧЕТ" (ЕСЛИ ЕСТЬ) ====================
document.getElementById('priceRequestBtn')?.addEventListener('click', function (e) {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        const offset = document.querySelector('header').offsetHeight;
        window.scrollTo({
            top: contactSection.offsetTop - offset,
            behavior: 'smooth'
        });
    }
});

// ==================== СЛАЙДЕР В БЛОКЕ "О КОМПАНИИ" ====================
let slideIndex = 0;
let slideInterval;

function showSlides(n) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    if (!slides.length) return;
    if (n >= slides.length) slideIndex = 0;
    if (n < 0) slideIndex = slides.length - 1;
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    slides[slideIndex].classList.add('active');
    if (dots[slideIndex]) dots[slideIndex].classList.add('active');
}

window.changeSlide = function (n) {
    clearInterval(slideInterval);
    slideIndex += n;
    showSlides(slideIndex);
    startAutoSlide();
};

window.currentSlide = function (n) {
    clearInterval(slideInterval);
    slideIndex = n;
    showSlides(slideIndex);
    startAutoSlide();
};

function startAutoSlide() {
    slideInterval = setInterval(() => {
        slideIndex++;
        showSlides(slideIndex);
    }, 4000);
}

function initSlideshow() {
    if (document.querySelector('.slide')) {
        showSlides(slideIndex);
        startAutoSlide();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSlideshow);
} else {
    initSlideshow();
}

const slideshowContainer = document.querySelector('.about-slideshow');
if (slideshowContainer) {
    slideshowContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
    slideshowContainer.addEventListener('mouseleave', startAutoSlide);
}

// ==================== ФОРМА ОТПРАВКИ ЗАЯВКИ ====================
const requestForm = document.getElementById('onlineRequestForm');
const successMessage = document.getElementById('formSuccessMessage');

if (requestForm) {
    requestForm.addEventListener('submit', function(e) {
        setTimeout(() => {
            if (successMessage) {
                successMessage.style.display = 'block';
                requestForm.reset();
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 5000);
            }
        }, 100);
    });

    const phoneInput = document.getElementById('formPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            if (value.length === 11) {
                value = value.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5');
            }
            e.target.value = value;
        });
    }
}

// ==================== ПАНЕЛЬ ДОСТУПНОСТИ (A11Y) ====================
const toggleBtn = document.getElementById('accessibilityToggle');
const menu = document.getElementById('accessibilityMenu');
const fontPlus = document.getElementById('fontPlus');
const fontMinus = document.getElementById('fontMinus');
const fontReset = document.getElementById('fontReset');
const contrastToggle = document.getElementById('contrastToggle');

if (toggleBtn && menu) {
    toggleBtn.addEventListener('click', () => {
        menu.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
        if (!toggleBtn.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove('open');
        }
    });
}

let currentFontSize = 'normal';

if (fontPlus) {
    fontPlus.addEventListener('click', () => {
        if (currentFontSize === 'xlarge') {
            document.body.classList.remove('font-xlarge');
            document.body.classList.add('font-large');
            currentFontSize = 'large';
        } else if (currentFontSize === 'large') {
            // уже large, ничего не меняем
        } else if (currentFontSize === 'normal') {
            document.body.classList.add('font-large');
            currentFontSize = 'large';
        }
        saveAccessibilitySettings();
    });
}

if (fontMinus) {
    fontMinus.addEventListener('click', () => {
        if (currentFontSize === 'large') {
            document.body.classList.remove('font-large');
            currentFontSize = 'normal';
        } else if (currentFontSize === 'xlarge') {
            document.body.classList.remove('font-xlarge');
            document.body.classList.add('font-large');
            currentFontSize = 'large';
        }
        saveAccessibilitySettings();
    });
}

if (fontReset) {
    fontReset.addEventListener('click', () => {
        document.body.classList.remove('font-large', 'font-xlarge');
        currentFontSize = 'normal';
        saveAccessibilitySettings();
    });
}

if (contrastToggle) {
    contrastToggle.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
        saveAccessibilitySettings();
    });
}

function saveAccessibilitySettings() {
    const settings = {
        fontSize: currentFontSize,
        highContrast: document.body.classList.contains('high-contrast')
    };
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
}

function loadAccessibilitySettings() {
    const saved = localStorage.getItem('accessibilitySettings');
    if (saved) {
        const settings = JSON.parse(saved);
        if (settings.fontSize === 'large') {
            document.body.classList.add('font-large');
            currentFontSize = 'large';
        } else if (settings.fontSize === 'xlarge') {
            document.body.classList.add('font-xlarge');
            currentFontSize = 'xlarge';
        }
        if (settings.highContrast) {
            document.body.classList.add('high-contrast');
        }
    }
}
loadAccessibilitySettings();

// ==================== ГОРЯЧИЕ КЛАВИШИ (Ctrl + / - / 0) ====================
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === '+') {
        e.preventDefault();
        if (fontPlus) fontPlus.click();
    } else if (e.ctrlKey && e.key === '-') {
        e.preventDefault();
        if (fontMinus) fontMinus.click();
    } else if (e.ctrlKey && e.key === '0') {
        e.preventDefault();
        if (fontReset) fontReset.click();
    }
});

// ==================== COOKIES УВЕДОМЛЕНИЕ ====================
const cookiesNotice = document.getElementById('cookiesNotice');
const acceptCookiesBtn = document.getElementById('acceptCookies');

function checkCookiesConsent() {
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
        setTimeout(() => {
            if (cookiesNotice) {
                cookiesNotice.classList.add('show');
            }
        }, 500);
    }
}

function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    if (cookiesNotice) {
        cookiesNotice.classList.remove('show');
    }
}

if (acceptCookiesBtn) {
    acceptCookiesBtn.addEventListener('click', acceptCookies);
}
checkCookiesConsent();
