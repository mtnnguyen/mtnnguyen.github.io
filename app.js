/*
 * Martin Nguyen — portfolio interactions
 * No libraries, API keys, build step, or backend are required.
 *
 * EDIT CONTENT: find `const experiences` and `const projects` below.
 * EDIT PAGE TEXT: open index.html.
 * EDIT COLORS / LAYOUT: open style.css.
 *
 * $ selects one HTML element; $$ selects a list of HTML elements.
 * These helpers are local shortcuts, not jQuery.
 */

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [
  ...scope.querySelectorAll(selector),
];
const svgNS = "http://www.w3.org/2000/svg";

// Fixed, synthetic locations for the concept preview. Not player or team data.
const shots = [
  [171, 55, 1],
  [186, 68, 1],
  [160, 75, 0],
  [195, 87, 1],
  [182, 98, 1],
  [156, 100, 0],
  [206, 60, 0],
  [167, 120, 1],
  [212, 131, 0],
  [112, 92, 1],
  [99, 121, 0],
  [250, 98, 1],
  [247, 146, 0],
  [65, 58, 1],
  [54, 94, 0],
  [72, 152, 1],
  [96, 184, 0],
  [139, 196, 1],
  [190, 201, 0],
  [229, 188, 1],
  [290, 151, 0],
  [304, 92, 1],
  [310, 54, 0],
  [142, 61, 1],
  [205, 108, 0],
  [177, 81, 1],
  [187, 58, 1],
  [163, 90, 0],
  [118, 147, 1],
  [274, 64, 0],
].map(([x, y, made], index) => ({ x, y, made: !!made, index }));
function addShots(target, filter = "all") {
  target.replaceChildren();
  const selected = shots.filter(
    (s) => filter === "all" || (filter === "made" ? s.made : !s.made),
  );
  selected.forEach((s) => {
    const c = document.createElementNS(svgNS, "circle");
    Object.entries({
      cx: s.x,
      cy: s.y,
      r: s.made ? 3.7 : 3.2,
      fill: s.made ? "#345c42" : "none",
      stroke: s.made ? "#345c42" : "#9cae8f",
      "stroke-width": 1.2,
    }).forEach(([k, v]) => c.setAttribute(k, v));
    target.append(c);
  });
  return selected.length;
}

// EXPERIENCE CONTENT — edit the text inside these entries. Keep the keys stable.
const experiences = {
  utfr: {
    date: "FEB 2026 – PRESENT",
    role: "Deep Learning Perception Analyst",
    org: "University of Toronto Formula Racing · Driverless",
    description:
      "Preparing and reviewing annotated image data for the team’s driverless cone-detection workflow.",
    tags: ["Roboflow", "Image annotation", "Computer vision"],
    sections: [
      [
        "IMAGE ANNOTATION",
        "Annotated 60+ images in Roboflow by drawing bounding boxes around track cones, supporting dataset preparation.",
      ],
      [
        "CONE CLASSIFICATION",
        "Labelled 50+ cones across three categories, providing object location and class annotations for cone-detection model development.",
      ],
      [
        "ANNOTATION REVIEW",
        "Reviewed 50+ annotated images and corrected bounding-box and classification errors to improve label consistency.",
      ],
    ],
  },

  caf: {
    date: "JUN 2025 – PRESENT",
    role: "Signal Operator",
    org: "32 Signal Regiment · Canadian Armed Forces Reserve",
    description:
      "Supported reliable team communications through radio and data-system operation, equipment setup, and troubleshooting.",
    tags: ["Communications", "Technical troubleshooting", "Teamwork"],
    sections: [
      [
        "SYSTEM OPERATION",
        "Operated and troubleshot 20+ radio and data systems in time-sensitive environments.",
      ],
      [
        "COMMUNICATIONS SETUP",
        "Helped establish field communications setups using multiple equipment categories, including radios, antennas, and power equipment.",
      ],
      [
        "TROUBLESHOOTING",
        "Diagnosed and resolved communication issues involving frequencies, equipment configuration, and connectivity.",
      ],
    ],
  },

  surveilone: {
    date: "JUL 2025 – OCT 2025",
    role: "Mobile Developer Intern",
    org: "Surveil.One · Remote",
    description:
      "Built mobile interfaces and connected application data for an AI-powered monitoring dashboard.",
    tags: ["Flutter", "Dart", "GraphQL"],
    sections: [
      [
        "MOBILE INTERFACE DEVELOPMENT",
        "Developed 20+ Flutter screens for an AI-powered monitoring dashboard, translating product requirements into functional mobile interfaces.",
      ],
      [
        "API INTEGRATION",
        "Integrated GraphQL APIs into the Flutter application to exchange data between the mobile client and backend.",
      ],
    ],
  },
};
function selectExperience(key, focus = false) {
  const e = experiences[key];
  $$(".experience-tabs [role=tab]").forEach((t) => {
    const active = t.dataset.experience === key;
    t.setAttribute("aria-selected", active);
    t.tabIndex = active ? 0 : -1;
    if (active && focus) t.focus();
  });
  const panel = $("#experience-panel");
  panel.setAttribute("aria-labelledby", "tab-" + key);
  panel.innerHTML = `
    <p class="experience-date mono">${e.date}</p>
    <h4>${e.role}</h4>
    <p class="experience-org">${e.org}</p>

    <p class="experience-description">
      ${e.description}
    </p>

    <button
      type="button"
      class="inline-project"
      data-open="${key}"
      aria-haspopup="dialog"
    >
      Explore the contribution ↗
    </button>
  `;
}
selectExperience("utfr");
$$(".experience-tabs [role=tab]").forEach((t, i, all) => {
  t.addEventListener("click", () => selectExperience(t.dataset.experience));
  t.addEventListener("keydown", (e) => {
    let index;
    if (e.key === "ArrowRight" || e.key === "ArrowDown")
      index = (i + 1) % all.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
      index = (i - 1 + all.length) % all.length;
    else if (e.key === "Home") index = 0;
    else if (e.key === "End") index = all.length - 1;
    else return;
    e.preventDefault();
    selectExperience(all[index].dataset.experience, true);
  });
});

