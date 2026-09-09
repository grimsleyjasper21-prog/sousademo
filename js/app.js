/* Salón Vera — app shell: i18n rendering, nav, language toggle,
   offline badge, install prompt, service worker registration. */
(function () {
  "use strict";

  var LANG_KEY = "salon-lang";
  var DICT = window.SALON_I18N;

  function detectDefaultLang() {
    var nav = (navigator.language || "es").toLowerCase();
    return nav.indexOf("en") === 0 ? "en" : "es";
  }

  function getLang() {
    try {
      var stored = localStorage.getItem(LANG_KEY);
      if (stored === "es" || stored === "en") return stored;
    } catch (e) {}
    return detectDefaultLang();
  }

  function setLang(lang) {
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    document.documentElement.lang = lang;
    applyTranslations();
    var toggleLabel = document.getElementById("lang-toggle-label");
    if (toggleLabel) toggleLabel.textContent = t("lang.switchTo");
    document.dispatchEvent(new CustomEvent("salon:i18n-changed", { detail: { lang: lang } }));
  }

  function getByPath(obj, path) {
    return path.split(".").reduce(function (acc, key) {
      return acc && acc[key] !== undefined ? acc[key] : undefined;
    }, obj);
  }

  function t(key) {
    var lang = getLang();
    var val = getByPath(DICT[lang], key);
    if (val === undefined) val = getByPath(DICT.es, key);
    return val === undefined ? "" : val;
  }
  window.SalonI18n = { t: t, getLang: getLang, setLang: setLang };

  function applyTranslations() {
    var lang = getLang();
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (!key) return;
      var val = t(key);
      if (typeof val === "string") el.textContent = val;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      var val = t(key);
      if (typeof val === "string") el.setAttribute("placeholder", val);
    });

    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      var spec = el.getAttribute("data-i18n-attr"); // "attr:key.path"
      var parts = spec.split(":");
      if (parts.length !== 2) return;
      var val = t(parts[1]);
      if (typeof val === "string") el.setAttribute(parts[0], val);
    });

    document.title = t("meta.title");
  }

  function initNav() {
    var toggle = document.getElementById("nav-toggle");
    var nav = document.getElementById("primary-nav");
    if (!toggle || !nav) return;

    function closeNav() {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
    function openNav() {
      nav.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
    }

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.contains("open");
      if (isOpen) closeNav(); else openNav();
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  function initLangToggle() {
    var btn = document.getElementById("lang-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var current = getLang();
      setLang(current === "es" ? "en" : "es");
    });
  }

  function initOfflineBadge() {
    var badge = document.getElementById("offline-badge");
    if (!badge) return;
    function update() {
      badge.hidden = navigator.onLine;
    }
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    update();
  }

  function isIos() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  }
  function isStandalone() {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  }

  function initInstallPrompt() {
    var banner = document.getElementById("install-banner");
    var installBtn = document.getElementById("install-action");
    var dismissBtn = document.getElementById("install-dismiss");
    if (!banner) return;

    var DISMISS_KEY = "salon-install-dismissed";
    var dismissed = false;
    try { dismissed = localStorage.getItem(DISMISS_KEY) === "1"; } catch (e) {}
    if (dismissed || isStandalone()) return;

    var deferredEvent = null;

    window.addEventListener("beforeinstallprompt", function (e) {
      e.preventDefault();
      deferredEvent = e;
      banner.hidden = false;
    });

    if (isIos()) {
      banner.hidden = false;
      if (installBtn) installBtn.hidden = true;
    }

    if (installBtn) {
      installBtn.addEventListener("click", function () {
        if (deferredEvent) {
          deferredEvent.prompt();
          deferredEvent.userChoice.finally(function () {
            banner.hidden = true;
          });
        }
      });
    }

    if (dismissBtn) {
      dismissBtn.addEventListener("click", function () {
        banner.hidden = true;
        try { localStorage.setItem(DISMISS_KEY, "1"); } catch (e) {}
      });
    }

    window.addEventListener("appinstalled", function () {
      banner.hidden = true;
      try { localStorage.setItem(DISMISS_KEY, "1"); } catch (e) {}
    });
  }

  function initServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    if (location.protocol !== "https:" && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") return;
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function (err) {
        console.warn("Service worker registration failed:", err);
      });
    });
  }

  function initBookNowLinks() {
    document.querySelectorAll(".book-service").forEach(function (el) {
      el.addEventListener("click", function () {
        var serviceId = el.getAttribute("data-service");
        if (window.SalonBooking && serviceId) {
          window.SalonBooking.preselectService(serviceId);
        }
      });
    });
  }

  function initYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyTranslations();
    initNav();
    initLangToggle();
    initOfflineBadge();
    initInstallPrompt();
    initServiceWorker();
    initBookNowLinks();
    initYear();
  });
})();
