/* ============================================================
   FREQUENCY WAVE — main.js
   Nav overlay · Soundwave canvas · Scroll reveal
   Events tabs · Forms · Active section tracking
   ============================================================ */

'use strict';

/* ── Helpers ─────────────────────────────────────────────── */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================================
   1. NAV — scroll glass effect
   ============================================================ */
(function navScroll() {
  const nav = qs('#nav');
  if (!nav) return;
  const update = () => nav.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ============================================================
   2. NAV OVERLAY — three-dot open / close
   ============================================================ */
(function navOverlay() {
  const trigger  = qs('#navTrigger');
  const overlay  = qs('#navOverlay');
  const closeBtn = qs('#navClose');
  if (!trigger || !overlay) return;

  function open() {
    overlay.classList.add('open');
    trigger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('open');
    trigger.classList.remove('open');
    document.body.style.overflow = '';
  }

  trigger.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);

  // Close on overlay link click
  qsa('.nav-overlay-links a', overlay).forEach(link => {
    link.addEventListener('click', () => {
      close();
      // Smooth scroll handled by CSS scroll-behavior + href anchors
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) close();
  });
})();

/* ============================================================
   3. ACTIVE SECTION — highlight overlay link for visible section
   ============================================================ */
(function activeSection() {
  const sections = qsa('section[id], div[id]');
  const links    = qsa('.nav-overlay-links a[data-section]');
  if (!sections.length || !links.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach(a => {
        a.classList.toggle('active', a.dataset.section === id);
      });
    });
  }, { threshold: 0.35 });

  sections.forEach(s => io.observe(s));
})();

/* ============================================================
   4. SCROLL REVEAL — fade-up on .reveal elements
   ============================================================ */
(function scrollReveal() {
  const targets = qsa('.reveal');
  if (!targets.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => io.observe(el));
})();

/* ============================================================
   5. SOUNDWAVE CANVAS ANIMATION
   ============================================================ */
(function waveCanvas() {
  const canvas = qs('#waveCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, rafId;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  // Wave definitions
  const waves = [
    { f: 0.011, a: 42,  s: 0.014, c: 'rgba(107,0,245,0.55)',  p: 0    },
    { f: 0.017, a: 30,  s: 0.020, c: 'rgba(38,91,255,0.45)',   p: 1.4  },
    { f: 0.009, a: 55,  s: 0.010, c: 'rgba(0,248,255,0.30)',   p: 3.0  },
    { f: 0.021, a: 22,  s: 0.026, c: 'rgba(107,0,245,0.25)',   p: 0.6  },
    { f: 0.013, a: 36,  s: 0.016, c: 'rgba(0,248,255,0.18)',   p: 2.3  },
    { f: 0.008, a: 18,  s: 0.033, c: 'rgba(38,91,255,0.20)',   p: 4.1  },
  ];

  let t = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    waves.forEach(w => {
      ctx.beginPath();
      ctx.moveTo(0, H / 2);
      for (let x = 0; x <= W; x += 3) {
        const y = H / 2 + Math.sin(x * w.f + t * w.s + w.p) * w.a;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = w.c;
      ctx.lineWidth   = 1.6;
      ctx.stroke();
    });

    t++;
    rafId = requestAnimationFrame(draw);
  }

  // Only animate while visible
  const visObs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!rafId) draw();
    } else {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }, { threshold: 0 });

  visObs.observe(canvas);
})();

/* ============================================================
   6. EVENTS TABS
   ============================================================ */
(function eventsTabs() {
  const tabs   = qsa('.events-tab');
  const panels = qsa('.events-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t   => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const panel = qs(`#tab-${target}`);
      if (panel) {
        panel.classList.add('active');
        // Re-trigger reveal animations for newly shown cards
        qsa('.reveal', panel).forEach(el => {
          el.classList.remove('in');
          setTimeout(() => el.classList.add('in'), 80);
        });
      }
    });
  });
})();

/* ============================================================
   7. CONTACT FORM
   ============================================================ */
(function contactForm() {
  const form    = qs('#contactForm');
  const success = qs('#formSuccess');
  if (!form || !success) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = qs('#cName',    form);
    const email   = qs('#cEmail',   form);
    const message = qs('#cMessage', form);
    let ok = true;

    [name, email, message].forEach(f => {
      if (!f?.value.trim()) {
        ok = false;
        highlight(f, 'error');
      }
    });

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      ok = false;
      highlight(email, 'error');
    }

    if (!ok) return;

    // Simulate send
    const btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }

    setTimeout(() => {
      form.style.display    = 'none';
      success.style.display = 'block';
    }, 900);
  });

  function highlight(el, type) {
    if (!el) return;
    el.style.borderColor = type === 'error'
      ? 'rgba(255,80,80,0.6)'
      : 'rgba(0,248,255,0.4)';
    el.style.boxShadow = type === 'error'
      ? '0 0 0 3px rgba(255,80,80,0.08)'
      : '0 0 0 3px rgba(0,248,255,0.08)';
    setTimeout(() => {
      el.style.borderColor = '';
      el.style.boxShadow   = '';
    }, 2500);
  }
})();

/* ============================================================
   8. NEWSLETTER FORM
   ============================================================ */
(function newsletterForm() {
  const form    = qs('#nlForm');
  const success = qs('#nlSuccess');
  if (!form || !success) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = qs('#nlEmail', form);
    if (!input?.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
      input.style.borderColor = 'rgba(255,80,80,0.6)';
      setTimeout(() => { input.style.borderColor = ''; }, 2200);
      return;
    }

    const btn = form.querySelector('button');
    if (btn) { btn.textContent = '…'; btn.disabled = true; }

    setTimeout(() => {
      form.style.display    = 'none';
      success.style.display = 'block';
    }, 700);
  });
})();

/* ============================================================
   9. SMOOTH SCROLL for anchor links (fallback for older Safari)
   ============================================================ */
(function smoothScroll() {
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = qs('#nav')?.offsetHeight ?? 72;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - navH - 12,
      behavior: 'smooth',
    });
  });
})();
