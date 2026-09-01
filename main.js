/* ==========================================================================
   RUAN JOE IDICULA — DARK MODE & CINEMATIC PORTFOLIO CONTROLS
   Theme switching (Obsidian Crimson vs Studio Cyan), navigation, copy actions & animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
  initThemeToggle();
  initScrollProgress();
  initScrollSpy();
  initScrollReveals();
  initMobileMenu();
  initSkillsFilter();
  initCopyActions();
  initContactForm();
  initKeyboardShortcuts();
});

/* ==========================================================================
   1. LIVE CLOCK & CINEMATIC TIMECODE
   ========================================================================== */
function initLiveClock() {
  const clockEl = document.getElementById('live-clock');
  const dateEl = document.getElementById('live-date');

  function update() {
    const now = new Date();
    if (clockEl) {
      clockEl.textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }) + ' IST';
    }
    if (dateEl) {
      dateEl.textContent = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).toUpperCase();
    }
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   2. CINEMATIC THEME TOGGLE (Obsidian Crimson vs Studio Cyan)
   ========================================================================== */
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  const themeLabel = document.getElementById('theme-label');

  const savedTheme = localStorage.getItem('ruan_cinematic_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeUI(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'studio' ? 'dark' : 'studio';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('ruan_cinematic_theme', next);
      updateThemeUI(next);
      showToast(`Switched to ${next === 'studio' ? 'Studio Noir (Cyan Glow)' : 'Cinematic Obsidian (Crimson Flare)'}`);
    });
  }

  function updateThemeUI(theme) {
    if (!themeIcon || !themeLabel) return;
    if (theme === 'studio') {
      themeIcon.textContent = '◈';
      themeLabel.textContent = 'Studio Cyan';
    } else {
      themeIcon.textContent = '◉';
      themeLabel.textContent = 'Cinema Red';
    }
  }
}

/* ==========================================================================
   3. SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress-bar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${scrollPercent}%`;
  }, { passive: true });
}

/* ==========================================================================
   4. SCROLL SPY & ACTIVE NAV
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link-item');

  function highlightNav() {
    let currentId = '';
    const scrollPos = window.scrollY + 180;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();
}

/* ==========================================================================
   5. INTERSECTION OBSERVER SCROLL REVEALS
   ========================================================================== */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   6. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileMenu() {
  const trigger = document.getElementById('mobile-menu-trigger');
  const drawer = document.getElementById('mobile-nav-drawer');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!trigger || !drawer) return;

  trigger.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('is-open');
    trigger.setAttribute('aria-expanded', isOpen);
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('is-open');
    });
  });
}

/* ==========================================================================
   7. FILTERABLE SKILLS TAXONOMY
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const cards = document.querySelectorAll('.skill-index-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; }, 10);
        } else {
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   8. COPY TO CLIPBOARD ACTIONS
   ========================================================================== */
function initCopyActions() {
  const copyButtons = document.querySelectorAll('[data-copy]');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied: ${textToCopy}`);
      }).catch(() => {
        showToast('Direct copy unavailable; copied to focus.');
      });
    });
  });
}

/* ==========================================================================
   9. EDITORIAL CONTACT FORM GENERATOR
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('quick-compose-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('compose-name').value.trim();
    const subject = document.getElementById('compose-subject').value.trim();
    const message = document.getElementById('compose-message').value.trim();

    const mailtoUri = `mailto:ruanjoeidicula@gmail.com?subject=${encodeURIComponent(`[Cinematic Dispatch] ${subject} - from ${name}`)}&body=${encodeURIComponent(`Name: ${name}\n\nMessage:\n${message}`)}`;
    
    window.location.href = mailtoUri;
    showToast('Opening default email dispatch client...');
  });
}

/* ==========================================================================
   10. KEYBOARD SHORTCUTS & PRINT RESUME
   ========================================================================== */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    if (e.key.toLowerCase() === 't') {
      const themeBtn = document.getElementById('theme-toggle-btn');
      if (themeBtn) themeBtn.click();
    }
  });

  const printButtons = document.querySelectorAll('.btn-print-resume');
  printButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.print();
    });
  });
}

/* ==========================================================================
   TOAST HELPER
   ========================================================================== */
function showToast(message) {
  let toast = document.getElementById('editorial-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'editorial-toast';
    toast.className = 'editorial-toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
