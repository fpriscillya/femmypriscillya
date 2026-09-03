/* Click-to-enlarge lightbox for gallery + case-study images.
   Tiles that are links (<a class="tile">) navigate instead of enlarging. */
(function () {
  var groups = document.querySelectorAll(".gallery, .shots");
  if (!groups.length) return;

  var box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.innerHTML =
    '<button class="close" aria-label="Close">&times;</button><img alt="" /><div class="cap"></div>';
  document.body.appendChild(box);

  var bigImg = box.querySelector("img"),
    cap = box.querySelector(".cap"),
    closeBtn = box.querySelector(".close");

  function open(src, alt) {
    bigImg.src = src;
    bigImg.alt = alt || "";
    cap.textContent = alt || "";
    box.classList.add("open");
    closeBtn.focus();
  }
  function close() {
    box.classList.remove("open");
    bigImg.src = "";
  }

  groups.forEach(function (g) {
    g.addEventListener("click", function (e) {
      if (e.target.closest("a")) return; // linked tile -> let it navigate
      var item = e.target.closest(".tile, figure");
      if (!item) return;
      var img = item.querySelector("img");
      if (!img) return;
      open(img.currentSrc || img.src, img.alt);
    });
  });

  closeBtn.addEventListener("click", close);
  box.addEventListener("click", function (e) {
    if (e.target === box) close();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && box.classList.contains("open")) close();
  });
})();

/* ---- Hero sketch grid — assembles on load (index page only) ---- */
(function () {
  var hero = document.querySelector(".hero");
  if (!hero) return;

  var canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  hero.insertBefore(canvas, hero.firstChild);
  if (getComputedStyle(hero).position === "static")
    hero.style.position = "relative";
  hero.style.overflow = "hidden";
  Object.assign(canvas.style, {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 0,
  });
  var grid = hero.querySelector(".hero-grid");
  if (grid) {
    grid.style.position = "relative";
    grid.style.zIndex = 1;
  }

  var GAP = 72,
    JITTER = 0,
    INK = "rgba(38,38,38,0.12)";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ctx,
    W,
    H,
    lines = [],
    total = 0;

  function jitterPts(x1, y1, x2, y2) {
    var segs = 16,
      pts = [];
    for (var i = 0; i <= segs; i++) {
      var t = i / segs;
      pts.push([
        x1 + (x2 - x1) * t + (Math.random() - 0.5) * JITTER,
        y1 + (y2 - y1) * t + (Math.random() - 0.5) * JITTER,
      ]);
    }
    return pts;
  }

  function addLine(pts) {
    var delay = Math.random() * 800; // scattered start times
    var dur = 800 + Math.random() * 450; // each line's grow time (slower)
    var dir = Math.random() < 0.5 ? 0 : 1; // 0 = from start edge, 1 = from far edge
    lines.push({ pts: pts, delay: delay, dur: dur, dir: dir });
    total = Math.max(total, delay + dur);
  }

  function build() {
    var r = hero.getBoundingClientRect();
    W = r.width;
    H = r.height;
    var dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineWidth = 1;
    ctx.strokeStyle = INK;
    lines = [];
    total = 0;
    var x, y;
    for (x = GAP; x < W; x += GAP) addLine(jitterPts(x, 0, x, H));
    for (y = GAP; y < H; y += GAP) addLine(jitterPts(0, y, W, y));
  }

  function easeOut(p) {
    return 1 - Math.pow(1 - p, 3);
  }

  function drawFrame(t) {
    ctx.clearRect(0, 0, W, H);
    for (var l = 0; l < lines.length; l++) {
      var ln = lines[l];
      var p =
        t === null
          ? 1
          : easeOut(Math.max(0, Math.min(1, (t - ln.delay) / ln.dur)));
      if (p <= 0) continue;
      var pts = ln.pts,
        n = pts.length;
      var count = Math.max(1, Math.floor(n * p));
      ctx.beginPath();
      if (ln.dir === 0) {
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (var i = 1; i < count; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      } else {
        ctx.moveTo(pts[n - 1][0], pts[n - 1][1]);
        for (var j = n - 2; j >= n - count; j--)
          ctx.lineTo(pts[j][0], pts[j][1]);
      }
      ctx.stroke();
    }
  }

  function run() {
    if (window.innerWidth <= 820) {
      canvas.style.display = "none";
      return;
    }
    canvas.style.display = "block";
    build();
    if (reduce) {
      drawFrame(null);
      return;
    }
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var t = ts - start;
      drawFrame(t);
      if (t < total) requestAnimationFrame(step);
      else drawFrame(null);
    }
    requestAnimationFrame(step);
  }

  run();

  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      if (window.innerWidth <= 820) {
        canvas.style.display = "none";
        return;
      }
      canvas.style.display = "block";
      build();
      drawFrame(null);
    }, 150);
  });
})();
