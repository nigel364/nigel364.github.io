// script.js – Complete site interactions (updated & consolidated)

document.addEventListener('DOMContentLoaded', () => {
// ────────────────────────────────────────
// CAROUSEL – ACTIVE ITEM ALWAYS CENTERED + larger + infinite seamless loop
// ────────────────────────────────────────
const carousel = document.getElementById('valuesCarousel');
if (carousel) {
  const wrapper = carousel.parentElement;
  let originalItems = carousel.querySelectorAll('.carousel-item');
  const prevBtn = wrapper.querySelector('.carousel-btn.prev');
  const nextBtn = wrapper.querySelector('.carousel-btn.next');

  if (originalItems.length < 3) return;

  // Clone for infinite loop (prepend last few, append first few)
  const clonesBefore = Array.from(originalItems).slice(-3).map(el => el.cloneNode(true));
  const clonesAfter  = Array.from(originalItems).slice(0, 3).map(el => el.cloneNode(true));
  clonesBefore.forEach(clone => carousel.prepend(clone));
  clonesAfter.forEach(clone => carousel.appendChild(clone));

  const allItems = carousel.querySelectorAll('.carousel-item');

  let currentOffset = 0; // in pixels, negative for left movement
  let itemFullWidth = 0;
  let isTransitioning = false;
  let autoplayInterval;

  function updateItemWidth() {
    const sample = carousel.querySelector('.carousel-item');
    if (!sample) return;
    const style = getComputedStyle(sample);
    itemFullWidth = sample.offsetWidth +
                    parseFloat(style.marginLeft) +
                    parseFloat(style.marginRight);
  }

  function getActiveItemIndex() {
    // Find current active (or the one we want centered)
    const active = carousel.querySelector('.carousel-item.active');
    if (active) return Array.from(allItems).indexOf(active);
    return Math.floor(allItems.length / 2); // fallback
  }
  function centerActive(animate = true) {
    if (isTransitioning) return;
    isTransitioning = true;

    updateItemWidth();
    const activeIndex = getActiveItemIndex();

    // Calculate pixels to move so active item is in center of wrapper
    const wrapperCenter = wrapper.offsetWidth / 2;
    const itemCenter = itemFullWidth / 2;
    const targetOffset = wrapperCenter - (activeIndex * itemFullWidth) - itemCenter;

    carousel.style.transition = animate ? 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none';
    carousel.style.transform = `translateX(${targetOffset}px)`;

    setTimeout(() => { isTransitioning = false; }, animate ? 700 : 0);
  }
function handleInfiniteLoop() {
  const activeIndex = getActiveItemIndex();
  const originalsCount = originalItems.length;
  const clonesCount = 3;

  let realIndex = null;

  // Left clones → jump forward
  if (activeIndex < clonesCount) {
    realIndex = activeIndex + originalsCount;
  }

  // Right clones → jump backward
  if (activeIndex >= clonesCount + originalsCount) {
    realIndex = activeIndex - originalsCount;
  }

  if (realIndex === null) return;

  // 🔥 FULL visual reset (this kills the zoom flicker)
  allItems.forEach(item => {
    item.classList.remove('active', 'prev', 'next');
    item.style.transform = '';
  });

  const realItem = allItems[realIndex];
  realItem.classList.add('active');

  if (realItem.previousElementSibling)
    realItem.previousElementSibling.classList.add('prev');

  if (realItem.nextElementSibling)
    realItem.nextElementSibling.classList.add('next');

  centerActive(false); // instant jump, no animation
}


  function move(direction) {
    // Change which item is active
    let active = carousel.querySelector('.carousel-item.active');
    if (!active) {
      active = allItems[Math.floor(allItems.length / 2)];
      active.classList.add('active');
    }

    let newActive;
    if (direction > 0) {
      newActive = active.nextElementSibling;
      if (!newActive) newActive = allItems[0]; // loop
    } else {
      newActive = active.previousElementSibling;
      if (!newActive) newActive = allItems[allItems.length - 1]; // loop
    }

    allItems.forEach(item => item.classList.remove('active', 'prev', 'next'));
    newActive.classList.add('active');

    // Mark neighbors for optional styling
    if (newActive.previousElementSibling) newActive.previousElementSibling.classList.add('prev');
    if (newActive.nextElementSibling) newActive.nextElementSibling.classList.add('next');

    centerActive(true);
  }

  // Init
  setTimeout(() => {
    updateItemWidth();
    // Start with a middle-ish original item as active
    const startIdx = 3 + Math.floor(originalItems.length / 2); // after clonesBefore
    allItems.forEach((item, i) => item.classList.remove('active'));
    if (allItems[startIdx]) {
      allItems[startIdx].classList.add('active');
    }
    centerActive(false); // no animation on load
  }, 150); // small delay for layout to settle
enableMouseSelection();

  // Controls
  prevBtn?.addEventListener('click', () => move(-1));
  nextBtn?.addEventListener('click', () => move(1));

  // Autoplay
  function startAutoplay() { autoplayInterval = setInterval(() => move(1), 5000); }
  function stopAutoplay() { clearInterval(autoplayInterval); }

  wrapper.addEventListener('mouseenter', stopAutoplay);
  wrapper.addEventListener('mouseleave', startAutoplay);

  // Touch swipe
  let touchStartX = 0;
  wrapper.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    stopAutoplay();
  });
  wrapper.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) move(diff > 0 ? 1 : -1);
    startAutoplay();
  });

