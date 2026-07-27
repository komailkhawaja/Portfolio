/* ============================================================
   Muhammad Komail Khawaja — Portfolio
   Motion stack (all CDN, no build step):
     - Lenis      : buttery smooth scroll
     - anime.js   : staggers, tweens, springs, micro-interactions
     - vanilla rAF: scroll-linked parallax, 3D card tilt loops
   All effects respect prefers-reduced-motion.
   ============================================================ */

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const anime = window.anime; // alias

/* ---------- 1. Lenis — smooth scroll ---------- */
let lenis = null;
if (window.Lenis && !prefersReducedMotion) {
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
    smoothWheel: true,
    smoothTouch: false,
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

/* ---------- 2. Mobile nav + scroll-state (unchanged) ---------- */
const header = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const onScroll = () => {
  if (window.scrollY > 8) header.classList.add("is-scrolled");
  else header.classList.remove("is-scrolled");
};
document.addEventListener("scroll", onScroll, { passive: true });
onScroll();
navToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    if (header.classList.contains("is-open")) {
      header.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
    }
  });
});
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- 3. Anchor links through Lenis ---------- */
if (lenis) {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: -76 });
        }
      }
    });
  });
}

/* ---------- 4. Contact form (unchanged) ---------- */
const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  status.className = "form-status";
  status.textContent = "";
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  if (!name || !email) {
    status.classList.add("is-err");
    status.textContent = "Please add your name and an email so I can reply.";
    return;
  }
  const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!okEmail) {
    status.classList.add("is-err");
    status.textContent = "That email looks off — mind double-checking it?";
    return;
  }
  const subject = encodeURIComponent(`Hello from ${name}`);
  const body = encodeURIComponent(
    `${message || "Hi komailkhawaja,"}\n\n— ${name}\n${email}`
  );
  window.location.href = `mailto:komailkhawaja611@gmail.com?subject=${subject}&body=${body}`;
  status.classList.add("is-ok");
  status.textContent = `Thanks, ${name.split(" ")[0]} — your mail app should be opening now.`;
  form.reset();
});

/* ============================================================
   5. ANIMATIONS
   ============================================================ */

/* ---------- 5a. Hero: staggered word reveal (anime.js) ---------- */
(function heroReveal() {
  const title = document.querySelector(".hero-title");
  if (!title) return;

  // Split into words while preserving the <em> wrapper.
  const html = title.innerHTML;
  title.innerHTML = html.replace(
    /(<em>[\s\S]*?<\/em>)|([^\s<]+)|(<br\s*\/?>)/g,
    (m, em, word) => {
      if (em) return em.replace(/^<em>([\s\S]*)<\/em>$/, '<span class="word"><em>$1</em></span>');
      if (word) return `<span class="word">${word}</span>`;
      return m; // <br>
    }
  );

  if (prefersReducedMotion || !anime) return;

  anime({
    targets: ".hero .word",
    opacity: [0, 1],
    translateY: [22, 0],
    duration: 900,
    delay: anime.stagger(55),
    easing: "cubicBezier(.22,1,.36,1)",
  });

  anime({
    targets: ".hero .eyebrow, .hero .hero-sub, .hero .hero-cta, .hero .hero-meta",
    opacity: [0, 1],
    translateY: [14, 0],
    duration: 700,
    delay: anime.stagger(80, { start: 450 }),
    easing: "cubicBezier(.22,1,.36,1)",
  });
})();

