(function () {
  var header = document.querySelector(".site-header");
  var nav = document.querySelector(".site-nav");
  var toggle = document.querySelector(".nav-toggle");
  var heroVideo = document.getElementById("hero-video");
  var yearEl = document.getElementById("year");
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = lightbox ? lightbox.querySelector(".lightbox-img") : null;
  var closeBtn = lightbox ? lightbox.querySelector(".lightbox-close") : null;

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeMobileNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    nav.querySelectorAll("details.nav-dropdown").forEach(function (d) {
      d.open = false;
    });
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMobileNav();
      });
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      var clickInsideNav = nav.contains(event.target);
      var clickToggle = toggle.contains(event.target);
      if (!clickInsideNav && !clickToggle) {
        closeMobileNav();
      }
    });
  }

  document.querySelectorAll(".nav-dropdown-panel a").forEach(function (link) {
    link.addEventListener("click", function () {
      document.querySelectorAll("details.nav-dropdown").forEach(function (d) {
        d.open = false;
      });
    });
  });

  document.addEventListener("click", function (event) {
    if (event.target.closest(".nav-dropdown")) return;
    document.querySelectorAll("details.nav-dropdown").forEach(function (d) {
      d.open = false;
    });
  });

  var sectionLinks = Array.prototype.slice.call(
    document.querySelectorAll(".site-nav a[href^='#']")
  );
  var sectionMap = {};

  sectionLinks.forEach(function (link) {
    var id = link.getAttribute("href").slice(1);
    var sectionEl = document.getElementById(id);
    if (sectionEl) {
      sectionMap[id] = link;
    }
  });

  var aboutSummary = document.querySelector(".nav-dropdown-summary");

  if ("IntersectionObserver" in window && Object.keys(sectionMap).length > 0) {
    var activeId = "";
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            activeId = entry.target.id;
          }
        });

        sectionLinks.forEach(function (link) {
          var id = link.getAttribute("href").slice(1);
          link.classList.toggle("is-active", id === activeId);
        });

        if (aboutSummary) {
          aboutSummary.classList.toggle(
            "is-active",
            activeId === "about" || activeId === "how-we-build"
          );
        }
      },
      {
        root: null,
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0
      }
    );

    Object.keys(sectionMap).forEach(function (id) {
      observer.observe(document.getElementById(id));
    });
  }

  function setupHeroPlaylist() {
    if (!heroVideo) return;
    var raw = heroVideo.getAttribute("data-playlist") || "";
    var videos = raw
      .split(",")
      .map(function (item) {
        return item.trim();
      })
      .filter(Boolean);

    if (videos.length < 2) return;

    var currentIndex = 0;
    var loadTimeout = null;
    heroVideo.removeAttribute("loop");
    heroVideo.muted = true;
    heroVideo.playsInline = true;

    function playIndex(nextIndex) {
      if (loadTimeout) {
        clearTimeout(loadTimeout);
        loadTimeout = null;
      }
      currentIndex = nextIndex;
      heroVideo.src = videos[currentIndex];
      heroVideo.load();

      // If a file cannot be decoded/loaded, skip quickly to the next one.
      loadTimeout = setTimeout(function () {
        var next = (currentIndex + 1) % videos.length;
        playIndex(next);
      }, 2500);
    }

    heroVideo.addEventListener("loadeddata", function () {
      if (loadTimeout) {
        clearTimeout(loadTimeout);
        loadTimeout = null;
      }
      var playPromise = heroVideo.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {});
      }
    });

    heroVideo.addEventListener("ended", function () {
      var next = (currentIndex + 1) % videos.length;
      playIndex(next);
    });

    heroVideo.addEventListener("error", function () {
      var next = (currentIndex + 1) % videos.length;
      playIndex(next);
    });

    playIndex(0);
  }

  setupHeroPlaylist();

  var topButton = document.getElementById("back-to-top");
  if (topButton) {
    window.addEventListener("scroll", function () {
      topButton.classList.toggle("is-visible", window.scrollY > 520);
    }, { passive: true });

    topButton.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.hidden = true;
    lightboxImg.src = "";
    lightboxImg.alt = "";
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-lightbox]").forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      var img = anchor.querySelector("img");
      openLightbox(anchor.getAttribute("href"), img ? img.getAttribute("alt") : "");
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav && nav.classList.contains("is-open") && toggle) {
      closeMobileNav();
    }
    if (e.key === "Escape" && lightbox && !lightbox.hidden) {
      closeLightbox();
    }
  });
})();