// PROJECT CONTENT — powers the featured carousel and project dialogs.
// Keep matching cards and art templates in index.html when adding a new key.
const projects = {
  nba: {
    index: "01",
    category: "SPORTS ANALYTICS / PERSONAL PROJECT",
    title: "NBA Space Explorer",
    summary:
      "An interactive spatial analytics project exploring basketball through shot quality, spacing, and player styles.",
    tags: ["React", "Vite", "Data visualization"],
    sections: [
      [
        "THE QUESTION",
        "How can a spatial view of the court make basketball patterns easier to explore? NBA Space Explorer brings my interest in sports together with the way I think about geography and statistics.",
      ],
      [
        "THE PROJECT",
        "A React and Vite application focused on interactive exploration of NBA shot quality, spacing, and player styles. The court provides a shared visual frame for asking questions about the game.",
      ],
      [
        "WHY IT BELONGS HERE",
        "It connects my interests in sports analytics, spatial data, and interface development. It is the direction I want to keep building toward as a data science student.",
      ],
    ],
    note: "Personal project · Sports and spatial analytics",
    demo: "court",
  },
  northstar: {
    index: "02",
    category: "GEOSPATIAL / PERSONAL PROJECT",
    title: "NorthStar",
    summary:
      "A map-based safety application built with React and Mapbox, bringing geographic context into an interactive interface.",
    tags: ["React", "Mapbox", "Spatial interfaces"],
    sections: [
      [
        "THE QUESTION",
        "How can location and context become easier to understand through a map? NorthStar explores a safety-focused use case for an interactive spatial interface.",
      ],
      [
        "THE PROJECT",
        "A React application using Mapbox for its mapping experience. The project connects application development with my interest in geography and how people understand a place.",
      ],
      [
        "WHY IT BELONGS HERE",
        "It demonstrates the intersection of software and geospatial work in my portfolio. Its focus on location and context is a foundation I can build on through my geospatial studies.",
      ],
    ],
    note: "Personal project · Geographic context",
    demo: "map",
  },
  utfr: {
    index: "03",
    category: "COMPUTER VISION / TEAM CONTRIBUTION",
    title: "UTFR Deep Learning Perception",
    summary:
      "Contributing cone annotations to the driverless perception workflow at University of Toronto Formula Racing.",
    tags: ["Roboflow", "Bounding boxes", "Image annotation"],
    sections: [
      [
        "THE CONTEXT",
        "A driverless race car needs to interpret its surroundings. Cone detection is one part of that perception problem, and annotated images help define the objects the system needs to recognize.",
      ],
      [
        "MY CONTRIBUTION",
        "I drew bounding boxes and labelled cones in Roboflow. My contribution was image annotation for the Deep Learning Perception team.",
      ],
      [
        "WHAT I TAKE FROM IT",
        "Working on labels connects individual examples to the larger computer vision workflow. My role has given me a practical view of the data preparation that supports a perception system.",
      ],
    ],
    note: "Team contribution · Joined February 2026",
    demo: "cones",
  },
};