/* ---------- 5b. Scroll-linked parallax (vanilla rAF) ---------- */
(function scrollParallax() {
  if (prefersReducedMotion) return;
  if (!lenis) return; // only animate when Lenis is driving scroll

  // Each item: { el, ranges }
  // range: { from: 'start start'/'start end'/etc., to: '...', props: {prop:[start,end]} }
  // We resolve them manually using element offsets.
  const items = [];

  function add(el, rangeStart, rangeEnd, props) {
    if (!el) return;
    items.push({ el, rangeStart, rangeEnd, props });
  }

  // Hero: title drifts up + fades, blob drifts up + scales
  const heroEl = document.querySelector(".hero");
  const heroTitle = document.querySelector(".hero-title");
  const heroBlob = document.querySelector(".hero-blob");
  if (heroEl && heroTitle) {
    add(heroTitle, heroEl, heroEl, {
      y: [0, -60],
      opacity: [1, 0.3],
    });
  }
  if (heroEl && heroBlob) {
    add(heroBlob, heroEl, heroEl, {
      y: [0, -120],
      scale: [1, 1.15],
    });
  }

  // Section heads: subtle parallax
  document.querySelectorAll(".section-head").forEach((el) => {
    add(el, el, el, { y: [40, -20], opacity: [0.2, 1] });
  });

  // About grid columns
  document.querySelectorAll(".about-grid > *").forEach((el, i) => {
    add(el, el, el, { opacity: [0, 1], x: [i === 0 ? -40 : 40, 0] });
  });

  // CTA title
  const ctaTitle = document.querySelector(".cta-title");
  if (ctaTitle) {
    add(ctaTitle, ctaTitle, ctaTitle, {
      letterSpacing: ["-0.06em", "-0.02em"],
      opacity: [0, 1],
      y: [40, 0],
    });
  }

  // Resolve a viewport-relative progress for one element.
  // 'start end' = when top of element hits bottom of viewport
  // 'end start' = when bottom of element hits top of viewport
  function progressFor(rect, from, to) {
    const vh = window.innerHeight;
    const top = rect.top + window.scrollY;
    const bottom = top + rect.height;
    const fromY = from === "start end" ? vh
                : from === "start 0.9" ? vh * 0.9
                : from === "start 0.85" ? vh * 0.85
                : from === "start 0.5"  ? vh * 0.5
                : top;                                  // 'start start'
    const toY =   to === "end start" ? -rect.height
                : to === "start 0.4" ? vh * 0.4
                : to === "start 0.3" ? vh * 0.3
                : to === "start 0.6" ? vh * 0.6
                : -rect.height;                        // 'end start' default
    // We use the current scrollY to find the element's "current" anchor (its top).
    const cur = window.scrollY;
    const start = fromY;
    const end = toY;
    const t = (cur - start) / (end - start);
    return Math.max(0, Math.min(1, t));
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function tick() {
    items.forEach((it) => {
      const rect = it.el.getBoundingClientRect();
      // For section heads we want the parallax through the whole scroll of the element.
      // For hero we want title to fade as we leave the hero.
      let p;
      if (it.el === heroTitle || it.el === heroBlob) {
        // 0 at top, 1 as we scroll past the hero
        p = Math.min(1, Math.max(0, window.scrollY / (heroEl.offsetHeight * 0.9)));
      } else {
        p = progressFor(rect, "start 0.85", "start 0.3");
        // Looping: section heads need to also drift past — use element-relative progress
        if (it.props && "y" in it.props && Array.isArray(it.props.y)) {
          // For .section-head and .cta-title, animate across element's viewport transit
          const top = rect.top + window.scrollY;
          const vh = window.innerHeight;
          const enter = top - vh;
          const leave = top + rect.height * 0.5;
          const t = (window.scrollY - enter) / Math.max(1, (leave - enter));
          p = Math.max(0, Math.min(1, t));
        }
      }
      const transforms = [];
      const styleMap = {};
      for (const k of Object.keys(it.props)) {
        const [a, b] = it.props[k];
        const v = lerp(a, b, p);
        if (k === "y") transforms.push(`translateY(${v}px)`);
        else if (k === "x") transforms.push(`translateX(${v}px)`);
        else if (k === "scale") transforms.push(`scale(${v})`);
        else if (k === "opacity") styleMap.opacity = v;
        else if (k === "letterSpacing") styleMap.letterSpacing = v;
      }
      it.el.style.transform = transforms.join(" ");
      for (const [k, v] of Object.entries(styleMap)) {
        it.el.style[k] = v;
      }
    });
    requestAnimationFrame(tick);
  }
  // Lenis will already be driving rAF; piggyback on a single shared loop
  if (!prefersReducedMotion) requestAnimationFrame(tick);
})();

/* ---------- 5c. Staggered card reveal (anime.js + IntersectionObserver) ---------- */
(function staggerReveal()

  // Timeline markers: spring in
  const markers = document.querySelectorAll(".timeline-marker");
  if (markers.length) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          anime({
            targets: entry.target,
            scale: [0, 1],
            opacity: [0, 1],
            duration: 600,
            easing: "spring(1, 80, 10, 0)", // mass, stiffness, damping, velocity
          });
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );
    markers.forEach((m) => {
      m.style.opacity = "0";
      io.observe(m);
    });
  }
})();

