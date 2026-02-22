/* ============================================
   FREQUENCY WAVE — Main JavaScript
   ============================================ */

'use strict';

// ── Navigation Scroll Behavior ──
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ── Mobile Navigation ──
(function () {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
})();

function closeMobileNav() {
  const mobileNav = document.getElementById('mobileNav');
  const hamburger = document.getElementById('hamburger');
  if (mobileNav) mobileNav.classList.remove('open');
  if (hamburger) hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

// ── Scroll-Triggered Fade Animations ──
(function () {
  const targets = document.querySelectorAll('.fade-up');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
})();

// ── Soundwave Canvas Animation (Home Hero Only) ──
(function () {
  const canvas = document.getElementById('waveCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animId;
  let W, H;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  // Wave config
  const waves = [
    { freq: 0.012, amp: 38, speed: 0.016, color: 'rgba(107, 0, 245, 0.55)', phase: 0 },
    { freq: 0.018, amp: 28, speed: 0.022, color: 'rgba(38, 91, 255, 0.45)', phase: 1.5 },
    { freq: 0.010, amp: 50, speed: 0.011, color: 'rgba(0, 248, 255, 0.35)', phase: 3.1 },
    { freq: 0.022, amp: 20, speed: 0.028, color: 'rgba(107, 0, 245, 0.3)', phase: 0.7 },
    { freq: 0.014, amp: 34, speed: 0.018, color: 'rgba(0, 248, 255, 0.2)', phase: 2.5 },
  ];

  let t = 0;

  function drawWave(wave) {
    ctx.beginPath();
    ctx.moveTo(0, H / 2);

    for (let x = 0; x <= W; x += 2) {
      const y = H / 2 + Math.sin(x * wave.freq + t * wave.speed + wave.phase) * wave.amp;
      ctx.lineTo(x, y);
    }

    ctx.strokeStyle = wave.color;
    ctx.lineWidth = 1.8;
    ctx.stroke();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    waves.forEach(drawWave);
    t += 1;
    animId = requestAnimationFrame(draw);
  }

  draw();

  // Pause when off-screen for performance
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        if (!animId) draw();
      } else {
        cancelAnimationFrame(animId);
        animId = null;
      }
    },
    { threshold: 0 }
  );
  observer.observe(canvas);
})();

// ── Active Nav Link Highlighting ──
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-links a');

  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
})();

// ── Contact Form Handler ──
(function () {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form || !success) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const message = form.querySelector('#message');

    // Simple validation
    let valid = true;

    [name, email, message].forEach((field) => {
      if (!field || !field.value.trim()) {
        valid = false;
        if (field) {
          field.style.borderColor = 'rgba(255, 80, 80, 0.6)';
          field.style.boxShadow = '0 0 0 3px rgba(255, 80, 80, 0.1)';
          setTimeout(() => {
            field.style.borderColor = '';
            field.style.boxShadow = '';
          }, 2500);
        }
      }
    });

    if (!valid) return;

    // Email format check
    const emailVal = email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      email.style.borderColor = 'rgba(255, 80, 80, 0.6)';
      email.style.boxShadow = '0 0 0 3px rgba(255, 80, 80, 0.1)';
      setTimeout(() => {
        email.style.borderColor = '';
        email.style.boxShadow = '';
      }, 2500);
      return;
    }

    // Simulate submission
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      success.style.display = 'block';
    }, 1000);
  });
})();

// ── Smooth Scroll for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = document.getElementById('nav')?.offsetHeight || 80;
    const top = target.getBoundingClientRect().top + window.scrollY - navH - 20;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Cursor glow effect on interactive elements (subtle) ──
(function () {
  const glowEls = document.querySelectorAll('.btn, .btn-nav, .tier-card, .icon-block, .value-card, .event-card, .perk-card');

  glowEls.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--mouse-x', `${x}%`);
      el.style.setProperty('--mouse-y', `${y}%`);
    });
  });
})();
