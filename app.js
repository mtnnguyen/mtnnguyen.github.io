/*
 * Martin Nguyen — page behaviour. No libraries or build step.
 *
 * 1. The course line runs from the top of the page to the finish line.
 * 2. As you scroll, the line paints itself down to the reading position.
 * 3. The nav marks the section currently in view.
 * 4. Side Quests lists recent films from assets/data/letterboxd.json.
 * 5. The player card tilts toward the pointer and catches the light.
 * 6. First visit per session: a quick pack-opening intro that reveals the card.
 *
 * EDIT CONTENT in index.html. EDIT COLORS AND LAYOUT in style.css.
 */
(() => {
  const course = document.querySelector(".course");
  const line = document.querySelector(".course-line");
  const finish = document.querySelector(".finish-line");
  if (!course || !line) return;

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let lineTop = 0;
  let lineLen = 0;
  const dots = [...course.querySelectorAll(".split, .quest")];
  let dotYs = [];

  // Stop the line where the finish line crosses it.
  function measure() {
    const courseTop = course.getBoundingClientRect().top + scrollY;
    lineTop = courseTop;
    lineLen = finish
      ? finish.getBoundingClientRect().top + scrollY - courseTop
      : course.offsetHeight;
    line.style.setProperty("--line-len", `${Math.max(lineLen, 0)}px`);
    // Each dot is the row's ::before; its centre is its top plus half its height.
    dotYs = dots.map((d) => {
      const dot = getComputedStyle(d, "::before");
      const centre = parseFloat(dot.top) + parseFloat(dot.height) / 2 || 44;
      return d.getBoundingClientRect().top + scrollY - courseTop + centre;
    });
    paint();
  }

  // The painted part reaches 60% down the viewport, so the line leads the reader.
  function paint() {
    if (reducedMotion.matches || !lineLen) {
      course.classList.remove("is-painting");
      line.style.setProperty("--paint", "1");
      return;
    }
    course.classList.add("is-painting");
    // At the bottom of the page the line always reaches the finish.
    const atEnd = scrollY + innerHeight >= document.documentElement.scrollHeight - 4;
    const reach = atEnd ? lineLen : scrollY + innerHeight * 0.6 - lineTop;
    const progress = Math.min(Math.max(reach / lineLen, 0), 1);
    line.style.setProperty("--paint", progress.toFixed(4));
    // A dot fills once the paint has reached it.
    dots.forEach((d, i) => d.classList.toggle("is-reached", reach >= dotYs[i]));
  }

  let queued = false;
  function onScroll() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      paint();
    });
  }

  measure();
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", measure);
  addEventListener("load", measure);
  reducedMotion.addEventListener("change", paint);
  if ("ResizeObserver" in window) new ResizeObserver(measure).observe(course);

  // Mark the nav link for the section in view.
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
        const on = current && a.getAttribute("href") === `#${current.id}`;
        if (on) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-35% 0px -55% 0px" },
  );
  sections.forEach((s) => observer.observe(s));
})();

// Recent films, synced from Letterboxd by .github/workflows/letterboxd.yml.
(() => {
  const list = document.querySelector("[data-films]");
  if (!list) return;

  // Letterboxd ratings are 0.5–5 in half steps; draw them the way Letterboxd does.
  const stars = (r) => (r ? "★".repeat(Math.floor(r)) + (r % 1 ? "½" : "") : "");

  fetch("./assets/data/letterboxd.json", { cache: "no-cache" })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
    .then((data) => {
      const films = (data.films || []).slice(0, 4);
      if (!films.length) return;
      films.forEach((f) => {
        const li = document.createElement("li");
        li.className = "film";
        const a = document.createElement("a");
        a.href = f.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        if (f.poster) {
          const img = document.createElement("img");
          img.src = f.poster;
          img.alt = `${f.title} poster`;
          img.loading = "lazy";
          img.width = 230;
          img.height = 345;
          a.append(img);
        }
        const h = document.createElement("h4");
        h.textContent = f.title;
        if (f.year) {
          const y = document.createElement("span");
          y.textContent = ` ${f.year}`;
          h.append(y);
        }
        a.append(h);
        li.append(a);
        if (f.rating) {
          const r = document.createElement("p");
          r.className = "film-rating";
          r.textContent = stars(f.rating);
          r.setAttribute("aria-label", `${f.rating} out of 5`);
          li.append(r);
        }
        if (f.review) {
          const p = document.createElement("p");
          p.className = "film-review";
          p.textContent = f.review;
          li.append(p);
        }
        list.append(li);
      });
    })
    .catch(() => {});
})();

