/* ============================================================
   Lesson interactions
   ============================================================ */

(function heroPixels() {
  const canvas = document.getElementById("pixelHero");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const TEAL = "#1ebcba",
    CORAL = "#f08081",
    LIGHT = "#b6e1df";
  let cell = 18,
    cols = 0,
    rows = 0,
    grid = [];

  function size() {
    const r = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = r.width * dpr;
    canvas.height = r.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(r.width / cell);
    rows = Math.ceil(r.height / cell);
    grid = new Array(cols * rows).fill(0);
  }
  const idx = (x, y) => y * cols + x;

  // light up a cluster of pixels: an alpha blob, a beta squiggle, or a muon streak
  function spawn() {
    const kind = Math.random();
    if (kind < 0.34) {
      // alpha: small dense blob, coral
      const cx = (Math.random() * cols) | 0,
        cy = (Math.random() * rows) | 0;
      for (let dx = -1; dx <= 1; dx++)
        for (let dy = -1; dy <= 1; dy++) paint(cx + dx, cy + dy, CORAL, 1);
    } else if (kind < 0.7) {
      // beta: short wiggly line, teal
      let x = (Math.random() * cols) | 0,
        y = (Math.random() * rows) | 0;
      for (let i = 0; i < 7; i++) {
        paint(x, y, TEAL, 0.9);
        x += Math.random() < 0.5 ? 1 : -1;
        y += Math.random() < 0.5 ? 1 : 0;
      }
    } else {
      // muon: long straight streak, light teal
      let x = (Math.random() * cols) | 0,
        y = (Math.random() * rows) | 0;
      const len = 10 + ((Math.random() * 14) | 0);
      const dx = Math.random() < 0.5 ? 1 : -1;
      for (let i = 0; i < len; i++)
        paint(x + i * dx, y + ((i * 0.3) | 0), LIGHT, 0.8);
    }
  }
  function paint(x, y, color, life) {
    if (x < 0 || y < 0 || x >= cols || y >= rows) return;
    grid[idx(x, y)] = { color, life };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const c = grid[idx(x, y)];
        // faint base grid dot
        ctx.fillStyle = "rgba(255,255,255,0.035)";
        ctx.fillRect(x * cell + cell / 2 - 1, y * cell + cell / 2 - 1, 2, 2);
        if (c) {
          ctx.globalAlpha = Math.max(0, c.life);
          ctx.fillStyle = c.color;
          ctx.fillRect(x * cell + 2, y * cell + 2, cell - 4, cell - 4);
          ctx.globalAlpha = 1;
          c.life -= 0.018;
          if (c.life <= 0) grid[idx(x, y)] = 0;
        }
      }
    }
  }

  size();
  window.addEventListener("resize", size);

  if (reduce) {
    // static: scatter a few marks once, no animation
    for (let i = 0; i < 14; i++) spawn();
    draw();
    return;
  }
  let frame = 0;
  (function loop() {
    if (frame % 26 === 0) spawn();
    draw();
    frame++;
    requestAnimationFrame(loop);
  })();
})();

/* ---------- flip cards ---------- */
document.querySelectorAll(".flip").forEach((card) => {
  card.addEventListener("click", () => {
    const open = card.getAttribute("aria-pressed") === "true";
    card.setAttribute("aria-pressed", String(!open));
  });
});

/* ---------- Pixet hotspots ---------- */
(function hotspots() {
  const dots = document.querySelectorAll(".hotspot__dot");
  const panel = document.getElementById("hotspotPanel");
  if (!dots.length || !panel) return;
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      dots.forEach((d) => d.setAttribute("aria-current", "false"));
      dot.setAttribute("aria-current", "true");
      panel.innerHTML =
        "<h4>" + dot.dataset.title + "</h4><p>" + dot.dataset.body + "</p>";
    });
  });
})();

/* ---------- misconceptions reveal ---------- */
document.querySelectorAll(".misc-item").forEach((item) => {
  item.addEventListener("click", () => {
    const open = item.getAttribute("aria-expanded") === "true";
    item.setAttribute("aria-expanded", String(!open));
  });
});