// Reuse the existing dialog for every experience.
Object.entries(experiences).forEach(([key, experience]) => {
  projects[key] = {
    ...projects[key],
    index: "EXPERIENCE",
    category: experience.org,
    title: experience.role,
    summary: experience.description,
    tags: experience.tags,
    sections: experience.sections,
    note: experience.date,
  };
});

// Concept demos use synthetic data and original diagrams.
function makeDemo(type) {
  if (type === "court")
    return `<div class="demo"><div class="demo-label mono"><span>CONCEPT PREVIEW</span><span>SHOT EXPLORER</span></div><svg viewBox="0 0 360 232" role="img" aria-label="Interactive court displaying synthetic shot positions"><g fill="none" stroke="#a9bba9" stroke-width="1.3"><path d="M24 212V20H336V212ZM130 20V126H230V20M149 20V126H211V20"/><circle cx="180" cy="126" r="32"/><path d="M45 20V67C45 234 315 234 315 67V20M161 42H199"/><circle cx="180" cy="48" r="7"/></g><g id="demo-shots"></g></svg><div class="mini-legend"><span><i></i>Made</span><span><i></i>Missed</span></div><div class="demo-controls" role="group" aria-label="Filter illustrative shots"><button data-shot="all" aria-pressed="true">All shots</button><button data-shot="made" aria-pressed="false">Made</button><button data-shot="missed" aria-pressed="false">Missed</button></div><p class="demo-result" id="shot-result" aria-live="polite">30 illustrative shots shown</p><p class="demo-disclaimer">Synthetic sample created for this portfolio preview. Not real NBA data or a screenshot of the original project.</p></div>`;
  if (type === "map")
    return `<div class="demo"><div class="demo-label mono"><span>CONCEPT PREVIEW</span><span>SPATIAL LAYERS</span></div><svg viewBox="0 0 360 245" role="img" aria-label="Illustrative city map with toggleable context and path layers"><rect width="360" height="245" fill="#edf0e7"/><path d="M263 0L283 59L251 112L268 175L244 245H360V0Z" fill="#cedfe3"/><g fill="#d7dfd1"><path d="M20 20H76V65H20ZM93 20H134V65H93ZM151 20H226V65H151ZM20 82H76V127H20ZM93 82H134V127H93ZM151 82H226V127H151ZM20 144H76V189H20ZM93 144H134V189H93ZM151 144H226V189H151ZM20 206H76V245H20ZM93 206H134V245H93ZM151 206H226V245H151Z"/></g><g class="demo-context" fill="#6f9170"><circle cx="52" cy="110" r="7"/><circle cx="177" cy="41" r="7"/><circle cx="180" cy="169" r="7"/><circle cx="110" cy="225" r="7"/></g><g class="map-route"><path d="M47 196H85V73H189" fill="none" stroke="#3d6368" stroke-width="3"/><circle cx="47" cy="196" r="6" fill="#edf0e7" stroke="#3d6368" stroke-width="2"/><circle cx="189" cy="73" r="6" fill="#3d6368"/></g></svg><div class="demo-controls" role="group" aria-label="Toggle illustrative map layers"><button data-layer="demo-context" aria-pressed="true">Context points</button><button data-layer="map-route" aria-pressed="true">Example path</button></div><p class="demo-result" id="map-result" aria-live="polite">2 illustrative layers visible</p><p class="demo-disclaimer">Illustrative map and path, created for this portfolio. Not live location data, a safety assessment, or navigation guidance.</p></div>`;
  const source = $("#art-utfr").content.querySelector(".cone-art").innerHTML;
  return `<div class="demo"><div class="demo-label mono"><span>CONCEPT PREVIEW</span><span>ANNOTATION LAYER</span></div><svg viewBox="0 0 360 232" role="img" aria-label="Illustrative cones with bounding boxes">${source.split('<g fill="none" stroke="#536a47"')[0]}<g class="annotation-labels"><g fill="none" stroke="#536a47" stroke-width="1.3"><path d="M68 120H111V179H68ZM249 120H291V179H249ZM123 84H153V127H123ZM207 84H237V127H207Z"/></g><g fill="#536a47"><rect x="68" y="107" width="55" height="13"/><rect x="249" y="107" width="50" height="13"/></g><g fill="#fff" font-family="monospace" font-size="7"><text x="71" y="116">YELLOW CONE</text><text x="252" y="116">BLUE CONE</text></g></g></svg><div class="demo-controls"><button data-annotations aria-pressed="true">Bounding boxes on</button></div><p class="demo-result" id="annotation-result" aria-live="polite">Annotation layer visible</p><p class="demo-disclaimer">Original schematic created for this portfolio. It illustrates bounding boxes and is not UTFR training imagery or model output.</p></div>`;
}
const dialog = $("#project-dialog");
let opener = null;
function setProjectURL(key) {
  // A double-click preview uses file://. Shareable links are enabled on HTTP(S).
  if (location.protocol === "file:") return;
  const u = new URL(location.href);
  if (key) u.searchParams.set("project", key);
  else u.searchParams.delete("project");
  history.replaceState(null, "", u);
}
function openProject(key) {
  const p = projects[key];
  if (!p) return;
  opener = document.activeElement;
  $("#dialog-kicker").textContent = `${p.index} / ${p.category}`;
  $("#dialog-body").innerHTML =
    `<div class="dialog-inner"><h2 id="dialog-title">${p.title}</h2><p class="dialog-summary">${p.summary}</p><div class="tags">${p.tags.map((t) => `<span>${t}</span>`).join("")}</div><div class="detail-grid ${p.demo ? "" : "detail-grid--text"}"><div class="detail-copy">${p.sections.map(([h, t]) => `<h3>${h}</h3><p>${t}</p>`).join("")}</div>${p.demo ? makeDemo(p.demo) : ""}</div><div class="detail-bottom"><span>${p.note}</span><a href="mailto:martin.nguyxn@gmail.com?subject=${encodeURIComponent("Let’s talk about " + p.title)}">Ask me about it ↗</a></div></div>`;
  if (p.demo === "court") addShots($("#demo-shots"));
  document.body.classList.add("modal-open");
  dialog.showModal();
  dialog.scrollTop = 0;
  $(".close-button").focus();
  setProjectURL(key);
}
document.addEventListener("click", (e) => {
  const open = e.target.closest("[data-open], [data-featured-open]");
  if (open) {
    openProject(open.dataset.open || open.dataset.featuredOpen);
    return;
  }
  const experience = e.target.closest("[data-select-experience]");
  if (experience) selectExperience(experience.dataset.selectExperience);
  const shot = e.target.closest("[data-shot]");
  if (shot) {
    $$("[data-shot]").forEach((b) =>
      b.setAttribute("aria-pressed", b === shot),
    );
    const n = addShots($("#demo-shots"), shot.dataset.shot);
    $("#shot-result").textContent =
      `${n} illustrative ${shot.dataset.shot === "all" ? "shots" : shot.dataset.shot + " shots"} shown`;
  }
  const layer = e.target.closest("[data-layer]");
  if (layer) {
    const on = layer.getAttribute("aria-pressed") !== "true";
    layer.setAttribute("aria-pressed", on);
    $("." + layer.dataset.layer, dialog).toggleAttribute("hidden", !on);
    const n = $$("[data-layer][aria-pressed=true]").length;
    $("#map-result").textContent =
      `${n} illustrative ${n === 1 ? "layer" : "layers"} visible`;
  }
  const annotations = e.target.closest("[data-annotations]");
  if (annotations) {
    const on = annotations.getAttribute("aria-pressed") !== "true";
    annotations.setAttribute("aria-pressed", on);
    annotations.textContent = `Bounding boxes ${on ? "on" : "off"}`;
    $(".annotation-labels", dialog).toggleAttribute("hidden", !on);
    $("#annotation-result").textContent =
      `Annotation layer ${on ? "visible" : "hidden"}`;
  }
});
$(".close-button").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      dialog.close();
  }
});
dialog.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  setProjectURL(null);
  if (opener && opener.isConnected) opener.focus({ preventScroll: true });
});
const initial = new URLSearchParams(location.search).get("project");
if (projects[initial]) openProject(initial);