// Player card shine: tilt toward the pointer, move the glare and foil with it.
(() => {
  const card = document.querySelector(".pc");
  const glare = document.getElementById("pc-glare");
  if (!card || !glare) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const MAX_TILT = 9; // degrees

  function move(e) {
    const r = card.getBoundingClientRect();
    const x = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
    const y = Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1);
    card.classList.add("is-tilting");
    // The glare sits where the pointer is, in the card's 300 × 420 drawing space.
    glare.setAttribute("cx", (x * 300).toFixed(1));
    glare.setAttribute("cy", (y * 420).toFixed(1));
    card.style.setProperty("--foil-x", `${((x - 0.5) * 160).toFixed(1)}px`);
    card.style.setProperty("--foil-y", `${((y - 0.5) * 160).toFixed(1)}px`);
    if (!reduced.matches) {
      card.style.setProperty("--ry", `${((x - 0.5) * 2 * MAX_TILT).toFixed(2)}deg`);
      card.style.setProperty("--rx", `${((0.5 - y) * 2 * MAX_TILT).toFixed(2)}deg`);
    }
  }
  function leave() {
    card.classList.remove("is-tilting");
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  }
  card.addEventListener("pointermove", move);
  card.addEventListener("pointerleave", leave);
  card.addEventListener("pointercancel", leave);
})();

// Pack-opening intro. theme.js adds .pack-pending when it should play.
(() => {
  const root = document.documentElement;
  if (!root.classList.contains("pack-pending")) return;
  const card = document.querySelector(".pc");
  if (!card) { root.classList.remove("pack-pending"); return; }

  const pack = document.createElement("div");
  pack.className = "pack";
  pack.setAttribute("role", "dialog");
  pack.setAttribute("aria-label", "Opening pack. Press any key to skip.");
  pack.innerHTML = `
    <div class="pack-burst" aria-hidden="true"></div>
    <div class="pack-stage" aria-hidden="true">
      <div class="pack-flip">
        <div class="pack-back">
          <svg viewBox="0 0 300 420">
            <defs><linearGradient id="pack-back-fill" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#2a3d8f"/><stop offset="1" stop-color="#0d1a4d"/></linearGradient></defs>
            <path d="M34 18C74 18 98 10 116 2Q150-4 184 2C202 10 226 18 266 18L300 44V356Q300 378 278 386L162 417Q150 421 138 417L22 386Q0 378 0 356V44Z" fill="url(#pack-back-fill)" stroke="rgba(255,255,255,.7)" stroke-width="4"/>
            <path d="M40 30C78 30 102 22 119 14Q150 9 181 14C198 22 222 30 260 30L288 50V352Q288 368 272 374L160 404Q150 407 140 404L28 374Q12 368 12 352V50Z" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="1.2"/>
            <rect x="110" y="170" width="80" height="80" rx="12" fill="#1f4fd1"/>
            <path transform="translate(110 170) scale(1.25)" d="M13 51V13h10l9 17 9-17h10v38h-9V30l-7 13h-6l-7-13v21Z" fill="#fff"/>
          </svg>
        </div>
        <div class="pack-front"></div>
      </div>
    </div>
    <p class="pack-caption" aria-live="polite">Opening pack…</p>
    <button type="button" class="pack-skip">Skip</button>`;

  // The front is a copy of the real card, minus ids so nothing is duplicated.
  const front = card.cloneNode(true);
  front.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
  pack.querySelector(".pack-front").append(front);
  document.body.append(pack);

  const caption = pack.querySelector(".pack-caption");
  const timers = [];
  let finished = false;
  function finish() {
    if (finished) return;
    finished = true;
    timers.forEach(clearTimeout);
    try { sessionStorage.setItem("pack-opened", "1"); } catch {}
    // Fade the overlay out first, then bring the page in, so the two never overlap.
    pack.classList.add("is-done");
    setTimeout(() => {
      pack.remove();
      root.classList.remove("pack-pending");
    }, 360);
    removeEventListener("keydown", finish);
  }

  requestAnimationFrame(() => pack.classList.add("is-playing"));
  timers.push(setTimeout(() => { caption.innerHTML = "<b>Martin Nguyen</b> · 87 CAM"; }, 1050));
  timers.push(setTimeout(finish, 2000));
  pack.addEventListener("click", finish);
  addEventListener("keydown", finish);
})();

