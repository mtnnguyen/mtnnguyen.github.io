(() => {
  const canvas = document.getElementById("towerCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return; // The SVG underneath remains visible without Canvas support.

  const frame = canvas.closest(".tower-frame");
  const hint = document.querySelector(".tower-hint");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const coarsePointer = matchMedia("(pointer: coarse)");
  const IMG_SRC = "./assets/img/headshot.png";
  const SETTINGS = {
    scale: 0.92,
    alphaThreshold: 40,
    rowGapDesktop: 3,
    rowGapMobile: 3,
    scatter: 210,
    maxDist: 65,
    repelStrength: 1.6,
    settlePullMin: 0.012,
    settlePullMax: 0.045,
    friction: 0.84,
    fadeSeconds: 1.2,
    moveSeconds: 2.2,
    maxDevicePixelRatio: 2,
  };

  // Matches the original vector file. This also keeps file:// previews working
  // when a browser does not allow reading a locally loaded image's pixels.
  const FALLBACK_SHAPES = [
    { color: "#a2b69a", path: "M178 16H182L184 104H176Z" },
    { color: "#a2b69a", path: "M175 104H185L188 197H172Z" },
    {
      color: "#a2b69a",
      path: "M171 196H189L194 254L203 421Q212 526 241 608H205L181 466L155 608H119Q150 516 157 419L166 254Z",
    },
    {
      color: "#6f896c",
      path: "M170 122Q180 115 190 122L194 131L187 137H173L166 131Z",
    },
    { color: "#6f896c", path: "M160 202H200L217 216H143Z" },
    {
      color: "#6f896c",
      path: "M133 215Q180 200 227 215L237 227L229 240Q180 259 131 240L123 227Z",
    },
    { color: "#6f896c", path: "M142 244H218L203 260H157Z" },
    {
      color: "#d0d9c6",
      path: "M130 222Q180 208 230 222L230 226Q180 215 130 226Z",
    },
    {
      color: "#d0d9c6",
      path: "M139 232Q180 242 221 232L217 238Q180 249 143 238Z",
    },
    { color: "#d0d9c6", path: "M171 265H179L178 443L155 587H148L166 419Z" },
    { color: "#d0d9c6", path: "M183 265H188L196 423L221 594H214L188 440Z" },
    { color: "#879e7d", path: "M172 260H188V594H172Z" },
    { color: "#6f896c", path: "M111 608H249L256 616H104Z" },
  ];
  const mouse = { x: -1000, y: -1000, active: false };
  let image = null;
  let particles = [];
  let width = 0;
  let height = 0;
  let dpr = 1;
  let frameId = null;
  let resizeId = null;
  let startTime = 0;
  let lastTime = 0;
  let visible = true;
  let initialized = false;
  let sourceReady = false;
  let accent = "#2d543f";

  function drawFallbackMask(offCtx, w, h) {
    const scale = Math.min(w / 360, h / 640) * SETTINGS.scale;
    offCtx.save();
    offCtx.translate((w - 360 * scale) / 2, (h - 640 * scale) / 2);
    offCtx.scale(scale, scale);
    for (const shape of FALLBACK_SHAPES) {
      offCtx.fillStyle = shape.color;
      offCtx.fill(new Path2D(shape.path));
    }
    offCtx.restore();
  }

  function buildParticles(animate) {
    let off = document.createElement("canvas");
    off.width = width;
    off.height = height;
    let offCtx = off.getContext("2d", { willReadFrequently: true });
    if (!offCtx) return [];
    let pixels;
    try {
      if (!image) throw new Error("Use bundled vector geometry");
      const scale =
        Math.min(width / image.naturalWidth, height / image.naturalHeight) *
        SETTINGS.scale;
      const w = image.naturalWidth * scale,
        h = image.naturalHeight * scale;
      offCtx.drawImage(image, (width - w) / 2, (height - h) / 2, w, h);
      pixels = offCtx.getImageData(0, 0, width, height).data;
      canvas.dataset.particleSource = "png";
    } catch {
      // Keep the static headshot visible if pixel sampling is unavailable.
      canvas.dataset.particleSource = "image-fallback";
      frame.classList.remove("tower-ready");
      return [];
    }

    const rowGap =
      innerWidth <= 600 ? SETTINGS.rowGapMobile : SETTINGS.rowGapDesktop;
    const out = [];
    for (let y = 0; y < height; y += rowGap) {
      let x = 0;
      while (x < width) {
        const i = (y * width + x) * 4;
        if (pixels[i + 3] <= SETTINGS.alphaThreshold) {
          x += 2;
          continue;
        }
        const brightness =
          (pixels[i] + pixels[i + 1] + pixels[i + 2]) / (3 * 255);
        const length = 2
        const scatter = animate ? SETTINGS.scatter : 0;
        out.push({
          x: x + (Math.random() - 0.5) * scatter,
          y: y + (Math.random() - 0.5) * scatter,
          targetX: x,
          targetY: y,
          vx: 0,
          vy: 0,
          length,
          color: `rgb(${pixels[i]}, ${pixels[i + 1]}, ${pixels[i + 2]})`,
          alpha: pixels[i + 3] / 255,
          delay: animate ? Math.random() * 0.25 : 0,
        });
        x += length + 2;
      }
    }
    return out;
  }

  const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  function stop() {
    if (frameId !== null) cancelAnimationFrame(frameId);
    frameId = null;
    lastTime = 0;
  }
  function schedule() {
    if (!particles.length || !visible || document.hidden || frameId !== null)
      return;
    frameId = requestAnimationFrame(drawFrame);
  }
  function snapToTargets() {
    for (const p of particles) {
      p.x = p.targetX;
      p.y = p.targetY;
      p.vx = 0;
      p.vy = 0;
    }
  }
  function drawFrame(now) {
    frameId = null;
    if (!visible || document.hidden) return;
    const reduced = reducedMotion.matches;
    const elapsed = (now - startTime) / 1000;
    // Keep the spring response similar on 60 Hz and high-refresh displays.
    const dt = lastTime ? Math.min((now - lastTime) / 16.667, 2) : 1;
    lastTime = now;
    let moving = false;
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2
    ctx.lineCap = "round";
    for (const p of particles) {
      const age = elapsed - p.delay;
      if (!reduced && age < 0) {
        moving = true;
        continue;
      }
      const fade = reduced
        ? 1
        : easeOutQuad(Math.max(0, Math.min(age / SETTINGS.fadeSeconds, 1)));
      if (reduced) {
        p.x = p.targetX;
        p.y = p.targetY;
        p.vx = 0;
        p.vy = 0;
      } else {
        const progress = easeOutCubic(
          Math.max(0, Math.min(age / SETTINGS.moveSeconds, 1)),
        );
        if (mouse.active) {
          const dx = p.x - mouse.x,
            dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < SETTINGS.maxDist && dist > 0.01) {
            const force =
              (1 - dist / SETTINGS.maxDist) * SETTINGS.repelStrength;
            p.vx += (dx / dist) * force * dt;
            p.vy += (dy / dist) * force * dt;
          }
        }
        const pull = SETTINGS.settlePullMin + progress * SETTINGS.settlePullMax;
        p.vx += (p.targetX - p.x) * pull * dt;
        p.vy += (p.targetY - p.y) * pull * dt;
        const friction = Math.pow(SETTINGS.friction, dt);
        p.vx *= friction;
        p.vy *= friction;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const unsettled =
          Math.abs(p.targetX - p.x) +
            Math.abs(p.targetY - p.y) +
            Math.abs(p.vx) +
            Math.abs(p.vy) >
          0.1;
        if (unsettled || fade < 1) moving = true;
        else {
          p.x = p.targetX;
          p.y = p.targetY;
          p.vx = 0;
          p.vy = 0;
        }
      }
      ctx.globalAlpha = p.alpha * fade;
      ctx.strokeStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.length, p.y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    frame.classList.add("tower-ready");
    canvas.dataset.particleState = reduced
      ? "reduced-motion"
      : moving
        ? "animating"
        : "settled";
    // Stop drawing when settled, including when the pointer is outside the tower.
    if (!reduced && moving) schedule();
    else lastTime = 0;
  }

  function resize(force = false) {
    if (!sourceReady) return;
    const rect = canvas.getBoundingClientRect();
    const w = Math.floor(rect.width),
      h = Math.floor(rect.height);
    const nextDpr = Math.min(
      SETTINGS.maxDevicePixelRatio,
      Math.max(1, devicePixelRatio || 1),
    );
    if (
      w < 1 ||
      h < 1 ||
      (!force && w === width && h === height && dpr === nextDpr)
    )
      return;
    stop();
    width = w;
    height = h;
    dpr = nextDpr;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    accent =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim() || "#2d543f";
    const animate = !initialized && !reducedMotion.matches;
    particles = buildParticles(animate);
    canvas.dataset.particleCount = String(particles.length);
    startTime = performance.now() - (animate ? 0 : 10000);
    mouse.active = false;
    initialized = true;
    if (hint)
      hint.textContent = reducedMotion.matches
        ? ""
        : coarsePointer.matches
          ? ""
          : "MOVE YOUR CURSOR TO EXPLORE";
    schedule();
  }

  function movePointer(event) {
    if (reducedMotion.matches) return;
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
    mouse.active = true;
    schedule();
  }
  function releasePointer() {
    mouse.active = false;
    schedule();
  }
  canvas.addEventListener("pointermove", movePointer, { passive: true });
  canvas.addEventListener("pointerdown", movePointer, { passive: true });
  canvas.addEventListener("pointerleave", releasePointer);
  canvas.addEventListener("pointercancel", releasePointer);
  canvas.addEventListener("pointerup", (e) => {
    if (e.pointerType !== "mouse") releasePointer();
  });

  new ResizeObserver(() => {
    if (resizeId !== null) cancelAnimationFrame(resizeId);
    resizeId = requestAnimationFrame(() => {
      resizeId = null;
      resize();
    });
  }).observe(frame);
  addEventListener("resize", () => resize());
  new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      if (visible) schedule();
      else {
        stop();
        mouse.active = false;
        canvas.dataset.particleState = "paused";
      }
    },
    { threshold: 0 },
  ).observe(canvas);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stop();
      mouse.active = false;
      canvas.dataset.particleState = "paused";
    } else schedule();
  });
  reducedMotion.addEventListener("change", () => {
    stop();
    mouse.active = false;
    snapToTargets();
    resize(true);
  });
  coarsePointer.addEventListener("change", () => resize(true));

  // Load once. Resize reuses the image, avoiding stale loads and duplicate loops.
  const img = new Image();
  img.onload = () => {
    sourceReady = true;
    image = img;
    resize(true);
  };
  img.onerror = () => {
    sourceReady = true;
    resize(true);
  };
  img.src = IMG_SRC;
})();