// Mobile navigation and orientation-aware experience tabs.
const menu = $(".menu-toggle"),
  nav = $("#main-nav"),
  mobileQuery = matchMedia("(max-width:600px)");
function closeMenu(restoreFocus = false) {
  menu.setAttribute("aria-expanded", "false");
  menu.setAttribute("aria-label", "Open navigation");
  nav.classList.remove("is-open");
  if (restoreFocus) menu.focus();
}
menu.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", open);
  menu.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation",
  );
  nav.classList.toggle("is-open", open);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menu.getAttribute("aria-expanded") === "true")
    closeMenu(true);
});
function updateTabOrientation() {
  $(".experience-tabs").setAttribute(
    "aria-orientation",
    mobileQuery.matches ? "horizontal" : "vertical",
  );
  if (!mobileQuery.matches) closeMenu();
}
mobileQuery.addEventListener("change", updateTabOrientation);
updateTabOrientation();
// One shared anchor handler: sticky-header offset, focus, and usable URL hashes.
const header = $(".site-header");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let headerOffset = 95;
function updateHeaderOffset() {
  headerOffset = Math.ceil(header.getBoundingClientRect().height) + 20;
  document.documentElement.style.setProperty(
    "--anchor-offset",
    `${headerOffset}px`,
  );
}
new ResizeObserver(updateHeaderOffset).observe(header);
updateHeaderOffset();
function anchorTarget(href) {
  if (!href || href === "#" || !href.startsWith("#")) return null;
  try {
    return document.getElementById(decodeURIComponent(href.slice(1)));
  } catch {
    return null;
  }
}
document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (
    !link ||
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    link.hasAttribute("download") ||
    (link.target && link.target !== "_self")
  )
    return;
  const href = link.getAttribute("href");
  const target = anchorTarget(href);
  if (!target) return;
  event.preventDefault();
  closeMenu();
  updateHeaderOffset();
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
  if (location.protocol !== "file:" && location.hash !== href) {
    history.pushState(null, "", href);
  }
  window.scrollTo({
    top: Math.max(
      0,
      target.getBoundingClientRect().top + scrollY - headerOffset,
    ),
    behavior: reducedMotion.matches ? "instant" : "smooth",
  });
});

