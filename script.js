// script.js – Complete site interactions (updated & consolidated)

document.addEventListener('DOMContentLoaded', () => {
// ────────────────────────────────────────
// VALUES CAROUSEL — TRUE CIRCULAR (NO CLONES)
// Active centered + larger + infinite
// ────────────────────────────────────────

const carousel = document.getElementById('valuesCarousel');
// ────────────────────────────────────────
// CAROUSEL IMAGE LAYOUT — UNIFORM SIZE + COVER
// ────────────────────────────────────────
(function fixCarouselImages() {
  const carousel = document.getElementById('valuesCarousel');
  if (!carousel) return;

  const items = carousel.querySelectorAll('.carousel-item');
  const FIXED_HEIGHT = 480; // adjust as needed
  const FIXED_WIDTH =300;

  items.forEach(item => {
    const img = item.querySelector('img');
    if (!img) return;

    // Force all items to have same height
    item.style.height = `${FIXED_HEIGHT}px`;
	item.style.width = `${FIXED_WIDTH}px`;
    item.style.overflow = 'hidden';
    item.style.display = 'flex';
    item.style.justifyContent = 'center';
    item.style.alignItems = 'center';

    // Force image to fill container, crop extra
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';       // crop & fill
    img.style.objectPosition = 'center'; // center the crop
    img.style.display = 'block';
  });
})();

if (!carousel) return;

const wrapper = carousel.parentElement;
const items = Array.from(carousel.querySelectorAll('.carousel-item'));
const total = items.length;

const prevBtn = wrapper.querySelector('.carousel-btn.prev');
const nextBtn = wrapper.querySelector('.carousel-btn.next');

let currentIndex = 0;
let autoplayInterval;
const ITEM_GAP = 24; // space between cards

function getItemWidth() {
  const item = items[0];
  const style = getComputedStyle(item);
  return item.offsetWidth +
         parseFloat(style.marginLeft) +
         parseFloat(style.marginRight) +
         ITEM_GAP;
}

function updateCarousel(animate = true) {
  const itemWidth = getItemWidth();

  items.forEach((item, i) => {
    let offset = (i - currentIndex + total) % total;

    // Spread items both sides (−n … +n)
    if (offset > total / 2) offset -= total;

    const isActive = offset === 0;

    item.style.transition = animate
      ? 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s'
      : 'none';

    item.style.transform = `
      translateX(${offset * itemWidth}px)
      scale(${isActive ? 1.25 : 0.85})
    `;

    item.style.opacity = isActive ? '1' : '0.55';
    item.style.zIndex = isActive ? '3' : '1';

    item.classList.toggle('active', isActive);
  });
}

// ─── Controls ──────────────────────────
function move(dir) {
  currentIndex = (currentIndex + dir + total) % total;
  updateCarousel(true);
}

prevBtn?.addEventListener('click', () => move(-1));
nextBtn?.addEventListener('click', () => move(1));

// ─── Click to focus ────────────────────
items.forEach((item, index) => {
  item.addEventListener('click', () => {
    currentIndex = index;
    updateCarousel(true);
  });
});

// ─── Autoplay ──────────────────────────
function startAutoplay() {
  autoplayInterval = setInterval(() => move(1), 4500);
}
function stopAutoplay() {
  clearInterval(autoplayInterval);
}

wrapper.addEventListener('mouseenter', stopAutoplay);
wrapper.addEventListener('mouseleave', startAutoplay);

// ─── Touch Swipe ───────────────────────
let startX = 0;
wrapper.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
  stopAutoplay();
});

wrapper.addEventListener('touchend', e => {
  const diff = startX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 60) move(diff > 0 ? 1 : -1);
  startAutoplay();
});

// ─── Resize Safety ─────────────────────
new ResizeObserver(() => updateCarousel(false)).observe(wrapper);

// ─── Init ──────────────────────────────
updateCarousel(false);
startAutoplay();

  // ────────────────────────────────────────
  // HAMBURGER MENU
  // ────────────────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const menu = document.querySelector('#menuDropdown');
  const topBar = document.querySelector('.top-bar');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    menu.classList.toggle('visible');
    topBar.classList.toggle('menu-open');
  });

  // ────────────────────────────────────────
  // SEARCH TOGGLE
  // ────────────────────────────────────────
  const searchBox = document.querySelector('.search-box');
  const searchBtn = document.querySelector('.search-btn');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  searchBtn?.addEventListener('click', () => {
    searchBox.classList.toggle('active');
    if (searchBox.classList.contains('active')) searchInput?.focus();
  });

  document.addEventListener('click', e => {
    if (searchBox && !searchBox.contains(e.target)) {
      searchBox.classList.remove('active');
    }
  });

  // ────────────────────────────────────────
  // SIMPLE CLIENT-SIDE SEARCH
  // ────────────────────────────────────────
  if (searchInput && searchResults) {
    const searchable = Array.from(
      document.querySelectorAll('h1, h2, h3, h4, p, .carousel-title, .card-label, .card-content h3')
    );

    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();
      searchResults.innerHTML = '';

      if (q.length < 2) {
        searchResults.style.display = 'none';
        return;
      }

      const matches = searchable.filter(el => el.textContent.toLowerCase().includes(q));

      if (matches.length === 0) {
        searchResults.innerHTML = `<p>No results for "<b>${q}</b>"</p>`;
      } else {
        matches.forEach(el => {
          const link = document.createElement('a');
          link.href = '#';
          link.textContent = el.textContent.trim().substring(0, 80) + (el.textContent.length > 80 ? '...' : '');
          link.addEventListener('click', evt => {
            evt.preventDefault();
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            searchResults.style.display = 'none';
            searchInput.value = '';
            searchBox.classList.remove('active');
          });
          searchResults.appendChild(link);
        });
      }
      searchResults.style.display = 'block';
    });
  }

