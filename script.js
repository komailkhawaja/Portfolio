/* ============================================================
   Muhammad Komail Khawaja — Portfolio
   Optimized version - Lightweight, no external dependencies
   ============================================================ */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- 1. SCROLL PROGRESS RING ---------- */
(function() {
  const ring = document.getElementById('scrollRing');
  const progress = document.getElementById('scrollRingProgress');
  const percent = document.getElementById('scrollPercent');
  if (!ring || !progress || !percent) return;
  
  const circumference = 157.08;
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY / total;
        const offset = circumference - (scrolled * circumference);
        progress.style.strokeDashoffset = offset;
        percent.textContent = Math.round(scrolled * 100) + '%';
        
        ring.classList.toggle('visible', window.scrollY > 300);
        
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  
  ring.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ---------- 2. CURSOR GLOW ---------- */
(function() {
  const glow = document.getElementById('cursorGlow');
  if (!glow || window.matchMedia('(pointer: coarse)').matches) return;
  
  let mouseX = -1000, mouseY = -1000;
  let currentX = -1000, currentY = -1000;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;
    glow.style.transform = `translate(${currentX}px, ${currentY}px)`;
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
})();

/* ---------- 3. HEADER SCROLL ---------- */
var header = document.getElementById('siteHeader');
var navToggle = document.getElementById('navToggle');
var lastScroll = 0;

function onScroll() {
  const currentScroll = window.scrollY;
  header.classList.toggle('is-scrolled', currentScroll > 8);
  
  if (currentScroll > 100) {
    if (currentScroll > lastScroll) {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }
  } else {
    header.classList.remove('hidden');
  }
  lastScroll = currentScroll;
}
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- 4. MOBILE NAV ---------- */
navToggle.addEventListener('click', function() {
  var isOpen = header.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

document.querySelectorAll('.nav-links a').forEach(function(link) {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const transition = document.getElementById('pageTransition');
        transition.classList.add('active');
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setTimeout(() => {
            transition.classList.remove('active');
          }, 400);
        }, 300);
      }
    }
    header.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  });
});

/* ---------- 5. ACTIVE NAV ---------- */
(function() {
  var sections = document.querySelectorAll('section[id]');
  var links = document.querySelectorAll('.nav-links a');
  if (!sections.length || !links.length) return;
  let ticking = false;
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(() => {
        var current = '';
        sections.forEach(function(sec) {
          if (sec.getBoundingClientRect().top <= 140) current = sec.id;
        });
        links.forEach(function(a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ---------- 6. FOOTER YEAR ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- 7. MAGNETIC BUTTONS ---------- */
(function() {
  if (prefersReducedMotion) return;
  
  document.querySelectorAll('[data-magnetic]').forEach(function(btn) {
    btn.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const strength = 8;
      this.style.transform = `translate(${x / strength}px, ${y / strength}px) scale(1.02)`;
    });
    btn.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });
})();

/* ---------- 8. 3D CARD TILT ---------- */
(function() {
  if (prefersReducedMotion) return;
  
  document.querySelectorAll('.work-card').forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotateX = y * 6;
      const rotateY = x * 6;
      this.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });
})();

/* ---------- 9. COUNTER ANIMATION ---------- */
(function() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * target);
          el.textContent = current;
          
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = target;
          }
        }
        requestAnimationFrame(updateCounter);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(function(c) { observer.observe(c); });
})();

/* ---------- 10. CONTACT FORM ---------- */
(function() {
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  if (!form || !status) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    status.className = 'form-status';
    status.textContent = '';
    
    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var message = form.message.value.trim();
    
    if (!name || !email) {
      status.classList.add('is-err');
      status.textContent = 'Please add your name and an email so I can reply.';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.classList.add('is-err');
      status.textContent = 'That email looks off — mind double-checking it?';
      return;
    }
    
    var subject = encodeURIComponent('Hello from ' + name);
    var body = encodeURIComponent((message || 'Hi komailkhawaja,') + '\n\n— ' + name + '\n' + email);
    window.location.href = 'mailto:komailkhawaja611@gmail.com?subject=' + subject + '&body=' + body;
    
    status.classList.add('is-ok');
    status.textContent = 'Thanks, ' + name.split(' ')[0] + ' — your mail app should be opening now.';
    form.reset();
  });
})();

/* ---------- 11. INTERSECTION OBSERVER ---------- */
(function() {
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

  document.querySelectorAll('.reveal-up, .reveal-section, .reveal-card').forEach(function(el) {
    if (!el.closest('.hero')) {
      observer.observe(el);
    }
  });
})();

console.log('🚀 Portfolio loaded with all enhancements!');
console.log('✨ Features: 3D Tilt | Magnetic Buttons | Page Transitions | Glassmorphism | Scroll Ring | Counters');
