/**
 * HAVEN DIGITAL STUDIO — INTERACTIVE CLIENT RUNTIME
 * Lightweight Vanilla JS • Zero Dependencies • Fast & Resilient
 */

document.addEventListener('DOMContentLoaded', () => {
  initNightDaySlider();
  initMobileNav();
  initScrollReveal();
  initContactForm();
  initTemplateFilters();
  initParallaxEffects();
  autoSelectTemplateFromUrl();
  initHavenAI();
});

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
   4. CONTACT ENQUIRY FORM (LOCAL SUCCESS NOTIFICATION)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('haven-contact-form');
  const successBox = document.getElementById('form-success-box');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = (document.getElementById('name') || {}).value || 'Client';
    const email = (document.getElementById('email') || {}).value || '';
    const brand = (document.getElementById('brand') || {}).value || '';
    const template = (document.getElementById('template') || {}).value || 'Bespoke';

    // Store in localStorage for client record
    const enquiry = {
      name,
      email,
      brand,
      template,
      timestamp: new Date().toISOString()
    };

    try {
      const past = JSON.parse(localStorage.getItem('haven_enquiries') || '[]');
      past.push(enquiry);
      localStorage.setItem('haven_enquiries', JSON.stringify(past));
    } catch (_) {}

    // Show dynamic success confirmation
    if (successBox) {
      successBox.innerHTML = `
        <div style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: #bbf7d0;">
          Enquiry Received, ${escapeHtml(name)}
        </div>
        <p style="font-size: 0.95rem; color: #e2e8f0; line-height: 1.6;">
          Thank you for reaching out regarding <strong>${escapeHtml(brand || 'your project')}</strong> with the <strong>${escapeHtml(template)}</strong> aesthetic.
          Our creative director will review your brief and contact you within 24 hours.
        </p>
      `;
      successBox.classList.add('show');
      form.reset();
      successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
   7. SUBTLE LAYERED PARALLAX ON HERO GRAPHICS
   ========================================================================== */
function initParallaxEffects() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const card = document.querySelector('.split-viewer-card');
  const stars = document.querySelector('.stars-overlay');
  const glow = document.querySelector('.wolf-atmosphere-glow');
  const wolfImg = document.querySelector('.hero-wolf-img');
  const dayImg = document.querySelector('.hero-day-img');

  if (!card) return;

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  let rafId = null;

  function onMouseMove(e) {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalized offset relative to hero card
    mouseX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (window.innerWidth * 0.5)));
    mouseY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (window.innerHeight * 0.5)));

    if (!rafId) {
      rafId = requestAnimationFrame(updateParallax);
    }
  }

  function updateParallax() {
    // Smooth dampening interpolation (lerp)
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;

    const rotY = (currentX * 3).toFixed(2);
    const rotX = (-currentY * 2).toFixed(2);

    card.style.transform = `perspective(1200px) rotateY(${rotY}deg) rotateX(${rotX}deg)`;

    // Layered depth: stars shift minimally, atmosphere shimmers gently
    if (stars) {
      stars.style.transform = `translate3d(${(-currentX * 5).toFixed(1)}px, ${(-currentY * 3).toFixed(1)}px, 0)`;
    }
    if (glow) {
      glow.style.transform = `translate3d(${(currentX * 4).toFixed(1)}px, ${(currentY * 3).toFixed(1)}px, 0)`;
    }

    if (Math.abs(mouseX - currentX) > 0.001 || Math.abs(mouseY - currentY) > 0.001) {
      rafId = requestAnimationFrame(updateParallax);
    } else {
      rafId = null;
    }
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouseX = 0;
    mouseY = 0;
    if (!rafId) {
      rafId = requestAnimationFrame(updateParallax);
    }
  });
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

  // Pill Elements
  const valName = document.getElementById('val-name');
  const valBiz = document.getElementById('val-biz');
  const valType = document.getElementById('val-type');
  const valTemplate = document.getElementById('val-template');
  const valBudget = document.getElementById('val-budget');

  // Summary Elements
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

  // State
  let isListening = false;
  let isSpeaking = false;
  let isThinking = false;
  let isMuted = false;
  let conversationHistory = [];
  let projectState = {
    name: '',
    email: '',
    phone: '',
    businessName: '',
    country: '',
    city: '',
    businessType: '',
    websiteType: '',
    projectType: '',
    template: '',
    pages: [],
    features: [],
    hosting: '',
    domain: '',
    budget: '',
    timeline: '',
    stylePreferences: '',
    brandColors: '',
    existingWebsite: '',
    referenceWebsites: '',
    additionalRequirements: ''
  };

  const API_BASE_URL = (window.HAVEN_API_BASE_URL || '').replace(/\/$/, '');

  // Speech Recognition Setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  let recognition = null;

  if (SpeechRecognition) {
    try {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        isListening = true;
        setVoiceState('listening');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript && transcript.trim()) {
          sendMessage(transcript.trim());
        }
      };

      recognition.onerror = (event) => {
        console.warn('[HAVEN AI] Speech recognition error:', event.error);
        isListening = false;
        if (event.error === 'not-allowed') {
          setVoiceState('error', 'Microphone permission denied. You can continue by typing.');
        } else {
          setVoiceState('idle');
        }
      };

      recognition.onend = () => {
        isListening = false;
        if (!isThinking && !isSpeaking) {
          setVoiceState('idle');
        }
      };
    } catch (e) {
      console.warn('[HAVEN AI] Speech recognition initialization failed:', e);
    }
  }

  // Voice State Visualizer
  function setVoiceState(state, customMessage) {
    if (!orb || !statusText || !liveStatus) return;

    orb.className = 'ai-orb-wrap ' + (state === 'idle' ? '' : state);
    liveStatus.className = 'ai-live-indicator ' + (state === 'idle' ? '' : state);

    if (micBtn) {
      if (state === 'listening') {
        micBtn.classList.add('active-listening');
      } else {
        micBtn.classList.remove('active-listening');
      }
    }

    if (stopSpeakingBtn) {
      stopSpeakingBtn.style.display = (state === 'speaking') ? 'inline-flex' : 'none';
    }

    switch (state) {
      case 'listening':
        statusText.textContent = customMessage || 'Listening...';
        break;
      case 'thinking':
        statusText.textContent = customMessage || 'Thinking...';
        break;
      case 'speaking':
        statusText.textContent = customMessage || 'HAVEN AI is speaking...';
        break;
      case 'error':
        statusText.textContent = customMessage || 'Voice isn\'t available right now. You can continue by typing.';
        break;
      case 'idle':
      default:
        statusText.textContent = customMessage || '● Ready';
        break;
    }
  }

  // Speech Synthesis Helper
  function speakResponse(text, lang) {
    if (!('speechSynthesis' in window) || isMuted) {
      setVoiceState('idle');
      return;
    }

    window.speechSynthesis.cancel();

    // Clean plain text without markdown or symbols
    const cleanText = text.replace(/[*#`_~[\]]/g, '').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Detect language code
    if (lang === 'ur') {
      utterance.lang = 'ur-PK';
    } else if (lang === 'hi') {
      utterance.lang = 'hi-IN';
    } else if (lang === 'ar') {
      utterance.lang = 'ar-SA';
    } else {
      utterance.lang = 'en-US';
    }

    // Try finding natural sounding voice
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const match = voices.find(v => v.lang.startsWith(utterance.lang.slice(0, 2)) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium')));
      if (match) utterance.voice = match;
    }

    utterance.onstart = () => {
      isSpeaking = true;
      setVoiceState('speaking');
    };

    utterance.onend = () => {
      isSpeaking = false;
      setVoiceState('idle');
    };

    utterance.onerror = () => {
      isSpeaking = false;
      setVoiceState('idle');
    };

    window.speechSynthesis.speak(utterance);
  }

  function stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isSpeaking = false;
    setVoiceState('idle');
  }

  // Render chat bubble in conversation thread
  function appendMessage(role, text) {
    if (!thread) return;
    const bubble = document.createElement('div');
    bubble.className = `ai-chat-bubble ${role === 'user' ? 'user' : 'assistant'}`;

    const author = document.createElement('div');
    author.className = 'chat-bubble-author';

    if (role === 'user') {
      author.innerHTML = `You`;
    } else {
      author.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"></circle></svg> HAVEN AI &bull; Project Consultant`;
    }

    const content = document.createElement('div');
    content.className = 'chat-bubble-text';
    content.textContent = text;

    bubble.appendChild(author);
    bubble.appendChild(content);
    thread.appendChild(bubble);

    // Smooth scroll to bottom
    thread.scrollTop = thread.scrollHeight;
  }

  // Update live progress bar pills
  function updateProgressPills(state) {
    if (!state) return;
    if (valName && state.name) {
      valName.textContent = state.name;
      valName.parentElement.classList.add('filled');
    }
    if (valBiz && state.businessName) {
      valBiz.textContent = state.businessName;
      valBiz.parentElement.classList.add('filled');
    }
    if (valType && (state.websiteType || state.businessType)) {
      valType.textContent = state.websiteType || state.businessType;
      valType.parentElement.classList.add('filled');
    }
    if (valTemplate && state.template) {
      valTemplate.textContent = state.template;
      valTemplate.parentElement.classList.add('filled');
    }
    if (valBudget && state.budget) {
      valBudget.textContent = state.budget;
      valBudget.parentElement.classList.add('filled');
    }
  }

  // Populate Project Summary Review Card
  function renderSummaryCard(state) {
    if (!summaryBox) return;

    if (sumClient) sumClient.textContent = state.name || 'Not provided yet';
    if (sumEmail) sumEmail.textContent = state.email || 'Required for confirmation';
    if (sumBrand) sumBrand.textContent = state.businessName || 'Bespoke Brand';
    if (sumBizType) sumBizType.textContent = state.businessType || state.websiteType || 'Custom Venture';
    if (sumTemplate) sumTemplate.textContent = state.template || 'Custom Bespoke Scope';
    
    if (sumPages) {
      sumPages.textContent = Array.isArray(state.pages) && state.pages.length ? state.pages.join(', ') : 'Standard 6-Page Suite';
    }
    if (sumFeatures) {
      sumFeatures.textContent = Array.isArray(state.features) && state.features.length ? state.features.join(', ') : 'Turnkey responsive setup';
    }
    if (sumBudget) sumBudget.textContent = state.budget || 'Starting from PKR 29,000';

    if (state.additionalRequirements && sumNotes && sumNotesBox) {
      sumNotes.textContent = state.additionalRequirements;
      sumNotesBox.style.display = 'block';
    }

    summaryBox.classList.add('active');
    summaryBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Send Message to backend
  async function sendMessage(text) {
    if (!text || isThinking) return;

    // Interrupt any active voice synthesis
    stopSpeaking();

    // Append to UI
    appendMessage('user', text);
    conversationHistory.push({ role: 'user', text });

    if (textInput) textInput.value = '';

    // Set Thinking state
    isThinking = true;
    setVoiceState('thinking');

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: conversationHistory,
          projectState: projectState
        })
      });

      if (!response.ok) {
        throw new Error('API server returned status ' + response.status);
      }

      const data = await response.json();
      isThinking = false;

      const aiReply = data.reply || "I understand your vision. Let's continue shaping your project.";
      
      // Update history and state
      conversationHistory.push({ role: 'model', text: aiReply });
      if (data.projectState) {
        projectState = { ...projectState, ...data.projectState };
        updateProgressPills(projectState);
      }

      // Update language indicator
      if (langPill && data.detectedLanguage) {
        langPill.textContent = data.detectedLanguage.toUpperCase();
      }

      appendMessage('assistant', aiReply);

      // Speak response if not muted
      speakResponse(aiReply, data.detectedLanguage);

      // Check if ready to display summary
      if (data.isReadyForSummary) {
        renderSummaryCard(projectState);
      }

    } catch (err) {
      console.error('[HAVEN AI] Chat communication failed:', err);
      isThinking = false;
      const errorMsg = "I'm having trouble connecting right now. You can continue by typing or use the HAVEN contact page.";
      appendMessage('assistant', errorMsg);
      setVoiceState('error', errorMsg);
    }
  }

  // Toggle Microphone
  function toggleMicrophone() {
    if (!recognition) {
      setVoiceState('error', 'Voice recognition is not supported in this browser. Please type below.');
      if (textInput) textInput.focus();
      return;
    }

    // If AI is currently speaking, clicking mic interrupts it and begins listening
    if (isSpeaking) {
      stopSpeaking();
    }

    if (isListening) {
      recognition.stop();
      isListening = false;
      setVoiceState('idle');
    } else {
      try {
        recognition.start();
      } catch (err) {
        console.warn('[HAVEN AI] Recognition start error:', err);
        recognition.stop();
        setTimeout(() => {
          try { recognition.start(); } catch (_) {}
        }, 150);
      }
    }
  }

  // Submit Confirmed Project Brief
  async function submitConfirmedEnquiry() {
    if (!sendEnquiryBtn) return;

    // Check email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let clientEmail = projectState.email?.trim();

    if (!clientEmail || !emailRegex.test(clientEmail)) {
      const promptEmail = prompt('Please enter your contact email address so HAVEN can review and send your confirmed quote:');
      if (promptEmail && emailRegex.test(promptEmail.trim())) {
        projectState.email = promptEmail.trim();
        clientEmail = projectState.email;
        if (sumEmail) sumEmail.textContent = clientEmail;
      } else {
        alert('A valid email address is required before sending your enquiry.');
        return;
      }
    }

    sendEnquiryBtn.disabled = true;
    sendEnquiryBtn.textContent = 'Transmitting Brief...';

    const payload = {
      clientInfo: {
        name: projectState.name || 'Valued Client',
        email: clientEmail,
        phone: projectState.phone || '',
        country: projectState.country || '',
        city: projectState.city || ''
      },
      business: {
        businessName: projectState.businessName || 'New Brand',
        businessType: projectState.businessType || 'General',
        existingWebsite: projectState.existingWebsite || ''
      },
      project: {
        websiteType: projectState.websiteType || 'Professional Website',
        projectType: projectState.projectType || 'Template Suite',
        template: projectState.template || 'Custom Vision',
        pages: projectState.pages || [],
        features: projectState.features || [],
        hosting: projectState.hosting || 'Yes',
        domain: projectState.domain || 'Yes'
      },
      budgetTimeline: {
        budget: projectState.budget || 'Standard Tier',
        timeline: projectState.timeline || '2–4 weeks'
      },
      design: {
        style: projectState.stylePreferences || 'Dark cinematic & minimal',
        brandColors: projectState.brandColors || 'HAVEN Aesthetics',
        referenceWebsites: projectState.referenceWebsites || ''
      },
      additionalRequirements: projectState.additionalRequirements || '',
      transcript: conversationHistory
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/submit-enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resData = await res.json();

      if (res.ok && resData.success) {
        if (summaryBox) summaryBox.classList.remove('active');
        if (successBox) {
          if (successRefId) successRefId.textContent = resData.referenceId || 'HVN-CONFIRMED';
          successBox.classList.add('active');
          successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        stopSpeaking();
        const confirmationSpeech = `Thank you ${projectState.name || ''}. Your project enquiry has been confirmed and transmitted to the HAVEN team.`;
        speakResponse(confirmationSpeech, 'en');
      } else {
        throw new Error(resData.error || 'Server rejected enquiry submission');
      }
    } catch (err) {
      console.error('[HAVEN AI] Submission error:', err);
      alert('Your enquiry could not be sent right now. Please try again or reach out directly at hello@havenweb.studio.');
    } finally {
      sendEnquiryBtn.disabled = false;
      sendEnquiryBtn.textContent = 'SEND ENQUIRY →';
    }
  }

  // Event Listeners
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (canvas) {
        canvas.style.display = 'flex';
        canvas.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Give polite voice introduction
        setTimeout(() => {
          speakResponse("Welcome to HAVEN. Tell me what you're imagining for your website.", 'en');
        }, 500);
      }
    });
  }

  if (micBtn) {
    micBtn.addEventListener('click', toggleMicrophone);
  }

  if (sendBtn && textInput) {
    sendBtn.addEventListener('click', () => {
      const val = textInput.value.trim();
      if (val) sendMessage(val);
    });

    textInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = textInput.value.trim();
        if (val) sendMessage(val);
      }
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      if (isMuted) {
        stopSpeaking();
        if (muteLabel) muteLabel.textContent = 'Audio Muted';
        muteBtn.style.opacity = '0.6';
      } else {
        if (muteLabel) muteLabel.textContent = 'Audio On';
        muteBtn.style.opacity = '1';
      }
    });
  }

  if (stopSpeakingBtn) {
    stopSpeakingBtn.addEventListener('click', stopSpeaking);
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Start a fresh consultation with HAVEN AI?')) {
        stopSpeaking();
        conversationHistory = [];
        projectState = {
          name: '',
          email: '',
          phone: '',
          businessName: '',
          country: '',
          city: '',
          businessType: '',
          websiteType: '',
          projectType: '',
          template: '',
          pages: [],
          features: [],
          hosting: '',
          domain: '',
          budget: '',
          timeline: '',
          stylePreferences: '',
          brandColors: '',
          existingWebsite: '',
          referenceWebsites: '',
          additionalRequirements: ''
        };
        if (thread) {
          thread.innerHTML = `
            <div class="ai-chat-bubble assistant">
              <div class="chat-bubble-author">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"></circle></svg>
                HAVEN AI &bull; Senior Consultant
              </div>
              <div class="chat-bubble-text">
                Session restarted. Tell me what kind of website or brand you'd like to build.
              </div>
            </div>
          `;
        }
        if (summaryBox) summaryBox.classList.remove('active');
        if (successBox) successBox.classList.remove('active');
        ['pill-name', 'pill-biz', 'pill-type', 'pill-template', 'pill-budget'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.classList.remove('filled');
        });
        if (valName) valName.textContent = '—';
        if (valBiz) valBiz.textContent = '—';
        if (valType) valType.textContent = '—';
        if (valTemplate) valTemplate.textContent = '—';
        if (valBudget) valBudget.textContent = '—';
        setVoiceState('idle');
      }
    });
  }

  if (editDetailsBtn) {
    editDetailsBtn.addEventListener('click', () => {
      if (summaryBox) summaryBox.classList.remove('active');
      appendMessage('assistant', "What details would you like to refine? You can update your pages, features, template, or budget.");
      if (textInput) textInput.focus();
    });
  }

  if (sendEnquiryBtn) {
    sendEnquiryBtn.addEventListener('click', submitConfirmedEnquiry);
  }

  if (newConsultationBtn) {
    newConsultationBtn.addEventListener('click', () => {
      window.location.reload();
    });
  }
}

