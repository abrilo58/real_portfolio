/**
 * Portfolio interactions: theme toggle, typing effect, scroll reveal,
 * project filter, navbar behaviour and the contact form.
 */

const root = document.documentElement;
const CONTACT_EMAIL = "abriloman58@gmail.com";

/** Toggle between dark and light themes and remember the choice. */
function initTheme() {
  document.getElementById("themeToggle").addEventListener("click", () => {
    const next = root.dataset.bsTheme === "dark" ? "light" : "dark";
    root.dataset.bsTheme = next;
    localStorage.setItem("theme", next);
  });
}

/** Type and delete each role from the data-roles list in a loop. */
function initTyping() {
  const el = document.getElementById("typed");
  const roles = el.dataset.roles.split("|");
  let roleIndex = 0;
  let charIndex = roles[0].length;
  let deleting = true;

  const tick = () => {
    const role = roles[roleIndex];
    charIndex += deleting ? -1 : 1;
    el.textContent = role.slice(0, charIndex);

    let delay = deleting ? 45 : 90;
    if (!deleting && charIndex === role.length) {
      deleting = true;
      delay = 1800;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }
    setTimeout(tick, delay);
  };

  setTimeout(tick, 2000);
}

/** Count a number up from zero to its data-count value. */
function animateCounter(el) {
  const target = Number(el.dataset.count);
  const duration = 1600;
  const start = performance.now();

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

/** Reveal elements as they scroll into view and start any counters inside. */
function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        entry.target.querySelectorAll(".counter").forEach(animateCounter);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

/** Show only the project cards matching the selected filter button. */
function initProjectFilter() {
  const buttons = document.querySelectorAll(".filter-btn");
  const items = document.querySelectorAll(".project-item");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      buttons.forEach((b) => {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-pressed", b === btn);
      });
      items.forEach((item) => {
        const categories = item.dataset.category.split(" ");
        item.classList.toggle("d-none", filter !== "all" && !categories.includes(filter));
      });
    });
  });
}

/** Solid navbar and back-to-top button on scroll; close the mobile menu on link click. */
function initNavbar() {
  const nav = document.getElementById("mainNav");
  const backToTop = document.getElementById("backToTop");
  const menu = document.getElementById("navLinks");

  const onScroll = () => {
    nav.classList.toggle("scrolled", scrollY > 40);
    backToTop.classList.toggle("show", scrollY > 600);
  };
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });

  menu.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => bootstrap.Collapse.getInstance(menu)?.hide());
  });
}

/** Build a mailto: link pre-filled with the visitor's message. */
function buildMailto(name, email, subject, message) {
  const body = `${message}\n\n${name}\n${email}`;
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Validate the contact form, then open the visitor's email app with the message. */
function initContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const value = (id) => document.getElementById(id).value.trim();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.classList.add("was-validated");
    if (!form.checkValidity()) return;

    window.location.href = buildMailto(value("name"), value("email"), value("subject"), value("message"));
    status.textContent = "Thanks! Your email app should open with your message ready to send.";
  });
}

initTheme();
initTyping();
initReveal();
initProjectFilter();
initNavbar();
initContactForm();
document.getElementById("year").textContent = new Date().getFullYear();
