/**
 * RAFFY LUCERO PORTFOLIO - CLIENT-SIDE INTERACTIVITY
 * Clean, lightweight, zero-dependency JavaScript.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initScrollSpy();
  initContactForm();
  initCopyEmail();
  initProjectModals();
  initCurrentYear();
});

/* ==========================================================================
   1. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNavigation() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  function toggleMenu(forceState) {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    const newState = typeof forceState === 'boolean' ? forceState : !isExpanded;

    toggleBtn.setAttribute('aria-expanded', String(newState));
    navMenu.classList.toggle('open', newState);
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close menu when any link is clicked
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
      toggleMenu(false);
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      toggleMenu(false);
      toggleBtn.focus();
    }
  });
}

/* ==========================================================================
   2. SCROLLSPY & ACTIVE NAV LINK INDICATOR
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

/* ==========================================================================
   3. CONTACT FORM VALIDATION & HONEST SUBMISSION HANDLER
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const banner = document.getElementById('form-status-banner');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateField(input, errorElementId, validatorFn) {
    const errorEl = document.getElementById(errorElementId);
    const isValid = validatorFn(input.value.trim());

    if (!isValid) {
      input.classList.add('error');
      if (errorEl) errorEl.classList.add('visible');
      return false;
    } else {
      input.classList.remove('error');
      if (errorEl) errorEl.classList.remove('visible');
      return true;
    }
  }

  // Real-time cleanup on input
  [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
    if (!input) return;
    input.addEventListener('input', () => {
      input.classList.remove('error');
      const err = document.getElementById(`${input.name}-error`);
      if (err) err.classList.remove('visible');
      if (banner) banner.style.display = 'none';
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateField(nameInput, 'name-error', (val) => val.length >= 2);
    const isEmailValid = validateField(emailInput, 'email-error', (val) => emailRegex.test(val));
    const isSubjectValid = validateField(subjectInput, 'subject-error', (val) => val.length >= 2);
    const isMessageValid = validateField(messageInput, 'message-error', (val) => val.length >= 5);

    if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
      if (banner) {
        banner.className = 'form-status-banner error';
        banner.textContent = 'Please fill out all required fields with valid information.';
        banner.style.display = 'block';
      }
      return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    // Construct honest email mailto link
    const mailtoRecipient = 'raffysfalls122@gmail.com';
    const emailSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject} - from ${name}`);
    const emailBody = encodeURIComponent(
      `Hello Raffy,\n\n${message}\n\nSender Details:\nName: ${name}\nEmail: ${email}`
    );

    const mailtoUrl = `mailto:${mailtoRecipient}?subject=${emailSubject}&body=${emailBody}`;

    // Honest feedback banner
    if (banner) {
      banner.className = 'form-status-banner success';
      banner.innerHTML = `
        <strong>Message prepared!</strong> Opening your email client to send to <strong>${mailtoRecipient}</strong>.<br/>
        <small style="display:block; margin-top:6px; opacity:0.9;">
          If your email app didn't open automatically, <a href="${mailtoUrl}" style="color:#fff; text-decoration:underline;">click here to launch it</a>, or copy the message to your webmail.
        </small>
      `;
      banner.style.display = 'block';
    }

    // Trigger user mail client
    window.location.href = mailtoUrl;
  });
}

/* ==========================================================================
   4. COPY EMAIL TO CLIPBOARD
   ========================================================================== */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  const copyBtnText = document.getElementById('copy-btn-text');
  const targetEmail = 'raffysfalls122@gmail.com';

  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(targetEmail);
      } else {
        // Fallback for older browsers
        const tempInput = document.createElement('input');
        tempInput.value = targetEmail;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }

      if (copyBtnText) {
        copyBtnText.textContent = 'Copied!';
        copyBtn.style.backgroundColor = '#ff5722';
        copyBtn.style.borderColor = '#ff5722';
        copyBtn.style.color = '#fff';

        setTimeout(() => {
          copyBtnText.textContent = 'Copy';
          copyBtn.style.backgroundColor = '';
          copyBtn.style.borderColor = '';
          copyBtn.style.color = '';
        }, 2400);
      }
    } catch (err) {
      console.warn('Could not copy email automatically:', err);
    }
  });
}

/* ==========================================================================
   5. PROJECT DETAILS MODAL
   ========================================================================== */
function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-dynamic-content');
  const closeBtn = document.getElementById('modal-close-btn');
  const modalButtons = document.querySelectorAll('.project-modal-btn');

  if (!modal || !modalContent) return;

  const projectDetails = {
    'is-concept': {
      title: 'Web-Based Information System',
      tag: 'Concept Prototype &bull; Academic Project (In Progress)',
      description: 'An academic information system prototype designed to manage, store, and query relational organizational data efficiently with high data integrity.',
      specs: [
        { label: 'Architecture', value: 'Relational Schema + Web Frontend' },
        { label: 'Key Tech', value: 'SQL, Next.js, Entity Relationship Modeling' },
        { label: 'Status', value: 'Active Academic Coursework Concept' },
        { label: 'Key Modules', value: 'Authentication, Record Indexing, Filtering, CRUD' }
      ],
      note: 'This project is currently in the prototype and schema-design stage. It serves as an exploration of database normal forms, query optimization, and structured administration interfaces.'
    },
    'uiux-concept': {
      title: 'UI/UX Website Prototype',
      tag: 'Design Concept &bull; Wireframing & Usability Study',
      description: 'A comprehensive user experience prototype emphasizing human-centered design principles, intuitive information architecture, and multi-device usability.',
      specs: [
        { label: 'Tooling', value: 'Figma, Component Tokens, CSS Architecture' },
        { label: 'Design System', value: 'Dark Theme, Accessible Contrast, Micro-interactions' },
        { label: 'Focus Areas', value: 'Touch targets, mobile viewport scaling, visual hierarchy' },
        { label: 'Deliverable', value: 'High-fidelity wireframes & clickable prototypes' }
      ],
      note: 'Developed as part of UI/UX design coursework to practice modern wireframing workflows and translating visual requirements into clean frontend code.'
    }
  };

  function openModal(projectId) {
    const data = projectDetails[projectId];
    if (!data) return;

    let specsHtml = '<ul class="modal-specs-list">';
    data.specs.forEach((item) => {
      specsHtml += `<li><strong>${item.label}</strong> <span>${item.value}</span></li>`;
    });
    specsHtml += '</ul>';

    modalContent.innerHTML = `
      <span class="modal-tag-badge">${data.tag}</span>
      <h3>${data.title}</h3>
      <p class="modal-body-text">${data.description}</p>
      ${specsHtml}
      <p class="modal-body-text" style="font-size:0.88rem; color:#8d909f; font-style:italic;">${data.note}</p>
    `;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  modalButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const pid = btn.getAttribute('data-project');
      openModal(pid);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   6. FOOTER DYNAMIC YEAR
   ========================================================================== */
function initCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
