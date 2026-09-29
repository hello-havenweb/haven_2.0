/**
 * HAVEN DIGITAL STUDIO — INTERACTIVE CLIENT RUNTIME
 * Lightweight Vanilla JS • Zero Dependencies • Fast & Resilient
 */

document.addEventListener('DOMContentLoaded', () => {
  initAtmosphericBackground();
  initNightDaySlider();
  initMobileNav();
  initHeaderScroll();
  initScrollReveal();
  initContactForm();
  initTemplateFilters();
  initCurrencyToggle();
  initParallaxEffects();
  autoSelectTemplateFromUrl();
  initHavenAI();
});

/* ==========================================================================
   0. GLOBAL CINEMATIC ANIMATED ATMOSPHERIC BACKGROUND
   Pure GPU-accelerated CSS animations • Zero scroll lag • Zero CPU overhead
   ========================================================================== */
function initAtmosphericBackground() {
  if (!document.querySelector('.haven-ambient-backdrop')) {
    const backdrop = document.createElement('div');
    backdrop.className = 'haven-ambient-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');

    // 18 lightweight atmospheric particles of subtle purple light
    let particlesHtml = '';
    const particleCount = 18;
    for (let i = 0; i < particleCount; i++) {
      const left = ((i * 5.4 + 2) % 96).toFixed(1);
      const delay = ((i * 1.6) % 18).toFixed(1);
      const duration = (18 + (i * 2) % 12).toFixed(1);
      const size = (2 + (i % 3) * 0.8).toFixed(1);
      const driftX = (((i % 5) - 2) * 20).toFixed(0);
      particlesHtml += `<span class="ambient-particle" style="left:${left}%; width:${size}px; height:${size}px; animation-duration:${duration}s; animation-delay:-${delay}s; --p-dx:${driftX}px;"></span>`;
    }

    backdrop.innerHTML = `
      <div class="ambient-aurora-layer"></div>
      <div class="ambient-glow-orb ambient-orb-1"></div>
      <div class="ambient-glow-orb ambient-orb-2"></div>
      <div class="ambient-glow-orb ambient-orb-3"></div>
      <div class="ambient-atmospheric-glow"></div>
      <div class="ambient-particles-container">
        ${particlesHtml}
      </div>
    `;
    document.body.prepend(backdrop);
  }
}

/* ==========================================================================
   1. HERO NIGHT / DAY INTERACTIVE SPLIT SLIDER
   ========================================================================== */
function initNightDaySlider() {
  const viewer = document.querySelector('.split-viewer-card');
  const dayLayer = document.querySelector('.split-layer-day');
  const dividerLine = document.querySelector('.split-divider-line');
  const handle = document.querySelector('.split-handle');

  if (!viewer || !dayLayer || !dividerLine || !handle) return;

  let isDragging = false;
  let currentPct = 50;
  let targetPct = 50;
  let rafId = null;

  function render() {
    dividerLine.style.left = `${currentPct}%`;
    handle.style.left = `${currentPct}%`;
    dayLayer.style.clipPath = `polygon(${currentPct}% 0, 100% 0, 100% 100%, ${currentPct}% 100%)`;
    handle.setAttribute('aria-valuenow', Math.round(currentPct));
    rafId = null;
  }

  function queueUpdate(pct) {
    pct = Math.max(5, Math.min(95, pct));
    currentPct = pct;
    if (!rafId) {
      rafId = requestAnimationFrame(render);
    }
  }

  function getPctFromClientX(clientX) {
    const rect = viewer.getBoundingClientRect();
    if (rect.width === 0) return 50;
    return ((clientX - rect.left) / rect.width) * 100;
  }

  // Pointer Events (supports Mouse, Touch & Pen with unified capture)
  function startDrag(e) {
    isDragging = true;
    viewer.classList.add('is-dragging');
    try {
      if (e.target.setPointerCapture && e.pointerId) {
        e.target.setPointerCapture(e.pointerId);
      }
    } catch (_) {}
    queueUpdate(getPctFromClientX(e.clientX));
  }

  function moveDrag(e) {
    if (!isDragging) return;
    queueUpdate(getPctFromClientX(e.clientX));
  }

  function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;
    viewer.classList.remove('is-dragging');
    try {
      if (e.target.releasePointerCapture && e.pointerId) {
        e.target.releasePointerCapture(e.pointerId);
      }
    } catch (_) {}
  }

  if (window.PointerEvent) {
    handle.addEventListener('pointerdown', startDrag);
    viewer.addEventListener('pointerdown', startDrag);
    window.addEventListener('pointermove', moveDrag, { passive: true });
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
  } else {
    // Fallback for older browsers
    handle.addEventListener('mousedown', (e) => {
      isDragging = true;
      viewer.classList.add('is-dragging');
      e.preventDefault();
    });
    viewer.addEventListener('mousedown', (e) => {
      isDragging = true;
      viewer.classList.add('is-dragging');
      queueUpdate(getPctFromClientX(e.clientX));
    });
    window.addEventListener('mousemove', (e) => {
      if (isDragging) queueUpdate(getPctFromClientX(e.clientX));
    }, { passive: true });
    window.addEventListener('mouseup', () => {
      isDragging = false;
      viewer.classList.remove('is-dragging');
    });

    handle.addEventListener('touchstart', () => {
      isDragging = true;
      viewer.classList.add('is-dragging');
    }, { passive: true });
    viewer.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        isDragging = true;
        viewer.classList.add('is-dragging');
        queueUpdate(getPctFromClientX(e.touches[0].clientX));
      }
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length > 0) {
        queueUpdate(getPctFromClientX(e.touches[0].clientX));
      }
    }, { passive: true });
    window.addEventListener('touchend', () => {
      isDragging = false;
      viewer.classList.remove('is-dragging');
    });
  }

  // Keyboard accessibility
  handle.setAttribute('tabindex', '0');
  handle.setAttribute('role', 'slider');
  handle.setAttribute('aria-label', 'Night and Day transition slider');
  handle.setAttribute('aria-valuenow', '50');
  handle.setAttribute('aria-valuemin', '5');
  handle.setAttribute('aria-valuemax', '95');

  handle.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      queueUpdate(currentPct - 4);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      queueUpdate(currentPct + 4);
    } else if (e.key === 'Home') {
      e.preventDefault();
      queueUpdate(5);
    } else if (e.key === 'End') {
      e.preventDefault();
      queueUpdate(95);
    }
  });

  // Initial render at 50%
  render();
}