// ────────────────────────────────────────
// APPOINTMENT CALENDAR + BOOKING (UPDATED)
// ────────────────────────────────────────
document.querySelectorAll('.appointment-wrapper').forEach(wrapper => {

  const calendarBtn  = wrapper.querySelector('.calendar-btn');
  const closeBtn     = wrapper.querySelector('.close-dropdown');
  const miniCalendar = wrapper.querySelector('.mini-calendar');
  const timeSlots    = wrapper.querySelector('.time-slots');
  const bookBtn      = wrapper.querySelector('.book-appointment');
  const monthYear    = wrapper.querySelector('.month-year');
  const prevMonthBtn = wrapper.querySelector('.prev-month');
  const nextMonthBtn = wrapper.querySelector('.next-month');

  let selectedDate = null;
  let selectedTime = null;
  let currentMonth = new Date();
  currentMonth.setHours(0, 0, 0, 0);

  const timeOptions = [
    "09:00","09:30","10:00","10:30","11:00",
    "14:00","14:30","15:00","15:30","16:00"
  ];

  const bookedSlots = [
    { date: "2026-01-27", time: "09:00" },
    { date: "2026-01-28", time: "14:00" },
    { date: "2026-01-29", time: "10:30" }
  ];

  // ─── Open / Close Calendar Dropdown ──────────────
  calendarBtn?.addEventListener('click', e => {
    e.stopPropagation();
    wrapper.classList.toggle('active');
  });

  closeBtn?.addEventListener('click', e => {
    e.stopPropagation();
    wrapper.classList.remove('active');
  });

  wrapper.addEventListener('click', e => e.stopPropagation());

  document.addEventListener('click', () => {
    wrapper.classList.remove('active');
  });

  // ─── Calendar Generation ──────────────
  function generateCalendar() {
    if (!miniCalendar) return;
    miniCalendar.innerHTML = '';

    const today = new Date();
    today.setHours(0,0,0,0);

    const year  = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    monthYear.textContent = currentMonth.toLocaleString('default', {
      month: 'long',
      year: 'numeric'
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < offset; i++) {
      miniCalendar.appendChild(
        Object.assign(document.createElement('div'), { className: 'day disabled' })
      );
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const dateStr = dateObj.toISOString().split('T')[0];

      const day = document.createElement('div');
      day.className = 'day';
      day.textContent = d;

      const isPast = dateObj < today;
      const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

      if (isPast || isWeekend) {
        day.classList.add('disabled');
      } else {
        day.addEventListener('click', () => {
          miniCalendar.querySelectorAll('.day').forEach(el => el.classList.remove('selected'));
          day.classList.add('selected');
          selectedDate = dateStr;
          generateTimeSlots();
        });
      }

      miniCalendar.appendChild(day);
    }
  }

  // ─── Time Slots ───────────────────────
  function generateTimeSlots() {
    if (!timeSlots) return;
    timeSlots.innerHTML = '';

    if (!selectedDate) {
      timeSlots.innerHTML = '<p style="text-align:center;color:#777;">Select a date first</p>';
      if (bookBtn) bookBtn.disabled = true;
      return;
    }

    timeOptions.forEach(time => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = time;

      const isBooked = bookedSlots.some(slot => slot.date === selectedDate && slot.time === time);

      if (isBooked) {
        btn.disabled = true;
        btn.classList.add('booked');
      } else {
        btn.addEventListener('click', () => {
          timeSlots.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          selectedTime = time;
          if (bookBtn) bookBtn.disabled = false;
        });
      }

      timeSlots.appendChild(btn);
    });

    if (bookBtn) bookBtn.disabled = true;
  }

  // ─── Book Appointment ──────────────
  bookBtn?.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time.");
      return;
    }

    const name    = wrapper.querySelector('input[name="name"]')?.value.trim();
    const email   = wrapper.querySelector('input[name="email"]')?.value.trim();
    const phone   = wrapper.querySelector('input[name="phone"]')?.value.trim() || '—';
    const message = wrapper.querySelector('textarea[name="message"]')?.value.trim() || 'No additional message';

    if (!name || !email) {
      alert("Please enter your name and email.");
      return;
    }

    const subject = encodeURIComponent(`Appointment Request – ${selectedDate} at ${selectedTime}`);
    const body = encodeURIComponent(
      `Hello Afrigrade Team,

I would like to book a consultation.

Date: ${selectedDate}
Time: ${selectedTime}

Name: ${name}
Email: ${email}
Phone: ${phone}

Additional notes:
${message}

Thank you!
Best regards,
${name}`
    );

    window.open(
      `mailto:info@afrigradecentre.com?subject=${subject}&body=${body}`,
      '_blank'
    );

    setTimeout(() => {
      selectedDate = null;
      selectedTime = null;
      generateCalendar();
      generateTimeSlots();
      wrapper.classList.remove('active');
    }, 500);
  });

  // ─── Month Navigation ──────────────
  prevMonthBtn?.addEventListener('click', () => {
    currentMonth.setMonth(currentMonth.getMonth() - 1);
    generateCalendar();
  });

  nextMonthBtn?.addEventListener('click', () => {
    currentMonth.setMonth(currentMonth.getMonth() + 1);
    generateCalendar();
  });

  // ─── Initialize ──────────────
  generateCalendar();
  generateTimeSlots();

});



  // ────────────────────────────────────────
  // FADE-IN ON SCROLL
  // ────────────────────────────────────────
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // ────────────────────────────────────────
  // STAT COUNTERS (with K+/M+ formatting)
  // ────────────────────────────────────────
  document.querySelectorAll('.stat-number[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;

      let current = 0;
      const increment = target / 140; // ~2.3 seconds at 60fps
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
          observer.unobserve(el);
        }
        el.textContent = Math.ceil(current).toLocaleString() + '+';
      }, 16);

      // Format final value (K+/M+)
      setTimeout(() => {
        if (target >= 1_000_000) {
          el.textContent = (target / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M+';
        } else if (target >= 1_000) {
          el.textContent = Math.round(target / 1_000) + 'K+';
        }
      }, 2400);
    }, { threshold: 0.5 });

    observer.observe(el);
  });

  // ────────────────────────────────────────
  // NEWSLETTER (demo)
  // ────────────────────────────────────────
  document.querySelector('.newsletter-form')?.addEventListener('submit', e => {
    e.preventDefault();
    alert("Thank you! You've been subscribed.");
    e.target.reset();
  });
});

