/* ============================================
   NOBLE SYSTEM CONTROL — SCRIPT.JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- LUCIDE ICONS ---------- */
  lucide.createIcons();

  /* ---------- STICKY NAVBAR ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- HAMBURGER MENU ---------- */
  const hamburger = document.getElementById('hamburgerBtn');
  const mainNav = document.getElementById('mainNav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mainNav.classList.toggle('open');
    document.body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : '';
  });

  // Close nav when a link is clicked (mobile)
  mainNav.querySelectorAll('a:not(.dropdown-toggle)').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mainNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ---------- DROPDOWN TOGGLE (CLICK-BASED) ---------- */
  const dropdownParent = document.querySelector('.navbar__dropdown');
  const dropdownToggle = dropdownParent.querySelector('.dropdown-toggle');

  dropdownToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropdownParent.classList.toggle('open');
  });

  // Close dropdown when clicking anywhere outside
  document.addEventListener('click', (e) => {
    if (!dropdownParent.contains(e.target)) {
      dropdownParent.classList.remove('open');
    }
  });

  /* ---------- SCROLL REVEAL ---------- */
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger the animation slightly
        setTimeout(() => {
          entry.target.classList.add('active');
        }, index * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  /* ---------- COUNTER ANIMATION ---------- */
  const counters = document.querySelectorAll('.stat-item__number[data-target]');
  let countersDone = false;

  const animateCounters = () => {
    if (countersDone) return;
    countersDone = true;

    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 2000; // ms
      const start = performance.now();

      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(target * eased);

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          counter.textContent = target;
        }
      };
      requestAnimationFrame(tick);
    });
  };

  const statsSection = document.getElementById('stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        statsObserver.disconnect();
      }
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  }

  /* ---------- CONTACT FORM ---------- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('#name').value.trim();
      const email = form.querySelector('#email').value.trim();
      const phone = form.querySelector('#phone').value.trim();
      const message = form.querySelector('#message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      // Construct WhatsApp message
      const phoneNumber = "918042162345";
      const whatsappText = `*New Contact Form Submission*\n\n*Name:* ${name}\n*Email:* ${email}\n*Phone:* ${phone || 'N/A'}\n*Message:* ${message}`;
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappText)}`;

      // Update button state
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = '✓ Message Sent!';
      btn.style.background = '#22c55e';
      btn.disabled = true;

      // Open WhatsApp immediately (Avoids popup blocker)
      window.open(whatsappUrl, '_blank');

      // Show specific success message
      showToast('Your message has been sent successfully. Our team will contact you shortly.', 'success');

      form.reset();

      // Reset button after 3 seconds
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    });
  }

  /* ---------- TOAST NOTIFICATION ---------- */
  function showToast(msg, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed; bottom: 30px; right: 30px; z-index: 9999;
      padding: 16px 24px; border-radius: 12px;
      font-family: 'DM Sans', sans-serif; font-size: 0.92rem;
      color: #fff; backdrop-filter: blur(16px);
      background: ${type === 'error' ? 'rgba(239,68,68,0.9)' : 'rgba(26,107,255,0.9)'};
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      transform: translateY(20px); opacity: 0;
      transition: all 0.35s ease;
    `;
    toast.textContent = msg;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });

    setTimeout(() => {
      toast.style.transform = 'translateY(20px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  /* ---------- HERO IMAGE SLIDESHOW ---------- */
  const slides = document.querySelectorAll('.hero__slide');
  if (slides.length > 1) {
    let currentSlide = 0;
    setInterval(() => {
      slides[currentSlide].classList.remove('hero__slide--active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('hero__slide--active');
    }, 5000);
  }

  /* ---------- SMOOTH ANCHOR SCROLLING (FALLBACK) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