/* ==========================================================================
   2. MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!toggleBtn.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 16) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ==========================================================================
   3. SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');

  if (prefersReduced || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('active'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ==========================================================================
   4. CONTACT ENQUIRY FORM (WEB3FORMS INTEGRATION)
   ========================================================================== */
function initContactForm() {
  // If contact.js has already initialized the form, avoid duplicate bindings
  if (window.__HAVEN_CONTACT_FORM_INITIALIZED__) return;
  window.__HAVEN_CONTACT_FORM_INITIALIZED__ = true;

  const form = document.getElementById('haven-contact-form');
  const successBox = document.getElementById('form-success-box');
  let errorBox = document.getElementById('form-error-box');

  if (!form) return;

  if (!errorBox && successBox && successBox.parentNode) {
    errorBox = document.createElement('div');
    errorBox.id = 'form-error-box';
    errorBox.className = 'form-error-box';
    errorBox.style.display = 'none';
    successBox.parentNode.insertBefore(errorBox, successBox.nextSibling);
  }

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const brandInput = document.getElementById('brand');
  const templateSelect = document.getElementById('template');
  const budgetSelect = document.getElementById('budget');
  const detailsInput = document.getElementById('details');
  const botcheckInput = form.querySelector('input[name="botcheck"]');
  const submitBtn = form.querySelector('button[type="submit"]');

  let isSubmitting = false;

  // Clear errors on input
  [nameInput, emailInput, brandInput, detailsInput].forEach(inp => {
    if (inp) {
      inp.addEventListener('input', () => {
        inp.style.borderColor = '';
        const existingErr = inp.parentNode.querySelector('.form-field-error');
        if (existingErr) existingErr.remove();
        if (errorBox) {
          errorBox.classList.remove('show');
          errorBox.style.display = 'none';
        }
      });
    }
  });

  function showFieldError(inp, msg) {
    if (!inp) return;
    inp.style.borderColor = '#ef4444';
    inp.focus();
    let err = inp.parentNode.querySelector('.form-field-error');
    if (!err) {
      err = document.createElement('div');
      err.className = 'form-field-error';
      err.style.color = '#f87171';
      err.style.fontSize = '0.78rem';
      err.style.marginTop = '0.35rem';
      err.style.fontWeight = '500';
      inp.parentNode.appendChild(err);
    }
    err.textContent = msg;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (errorBox) {
      errorBox.classList.remove('show');
      errorBox.style.display = 'none';
    }
    if (successBox) {
      successBox.classList.remove('show');
      successBox.style.display = 'none';
    }

    if (botcheckInput && botcheckInput.checked) return;

    let hasError = false;
    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const brand = brandInput ? brandInput.value.trim() : '';
    const template = templateSelect ? templateSelect.value : 'Custom Vision';
    const budget = budgetSelect ? budgetSelect.value : 'TemplateWebsite';
    const details = detailsInput ? detailsInput.value.trim() : '';

    if (!name) {
      showFieldError(nameInput, 'Please enter your name.');
      hasError = true;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showFieldError(emailInput, 'Please enter a valid email address.');
      hasError = true;
    }
    if (!brand) {
      showFieldError(brandInput, 'Please provide your business or brand name.');
      hasError = true;
    }
    if (!details || details.length < 10) {
      showFieldError(detailsInput, 'Please provide a brief description of your project (at least 10 characters).');
      hasError = true;
    }

    if (hasError) return;

    isSubmitting = true;
    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : 'Send Project Enquiry →';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span style="display: inline-block; width: 0.95rem; height: 0.95rem; border: 2px solid rgba(255, 255, 255, 0.25); border-top-color: #ffffff; border-radius: 50%; animation: havenSpin 0.75s linear infinite; margin-right: 0.5rem; vertical-align: middle;"></span>
        Transmitting Brief...
      `;
    }

    const budgetLabel = budgetSelect && budgetSelect.selectedOptions && budgetSelect.selectedOptions[0]
      ? budgetSelect.selectedOptions[0].text
      : budget;

    const templateLabel = templateSelect && templateSelect.selectedOptions && templateSelect.selectedOptions[0]
      ? templateSelect.selectedOptions[0].text
      : template;

    const structuredMessage = [
      'New HAVEN Project Enquiry Brief:',
      '----------------------------------------',
      `Client Name: ${name}`,
      `Email Address: ${email}`,
      `Business / Brand: ${brand}`,
      `Selected Template: ${templateLabel}`,
      `Estimated Budget: ${budgetLabel}`,
      '',
      'Project Details:',
      details,
      '----------------------------------------',
      `Submitted: ${new Date().toISOString()}`
    ].join('\n');

    const payload = {
      access_key: '0e2c5bcb-d228-4cd4-801b-8528e9d002e7',
      subject: 'New HAVEN Website Inquiry',
      from_name: 'HAVEN Website Contact Form',
      name,
      email,
      replyto: email,
      brand,
      template: templateLabel,
      budget: budgetLabel,
      details,
      message: structuredMessage,
      'Business / Brand': brand,
      'Selected Template': templateLabel,
      'Estimated Budget': budgetLabel,
      'Project Details': details
    };

    try {
      const past = JSON.parse(localStorage.getItem('haven_enquiries') || '[]');
      past.push({ name, email, brand, template, budget, details, timestamp: new Date().toISOString() });
      localStorage.setItem('haven_enquiries', JSON.stringify(past));
    } catch (_) {}

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data && (data.success === true || res.status === 200)) {
        if (successBox) {
          successBox.innerHTML = `
            <div style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.4rem; color: #bbf7d0; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Project Enquiry Received</span>
            </div>
            <div style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--accent-lavender); margin-bottom: 0.85rem; letter-spacing: 0.08em;">
              CONFIRMED TRANSMISSION &bull; STATUS: 200 OK
            </div>
            <p style="font-size: 0.92rem; color: #e2e8f0; line-height: 1.6; margin: 0 auto; max-width: 540px;">
              Thank you, <strong>${escapeHtml(name)}</strong>. Your enquiry for <strong>${escapeHtml(brand)}</strong> has been delivered directly to HAVEN studio engineers. We review every brief and reply to <strong>${escapeHtml(email)}</strong> within 24 hours.
            </p>
          `;
          successBox.style.display = 'block';
          successBox.classList.add('show');
          form.reset();
          successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } else {
        const errorMsg = data && data.message ? data.message : 'Unable to transmit enquiry. Please try again.';
        if (errorBox) {
          errorBox.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 1.05rem; font-weight: 700; margin-bottom: 0.4rem; color: #fca5a5;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>Submission Error</span>
            </div>
            <p style="font-size: 0.9rem; color: #fecaca; line-height: 1.5; margin: 0 auto; max-width: 560px;">
              ${escapeHtml(errorMsg)}
            </p>
            <div style="font-size: 0.78rem; color: #cbd5e1; margin-top: 0.6rem;">
              Direct studio contact: <a href="mailto:hello.havenweb@gmail.com" style="color: var(--accent-lavender); text-decoration: underline;">hello.havenweb@gmail.com</a>
            </div>
          `;
          errorBox.style.display = 'block';
          errorBox.classList.add('show');
          errorBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    } catch (err) {
      if (errorBox) {
        errorBox.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 1.05rem; font-weight: 700; margin-bottom: 0.4rem; color: #fca5a5;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>Network Disruption</span>
          </div>
          <p style="font-size: 0.9rem; color: #fecaca; line-height: 1.5; margin: 0 auto; max-width: 560px;">
            Network connection interrupted while transmitting your enquiry. Your brief remains saved below. Please check your connection and click Send again, or email us directly at hello.havenweb@gmail.com.
          </p>
        `;
        errorBox.style.display = 'block';
        errorBox.classList.add('show');
        errorBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    } finally {
      isSubmitting = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }
    }
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));
}

/* ==========================================================================
   5. TEMPLATE CATEGORY FILTERS (TEMPLATES PAGE)
   ========================================================================== */
function initTemplateFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.template-card[data-category]');

  if (filterBtns.length === 0 || cards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5B. CURRENCY SWITCHER (PKR / USD)
   ========================================================================== */
function initCurrencyToggle() {
  const currencyBtns = document.querySelectorAll('.currency-btn');
  const cards = document.querySelectorAll('.pricing-mini-card[data-pkr-price]');

  if (currencyBtns.length === 0 || cards.length === 0) return;

  function setCurrency(currency) {
    currencyBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-currency') === currency));

    cards.forEach(card => {
      const priceEl = card.querySelector('.pkg-price');
      const subEl = card.querySelector('.pkg-price-sub');

      if (currency === 'usd') {
        if (priceEl && card.dataset.usdPrice) priceEl.textContent = card.dataset.usdPrice;
        if (subEl && card.dataset.usdSub) subEl.textContent = card.dataset.usdSub;
      } else {
        if (priceEl && card.dataset.pkrPrice) priceEl.textContent = card.dataset.pkrPrice;
        if (subEl && card.dataset.pkrSub) subEl.textContent = card.dataset.pkrSub;
      }
    });

    try {
      localStorage.setItem('haven_currency', currency);
    } catch (_) {}
  }

  currencyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const chosen = btn.getAttribute('data-currency');
      setCurrency(chosen);
    });
  });

  // Restore previous choice if any
  try {
    const saved = localStorage.getItem('haven_currency');
    if (saved && (saved === 'pkr' || saved === 'usd')) {
      setCurrency(saved);
    }
  } catch (_) {}
}

/* ==========================================================================
   6. AUTO-SELECT TEMPLATE FROM URL PARAMETERS & BANNER NOTIFICATION
   ========================================================================== */
function autoSelectTemplateFromUrl() {
  const select = document.getElementById('template');
  const notice = document.getElementById('template-notice');
  const noticeName = document.getElementById('template-notice-name');

  const params = new URLSearchParams(window.location.search);
  const requested = params.get('template');
  const budgetParam = params.get('budget');
  const budgetSelect = document.getElementById('budget');

  // Pre-select budget if provided
  if (budgetParam && budgetSelect) {
    const budgetMatch = Array.from(budgetSelect.options).find(opt =>
      opt.value.toLowerCase().includes(budgetParam.toLowerCase()) ||
      opt.text.toLowerCase().includes(budgetParam.toLowerCase())
    );
    if (budgetMatch) {
      budgetSelect.value = budgetMatch.value;
    }
  }

  function updateNotice(val) {
    if (!notice || !noticeName) return;
    if (val && val !== 'Custom Vision') {
      noticeName.textContent = val.toUpperCase();
      notice.style.display = 'flex';
    } else {
      notice.style.display = 'none';
    }
  }

  if (requested) {
    const cleanRequested = requested.toUpperCase();
    if (select) {
      const match = Array.from(select.options).find(opt => 
        opt.value.toLowerCase() === requested.toLowerCase() ||
        opt.text.toLowerCase().includes(requested.toLowerCase())
      );
      if (match) {
        select.value = match.value;
        updateNotice(match.value);
      } else {
        updateNotice(cleanRequested);
      }
    } else {
      updateNotice(cleanRequested);
    }
  }

  if (select) {
    select.addEventListener('change', () => {
      updateNotice(select.value);
    });
  }
}

/* ==========================================================================
   7. MOTION & SCROLL DISCIPLINE
   Decorative animations are strictly GPU-accelerated CSS to keep scrolling 100% smooth.
   ========================================================================== */
function initParallaxEffects() {
  // Purposely empty: prevents any mousemove JS event overhead during scroll
  // and ensures cards, text, and content never shift or lag.
}

/* ==========================================================================
   8. HAVEN AI — VOICE & TEXT CONSULTANT RUNTIME
   ========================================================================== */
function initHavenAI() {
  const startBtn = document.getElementById('start-conversation-btn');
  const canvas = document.getElementById('ai-studio-canvas');
  if (!startBtn && !canvas) return;

  const micBtn = document.getElementById('master-mic-btn');
  const textInput = document.getElementById('ai-text-input');
  const sendBtn = document.getElementById('ai-send-btn');
  const thread = document.getElementById('ai-conversation-thread');
  const orb = document.getElementById('ai-orb');
  const statusText = document.getElementById('ai-status-text');
  const liveStatus = document.getElementById('ai-live-status');
  const langPill = document.getElementById('ai-lang-pill');
  const muteBtn = document.getElementById('mute-voice-btn');
  const muteLabel = document.getElementById('mute-label');
  const stopSpeakingBtn = document.getElementById('stop-speaking-btn');
  const resetBtn = document.getElementById('reset-session-btn');
  const summaryBox = document.getElementById('ai-summary-box');
  const successBox = document.getElementById('ai-success-box');
  const editDetailsBtn = document.getElementById('edit-details-btn');
  const sendEnquiryBtn = document.getElementById('send-enquiry-btn');
  const newConsultationBtn = document.getElementById('new-consultation-btn');

  const valName = document.getElementById('val-name');
  const valBiz = document.getElementById('val-biz');
  const valType = document.getElementById('val-type');
  const valTemplate = document.getElementById('val-template');
  const valBudget = document.getElementById('val-budget');

  const sumClient = document.getElementById('sum-client');
  const sumEmail = document.getElementById('sum-email');
  const sumBrand = document.getElementById('sum-brand');
  const sumBizType = document.getElementById('sum-biztype');
  const sumTemplate = document.getElementById('sum-template');
  const sumPages = document.getElementById('sum-pages');
  const sumFeatures = document.getElementById('sum-features');
  const sumBudget = document.getElementById('sum-budget');
  const sumNotes = document.getElementById('sum-notes');
  const sumNotesBox = document.getElementById('sum-additional-box');
  const successRefId = document.getElementById('success-ref-id');

  let isListening = false;
  let isSpeaking = false;
  let isThinking = false;
  let isMuted = false;
  let conversationHistory = [];
  let projectState = {
    name: '', email: '', phone: '', businessName: '', country: '', city: '',
    businessType: '', websiteType: '', projectType: '', template: '', pages: [],
    features: [], hosting: '', domain: '', budget: '', timeline: '',
    stylePreferences: '', brandColors: '', existingWebsite: '',
    referenceWebsites: '', additionalRequirements: ''
  };

  const API_BASE_URL = (typeof window !== 'undefined' && window.location && window.location.origin && !window.location.origin.includes('YOUR_BACKEND_URL')) ? window.location.origin : '';
  const LIVE_WS_BASE = 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained';
  let liveSocket = null;
  let mediaStream = null;
  let audioContext = null;
  let sourceNode = null;
  let processorNode = null;
  let playbackContext = null;
  let playbackCursor = 0;
  let liveConnected = false;
  let liveUserTranscript = '';
  let liveAssistantTranscript = '';

  function setVoiceState(state, customMessage) {
    if (!orb || !statusText || !liveStatus) return;
    orb.className = 'ai-orb-wrap ' + (state === 'idle' ? '' : state);
    liveStatus.className = 'ai-live-indicator ' + (state === 'idle' ? '' : state);
    if (micBtn) micBtn.classList.toggle('active-listening', state === 'listening');
    if (stopSpeakingBtn) stopSpeakingBtn.style.display = state === 'speaking' ? 'inline-flex' : 'none';
    const messages = {
      listening: 'Listening...', thinking: 'Thinking...', speaking: 'HAVEN AI is speaking...',
      error: 'Voice isn\'t available right now. You can continue by typing.', idle: '● Ready'
    };
    statusText.textContent = customMessage || messages[state] || messages.idle;
  }

  function appendMessage(role, text) {
    if (!thread || !text) return;
    const bubble = document.createElement('div');
    bubble.className = `ai-chat-bubble ${role === 'user' ? 'user' : 'assistant'}`;
    const author = document.createElement('div');
    author.className = 'chat-bubble-author';
    author.innerHTML = role === 'user' ? 'You' : `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"></circle></svg> HAVEN AI &bull; Project Consultant`;
    const content = document.createElement('div');
    content.className = 'chat-bubble-text';
    content.textContent = text;
    bubble.appendChild(author); bubble.appendChild(content); thread.appendChild(bubble);
    thread.scrollTop = thread.scrollHeight;
  }

  function updateProgressPills(state) {
    if (!state) return;
    if (valName && state.name) { valName.textContent = state.name; valName.parentElement.classList.add('filled'); }
    if (valBiz && state.businessName) { valBiz.textContent = state.businessName; valBiz.parentElement.classList.add('filled'); }
    if (valType && (state.websiteType || state.businessType)) { valType.textContent = state.websiteType || state.businessType; valType.parentElement.classList.add('filled'); }
    if (valTemplate && state.template) { valTemplate.textContent = state.template; valTemplate.parentElement.classList.add('filled'); }
    if (valBudget && state.budget) { valBudget.textContent = state.budget; valBudget.parentElement.classList.add('filled'); }
  }

  function renderSummaryCard(state) {
    if (!summaryBox) return;
    if (sumClient) sumClient.textContent = state.name || 'Not provided yet';
    if (sumEmail) sumEmail.textContent = state.email || 'Required for confirmation';
    if (sumBrand) sumBrand.textContent = state.businessName || 'Bespoke Brand';
    if (sumBizType) sumBizType.textContent = state.businessType || state.websiteType || 'Custom Venture';
    if (sumTemplate) sumTemplate.textContent = state.template || 'Custom Bespoke Scope';
    if (sumPages) sumPages.textContent = Array.isArray(state.pages) && state.pages.length ? state.pages.join(', ') : 'Standard 6-Page Suite';
    if (sumFeatures) sumFeatures.textContent = Array.isArray(state.features) && state.features.length ? state.features.join(', ') : 'Turnkey responsive setup';
    if (sumBudget) sumBudget.textContent = state.budget || 'Starting from PKR 29,000';
    if (state.additionalRequirements && sumNotes && sumNotesBox) { sumNotes.textContent = state.additionalRequirements; sumNotesBox.style.display = 'block'; }
    summaryBox.classList.add('active');
    summaryBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function cleanSpeechText(text) { return String(text || '').replace(/[*#`_~[\]]/g, '').trim(); }

  function speakResponse(text, lang) {
    if (!('speechSynthesis' in window) || isMuted) { setVoiceState('idle'); return; }
    const cleanText = cleanSpeechText(text);
    if (!cleanText) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1; utterance.pitch = 1;
    utterance.lang = lang === 'ur' ? 'ur-PK' : lang === 'hi' ? 'hi-IN' : lang === 'ar' ? 'ar-SA' : 'en-US';
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(utterance.lang.slice(0, 2)) && /Natural|Google|Premium/i.test(v.name));
    if (match) utterance.voice = match;
    utterance.onstart = () => { isSpeaking = true; setVoiceState('speaking'); };
    utterance.onend = () => { isSpeaking = false; setVoiceState('idle'); };
    utterance.onerror = () => { isSpeaking = false; setVoiceState('idle'); };
    window.speechSynthesis.speak(utterance);
  }

  function stopSpeaking() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    isSpeaking = false;
    if (liveSocket && liveConnected) {
      try { liveSocket.send(JSON.stringify({ realtimeInput: { activityEnd: {} } })); } catch (_) {}
    }
    setVoiceState('idle');
  }

  async function sendMessage(text) {
    if (!text || isThinking) return;
    stopSpeaking();
    appendMessage('user', text);
    conversationHistory.push({ role: 'user', text });
    if (textInput) textInput.value = '';
    isThinking = true; setVoiceState('thinking');
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: conversationHistory, projectState })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `API server returned status ${response.status}`);
      isThinking = false;
      const aiReply = data.reply || 'I understand your vision. Let\'s continue shaping your project.';
      conversationHistory.push({ role: 'model', text: aiReply });
      if (data.projectState) { projectState = { ...projectState, ...data.projectState }; updateProgressPills(projectState); }
      if (langPill && data.detectedLanguage) langPill.textContent = data.detectedLanguage.toUpperCase();
      appendMessage('assistant', aiReply);
      speakResponse(aiReply, data.detectedLanguage);
      if (data.isReadyForSummary) renderSummaryCard(projectState);
    } catch (err) {
      console.error('[HAVEN AI] Chat communication failed:', err);
      isThinking = false;
      const errorMsg = 'I\'m having trouble connecting right now. Please try again in a moment.';
      appendMessage('assistant', errorMsg);
      setVoiceState('error', errorMsg);
    }
  }

  function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer); let binary = '';
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    return btoa(binary);
  }

  function floatTo16BitPCM(float32) {
    const out = new Int16Array(float32.length);
    for (let i = 0; i < float32.length; i++) {
      const s = Math.max(-1, Math.min(1, float32[i]));
      out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return out.buffer;
  }

  function downsampleTo16k(buffer, inputRate) {
    if (inputRate === 16000) return buffer;
    const ratio = inputRate / 16000;
    const newLength = Math.round(buffer.length / ratio);
    const result = new Float32Array(newLength);
    let offset = 0;
    for (let i = 0; i < newLength; i++) {
      const next = Math.round((i + 1) * ratio);
      let sum = 0, count = 0;
      for (let j = offset; j < next && j < buffer.length; j++) { sum += buffer[j]; count++; }
      result[i] = count ? sum / count : 0;
      offset = next;
    }
    return result;
  }

  function playPcm24k(base64) {
    if (isMuted || !base64) return;
    try {
      const binary = atob(base64);
      const pcm = new Int16Array(binary.length / 2);
      for (let i = 0; i < pcm.length; i++) pcm[i] = (binary.charCodeAt(i * 2) & 255) | (binary.charCodeAt(i * 2 + 1) << 8);
      if (!playbackContext) playbackContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
      const ctx = playbackContext;
      const audio = ctx.createBuffer(1, pcm.length, 24000);
      const channel = audio.getChannelData(0);
      for (let i = 0; i < pcm.length; i++) channel[i] = pcm[i] / 32768;
      const source = ctx.createBufferSource(); source.buffer = audio; source.connect(ctx.destination);
      const now = ctx.currentTime;
      playbackCursor = Math.max(playbackCursor, now);
      source.start(playbackCursor);
      playbackCursor += audio.duration;
      isSpeaking = true; setVoiceState('speaking');
      source.onended = () => { if (playbackCursor <= ctx.currentTime + 0.05) { isSpeaking = false; setVoiceState('idle'); } };
    } catch (err) { console.warn('[HAVEN AI] Audio playback failed:', err); }
  }

  async function updateProjectFromVoiceTranscript(text) {
    if (!text || text.length < 2) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: conversationHistory, projectState })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) return;
      if (data.projectState) { projectState = { ...projectState, ...data.projectState }; updateProgressPills(projectState); }
      if (data.isReadyForSummary) renderSummaryCard(projectState);
      if (data.detectedLanguage && langPill) langPill.textContent = data.detectedLanguage.toUpperCase();
    } catch (err) { console.warn('[HAVEN AI] Voice project-state sync failed:', err); }
  }

  async function startLiveVoice() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setVoiceState('error', 'Your browser does not support microphone access. Please continue by typing.');
      return;
    }
    if (liveConnected) return;
    try {
      setVoiceState('thinking', 'Connecting to HAVEN AI...');
      const tokenResponse = await fetch(`${API_BASE_URL}/api/live-token`, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      const tokenData = await tokenResponse.json().catch(() => ({}));
      if (!tokenResponse.ok || !tokenData.token) throw new Error(tokenData.error || 'Could not create Live API token.');

      mediaStream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
      liveSocket = new WebSocket(`${LIVE_WS_BASE}?access_token=${encodeURIComponent(tokenData.token)}`);

      liveSocket.onopen = async () => {
        liveConnected = true;
        setVoiceState('listening', 'Listening...');
        const system = `You are HAVEN AI, a professional digital project consultant for HAVEN. Be warm, concise, natural and useful. Never say you are a generic AI. Mirror the user's language. Discuss HAVEN's real website services, templates and starting prices. Do not invent awards, clients or statistics. Current project state: ${JSON.stringify(projectState)}`;
        liveSocket.send(JSON.stringify({
          setup: {
            model: 'models/gemini-3.8-live',
            generationConfig: { responseModalities: ['AUDIO'] },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            systemInstruction: { parts: [{ text: system }] }
          }
        }));

        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        await audioContext.resume();
        sourceNode = audioContext.createMediaStreamSource(mediaStream);
        processorNode = audioContext.createScriptProcessor(4096, 1, 1);
        processorNode.onaudioprocess = (event) => {
          if (!liveSocket || liveSocket.readyState !== WebSocket.OPEN) return;
          const input = event.inputBuffer.getChannelData(0);
          const downsampled = downsampleTo16k(input, audioContext.sampleRate);
          const pcm = floatTo16BitPCM(downsampled);
          liveSocket.send(JSON.stringify({ realtimeInput: { audio: { data: arrayBufferToBase64(pcm), mimeType: 'audio/pcm;rate=16000' } } }));
        };
        sourceNode.connect(processorNode);
        processorNode.connect(audioContext.destination);
      };

      liveSocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          const content = message.serverContent;
          if (!content) return;
          if (content.inputTranscription?.text) {
            liveUserTranscript += content.inputTranscription.text;
          }
          if (content.outputTranscription?.text) {
            liveAssistantTranscript += content.outputTranscription.text;
          }
          const parts = content.modelTurn?.parts || [];
          for (const part of parts) {
            if (part.inlineData?.mimeType?.startsWith('audio/pcm')) playPcm24k(part.inlineData.data);
            if (part.text) liveAssistantTranscript += part.text;
          }
          if (content.turnComplete) {
            if (liveUserTranscript.trim()) {
              const userText = liveUserTranscript.trim();
              appendMessage('user', userText);
              conversationHistory.push({ role: 'user', text: userText });
              updateProjectFromVoiceTranscript(userText);
            }
            if (liveAssistantTranscript.trim()) {
              const assistantText = liveAssistantTranscript.trim();
              appendMessage('assistant', assistantText);
              conversationHistory.push({ role: 'model', text: assistantText });
            }
            liveUserTranscript = ''; liveAssistantTranscript = '';
            setVoiceState('listening', 'Listening...');
          }
        } catch (err) { console.warn('[HAVEN AI] Live message parse failed:', err); }
      };

      liveSocket.onerror = (event) => {
        console.error('[HAVEN AI] Gemini Live socket error:', event);
        setVoiceState('error', 'HAVEN AI voice could not connect. You can continue by typing.');
      };
      liveSocket.onclose = () => {
        liveConnected = false;
        stopLiveVoice();
        setVoiceState('idle');
      };
    } catch (err) {
      console.error('[HAVEN AI] Live voice startup failed:', err);
      stopLiveVoice();
      setVoiceState('error', 'HAVEN AI voice could not connect. Please check the AI connection and try again.');
    }
  }

  function stopLiveVoice() {
    liveConnected = false;
    if (processorNode) { try { processorNode.disconnect(); } catch (_) {} processorNode = null; }
    if (sourceNode) { try { sourceNode.disconnect(); } catch (_) {} sourceNode = null; }
    if (audioContext) { try { audioContext.close(); } catch (_) {} audioContext = null; }
    if (mediaStream) mediaStream.getTracks().forEach(track => track.stop());
    mediaStream = null;
    if (liveSocket && liveSocket.readyState === WebSocket.OPEN) { try { liveSocket.close(); } catch (_) {} }
    liveSocket = null;
    playbackCursor = 0;
  }

  function toggleMicrophone() {
    if (isSpeaking) stopSpeaking();
    if (liveConnected) { stopLiveVoice(); setVoiceState('idle'); return; }
    startLiveVoice();
  }

  async function submitConfirmedEnquiry() {
    if (!sendEnquiryBtn) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let clientEmail = projectState.email?.trim();
    if (!clientEmail || !emailRegex.test(clientEmail)) {
      const promptEmail = prompt('Please enter your contact email address so HAVEN can review and send your confirmed quote:');
      if (promptEmail && emailRegex.test(promptEmail.trim())) { projectState.email = promptEmail.trim(); clientEmail = projectState.email; if (sumEmail) sumEmail.textContent = clientEmail; }
      else { alert('A valid email address is required before sending your enquiry.'); return; }
    }
    sendEnquiryBtn.disabled = true; sendEnquiryBtn.textContent = 'Transmitting Brief...';
    const payload = {
      clientInfo: { name: projectState.name || 'Valued Client', email: clientEmail, phone: projectState.phone || '', country: projectState.country || '', city: projectState.city || '' },
      business: { businessName: projectState.businessName || 'New Brand', businessType: projectState.businessType || 'General', existingWebsite: projectState.existingWebsite || '' },
      project: { websiteType: projectState.websiteType || 'Professional Website', projectType: projectState.projectType || 'Template Suite', template: projectState.template || 'Custom Vision', pages: projectState.pages || [], features: projectState.features || [], hosting: projectState.hosting || 'Yes', domain: projectState.domain || 'Yes' },
      budgetTimeline: { budget: projectState.budget || 'Standard Tier', timeline: projectState.timeline || '2–4 weeks' },
      design: { style: projectState.stylePreferences || 'Dark cinematic & minimal', brandColors: projectState.brandColors || 'HAVEN Aesthetics', referenceWebsites: projectState.referenceWebsites || '' },
      additionalRequirements: projectState.additionalRequirements || '', transcript: conversationHistory
    };
    try {
      const res = await fetch(`${API_BASE_URL}/api/submit-enquiry`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const resData = await res.json();
      if (res.ok && resData.success) {
        if (summaryBox) summaryBox.classList.remove('active');
        if (successBox) { if (successRefId) successRefId.textContent = resData.referenceId || 'HVN-CONFIRMED'; successBox.classList.add('active'); successBox.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        stopSpeaking();
        if (!isMuted) speakResponse(`Thank you ${projectState.name || ''}. Your project enquiry has been confirmed and transmitted to the HAVEN team.`, 'en');
      } else throw new Error(resData.error || 'Server rejected enquiry submission');
    } catch (err) {
      console.error('[HAVEN AI] Submission error:', err);
      alert('Your enquiry could not be sent right now. Please try again or reach out directly at hello.havenweb@gmail.com.');
    } finally { sendEnquiryBtn.disabled = false; sendEnquiryBtn.textContent = 'SEND ENQUIRY →'; }
  }

  if (startBtn) startBtn.addEventListener('click', () => {
    if (canvas) {
      canvas.style.display = 'flex'; canvas.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => { if (!isMuted) speakResponse("Welcome to HAVEN. Tell me what you're imagining for your website.", 'en'); }, 500);
    }
  });
  if (micBtn) micBtn.addEventListener('click', toggleMicrophone);
  if (sendBtn && textInput) {
    sendBtn.addEventListener('click', () => { const val = textInput.value.trim(); if (val) sendMessage(val); });
    textInput.addEventListener('keydown', e => { if (e.key === 'Enter') { const val = textInput.value.trim(); if (val) sendMessage(val); } });
  }
  if (muteBtn) muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    if (isMuted) { stopSpeaking(); if (muteLabel) muteLabel.textContent = 'Audio Muted'; muteBtn.style.opacity = '0.6'; }
    else { if (muteLabel) muteLabel.textContent = 'Audio On'; muteBtn.style.opacity = '1'; }
  });
  if (stopSpeakingBtn) stopSpeakingBtn.addEventListener('click', stopSpeaking);
  if (editDetailsBtn) editDetailsBtn.addEventListener('click', () => {
    if (summaryBox) summaryBox.classList.remove('active');
    appendMessage('assistant', 'What details would you like to refine? You can update your pages, features, template, or budget.');
    if (textInput) textInput.focus();
  });
  if (sendEnquiryBtn) sendEnquiryBtn.addEventListener('click', submitConfirmedEnquiry);
  if (newConsultationBtn) newConsultationBtn.addEventListener('click', () => window.location.reload());
  if (resetBtn) resetBtn.addEventListener('click', () => {
    if (!confirm('Start a fresh consultation with HAVEN AI?')) return;
    stopLiveVoice(); stopSpeaking(); conversationHistory = [];
    projectState = { name:'',email:'',phone:'',businessName:'',country:'',city:'',businessType:'',websiteType:'',projectType:'',template:'',pages:[],features:[],hosting:'',domain:'',budget:'',timeline:'',stylePreferences:'',brandColors:'',existingWebsite:'',referenceWebsites:'',additionalRequirements:'' };
    if (thread) thread.innerHTML = `<div class="ai-chat-bubble assistant"><div class="chat-bubble-author"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"></circle></svg> HAVEN AI &bull; Senior Consultant</div><div class="chat-bubble-text">Session restarted. Tell me what kind of website or brand you'd like to build.</div></div>`;
    if (summaryBox) summaryBox.classList.remove('active'); if (successBox) successBox.classList.remove('active');
    ['pill-name','pill-biz','pill-type','pill-template','pill-budget'].forEach(id => { const el=document.getElementById(id); if(el) el.classList.remove('filled'); });
    if(valName)valName.textContent='—'; if(valBiz)valBiz.textContent='—'; if(valType)valType.textContent='—'; if(valTemplate)valTemplate.textContent='—'; if(valBudget)valBudget.textContent='—'; setVoiceState('idle');
  });

  setVoiceState('idle');
}