/* ---------- sticky nav: active state on scroll ---------- */
(function navScroll() {
  const links = document.querySelectorAll('.topnav__link[href^="#"]');
  const sections = Array.from(links)
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove("is-active"));
          const active = document.querySelector(
            '.topnav__link[href="#' + entry.target.id + '"]',
          );
          if (active) active.classList.add("is-active");
        }
      });
    },
    { rootMargin: "-20% 0px -70% 0px" },
  );

  sections.forEach((s) => io.observe(s));
})();

/* ---------- penetration diagram ---------- */
(function penDiagram() {
  const svg = document.getElementById("penSVG");
  const card = document.getElementById("penCard");
  if (!svg || !card) return;

  const rays = svg.querySelectorAll(".pen-ray");
  const barriers = svg.querySelectorAll(".pen-barrier");

  const INFO = {
    alpha: {
      title: "Alpha",
      body: "A heavy helium nucleus. It deposits so much energy in such a short distance that a single sheet of paper stops it completely. It never reaches the aluminium.",
    },
    beta: {
      title: "Beta",
      body: "A fast electron. It passes through paper but a few millimetres of aluminium scatter and absorb it. It never reaches the lead.",
    },
    gamma: {
      title: "Gamma",
      body: "A high-energy electromagnetic wave with no mass. It sails through paper and aluminium but thick lead finally absorbs most of it.",
    },
    muon: {
      title: "Muon",
      body: "A heavy cosmic particle from space. It barely interacts with matter at all. It passes straight through paper, aluminium, lead, and concrete, and keeps going underground.",
    },
  };

  function showCard(title, body) {
    card.innerHTML =
      '<p class="pen-card__title">' +
      title +
      '</p><p class="pen-card__body">' +
      body +
      "</p>";
  }
  function resetCard() {
    card.innerHTML =
      '<p class="pen-card__hint">Hover a particle or click a barrier.</p>';
  }

  // make child elements transparent to pointer so only the <g> fires
  rays.forEach((ray) => {
    ray.querySelectorAll("line, polygon, text, path").forEach((el) => {
      el.style.pointerEvents = "none";
    });
  });

  let activeRay = null;

  rays.forEach((ray) => {
    ray.addEventListener("mouseover", (e) => {
      if (activeRay === ray) return;
      activeRay = ray;
      rays.forEach((r) => {
        r.classList.add("dimmed");
        r.classList.remove("highlighted");
      });
      ray.classList.remove("dimmed");
      ray.classList.add("highlighted");
      const p = ray.dataset.particle;
      showCard(INFO[p].title, INFO[p].body);
    });
    ray.addEventListener("mouseout", (e) => {
      // only reset when leaving the <g> entirely, not moving between children
      if (ray.contains(e.relatedTarget)) return;
      activeRay = null;
      rays.forEach((r) => {
        r.classList.remove("dimmed");
        r.classList.remove("highlighted");
      });
      resetCard();
    });
    ray.addEventListener("click", () => {
      const p = ray.dataset.particle;
      showCard(INFO[p].title, INFO[p].body);
    });
  });

  // click barriers
  barriers.forEach((barrier) => {
    barrier.addEventListener("click", () => {
      showCard(barrier.dataset.title, barrier.dataset.body);
      // briefly highlight the barrier
      barrier.setAttribute("fill", "rgba(30,188,186,0.13)");
      setTimeout(() => barrier.setAttribute("fill", "transparent"), 600);
    });
  });
})();