/* ---------- 5d. 3D tilt on cards (vanilla rAF) ---------- */
(function cardTilt() {
  if (prefersReducedMotion) return;
  const cards = document.querySelectorAll(
    ".work-card, .skill-group, .edu-card, .extras-card, .timeline-content"
  );
  const MAX = 6; // degrees

  cards.forEach((card) => {
    let frame = 0;
    let rect = null;
    const target = { rx: 0, ry: 0, gx: 50, gy: 50, s: 1 };
    const current = { rx: 0, ry: 0, gx: 50, gy: 50, s: 1 };

    function refreshRect() { rect = card.getBoundingClientRect(); }

    function onMove(e) {
      if (!rect) refreshRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = (x / rect.width - 0.5) * 2;
      const py = (y / rect.height - 0.5) * 2;
      target.ry = px * MAX;
      target.rx = -py * MAX;
      target.gx = (x / rect.width) * 100;
      target.gy = (y / rect.height) * 100;
      target.s = 1.015;
      if (!frame) frame = requestAnimationFrame(tick);
    }
    function onLeave() {
      target.ry = 0; target.rx = 0; target.s = 1;
      target.gx = 50; target.gy = 50;
      if (!frame) frame = requestAnimationFrame(tick);
      rect = null;
    }
    function tick() {
      frame = 0;
      current.ry += (target.ry - current.ry) * 0.18;
      current.rx += (target.rx - current.rx) * 0.18;
      current.gx += (target.gx - current.gx) * 0.18;
      current.gy += (target.gy - current.gy) * 0.18;
      current.s  += (target.s  - current.s)  * 0.18;
      card.style.transform =
        `perspective(900px) rotateX(${current.rx.toFixed(2)}deg) rotateY(${current.ry.toFixed(2)}deg) scale3d(${current.s.toFixed(3)},${current.s.toFixed(3)},1)`;
      card.style.setProperty("--mx", current.gx.toFixed(1) + "%");
      card.style.setProperty("--my", current.gy.toFixed(1) + "%");
      if (
        Math.abs(target.ry - current.ry) > 0.05 ||
        Math.abs(target.rx - current.rx) > 0.05 ||
        Math.abs(target.s  - current.s)  > 0.001
      ) {
        frame = requestAnimationFrame(tick);
      } else {
        if (target.ry === 0 && target.rx === 0 && target.s === 1) {
          card.style.transform = "";
        }
      }
    }
    card.addEventListener("mouseenter", refreshRect);
    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
  });
})();

/* ---------- 5e. Micro-interactions (anime.js) ---------- */
(function microInteractions() {
  if (prefersReducedMotion || !anime) return;

  // Buttons: scale 1.03 on hover, back to 1 on leave
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      anime.remove(btn);
      anime({
        targets: btn,
        scale: 1.03,
        duration: 350,
        easing: "spring(1, 400, 18, 0)",
      });
    });
    btn.addEventListener("mouseleave", () => {
      anime.remove(btn);
      anime({
        targets: btn,
        scale: 1,
        duration: 350,
        easing: "spring(1, 400, 22, 0)",
      });
    });
  });

  // Nav links lift
  document.querySelectorAll(".nav-links a").forEach((a) => {
    a.addEventListener("mouseenter", () => {
      anime.remove(a);
      anime({ targets: a, translateY: -2, duration: 400, easing: "spring(1, 500, 18, 0)" });
    });
    a.addEventListener("mouseleave", () => {
      anime.remove(a);
      anime({ targets: a, translateY: 0, duration: 400, easing: "spring(1, 500, 18, 0)" });
    });
  });

  // Link arrow slide
  document.querySelectorAll(".link-arrow").forEach((a) => {
    const span = a.querySelector("span");
    if (!span) return;
    a.addEventListener("mouseenter", () => {
      anime.remove(span);
      anime({ targets: span, translateX: 4, duration: 400, easing: "spring(1, 500, 18, 0)" });
    });
    a.addEventListener("mouseleave", () => {
      anime.remove(span);
      anime({ targets: span, translateX: 0, duration: 400, easing: "spring(1, 500, 18, 0)" });
    });
  });

  // Form field focus glow
  document.querySelectorAll(".field input, .field textarea").forEach((input) => {
    input.addEventListener("focus", () => {
      anime.remove(input);
      anime({ targets: input, scale: 1.01, duration: 350, easing: "spring(1, 400, 18, 0)" });
    });
    input.addEventListener("blur", () => {
      anime.remove(input);
      anime({ targets: input, scale: 1, duration: 350, easing: "spring(1, 400, 22, 0)" });
    });
  });

  // Magnetic icon links
  document.querySelectorAll(".icon-link").forEach((icon) => {
    icon.addEventListener("mousemove", (e) => {
      const r = icon.getBoundingClientRect();
      const tx = (e.clientX - r.left - r.width / 2) * 0.35;
      const ty = (e.clientY - r.top - r.height / 2) * 0.35;
      anime.remove(icon);
      anime({ targets: icon, translateX: tx, translateY: ty, duration: 400, easing: "spring(1, 350, 18, 0)" });
    });
    icon.addEventListener("mouseleave", () => {
      anime.remove(icon);
      anime({ targets: icon, translateX: 0, translateY: 0, duration: 400, easing: "spring(1, 350, 22, 0)" });
    });
  });
})();
