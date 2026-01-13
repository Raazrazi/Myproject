

console.log('script.js loading...')

/*=============== INTRO REVEAL DISMISSAL ===============*/
window.addEventListener('load', () => {
    const introOverlay = document.getElementById('intro-overlay');
    if (introOverlay) {
        setTimeout(() => {
            introOverlay.classList.add('fade-out');
        }, 2800); // 2.8s covers the logo and line reveal
    }
});

/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close');

/* Menu show */
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

/* Menu hidden */
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link');

const linkAction = () => {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.remove('show-menu');
};
navLink.forEach(n => n.addEventListener('click', linkAction));

/*=============== BLUR HEADER ===============*/
const blurHeader = () => {
    const header = document.getElementById('header');
    if (header) {
        window.scrollY >= 50 ? header.classList.add('blur-header')
            : header.classList.remove('blur-header');
    }
};
window.addEventListener('scroll', blurHeader);

/*=============== SLIDING INDICATOR LOGIC ===============*/
const indicator = document.getElementById('nav-indicator');
const sections = document.querySelectorAll('section[id]');

const handleIndicator = (el) => {
    if (!el || !indicator || window.innerWidth < 1024) {
        if (indicator) indicator.style.display = 'none';
        return;
    }

    indicator.style.display = 'block';
    const rect = el.getBoundingClientRect();
    const navRect = navMenu.getBoundingClientRect();

    indicator.style.width = `${rect.width}px`;
    indicator.style.left = `${rect.left - navRect.left}px`;
    indicator.style.top = `${rect.top - navRect.top}px`;
    indicator.style.height = `${rect.height}px`;
};

// Update indicator on click and hover
navLink.forEach(link => {
    link.addEventListener('mouseenter', () => handleIndicator(link));
    link.addEventListener('mouseleave', () => {
        const activeLink = document.querySelector('.nav__link.active-link');
        handleIndicator(activeLink);
    });
});

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const scrollActive = () => {
    const scrollY = window.scrollY;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 150,
            sectionId = current.getAttribute('id'),
            sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']');

        if (sectionsClass) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                sectionsClass.classList.add('active-link');
                handleIndicator(sectionsClass);
            } else {
                sectionsClass.classList.remove('active-link');
            }
        }
    });
};
window.addEventListener('scroll', scrollActive);
window.addEventListener('resize', () => {
    const activeLink = document.querySelector('.nav__link.active-link');
    handleIndicator(activeLink);
});

/*=============== MODALS LOGIC WITH SWITCHING ===============*/
const signupBtn = document.getElementById('signup-btn');
const signupModal = document.getElementById('signup-modal');
const signinModal = document.getElementById('signin-modal');
const modalCloseSignup = document.getElementById('modal-close');
const modalCloseSignin = document.getElementById('modal-close-signin');

// Links to switch between modals
const loginLinkBtn = document.getElementById('login-link-btn');
const signupLinkBtn = document.getElementById('signup-link-btn');

/* Function to close all modals */
const closeAllModals = () => {
    if (signupModal) signupModal.classList.remove('show-modal');
    if (signinModal) signinModal.classList.remove('show-modal');
};

/* Open Sign Up */
if (signupBtn) {
    signupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeAllModals();
        if (signupModal) signupModal.classList.add('show-modal');
    });
}

/* Switch from Sign Up to Sign In */
if (loginLinkBtn) {
    loginLinkBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeAllModals();
        if (signinModal) signinModal.classList.add('show-modal');
    });
}

/* Switch from Sign In to Sign Up */
if (signupLinkBtn) {
    signupLinkBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeAllModals();
        if (signupModal) signupModal.classList.add('show-modal');
    });
}

/* Close buttons */
if (modalCloseSignup) {
    modalCloseSignup.addEventListener('click', closeAllModals);
}
if (modalCloseSignin) {
    modalCloseSignin.addEventListener('click', closeAllModals);
}

/* Close modal on outside click */
window.addEventListener('click', (e) => {
    if (e.target == signupModal) {
        signupModal.classList.remove('show-modal');
    }
    if (e.target == signinModal) {
        signinModal.classList.remove('show-modal');
    }
});

/* Close modal on ESC key */
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAllModals();
    }
});

// Initialize indicator position
window.addEventListener('load', () => {
    const activeLink = document.querySelector('.nav__link.active-link');
    handleIndicator(activeLink);
});

/*=============== SCROLL REVEAL (IntersectionObserver) ===============*/
(() => {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const elementsToReveal = document.querySelectorAll(
        '.section, .hero__title, .hero__subtitle, .hero__actions, .nav__item, .contact-card, .file-item'
    );

    elementsToReveal.forEach((el) => {
        el.classList.add('will-reveal');
        observer.observe(el);
    });
})();

/*=============== MAGNETIC BUTTON EFFECT ===============*/
(() => {
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transition = 'transform 0.1s ease-out';
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
            btn.style.transform = 'translate(0, 0) scale(1)';
        });
    });
})();

console.log('script.js initialization complete');
