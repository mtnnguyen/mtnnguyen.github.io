// nav highlight + card tilt
(() => {
  const links = [...document.querySelectorAll('.masthead nav a[href^="#"]')];
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  if (!("IntersectionObserver" in window) || !sections.length) return;

  const visible = new Map();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => visible.set(e.target, e.isIntersecting));
      const current = sections.find((s) => visible.get(s));
      links.forEach((a) => {
        if (current && a.getAttribute("href") === `#${current.id}`) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-35% 0px -55% 0px" },
  );
  sections.forEach((s) => observer.observe(s));
})();

(() => {
  const card = document.querySelector(".pc");
  const glare = document.getElementById("pc-glare");
  if (!card || !glare) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const MAX_TILT = 4;

  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    const x = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
    const y = Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1);
    card.classList.add("is-tilting");
    glare.setAttribute("cx", (x * 300).toFixed(1));
    glare.setAttribute("cy", (y * 420).toFixed(1));
    if (!reduced.matches) {
      card.style.setProperty("--ry", `${((x - 0.5) * 2 * MAX_TILT).toFixed(2)}deg`);
      card.style.setProperty("--rx", `${((0.5 - y) * 2 * MAX_TILT).toFixed(2)}deg`);
    }
  });
  const leave = () => {
    card.classList.remove("is-tilting");
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  };
  card.addEventListener("pointerleave", leave);
  card.addEventListener("pointercancel", leave);
})();
