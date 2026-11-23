(function () {
  var PROJECTS = window.PROJECTS || [];
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // `code` → <code>code</code>
  function md(s) { return esc(s).replace(/`([^`]+)`/g, "<code>$1</code>"); }
  function $(sel, root) { return (root || document).querySelector(sel); }

  /* ---------- Shared: nav, year, avatar, reveal ---------- */
  var page = document.body.getAttribute("data-page");
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    if (a.getAttribute("data-nav") === page) a.setAttribute("aria-current", "page");
  });
  document.querySelectorAll("[data-year]").forEach(function (n) { n.textContent = new Date().getFullYear(); });

  document.querySelectorAll(".avatar img").forEach(function (img) {
    function fail() { img.remove(); }
    if (img.complete && !img.naturalWidth) fail();
    img.addEventListener("error", fail);
  });

  // Show the resume button only when resume.pdf has been uploaded
  var resumeBtn = $("[data-resume]");
  if (resumeBtn) {
    fetch("resume.pdf", { method: "HEAD" }).then(function (r) {
      if (r.ok) resumeBtn.hidden = false;
    }).catch(function () {});
  }

  function reveal() {
    var items = document.querySelectorAll(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (n) { n.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (n) { io.observe(n); });
  }

  /* ---------- Typed role line (home) ---------- */
  var typed = $("[data-typed]");
  if (typed) {
    var words = JSON.parse(typed.getAttribute("data-typed"));
    if (!reduceMotion && words.length > 1) {
      var wi = 0, ci = words[0].length, deleting = true;
      setTimeout(function tick() {
        var w = words[wi];
        if (deleting) {
          ci--;
          if (ci <= 0) { deleting = false; wi = (wi + 1) % words.length; }
        } else {
          ci++;
          if (ci >= words[wi].length) { deleting = true; typed.textContent = words[wi]; return setTimeout(tick, 2200); }
        }
        typed.textContent = words[wi].slice(0, Math.max(0, ci));
        setTimeout(tick, deleting ? 35 : 70);
      }, 2600);
    }
  }

  /* ---------- Project cards (home + projects page) ---------- */
  function renderCards(container, list) {
    list.forEach(function (p) {
      var card = document.createElement("article");
      card.className = "card reveal";
      card.innerHTML =
        '<div class="card-cover" aria-hidden="true"></div>' +
        '<div class="card-body">' +
          '<h3><a href="project.html?id=' + encodeURIComponent(p.id) + '">' + esc(p.title) + "</a></h3>" +
          "<p>" + esc(p.short) + "</p>" +
          '<ul class="chips">' + p.tags.slice(0, 5).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" +
          '<div class="meta"><span>' + esc(p.year) + " · " + p.repos.length + (p.repos.length === 1 ? " repository" : " repositories") + '</span><span class="go">View project →</span></div>' +
        "</div>";
      container.appendChild(card);
      if (p.overview && window.Diagram) window.Diagram.mount(card.querySelector(".card-cover"), p.overview, { compact: true });
    });
  }

  var cardsHome = $("#project-cards");
  if (cardsHome) renderCards(cardsHome, PROJECTS);
  var countEl = $("[data-project-count]");
  if (countEl) countEl.textContent = PROJECTS.length;

  /* ---------- Project page ---------- */
  var projectRoot = $("#project");
  if (projectRoot) renderProject(projectRoot);

  function renderProject(root) {
    var id = new URLSearchParams(location.search).get("id");
    var idx = PROJECTS.findIndex(function (p) { return p.id === id; });
    if (idx < 0) {
      root.innerHTML = '<div class="wrap"><p class="crumbs"><a href="projects.html">Projects</a></p>' +
        '<h1 class="title">Project not found</h1><p class="lede">This project doesn\'t exist or has moved. <a href="projects.html">See all projects</a>.</p></div>';
      return;
    }
    var p = PROJECTS[idx];
    document.title = p.title + " – Prasanth S";

    var links = (p.links || []).map(function (l) {
      return '<a class="btn" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + " ↗</a>";
    }).join("");

    var html = "";
    html += '<div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> / <a href="projects.html">Projects</a> / <span>' + esc(p.title) + "</span></nav></div>";

    html += '<header class="p-hero"><div class="wrap">' +
      "<h1>" + esc(p.title) + "</h1>" +
      '<p class="lede">' + md(p.summary) + "</p>" +
      '<p class="p-meta"><span><b>Year</b> ' + esc(p.year) + "</span><span><b>Role</b> " + esc(p.role) + "</span><span><b>Status</b> " + esc(p.status) + "</span></p>" +
      (p.notice ? '<p class="notice">' + md(p.notice) + "</p>" : "") +
      (links ? '<div class="actions" style="margin-top:14px">' + links + "</div>" : "") +
      '<ul class="chips" style="margin-top:22px">' + p.tags.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" +
      "</div></header>";

    html += '<section class="block reveal"><div class="wrap">' +
      '<h2 class="title">What I built</h2><ul class="ticks cols">' + p.highlights.map(function (h) { return "<li>" + md(h) + "</li>"; }).join("") + "</ul>" +
      "</div></section>";

    if (p.overview) {
      html += '<section class="block reveal"><div class="wrap">' +
        '<h2 class="title">' + esc(p.overview.title) + "</h2>" +
        (p.overview.caption ? '<p class="lede" style="margin-bottom:18px">' + md(p.overview.caption) + "</p>" : "") +
        '<div id="overview-diagram"></div></div></section>';
    }

    html += '<section class="block reveal"><div class="wrap">' +
      '<h2 class="title">Repositories</h2>' +
      '<p class="lede" style="margin-bottom:22px">Each repository has its own live diagram. Drag the boxes to explore; packets show how requests and deployments move.</p>' +
      '<div class="tabs" role="tablist" aria-label="Repositories">' +
      p.repos.map(function (r, i) {
        return '<button class="tab" role="tab" id="tab-' + i + '" aria-controls="panel-' + i + '" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '">' + esc(r.name) + "</button>";
      }).join("") +
      "</div>" +
      p.repos.map(function (r, i) {
        return '<div class="repo-panel" role="tabpanel" id="panel-' + i + '" aria-labelledby="tab-' + i + '"' + (i === 0 ? "" : " hidden") + ">" +
          '<div class="repo-head"><div><h3>' + esc(r.name) + "</h3><p>" + md(r.tagline) + "</p></div>" +
          '<a class="btn" href="' + esc(r.url) + '" target="_blank" rel="noopener">Open on GitHub ↗</a></div>' +
          '<div class="repo-diagram">' + (r.diagram ? "" : '<p class="muted">This repository is shown in the overview diagram above.</p>') + "</div>" +
          '<div class="repo-grid inside">' +
            '<div><h4>How it flows</h4><ol class="flow-steps">' + r.steps.map(function (s) { return "<li>" + md(s) + "</li>"; }).join("") + "</ol></div>" +
            "<div><h4>What's inside</h4><ul>" + r.inside.map(function (s) { return "<li>" + md(s) + "</li>"; }).join("") + "</ul></div>" +
          "</div></div>";
      }).join("") +
      "</div></section>";

    if (p.lessons && p.lessons.length) {
      html += '<section class="block reveal"><div class="wrap">' +
        '<h2 class="title">Problems I solved</h2>' +
        '<p class="lede" style="margin-bottom:22px">Real issues from building this, and how I fixed them.</p>' +
        '<div class="lessons">' + p.lessons.map(function (l) {
          return '<article class="lesson"><h3>' + md(l.problem) + '</h3><p class="fix">' + md(l.fix) + "</p></article>";
        }).join("") + "</div></div></section>";
    }

    if (p.gallery && p.gallery.length) {
      html += '<section class="block" id="gallery-section" hidden><div class="wrap">' +
        '<h2 class="title">Screenshots</h2>' +
        '<p class="lede" style="margin-bottom:22px">Select a screenshot to view it full size.</p>' +
        '<div class="gallery" id="gallery"></div></div></section>';
    }

    var next = PROJECTS[(idx + 1) % PROJECTS.length];
    if (PROJECTS.length > 1) {
      html += '<section class="block"><div class="wrap"><a class="next-project" href="project.html?id=' + encodeURIComponent(next.id) + '">' +
        "<span><small>Next project</small><strong>" + esc(next.title) + '</strong></span><span class="go">→</span></a></div></section>';
    }

    root.innerHTML = html;

    if (p.overview) window.Diagram.mount($("#overview-diagram"), p.overview);

    // Repo diagrams: mount each one when its tab first opens
    var mounted = {};
    function mountRepo(i) {
      if (mounted[i] || !p.repos[i].diagram) return;
      mounted[i] = true;
      window.Diagram.mount($("#panel-" + i + " .repo-diagram"), p.repos[i].diagram);
    }
    mountRepo(0);

    var tabs = Array.prototype.slice.call(root.querySelectorAll(".tab"));
    function select(i, focus) {
      tabs.forEach(function (t, j) {
        var on = i === j;
        t.setAttribute("aria-selected", on);
        t.tabIndex = on ? 0 : -1;
        $("#panel-" + j).hidden = !on;
      });
      mountRepo(i);
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(i); });
      t.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") { e.preventDefault(); select((i + 1) % tabs.length, true); }
        if (e.key === "ArrowLeft") { e.preventDefault(); select((i - 1 + tabs.length) % tabs.length, true); }
      });
    });

    if (p.gallery && p.gallery.length) buildGallery(p);
    reveal();
  }

  /* ---------- Gallery: shows only images that exist ---------- */
  function buildGallery(p) {
    var grid = $("#gallery"), section = $("#gallery-section");
    var dialog = $("#lightbox"), dImg = $("#lightbox img"), dCap = $("#lightbox p");
    p.gallery.forEach(function (g) {
      var src = "images/projects/" + p.id + "/" + g.file;
      var img = new Image();
      img.onload = function () {
        var fig = document.createElement("figure");
        fig.className = "shot";
        fig.innerHTML = '<button type="button" aria-label="View ' + esc(g.title) + ' full size"><img src="' + esc(src) + '" alt="' + esc(g.title + ": " + g.text) + '" loading="lazy"></button>' +
          "<figcaption><b>" + esc(g.title) + "</b><span>" + md(g.text) + "</span></figcaption>";
        fig.querySelector("button").addEventListener("click", function () {
          dImg.src = src; dImg.alt = g.title; dCap.textContent = g.title + ": " + g.text;
          if (dialog.showModal) dialog.showModal();
        });
        grid.appendChild(fig);
        section.hidden = false;
      };
      img.src = src;
    });
    if (dialog) dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
  }

  if (!projectRoot) reveal();
})();