// Contact Form Submission (mailto fallback)
document.getElementById('contact-form-main')?.addEventListener('submit', function(e) {
  e.preventDefault();

  const btn = document.getElementById('submit-contact');
  const status = document.getElementById('form-status');

  btn.disabled = true;
  btn.textContent = 'Sending...';
  status.style.display = 'none';

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const phone   = document.getElementById('phone').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !subject || !message) {
    status.textContent = 'Please fill in all required fields.';
    status.className = 'form-status error';
    status.style.display = 'block';
    btn.disabled = false;
    btn.textContent = 'Send Message';
    return;
  }

  const mailBody = 
    `Name: ${name}\n` +
    `Email: ${email}\n` +
    `Phone: ${phone || '—'}\n\n` +
    `Message:\n${message}`;

  const mailto = `mailto:info@afrigradecentre.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;

  window.location.href = mailto;

  setTimeout(() => {
    status.textContent = "Your email client should open now. Thank you!";
    status.className = 'form-status success';
    status.style.display = 'block';
    btn.disabled = false;
    btn.textContent = 'Send Message';
    document.getElementById('contact-form-main').reset();

    setTimeout(() => { status.style.display = 'none'; }, 8000);
  }, 600);
});
// Purpose "Learn More" toggle
document.querySelectorAll('.purpose-toggle').forEach(button => {
  button.addEventListener('click', function() {
    const details = document.getElementById('purpose-details');
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    
    // Toggle state
    this.setAttribute('aria-expanded', !isExpanded);
    details.style.maxHeight = isExpanded ? '0px' : `${details.scrollHeight}px`;
    details.style.opacity = isExpanded ? '0' : '1';
    
    // Optional: add/remove class for extra styling
    details.classList.toggle('open', !isExpanded);
  });
});
// ────────────────────────────────────────
// BACK TO TOP BUTTON
// ────────────────────────────────────────
(function () {
  const backToTopBtn = document.getElementById('back-to-top');

  if (!backToTopBtn) return;

  // Show/hide button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  // Smooth scroll to top when clicked
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
})();
// ────────────────────────────────────────
// SCROLL REVEAL ANIMATIONS (Intersection Observer)
// ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Optional: stop observing once revealed (better perf)
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,          // trigger when 15% visible
      rootMargin: '0px 0px -80px 0px' // slight offset so it feels natural
    }
  );

  revealElements.forEach(el => observer.observe(el));
});

