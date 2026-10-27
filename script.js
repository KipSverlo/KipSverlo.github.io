(function () {
  "use strict";

  var STORAGE_KEY = "lang";
  var DEFAULT_LANG = "ru";
  var SUPPORTED = ["ru", "en"];

  var META = {
    ru: {
      title: "Перунов Аркадий — сайты и Telegram-боты для малого бизнеса",
      description:
        "Разрабатываю сайты и Telegram-боты под ключ для малого бизнеса. Приём заявок в чат, автозапись, каталог услуг. Срок 5–7 дней."
    },
    en: {
      title: "Arkadiy Perunov — websites and Telegram bots for small business",
      description:
        "I build turnkey websites and Telegram bots for small businesses. Leads straight to your chat, online booking, service catalog. Delivered in 5–7 days."
    }
  };

  var root = document.documentElement;

  // ---------- Language ----------

  function readStoredLang() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function storeLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* storage unavailable — choice just won't persist */
    }
  }

  function setMeta(selector, value) {
    var el = document.querySelector(selector);
    if (el) el.setAttribute("content", value);
  }

  function applyLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT_LANG;

    root.setAttribute("lang", lang);
    document.title = META[lang].title;
    setMeta('meta[name="description"]', META[lang].description);
    setMeta('meta[property="og:title"]', META[lang].title);
    setMeta('meta[property="og:description"]', META[lang].description);

    var buttons = document.querySelectorAll("[data-set-lang]");
    for (var i = 0; i < buttons.length; i++) {
      var active = buttons[i].getAttribute("data-set-lang") === lang;
      buttons[i].classList.toggle("is-active", active);
      buttons[i].setAttribute("aria-pressed", active ? "true" : "false");
    }
  }

  applyLang(readStoredLang() || DEFAULT_LANG);

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-set-lang]");
    if (!btn) return;
    var lang = btn.getAttribute("data-set-lang");
    applyLang(lang);
    storeLang(lang);
  });

  // ---------- Header & mobile menu ----------

  var header = document.getElementById("header");
  var nav = document.getElementById("nav");
  var burger = document.getElementById("burger");

  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    header.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  }

  burger.addEventListener("click", function () {
    setMenu(!nav.classList.contains("is-open"));
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) setMenu(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Hero entrance ----------

  var hero = document.querySelector(".hero");
  var WORD_STEP = 70;

  // Wrap every word of the title (both languages) so it can fade in on its own.
  function splitWords(el) {
    var nodes = Array.prototype.slice.call(el.childNodes);
    var count = 0;
    nodes.forEach(function (node) {
      if (node.nodeType === 3) {
        var parts = node.textContent.split(/(\s+)/);
        var frag = document.createDocumentFragment();
        parts.forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
          } else {
            var span = document.createElement("span");
            span.className = "hero__word";
            span.textContent = part;
            span.style.setProperty("--d", 150 + count * WORD_STEP + "ms");
            frag.appendChild(span);
            count++;
          }
        });
        el.replaceChild(frag, node);
      } else if (node.nodeType === 1) {
        node.classList.add("hero__word");
        node.style.setProperty("--d", 150 + count * WORD_STEP + "ms");
        count++;
      }
    });
    return count;
  }

  if (hero) {
    var titleParts = hero.querySelectorAll(".hero__title > [data-lang]");
    var maxWords = 0;
    for (var t = 0; t < titleParts.length; t++) {
      maxWords = Math.max(maxWords, splitWords(titleParts[t]));
    }

    // eyebrow first, then subtitle and buttons after the title
    var afterTitle = 150 + maxWords * WORD_STEP + 150;
    var heroItems = hero.querySelectorAll(".hero-anim");
    for (var h = 0; h < heroItems.length; h++) {
      var delay = h === 0 ? 0 : afterTitle + (h - 1) * 120;
      heroItems[h].style.setProperty("--d", delay + "ms");
    }

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        hero.classList.add("is-in");
      });
    });
  }

  // ---------- Reveal on scroll ----------

  var REVEAL_SELECTOR = ".section__head, .card, .timeline__step, .pricing__note, .contact";
  var REVEAL_STAGGER = 100;
  var revealEls = document.querySelectorAll(REVEAL_SELECTOR);

  function show(el) {
    el.classList.add("is-visible");
    // drop the stagger delay afterwards so hover effects stay instant
    var d = parseInt(el.style.transitionDelay, 10) || 0;
    setTimeout(function () {
      el.style.transitionDelay = "";
    }, d + 900);
  }

  if (!reduceMotion && "IntersectionObserver" in window) {
    for (var r = 0; r < revealEls.length; r++) {
      var el = revealEls[r];
      el.classList.add("reveal");
      // stagger among siblings in the same row/grid
      var index = 0;
      var prev = el.previousElementSibling;
      while (prev) {
        if (prev.matches(REVEAL_SELECTOR)) index++;
        prev = prev.previousElementSibling;
      }
      if (index) el.style.transitionDelay = index * REVEAL_STAGGER + "ms";
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          show(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    for (var o = 0; o < revealEls.length; o++) observer.observe(revealEls[o]);
  }

  // ---------- Smooth scroll ----------

  document.addEventListener("click", function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;

    var id = link.getAttribute("href").slice(1);
    var behavior = reduceMotion ? "auto" : "smooth";

    if (id === "" || id === "top") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: behavior });
    } else {
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      var offset = header.offsetHeight + 16;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: behavior });
    }

    setMenu(false);
    if (history.replaceState) history.replaceState(null, "", "#" + id);
  });
})();
