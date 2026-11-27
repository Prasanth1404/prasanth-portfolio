/* 3D effects for prasanth.space */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(s, r) { return (r || document).querySelector(s); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* ---------- Loader (home page, once per visit) ---------- */
  var loader = $("#loader");
  if (loader) {
    var seen = false;
    try { seen = sessionStorage.getItem("ps-loader") === "1"; } catch (e) {}
    if (seen || reduce) {
      loader.remove();
    } else {
      var countEl = $(".count", loader), bar = $(".bar", loader), t0 = performance.now(), DUR = 1600;
      (function tick(now) {
        var p = Math.min(1, (now - t0) / DUR), e = 1 - Math.pow(1 - p, 3);
        countEl.textContent = Math.round(e * 100);
        bar.style.width = (e * 100) + "%";
        if (p < 1) return requestAnimationFrame(tick);
        try { sessionStorage.setItem("ps-loader", "1"); } catch (e2) {}
        setTimeout(function () { loader.classList.add("done"); setTimeout(function () { loader.remove(); }, 700); }, 250);
      })(t0);
    }
  }

  /* ---------- 3D particle field (all pages) ---------- */
  var cv = $("#fx");
  if (cv && cv.getContext) {
    var ctx = cv.getContext("2d"), W, H, DPR = Math.min(window.devicePixelRatio || 1, 2), pts = [];
    var N = window.innerWidth < 720 ? 70 : 150, FOV = 420, mx = 0, my = 0, tx = 0, ty = 0, visible = true;
    function size() { W = cv.width = innerWidth * DPR; H = cv.height = innerHeight * DPR; }
    function spawn(p, far) {
      p.x = (Math.random() - 0.5) * 1600; p.y = (Math.random() - 0.5) * 1000;
      p.z = far ? 900 : Math.random() * 900 + 50; p.s = Math.random() * 1.6 + 0.6;
      p.v = Math.random() * 0.6 + 0.25; p.hue = Math.random() < 0.85 ? 352 : 18;
    }
    for (var i = 0; i < N; i++) { var p = {}; spawn(p); pts.push(p); }
    size(); addEventListener("resize", size);
    addEventListener("pointermove", function (e) { tx = (e.clientX / innerWidth - 0.5) * 60; ty = (e.clientY / innerHeight - 0.5) * 40; });
    document.addEventListener("visibilitychange", function () { visible = !document.hidden; });
    function draw() {
      if (visible) {
        mx += (tx - mx) * 0.04; my += (ty - my) * 0.04;
        ctx.clearRect(0, 0, W, H);
        var sy = (window.scrollY || 0) * 0.15;
        for (var i = 0; i < pts.length; i++) {
          var p = pts[i];
          if (!reduce) { p.z -= p.v; if (p.z < 10) spawn(p, true); }
          var k = FOV / p.z, x = (p.x + mx * (900 - p.z) / 900) * k + W / 2 / DPR, y = (p.y + my * (900 - p.z) / 900 - sy) * k + H / 2 / DPR;
          var yy = ((y % (H / DPR)) + H / DPR) % (H / DPR);
          var r = p.s * k * 1.4, a = Math.min(1, (900 - p.z) / 700) * 0.85;
          if (x < -20 || x > W / DPR + 20) continue;
          var g = ctx.createRadialGradient(x * DPR, yy * DPR, 0, x * DPR, yy * DPR, r * DPR * 3);
          g.addColorStop(0, "hsla(" + p.hue + ",100%,62%," + a + ")");
          g.addColorStop(1, "hsla(" + p.hue + ",100%,50%,0)");
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(x * DPR, yy * DPR, r * DPR * 3, 0, Math.PI * 2); ctx.fill();
        }
      }
      if (!reduce) requestAnimationFrame(draw);
    }
    draw();
  }

  /* ---------- Hero: portrait fallback and 3D tilt ---------- */
  var portrait = $(".hero-portrait");
  if (portrait) {
    var cut = new Image();
    cut.onload = function () { cut.className = "cutout"; cut.alt = "Prasanth S"; portrait.appendChild(cut); };
    cut.onerror = function () {
      var ring = document.createElement("div");
      ring.className = "photo-ring";
      ring.innerHTML = '<img src="images/profile.jpg" alt="Prasanth S">';
      portrait.appendChild(ring);
    };
    cut.src = "images/hero.png";
  }
  var frame = $("[data-tilt]");
  if (frame && !reduce && matchMedia("(pointer: fine)").matches) {
    frame.addEventListener("pointermove", function (e) {
      var r = frame.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      frame.style.transform = "rotateY(" + (x * 6) + "deg) rotateX(" + (-y * 5) + "deg)";
    });
    frame.addEventListener("pointerleave", function () { frame.style.transform = ""; });
  }

  /* ---------- Counters ---------- */
  var nums = document.querySelectorAll("[data-count]");
  if (nums.length) {
    var run = function (el) {
      var end = parseFloat(el.getAttribute("data-count")), dec = (el.getAttribute("data-count").split(".")[1] || "").length;
      var suf = el.getAttribute("data-suffix") || "", t0 = performance.now(), D = reduce ? 0 : 1400;
      (function step(now) {
        var p = D ? Math.min(1, (now - t0) / D) : 1, e = 1 - Math.pow(1 - p, 3);
        el.innerHTML = (end * e).toFixed(dec) + (suf ? "<sup>" + suf + "</sup>" : "");
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    };
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } }); }, { threshold: 0.6 });
      nums.forEach(function (n) { io.observe(n); });
    } else nums.forEach(run);
  }

  /* ---------- 3D project ring ---------- */
  var stage = $("#ring-stage"), ring = $("#ring");
  if (stage && ring && window.PROJECTS) {
    var list = window.PROJECTS, n = list.length, step = 360 / n, cards = [];
    list.forEach(function (p, i) {
      var a = document.createElement("a");
      a.className = "ring-card";
      a.href = "project.html?id=" + encodeURIComponent(p.id);
      a.setAttribute("aria-label", p.title);
      a.innerHTML = '<span class="no">' + String(i + 1).padStart(2, "0") + '</span>' +
        '<span class="thumb"><span class="ph">' + esc(p.title.split(" ").map(function (w) { return w[0]; }).join("").slice(0, 3).toUpperCase()) + '</span></span>' +
        '<span class="cat">' + (p.category === "company" ? "KlioTech · " + esc(p.kind) : "Personal project") + '</span>' +
        '<h3>' + esc(p.title) + '</h3><span class="go">Open project →</span>';
      ring.appendChild(a);
      cards.push(a);
      // picture: logo for company, cover/first screenshot for personal
      var thumb = a.querySelector(".thumb"), base = "images/projects/" + p.id + "/";
      var tries = p.category === "company"
        ? [[base + "logo.svg", "logo"], [base + "logo.png", "logo"], [base + "logo.webp", "logo"]]
        : [[base + "cover.png", "full"]].concat((p.gallery || []).map(function (g) { return [base + g.file, "full"]; }));
      (function next(k) {
        if (k >= tries.length) return;
        var img = new Image();
        img.onload = function () {
          thumb.innerHTML = ""; img.alt = "";
          if (tries[k][1] === "logo") { thumb.classList.add("logo"); if (p.logoBackground) thumb.style.background = p.logoBackground; }
          else img.className = "full";
          thumb.appendChild(img);
        };
        img.onerror = function () { next(k + 1); };
        img.src = tries[k][0];
      })(0);
    });

    var radius, angle = 0, vel = 0, dragging = false, moved = 0, lastX = 0, idle = 0;
    function layout() {
      var w = cards[0].offsetWidth;
      radius = Math.round((w / 2) / Math.tan(Math.PI / n)) + 60;
      cards.forEach(function (c, i) { c.style.transform = "rotateY(" + (i * step) + "deg) translateZ(" + radius + "px)"; });
    }
    function render() {
      ring.style.transform = "translateZ(" + (-radius) + "px) rotateY(" + angle + "deg)";
      var front = ((Math.round(-angle / step) % n) + n) % n;
      cards.forEach(function (c, i) {
        var d = Math.abs(((i * step + angle) % 360 + 540) % 360 - 180);
        c.classList.toggle("front", i === front);
        c.style.opacity = d < 100 ? 1 : 0.35;
        c.tabIndex = i === front ? 0 : -1;
      });
    }
    function loop() {
      if (!dragging) {
        if (Math.abs(vel) > 0.01) { angle += vel; vel *= 0.94; idle = 0; }
        else {
          idle++;
          var target = Math.round(angle / step) * step;
          angle += (target - angle) * 0.08;
          if (!reduce && idle > 240) angle -= 0.12;   // slow auto-rotate after 4 s idle
        }
      }
      render();
      requestAnimationFrame(loop);
    }
    stage.addEventListener("pointerdown", function (e) { dragging = true; moved = 0; lastX = e.clientX; vel = 0; stage.classList.add("dragging"); stage.setPointerCapture(e.pointerId); });
    stage.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var dx = e.clientX - lastX; lastX = e.clientX; moved += Math.abs(dx);
      angle += dx * 0.35; vel = dx * 0.35;
    });
    function end() { dragging = false; idle = 0; stage.classList.remove("dragging"); }
    stage.addEventListener("pointerup", end);
    stage.addEventListener("pointercancel", end);
    stage.addEventListener("click", function (e) { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
    function go(dir) { vel = 0; idle = 0; angle = Math.round(angle / step) * step + dir * step; }
    var prev = $("#ring-prev"), nextB = $("#ring-next");
    if (prev) prev.addEventListener("click", function () { go(1); });
    if (nextB) nextB.addEventListener("click", function () { go(-1); });
    stage.addEventListener("keydown", function (e) { if (e.key === "ArrowLeft") go(1); if (e.key === "ArrowRight") go(-1); });
    addEventListener("resize", layout);
    layout(); render(); loop();
  }

  /* ---------- Hanging ID badge (spring physics, drag to swing) ---------- */
  var swing = $("#badge-swing"), badge = $("#badge"), strap = $("#badge-strap");
  if (swing && badge) {
    var th = reduce ? 0 : 0.35, w = 0, hold = false, startX = 0, startTh = 0;
    function drawBadge() {
      swing.style.transform = "rotate(" + th + "rad)";
    }
    function phys() {
      if (!hold) { w += -th * 0.012; w *= 0.985; th += w; }
      drawBadge();
      if (!reduce) requestAnimationFrame(phys);
    }
    badge.addEventListener("pointerdown", function (e) { hold = true; startX = e.clientX; startTh = th; w = 0; badge.setPointerCapture(e.pointerId); badge.style.cursor = "grabbing"; });
    badge.addEventListener("pointermove", function (e) { if (!hold) return; th = Math.max(-0.9, Math.min(0.9, startTh + (e.clientX - startX) / 260)); });
    function rel() { hold = false; badge.style.cursor = ""; }
    badge.addEventListener("pointerup", rel);
    badge.addEventListener("pointercancel", rel);
    drawBadge(); phys();
  }

  /* ---------- Contact form → email ---------- */
  var form = $("#contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.elements.name.value.trim(), mail = form.elements.email.value.trim(), msg = form.elements.message.value.trim();
      var body = msg + "\n\n— " + name + (mail ? " (" + mail + ")" : "");
      location.href = "mailto:sgprasanth2523@gmail.com?subject=" + encodeURIComponent("Portfolio enquiry from " + (name || "a visitor")) + "&body=" + encodeURIComponent(body);
    });
  }
})();
