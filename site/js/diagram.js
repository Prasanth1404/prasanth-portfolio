/*
  Live architecture diagram
  - nodes can be dragged (mouse, touch, or arrow keys when focused)
  - packets flow along every connection
  - Pause / Reset buttons
*/
(function () {
  var NS = "http://www.w3.org/2000/svg";
  var KIND_NAMES = { user: "People", git: "Git and CI", aws: "AWS", k8s: "Kubernetes", data: "Data", sec: "Security" };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  // Point where the line from a to b leaves a's box
  function boxEdge(a, b, hw, hh, pad) {
    var dx = b.x - a.x, dy = b.y - a.y;
    if (!dx && !dy) return { x: a.x, y: a.y };
    var sx = dx ? (hw + pad) / Math.abs(dx) : Infinity;
    var sy = dy ? (hh + pad) / Math.abs(dy) : Infinity;
    var s = Math.min(sx, sy);
    return { x: a.x + dx * s, y: a.y + dy * s };
  }

  function mount(container, def, opts) {
    opts = opts || {};
    var W = def.width || 960, H = def.height || 520, NH = 56;
    var compact = !!opts.compact;
    var start = {}, pos = {};
    def.nodes.forEach(function (n) {
      start[n.id] = { x: n.x, y: n.y };
      pos[n.id] = { x: n.x, y: n.y, w: n.w || 164, k: n.kind || "k8s" };
    });

    var card = document.createElement("div");
    card.className = compact ? "" : "diagram-card";

    var bar, liveTag, pauseBtn;
    if (!compact) {
      bar = document.createElement("div");
      bar.className = "diagram-bar";
      liveTag = document.createElement("span");
      liveTag.className = "live";
      liveTag.textContent = "Live: drag any box";
      var btns = document.createElement("div");
      btns.className = "dbtns";
      pauseBtn = document.createElement("button");
      pauseBtn.type = "button";
      pauseBtn.className = "dbtn";
      var resetBtn = document.createElement("button");
      resetBtn.type = "button";
      resetBtn.className = "dbtn";
      resetBtn.textContent = "Reset layout";
      btns.appendChild(pauseBtn);
      btns.appendChild(resetBtn);
      bar.appendChild(liveTag);
      bar.appendChild(btns);
      card.appendChild(bar);
    }

    var svg = el("svg", {
      viewBox: "0 0 " + W + " " + H,
      class: "diagram-svg",
      role: "img",
      "aria-label": (def.title || "Architecture diagram") + (compact ? "" : ". Boxes can be moved with the mouse, touch, or arrow keys.")
    });
    if (compact) {
      card.appendChild(svg);
    } else {
      var scroller = document.createElement("div");
      scroller.className = "diagram-scroll";
      scroller.appendChild(svg);
      card.appendChild(scroller);
    }

    var defs = el("defs", {}, svg);
    var marker = el("marker", { id: "arr-" + Math.random().toString(36).slice(2), viewBox: "0 0 10 10", refX: "8", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse" }, defs);
    el("path", { d: "M1 1L9 5L1 9z", fill: "currentColor" }, marker);
    marker.style.color = "color-mix(in srgb, var(--slate) 70%, transparent)";
    var markerId = marker.getAttribute("id");

    (def.zones || []).forEach(function (z) {
      var g = el("g", { class: "zone" }, svg);
      el("rect", { x: z.x, y: z.y, width: z.w, height: z.h, rx: 14 }, g);
      var t = el("text", { x: z.x + 14, y: z.y + 22 }, g);
      t.textContent = z.label;
    });

    var gEdges = el("g", {}, svg);
    var gPackets = el("g", {}, svg);
    var gNodes = el("g", {}, svg);

    var edges = def.edges.map(function (e, i) {
      var line = el("line", { class: "edge" + (e.dashed ? " dashed" : ""), "marker-end": "url(#" + markerId + ")" }, gEdges);
      var label = null;
      if (e.label && !compact) {
        label = el("text", { class: "edge-label", "text-anchor": "middle" }, gEdges);
        label.textContent = e.label;
      }
      var kind = pos[e.from] ? pos[e.from].k : "k8s";
      var packets = [];
      var count = e.dashed ? 1 : 2;
      for (var p = 0; p < count; p++) {
        var c = el("circle", { class: "packet k-" + kind, r: compact ? 3.5 : 4.5 }, gPackets);
        packets.push({ el: c, t: (p / count + i * 0.13) % 1 });
      }
      return { def: e, line: line, label: label, packets: packets, a: null, b: null, len: 1 };
    });

    var nodeEls = {};
    def.nodes.forEach(function (n) {
      var p = pos[n.id];
      var g = el("g", { class: "node k-" + p.k, tabindex: compact ? "-1" : "0", role: compact ? "presentation" : "button", "aria-label": n.label + (n.sub ? ", " + n.sub : "") }, gNodes);
      el("rect", { class: "box", x: -p.w / 2, y: -NH / 2, width: p.w, height: NH, rx: 9 }, g);
      el("rect", { class: "bar", x: -p.w / 2, y: -NH / 2, width: 5, height: NH, rx: 2 }, g);
      var t1 = el("text", { class: "lbl", x: -p.w / 2 + 16, y: n.sub ? -4 : 5 }, g);
      t1.textContent = n.label;
      if (n.sub) {
        var t2 = el("text", { class: "sub", x: -p.w / 2 + 16, y: 14 }, g);
        t2.textContent = n.sub;
      }
      nodeEls[n.id] = g;
      if (!compact) enableDrag(g, n.id);
    });

    function layout() {
      def.nodes.forEach(function (n) {
        var p = pos[n.id];
        nodeEls[n.id].setAttribute("transform", "translate(" + p.x + " " + p.y + ")");
      });
      edges.forEach(function (e) {
        var A = pos[e.def.from], B = pos[e.def.to];
        if (!A || !B) return;
        var a = boxEdge(A, B, A.w / 2, NH / 2, 2);
        var b = boxEdge(B, A, B.w / 2, NH / 2, 6);
        e.a = a; e.b = b;
        e.len = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y));
        e.line.setAttribute("x1", a.x); e.line.setAttribute("y1", a.y);
        e.line.setAttribute("x2", b.x); e.line.setAttribute("y2", b.y);
        if (e.label) {
          e.label.setAttribute("x", (a.x + b.x) / 2);
          e.label.setAttribute("y", (a.y + b.y) / 2 - 6);
        }
        drawPackets(e);
      });
    }

    function drawPackets(e) {
      e.packets.forEach(function (pk) {
        pk.el.setAttribute("cx", e.a.x + (e.b.x - e.a.x) * pk.t);
        pk.el.setAttribute("cy", e.a.y + (e.b.y - e.a.y) * pk.t);
        pk.el.style.opacity = pk.t < 0.08 ? pk.t / 0.08 : pk.t > 0.92 ? (1 - pk.t) / 0.08 : 1;
      });
    }

    // Animation
    var running = !reduceMotion, visible = true, last = 0, SPEED = 90;
    function frame(ts) {
      if (!last) last = ts;
      var dt = Math.min(0.05, (ts - last) / 1000);
      last = ts;
      if (running && visible) {
        edges.forEach(function (e) {
          if (!e.a) return;
          var step = (SPEED * dt) / e.len;
          e.packets.forEach(function (pk) { pk.t = (pk.t + step) % 1; });
          drawPackets(e);
        });
      }
      requestAnimationFrame(frame);
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; }).observe(svg);
    }

    function setRunning(v) {
      running = v;
      if (!pauseBtn) return;
      pauseBtn.textContent = running ? "Pause" : "Play";
      liveTag.classList.toggle("paused", !running);
      liveTag.textContent = running ? "Live: drag any box" : "Paused: drag any box";
    }

    // Dragging
    function toSvg(evt) {
      var pt = svg.createSVGPoint();
      pt.x = evt.clientX; pt.y = evt.clientY;
      return pt.matrixTransform(svg.getScreenCTM().inverse());
    }
    function clamp(id) {
      var p = pos[id];
      p.x = Math.max(p.w / 2 + 4, Math.min(W - p.w / 2 - 4, p.x));
      p.y = Math.max(NH / 2 + 4, Math.min(H - NH / 2 - 4, p.y));
    }
    function enableDrag(g, id) {
      var off = null;
      g.addEventListener("pointerdown", function (evt) {
        evt.preventDefault();
        var s = toSvg(evt);
        off = { x: s.x - pos[id].x, y: s.y - pos[id].y };
        g.setPointerCapture(evt.pointerId);
        g.classList.add("dragging");
        gNodes.appendChild(g);
      });
      g.addEventListener("pointermove", function (evt) {
        if (!off) return;
        var s = toSvg(evt);
        pos[id].x = s.x - off.x;
        pos[id].y = s.y - off.y;
        clamp(id);
        layout();
      });
      function end() { off = null; g.classList.remove("dragging"); }
      g.addEventListener("pointerup", end);
      g.addEventListener("pointercancel", end);
      g.addEventListener("keydown", function (evt) {
        var step = evt.shiftKey ? 40 : 12, moved = true;
        if (evt.key === "ArrowLeft") pos[id].x -= step;
        else if (evt.key === "ArrowRight") pos[id].x += step;
        else if (evt.key === "ArrowUp") pos[id].y -= step;
        else if (evt.key === "ArrowDown") pos[id].y += step;
        else moved = false;
        if (moved) { evt.preventDefault(); clamp(id); layout(); }
      });
    }

    if (pauseBtn) {
      pauseBtn.addEventListener("click", function () { setRunning(!running); });
      resetBtn.addEventListener("click", function () {
        def.nodes.forEach(function (n) { pos[n.id].x = start[n.id].x; pos[n.id].y = start[n.id].y; });
        layout();
      });
      setRunning(running);
    }

    // Legend
    if (!compact) {
      var used = {};
      def.nodes.forEach(function (n) { used[n.kind || "k8s"] = true; });
      var legend = document.createElement("div");
      legend.className = "legend";
      Object.keys(KIND_NAMES).forEach(function (k) {
        if (!used[k]) return;
        var s = document.createElement("span");
        s.className = "k-" + k;
        s.innerHTML = "<i></i>" + KIND_NAMES[k];
        legend.appendChild(s);
      });
      card.appendChild(legend);
    }

    container.appendChild(card);
    layout();
    requestAnimationFrame(frame);
  }

  window.Diagram = { mount: mount };
})();