/* ---------- penetration diagram ---------- */
(function penCanvas() {
  const canvas = document.getElementById("penCanvas");
  if (!canvas) return;
  const panel = document.getElementById("pen3dInfo");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const W = 820,
    H = 240;
  const LABEL_W = 100,
    TRACK_X = 120,
    TRACK_END = 790,
    TRACK_W = TRACK_END - TRACK_X;
  const ROW_Y = [60, 105, 150, 195];

  const BARRIERS = [
    {
      id: "paper",
      x: TRACK_X + TRACK_W * 0.22,
      w: 10,
      depth: 14,
      label: "Paper",
      fc: "#d0d0d0",
      sc: "#aaa",
      tc: "#bbb",
    },
    {
      id: "aluminium",
      x: TRACK_X + TRACK_W * 0.44,
      w: 16,
      depth: 20,
      label: "Aluminium",
      fc: "#b0c0b0",
      sc: "#7a8e7a",
      tc: "#a0b0a0",
    },
    {
      id: "lead",
      x: TRACK_X + TRACK_W * 0.65,
      w: 26,
      depth: 30,
      label: "Lead",
      fc: "#484848",
      sc: "#282828",
      tc: "#383838",
    },
    {
      id: "concrete",
      x: TRACK_X + TRACK_W * 0.86,
      w: 38,
      depth: 40,
      label: "Concrete",
      fc: "#c0b8b0",
      sc: "#908880",
      tc: "#b0a8a0",
    },
  ];

  const PARTICLES = [
    {
      id: "alpha",
      label: "\u03b1  Alpha",
      color: "#e06060",
      stopAt: "paper",
      info: {
        title: "Alpha stopped by paper",
        body: "Alpha is a heavy helium nucleus. It deposits so much energy in so little distance that a single sheet of paper is enough to stop it completely.",
      },
    },
    {
      id: "beta",
      label: "\u03b2  Beta",
      color: "#1ebcba",
      stopAt: "aluminium",
      info: {
        title: "Beta stopped by aluminium",
        body: "Beta is a fast, light electron. It travels further than alpha but a few millimetres of aluminium absorbs enough energy to stop it.",
      },
    },
    {
      id: "gamma",
      label: "\u03b3  Gamma",
      color: "#2e6d6c",
      stopAt: "lead",
      info: {
        title: "Gamma stopped by lead",
        body: "Gamma is a high-energy wave with no mass. It passes through paper and aluminium easily. Only a thick dense material like lead stops it.",
      },
    },
    {
      id: "muon",
      label: "\u03bc  Muon",
      color: "#c08080",
      stopAt: null,
      info: {
        title: "Muon passes through everything",
        body: "Muons from cosmic rays interact so rarely with matter that they pass through hundreds of metres of solid rock. Concrete barely slows them.",
      },
    },
  ];

  // Compute stopX
  PARTICLES.forEach((p) => {
    const b = p.stopAt ? BARRIERS.find((b) => b.id === p.stopAt) : null;
    p.stopX = b ? b.x : TRACK_END;
    p.y = ROW_Y[PARTICLES.indexOf(p)];
  });

  // State per particle
  function freshState() {
    const s = {};
    PARTICLES.forEach((p) => {
      s[p.id] = { progress: 0, done: false, animating: false };
    });
    return s;
  }
  let state = freshState();

  // DPR-aware canvas setup
  const DPR = window.devicePixelRatio || 1;
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  canvas.style.width = W + "px";
  canvas.style.height = H + "px";
  const ctx = canvas.getContext("2d");
  ctx.scale(DPR, DPR);

  // ---------- draw ----------
  function draw() {
    ctx.clearRect(0, 0, W, H);

    // barriers
    BARRIERS.forEach((b) => {
      const sk = b.depth * 0.5;
      // right side
      ctx.beginPath();
      ctx.moveTo(b.x + b.w, H - 20);
      ctx.lineTo(b.x + b.w + sk, H - 20 - sk);
      ctx.lineTo(b.x + b.w + sk, 32 - sk);
      ctx.lineTo(b.x + b.w, 32);
      ctx.closePath();
      ctx.fillStyle = b.sc;
      ctx.fill();
      // top face
      ctx.beginPath();
      ctx.moveTo(b.x, 32);
      ctx.lineTo(b.x + sk, 32 - sk);
      ctx.lineTo(b.x + b.w + sk, 32 - sk);
      ctx.lineTo(b.x + b.w, 32);
      ctx.closePath();
      ctx.fillStyle = b.tc;
      ctx.fill();
      // front
      ctx.fillStyle = b.fc;
      ctx.fillRect(b.x, 32, b.w, H - 52);
      // label
      ctx.font = '700 11px "Open Sans",sans-serif';
      ctx.fillStyle = "#555";
      ctx.textAlign = "center";
      ctx.fillText(b.label, b.x + b.w / 2, 20);
    });

    // particles
    PARTICLES.forEach((p) => {
      const s = state[p.id];
      const curX = TRACK_X + (p.stopX - TRACK_X) * s.progress;

      // faint guide when not yet fired
      if (s.progress === 0) {
        ctx.beginPath();
        ctx.moveTo(TRACK_X, p.y);
        ctx.lineTo(TRACK_END, p.y);
        ctx.strokeStyle = p.color + "30";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
        return;
      }

      // shaft
      ctx.beginPath();
      ctx.moveTo(TRACK_X, p.y);
      ctx.lineTo(curX, p.y);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      ctx.setLineDash([]);
      ctx.stroke();

      // arrowhead while moving or if muon (passes through)
      if (!s.done || p.stopAt === null) {
        ctx.beginPath();
        ctx.moveTo(curX + 2, p.y);
        ctx.lineTo(curX - 10, p.y - 6);
        ctx.lineTo(curX - 10, p.y + 6);
        ctx.closePath();
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      // muon dashed tail beyond concrete
      if (p.stopAt === null && s.done) {
        ctx.beginPath();
        ctx.moveTo(TRACK_END, p.y);
        ctx.lineTo(TRACK_END + 28, p.y);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(TRACK_END + 30, p.y);
        ctx.lineTo(TRACK_END + 20, p.y - 5);
        ctx.lineTo(TRACK_END + 20, p.y + 5);
        ctx.closePath();
        ctx.fillStyle = p.color;
        ctx.fill();
      }
    });
  }

  // ---------- animation: raf is reset to null when loop ends ----------
  let raf = null;
  function tick() {
    let anyActive = false;
    PARTICLES.forEach((p) => {
      const s = state[p.id];
      if (!s.animating || s.done) return;
      s.progress = Math.min(1, s.progress + (reduce ? 1 : 0.025));
      if (s.progress >= 1) {
        s.done = true;
        s.animating = false;
        showInfo(p);
      }
      anyActive = true;
    });
    draw();
    if (anyActive) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = null; // KEY FIX: reset so next click can start a new loop
    }
  }

  function fire(p) {
    const s = state[p.id];
    if (s.done || s.animating) return;
    s.animating = true;
    if (!raf) raf = requestAnimationFrame(tick); // only start if not already running
  }

  function showInfo(p) {
    panel.innerHTML = "<h5>" + p.info.title + "</h5><p>" + p.info.body + "</p>";
  }

  // ---------- reset ----------
  function reset() {
    state = freshState();
    raf = null;
    panel.innerHTML =
      '<p class="pen3d-info__hint">Click a particle name to fire it.</p>';
    btns.forEach((btn, i) => {
      btn.style.opacity = "1";
      btn.style.pointerEvents = "auto";
    });
    draw();
  }

  // ---------- overlay buttons (no canvas text labels, so no doubling) ----------
  const wrap = canvas.parentElement;
  wrap.style.position = "relative";
  const btns = [];

  PARTICLES.forEach((p, i) => {
    const btn = document.createElement("button");
    btn.textContent = p.label;
    btn.setAttribute("aria-label", "Fire " + p.id);
    // Position relative to canvas CSS size (W x H px)
    const top = ROW_Y[i] - 12;
    btn.style.cssText =
      "position:absolute;left:0;top:" +
      top +
      "px;width:" +
      LABEL_W +
      "px;height:26px;" +
      "background:transparent;border:none;cursor:pointer;" +
      'font:700 13px "Open Sans",sans-serif;color:' +
      p.color +
      ";" +
      "text-align:right;padding-right:6px;";
    btn.addEventListener("click", () => {
      fire(p);
      btn.style.opacity = "0.45";
      btn.style.pointerEvents = "none";
    });
    wrap.appendChild(btn);
    btns.push(btn);
  });

  // Reset button
  const resetBtn = document.createElement("button");
  resetBtn.textContent = "Reset";
  resetBtn.style.cssText =
    "position:absolute;right:10px;bottom:8px;" +
    "background:#f08081;color:#fff;border:none;border-radius:999px;" +
    'padding:6px 16px;font:700 12px "Open Sans",sans-serif;cursor:pointer;';
  resetBtn.addEventListener("click", reset);
  wrap.appendChild(resetBtn);

  draw();
})();
