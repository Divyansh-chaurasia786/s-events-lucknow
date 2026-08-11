/**
 * S. CATERERS & EVENTS — Diverse Editorial Atelier Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomEventPlanner();
  initOccasionTabs();
  initGalleryFilters();
  initConsultationForm();
  initWhatsAppBlueprintModal();
});

// =========================================================================
// 1. OCCASION SPOTLIGHT TAB SWITCHER (FOR HOMEPAGE)
// =========================================================================

function initOccasionTabs() {
  const tabBtns = document.querySelectorAll('.occasion-tab-btn');
  const panes = document.querySelectorAll('.spotlight-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      panes.forEach(p => p.classList.add('d-none'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.remove('d-none');
      }
    });
  });
}

// =========================================================================
// 2. DESIGN YOUR EVENT STUDIO CONTROLLER
// =========================================================================

const eventState = {
  occasion: 'Royal Wedding Celebration',
  venue: 'Heritage Palace / Luxury Resort',
  guestCount: 'Grand (400 - 800 Guests)',
  theme: 'Royal Rajwada & Marigold Grandeur',
  production: ['Grand Floral Mandap Architecture', 'Concert Truss & Beam Lighting', 'Line-Array Concert Sound Fleet'],
  entertainment: ['Celebrity Bollywood & Club DJ', 'Live Sufi-Rock / Bollywood Band', 'Electrifying Punjabi Dhol Symphony'],
};

window.eventState = eventState;

function initCustomEventPlanner() {
  // Step Button Switching
  const stepPills = document.querySelectorAll('.studio-step-btn');
  const stepPanes = document.querySelectorAll('.planner-step-pane');

  stepPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const step = pill.getAttribute('data-step');
      switchPlannerStep(step);
    });
  });

  // Single Select Boxes (Occasion, Venue, Theme, Guest Count)
  document.querySelectorAll('.studio-option-card[data-group]').forEach(box => {
    box.addEventListener('click', () => {
      const group = box.getAttribute('data-group');
      const val = box.getAttribute('data-val');

      // Clear siblings in same group
      document.querySelectorAll(`.studio-option-card[data-group="${group}"]`).forEach(b => {
        b.classList.remove('selected');
      });

      box.classList.add('selected');
      eventState[group] = val;
      updateEventLiveTray();
    });
  });

  // Multi Select Boxes (Production, Entertainment)
  document.querySelectorAll('.studio-option-card[data-multi]').forEach(box => {
    box.addEventListener('click', () => {
      const multiKey = box.getAttribute('data-multi');
      const val = box.getAttribute('data-val');

      box.classList.toggle('selected');

      if (!Array.isArray(eventState[multiKey])) {
        eventState[multiKey] = [];
      }

      if (box.classList.contains('selected')) {
        if (!eventState[multiKey].includes(val)) {
          eventState[multiKey].push(val);
        }
      } else {
        eventState[multiKey] = eventState[multiKey].filter(item => item !== val);
      }

      updateEventLiveTray();
    });
  });

  // Next & Prev Step Buttons
  document.querySelectorAll('.btn-next-step').forEach(btn => {
    btn.addEventListener('click', () => {
      const next = btn.getAttribute('data-next');
      switchPlannerStep(next);
    });
  });

  document.querySelectorAll('.btn-prev-step').forEach(btn => {
    btn.addEventListener('click', () => {
      const prev = btn.getAttribute('data-prev');
      switchPlannerStep(prev);
    });
  });

  // Initial Summary Render
  updateEventLiveTray();
}

function switchPlannerStep(stepNum) {
  const stepPills = document.querySelectorAll('.studio-step-btn');
  const stepPanes = document.querySelectorAll('.planner-step-pane');

  stepPills.forEach(pill => pill.classList.remove('active'));
  stepPanes.forEach(pane => pane.classList.add('d-none'));

  const activePill = document.querySelector(`.studio-step-btn[data-step="${stepNum}"]`);
  const activePane = document.getElementById(`planner-step-${stepNum}`);

  if (activePill) activePill.classList.add('active');
  if (activePane) {
    activePane.classList.remove('d-none');
    activePane.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function updateEventLiveTray() {
  const occasionEl = document.getElementById('sum-occasion');
  const venueEl = document.getElementById('sum-venue');
  const guestsEl = document.getElementById('sum-guests');
  const themeEl = document.getElementById('sum-theme');
  const prodContainer = document.getElementById('sum-production-chips');
  const entContainer = document.getElementById('sum-entertainment-chips');

  if (occasionEl) occasionEl.textContent = eventState.occasion || 'Custom Event';
  if (venueEl) venueEl.textContent = eventState.venue || 'To Be Decided';
  if (guestsEl) guestsEl.textContent = eventState.guestCount || 'Custom Scale';
  if (themeEl) themeEl.textContent = eventState.theme || 'Bespoke Theme';

  if (prodContainer) {
    prodContainer.innerHTML = '';
    if (eventState.production.length === 0) {
      prodContainer.innerHTML = '<span class="text-white-50 small" style="font-size:0.75rem;">Standard Production</span>';
    } else {
      eventState.production.forEach(item => {
        const span = document.createElement('span');
        span.className = 'studio-chip-tag';
        span.innerHTML = `<i class="fa-solid fa-bolt text-gold"></i> ${item}`;
        prodContainer.appendChild(span);
      });
    }
  }

  if (entContainer) {
    entContainer.innerHTML = '';
    if (eventState.entertainment.length === 0) {
      entContainer.innerHTML = '<span class="text-white-50 small" style="font-size:0.75rem;">Standard Artists</span>';
    } else {
      eventState.entertainment.forEach(item => {
        const span = document.createElement('span');
        span.className = 'studio-chip-tag';
        span.innerHTML = `<i class="fa-solid fa-music text-gold"></i> ${item}`;
        entContainer.appendChild(span);
      });
    }
  }
}

// =========================================================================
// 3. WHATSAPP BLUEPRINT FORM MODAL CONTROLLER
// =========================================================================

function initWhatsAppBlueprintModal() {
  const triggerBtn = document.getElementById('btn-send-whatsapp-trigger');
  const modalEl = document.getElementById('whatsappBlueprintModal');
  const form = document.getElementById('whatsappBlueprintForm');

  if (triggerBtn && modalEl && typeof bootstrap !== 'undefined') {
    const modal = new bootstrap.Modal(modalEl);
    
    triggerBtn.addEventListener('click', () => {
      modal.show();
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('wa-name')?.value || '';
      const date = document.getElementById('wa-date')?.value || '';
      const address = document.getElementById('wa-address')?.value || '';

      const prodList = eventState.production.length ? eventState.production.join(', ') : 'Standard Production';
      const entList = eventState.entertainment.length ? eventState.entertainment.join(', ') : 'Standard Artists';

      const message = 
`👑 *CUSTOM EVENT BLUEPRINT — S. EVENTS & WEDDING DESIGN STUDIO* 👑
--------------------------------------------
👤 *Name:* ${name}
📅 *Date of Celebration:* ${date}
📍 *Address / Venue Location:* ${address}
--------------------------------------------
✨ *Occasion:* ${eventState.occasion}
🏰 *Venue Setting:* ${eventState.venue}
👥 *Guest Scale:* ${eventState.guestCount}
🎨 *Decor Aesthetics:* ${eventState.theme}
⚡ *Stage & Production:* ${prodList}
🎭 *Artists & Entertainment:* ${entList}
--------------------------------------------
Hello Amit Ji! I have designed my custom celebration blueprint on the S. Events website. Please share a tailored proposal & estimate for the above details.`;

      const waUrl = `https://wa.me/916393998141?text=${encodeURIComponent(message)}`;

      // Hide Modal
      if (modalEl && typeof bootstrap !== 'undefined') {
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();
      }

      // Open WhatsApp
      window.open(waUrl, '_blank');
      form.reset();
    });
  }
}

// =========================================================================
// 4. THEMES & GALLERY FILTER CONTROLLER
// =========================================================================

function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.theme-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-grid-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.classList.remove('btn-dark');
        b.classList.add('btn-outline-dark');
      });
      btn.classList.add('active');
      btn.classList.remove('btn-outline-dark');
      btn.classList.add('btn-dark');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// =========================================================================
// 5. CONSULTATION FORM HANDLER
// =========================================================================

function initConsultationForm() {
  const form = document.getElementById('eventConsultationForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]')?.value || '';
    const phone = form.querySelector('[name="phone"]')?.value || '';
    const occasion = form.querySelector('[name="occasion"]')?.value || eventState.occasion;
    const date = form.querySelector('[name="date"]')?.value || 'Upcoming Date';
    const notes = form.querySelector('[name="notes"]')?.value || '';

    if (!phone || phone.length < 10) {
      alert('Please enter a valid 10-digit mobile number for consultation.');
      return;
    }

    const waMsg = 
`🔔 *NEW EVENT PROPOSAL REQUEST — S. EVENTS* 🔔
*Name:* ${name}
*Phone:* ${phone}
*Occasion:* ${occasion}
*Preferred Date:* ${date}
*Custom Event Brief:*
${notes}

Submitted via S. Events & Wedding Design Studio Website.`;

    const waUrl = `https://wa.me/916393998141?text=${encodeURIComponent(waMsg)}`;

    alert(`Thank you, ${name}! Your event brief has been received. Redirecting to WhatsApp to connect directly with Amit Agarwal.`);
    window.open(waUrl, '_blank');

    form.reset();
  });
}