// Keep the CSS focus-visible fallback and provide an explicit keyboard mode.
document.addEventListener("keydown", (event) => {
  if (event.key === "Tab") document.body.classList.add("keyboard-nav");
});
document.addEventListener(
  "pointerdown",
  () => document.body.classList.remove("keyboard-nav"),
  { passive: true },
);

// Experience is a div and Contact is a footer, so use actual nav destinations.
const navTargets = $$("a", nav)
  .map((link) => ({
    link,
    target: anchorTarget(link.getAttribute("href")),
  }))
  .filter((item) => item.target);
let scrollPending = false;
function updateActiveNav() {
  let active = navTargets[0];
  const trigger = headerOffset + 8;
  navTargets.forEach((item) => {
    if (item.target.getBoundingClientRect().top <= trigger) active = item;
  });
  if (scrollY + innerHeight >= document.documentElement.scrollHeight - 8)
    active = navTargets.at(-1);
  navTargets.forEach((item) => {
    item.link.classList.toggle("active", item === active);
    if (item === active) item.link.setAttribute("aria-current", "location");
    else item.link.removeAttribute("aria-current");
  });
  scrollPending = false;
}
addEventListener(
  "scroll",
  () => {
    if (!scrollPending) {
      scrollPending = true;
      requestAnimationFrame(updateActiveNav);
    }
  },
  { passive: true },
);
addEventListener("resize", updateActiveNav);
addEventListener("hashchange", updateActiveNav);
updateActiveNav();