function enableMouseSelection() {
  const items = carousel.querySelectorAll('.carousel-item');

  items.forEach(item => {
    item.addEventListener('click', () => {
      if (isTransitioning) return;

      // 🔥 HARD RESET — fixes the zoom bug
      allItems.forEach(i => {
        i.classList.remove('active', 'prev', 'next');
        i.style.transform = ''; // reset scale for unseen items
      });

      // Activate clicked item
      item.classList.add('active');

      // Neighbors
      if (item.previousElementSibling)
        item.previousElementSibling.classList.add('prev');

      if (item.nextElementSibling)
        item.nextElementSibling.classList.add('next');

      centerActive(true);
    });
  });
}


  // Resize → re-center
  new ResizeObserver(() => {
    centerActive(false);
  }).observe(wrapper);

  startAutoplay();
}
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
  // APPOINTMENT CALENDAR + BOOKING
  // ────────────────────────────────────────
  const appointmentWrapper = document.querySelector('.appointment-wrapper');
  const calendarBtn = document.querySelector('.calendar-btn');
  const miniCalendar = document.getElementById('mini-calendar');
  const timeSlots = document.getElementById('time-slots');
  const bookBtn = document.getElementById('book-appointment');
  const monthYear = document.querySelector('.month-year');
  const prevMonth = document.querySelector('.prev-month');
  const nextMonth = document.querySelector('.next-month');

  let selectedDate = null;
  let selectedTime = null;
  let currentMonth = new Date();
  currentMonth.setHours(0, 0, 0, 0);

  const timeOptions = ["09:00","09:30","10:00","10:30","11:00","14:00","14:30","15:00","15:30","16:00"];

  // Example booked slots (replace with real data later)
  const booked = [
    { date: "2026-01-27", time: "09:00" },
    { date: "2026-01-28", time: "14:00" }
  ];

  function generateCalendar() {
    if (!miniCalendar) return;
    miniCalendar.innerHTML = '';
    const today = new Date(); today.setHours(0,0,0,0);
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth();

    monthYear.textContent = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

    const firstWeekday = new Date(y, m, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(y, m + 1, 0).getDate();

    // Shift for Monday start (adjust if your week starts Sunday)
    const emptyCells = (firstWeekday === 0 ? 6 : firstWeekday - 1);
    for (let i = 0; i < emptyCells; i++) {
      miniCalendar.appendChild(Object.assign(document.createElement('div'), { className: 'day disabled' }));
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(y, m, d);
      const dayEl = document.createElement('div');
      dayEl.className = 'day';
      dayEl.textContent = d;

      if (date.getDay() === 0 || date.getDay() === 6 || date < today) {
        dayEl.classList.add('disabled');
      } else {
        dayEl.addEventListener('click', () => {
          miniCalendar.querySelectorAll('.day').forEach(d => d.classList.remove('selected'));
          dayEl.classList.add('selected');
          selectedDate = date.toISOString().split('T')[0];

          timeSlots.innerHTML = '';
          timeOptions.forEach(t => {
            const btn = document.createElement('button');
            btn.textContent = t;

            const isBooked = booked.some(b => b.date === selectedDate && b.time === t);
            if (isBooked) {
              btn.classList.add('booked');
              btn.disabled = true;
            }

            btn.addEventListener('click', () => {
              timeSlots.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
              btn.classList.add('selected');
              selectedTime = t;
            });
            timeSlots.appendChild(btn);
          });
        });
      }
      miniCalendar.appendChild(dayEl);
    }
  }

  calendarBtn?.addEventListener('click', () => appointmentWrapper.classList.toggle('active'));

  prevMonth?.addEventListener('click', () => {
    currentMonth.setMonth(currentMonth.getMonth() - 1);
    generateCalendar();
  });

  nextMonth?.addEventListener('click', () => {
    currentMonth.setMonth(currentMonth.getMonth() + 1);
    generateCalendar();
  });

  bookBtn?.addEventListener('click', () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select both date and time.");
      return;
    }
    const subject = encodeURIComponent("Appointment Request – Afrigrade");
    const body = encodeURIComponent(`Hello,\n\nI'd like to book an appointment on ${selectedDate} at ${selectedTime}.\n\nBest regards.`);
    window.location.href = `mailto:info@afrigradecentre.com?subject=${subject}&body=${body}`;

    // Reset UI
    appointmentWrapper.classList.remove('active');
    selectedDate = selectedTime = null;
    miniCalendar?.querySelectorAll('.day').forEach(d => d.classList.remove('selected'));
    timeSlots.innerHTML = '';
  });

  // Initial render
  generateCalendar();

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