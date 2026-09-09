/* Salón Vera — booking wizard.
   Demo only: appointments are stored in localStorage on this device and
   are never transmitted anywhere. */
(function () {
  "use strict";

  var STORAGE_KEY = "salon-bookings";
  var SERVICES = ["cut", "color", "blowdry", "treatment", "bridal", "grooming"];
  var STYLISTS = { marta: "Marta Bonet", jaume: "Jaume Ferrer", aina: "Aina Roig" };

  var state = {
    step: 1,
    serviceId: null,
    date: null,
    time: null,
    name: "",
    email: "",
    phone: "",
    stylist: "",
    notes: ""
  };

  function t(key) { return window.SalonI18n ? window.SalonI18n.t(key) : ""; }

  // ---------- storage ----------
  function loadBookings() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }
  function saveBookings(list) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) {}
  }
  function generateReference() {
    var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    var out = "SV-";
    for (var i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  }

  // ---------- deterministic demo "busy" slots (cosmetic realism only) ----------
  function hashStr(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) { h = (h << 5) - h + str.charCodeAt(i); h |= 0; }
    return Math.abs(h);
  }
  function isSeedBusy(dateStr, timeStr) {
    return hashStr(dateStr + timeStr) % 5 === 0; // ~20% cosmetically pre-booked
  }

  function isUserBooked(dateStr, timeStr, excludeRef) {
    return loadBookings().some(function (b) {
      return b.date === dateStr && b.time === timeStr && b.status !== "cancelled" && b.reference !== excludeRef;
    });
  }

  // ---------- date helpers ----------
  function todayISO() {
    var d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  }
  function isSunday(dateStr) {
    var d = new Date(dateStr + "T00:00:00");
    return d.getDay() === 0;
  }
  function generateTimeSlots() {
    var slots = [];
    for (var h = 9; h <= 19; h++) {
      for (var m = 0; m < 60; m += 30) {
        if (h === 9 && m === 0) continue; // opens 9:30
        if (h === 19 && m === 30) { slots.push("19:30"); continue; }
        if (h === 20) break;
        slots.push((h < 10 ? "0" + h : h) + ":" + (m === 0 ? "00" : m));
      }
    }
    return slots;
  }
  function isPast(dateStr, timeStr) {
    var now = new Date();
    var slot = new Date(dateStr + "T" + timeStr + ":00");
    return slot.getTime() < now.getTime();
  }

  // ---------- DOM refs (queried lazily since script may load before DOM ready) ----------
  var el = {};
  function cacheEls() {
    el.wizard = document.getElementById("booking-wizard");
    el.form = document.getElementById("booking-form");
    el.steps = document.getElementById("wizard-steps");
    el.panels = el.form ? el.form.querySelectorAll(".wizard-panel") : [];
    el.serviceGrid = document.getElementById("service-choice-grid");
    el.dateInput = document.getElementById("booking-date");
    el.slotGrid = document.getElementById("time-slot-grid");
    el.noSlotsHint = document.getElementById("no-slots-hint");
    el.nameInput = document.getElementById("booking-name");
    el.emailInput = document.getElementById("booking-email");
    el.phoneInput = document.getElementById("booking-phone");
    el.stylistSelect = document.getElementById("booking-stylist");
    el.notesInput = document.getElementById("booking-notes");
    el.consentInput = document.getElementById("booking-consent");
    el.summary = document.getElementById("booking-summary");
    el.backBtn = document.getElementById("wizard-back");
    el.nextBtn = document.getElementById("wizard-next");
    el.submitBtn = document.getElementById("wizard-submit");
    el.success = document.getElementById("wizard-success");
    el.reference = document.getElementById("booking-reference");
    el.addAnotherBtn = document.getElementById("btn-add-another");
    el.manageBtn = document.getElementById("btn-manage");
    el.manageStandaloneBtn = document.getElementById("btn-manage-standalone");
    el.manageModal = document.getElementById("manage-modal");
    el.manageList = document.getElementById("manage-list");
    el.manageClose = document.getElementById("manage-close");
  }

  function clearError(id) {
    var e = document.getElementById(id);
    if (e) { e.hidden = true; e.textContent = ""; }
  }
  function showError(id, msg) {
    var e = document.getElementById(id);
    if (e) { e.hidden = false; e.textContent = msg; }
  }

  // ---------- render: service choices ----------
  function renderServiceGrid() {
    if (!el.serviceGrid) return;
    el.serviceGrid.innerHTML = "";
    SERVICES.forEach(function (id) {
      var name = t("services.list." + id + ".name");
      var price = t("services.list." + id + ".price");
      var wrap = document.createElement("label");
      wrap.className = "service-choice" + (state.serviceId === id ? " selected" : "");
      wrap.innerHTML =
        '<input type="radio" name="service" value="' + id + '"' + (state.serviceId === id ? " checked" : "") + '>' +
        '<span class="sc-name">' + name + "</span>" +
        '<span class="sc-price">' + price + "</span>";
      wrap.querySelector("input").addEventListener("change", function () {
        state.serviceId = id;
        clearError("error-service");
        renderServiceGrid();
      });
      el.serviceGrid.appendChild(wrap);
    });
  }

  // ---------- render: time slots ----------
  function renderTimeSlots() {
    if (!el.slotGrid) return;
    el.slotGrid.innerHTML = "";
    var dateStr = el.dateInput ? el.dateInput.value : "";
    if (!dateStr) { el.noSlotsHint.hidden = true; return; }

    var slots = generateTimeSlots();
    var anyAvailable = false;

    slots.forEach(function (time) {
      var taken = isSeedBusy(dateStr, time) || isUserBooked(dateStr, time, state.editingReference);
      var past = dateStr === todayISO() && isPast(dateStr, time);
      var disabled = taken || past;
      if (!disabled) anyAvailable = true;

      var label = document.createElement("label");
      label.className = "time-slot" + (disabled ? " taken" : "") + (state.time === time && !disabled ? " selected" : "");
      label.innerHTML =
        '<input type="radio" name="time" value="' + time + '"' + (disabled ? " disabled" : "") + (state.time === time ? " checked" : "") + ">" + time;
      if (!disabled) {
        label.querySelector("input").addEventListener("change", function () {
          state.time = time;
          clearError("error-slot");
          renderTimeSlots();
        });
      }
      el.slotGrid.appendChild(label);
    });

    el.noSlotsHint.hidden = anyAvailable;
  }

  // ---------- render: confirm summary ----------
  function renderSummary() {
    if (!el.summary) return;
    var stylistLabel = state.stylist ? STYLISTS[state.stylist] : t("booking.detailsStep.stylistAny");
    el.summary.innerHTML =
      "<dt>" + t("booking.confirmStep.service") + "</dt><dd>" + t("services.list." + state.serviceId + ".name") + "</dd>" +
      "<dt>" + t("booking.confirmStep.when") + "</dt><dd>" + formatDateHuman(state.date) + " · " + state.time + "</dd>" +
      "<dt>" + t("booking.confirmStep.stylist") + "</dt><dd>" + stylistLabel + "</dd>" +
      "<dt>" + t("booking.confirmStep.name") + "</dt><dd>" + escapeHtml(state.name) + "</dd>" +
      "<dt>" + t("booking.confirmStep.contact") + "</dt><dd>" + escapeHtml(state.email) + " · " + escapeHtml(state.phone) + "</dd>";
  }
  function escapeHtml(str) {
    return String(str || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function formatDateHuman(dateStr) {
    if (!dateStr) return "";
    var lang = window.SalonI18n ? window.SalonI18n.getLang() : "es";
    var d = new Date(dateStr + "T00:00:00");
    try {
      return d.toLocaleDateString(lang === "en" ? "en-GB" : "es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    } catch (e) { return dateStr; }
  }

  // ---------- wizard navigation ----------
  function goToStep(n) {
    state.step = n;
    el.panels.forEach(function (panel) {
      panel.hidden = Number(panel.getAttribute("data-panel")) !== n;
    });
    if (el.steps) {
      el.steps.querySelectorAll("li").forEach(function (li) {
        var s = Number(li.getAttribute("data-step"));
        li.classList.remove("active", "done");
        if (s === n) li.classList.add("active");
        else if (s < n) li.classList.add("done");
      });
    }
    el.backBtn.hidden = n === 1;
    el.nextBtn.hidden = n === 4;
    el.submitBtn.hidden = n !== 4;
    if (n === 2) renderTimeSlots();
    if (n === 4) renderSummary();
    if (el.wizard) el.wizard.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function validateStep(n) {
    if (n === 1) {
      if (!state.serviceId) { showError("error-service", t("booking.errors.selectService")); return false; }
      clearError("error-service");
      return true;
    }
    if (n === 2) {
      var ok = true;
      var dateStr = el.dateInput.value;
      if (!dateStr) { showError("error-date", t("booking.errors.required")); ok = false; }
      else if (dateStr < todayISO()) { showError("error-date", t("booking.dateStep.pastDate")); ok = false; }
      else if (isSunday(dateStr)) { showError("error-date", t("booking.dateStep.closedDay")); ok = false; }
      else clearError("error-date");

      if (ok) state.date = dateStr;
      if (!state.time) { showError("error-slot", t("booking.errors.selectSlot")); ok = false; }
      else clearError("error-slot");
      return ok;
    }
    if (n === 3) {
      var ok3 = true;
      state.name = el.nameInput.value.trim();
      state.email = el.emailInput.value.trim();
      state.phone = el.phoneInput.value.trim();
      state.stylist = el.stylistSelect.value;
      state.notes = el.notesInput.value.trim();

      if (!state.name) { showError("error-name", t("booking.errors.required")); ok3 = false; } else clearError("error-name");
      var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(state.email)) { showError("error-email", t("booking.errors.email")); ok3 = false; } else clearError("error-email");
      var phoneRe = /^[+\d][\d\s()-]{5,}$/;
      if (!phoneRe.test(state.phone)) { showError("error-phone", t("booking.errors.phone")); ok3 = false; } else clearError("error-phone");
      if (!el.consentInput.checked) { showError("error-consent", t("booking.errors.consent")); ok3 = false; } else clearError("error-consent");
      return ok3;
    }
    return true;
  }

  function resetWizard() {
    state = { step: 1, serviceId: null, date: null, time: null, name: "", email: "", phone: "", stylist: "", notes: "" };
    el.form.reset();
    el.form.hidden = false;
    el.success.hidden = true;
    renderServiceGrid();
    goToStep(1);
  }

  function submitBooking() {
    var booking = {
      reference: generateReference(),
      serviceId: state.serviceId,
      date: state.date,
      time: state.time,
      name: state.name,
      email: state.email,
      phone: state.phone,
      stylist: state.stylist,
      notes: state.notes,
      status: "confirmed",
      createdAt: new Date().toISOString()
    };
    var list = loadBookings();
    list.push(booking);
    saveBookings(list);
    return booking;
  }

  // ---------- manage bookings modal ----------
  function renderManageList() {
    if (!el.manageList) return;
    var list = loadBookings().slice().reverse();
    if (list.length === 0) {
      el.manageList.innerHTML = '<p class="field-hint">' + t("booking.manage.empty") + "</p>";
      return;
    }
    el.manageList.innerHTML = "";
    list.forEach(function (b) {
      var row = document.createElement("div");
      row.className = "booking-item" + (b.status === "cancelled" ? " cancelled" : "");
      var stylistLabel = b.stylist ? STYLISTS[b.stylist] : t("booking.detailsStep.stylistAny");
      row.innerHTML =
        '<div class="booking-item-info">' +
        "<strong>" + t("services.list." + b.serviceId + ".name") + "</strong>" +
        formatDateHuman(b.date) + " · " + b.time + "<br>" +
        stylistLabel + " · " + escapeHtml(b.name) + "<br>" +
        '<span style="opacity:.7">' + b.reference + (b.status === "cancelled" ? " — " + t("booking.manage.cancelled") : "") + "</span>" +
        "</div>";
      if (b.status !== "cancelled") {
        var cancelBtn = document.createElement("button");
        cancelBtn.type = "button";
        cancelBtn.className = "btn btn-ghost btn-small";
        cancelBtn.textContent = t("booking.manage.cancel");
        cancelBtn.addEventListener("click", function () {
          var all = loadBookings();
          var target = all.find(function (x) { return x.reference === b.reference; });
          if (target) target.status = "cancelled";
          saveBookings(all);
          renderManageList();
        });
        row.appendChild(cancelBtn);
      }
      el.manageList.appendChild(row);
    });
  }

  function openManageModal() {
    renderManageList();
    el.manageModal.hidden = false;
  }
  function closeManageModal() {
    el.manageModal.hidden = true;
  }

  // ---------- public API ----------
  window.SalonBooking = {
    preselectService: function (id) {
      if (SERVICES.indexOf(id) === -1) return;
      state.serviceId = id;
      renderServiceGrid();
      if (el.success && !el.success.hidden) resetWizard();
      goToStep(1);
    }
  };

  function init() {
    cacheEls();
    if (!el.form) return;

    if (el.dateInput) el.dateInput.min = todayISO();

    renderServiceGrid();
    goToStep(1);

    el.nextBtn.addEventListener("click", function () {
      if (validateStep(state.step)) goToStep(Math.min(4, state.step + 1));
    });
    el.backBtn.addEventListener("click", function () {
      goToStep(Math.max(1, state.step - 1));
    });
    if (el.dateInput) {
      el.dateInput.addEventListener("change", function () {
        state.time = null;
        renderTimeSlots();
      });
    }

    el.form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validateStep(3) || !state.serviceId || !state.date || !state.time) return;
      var booking = submitBooking();
      el.form.hidden = true;
      el.success.hidden = false;
      el.reference.textContent = booking.reference;
      el.wizard.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    el.addAnotherBtn.addEventListener("click", resetWizard);
    el.manageBtn.addEventListener("click", openManageModal);
    el.manageStandaloneBtn.addEventListener("click", openManageModal);
    el.manageClose.addEventListener("click", closeManageModal);
    el.manageModal.addEventListener("click", function (e) {
      if (e.target === el.manageModal) closeManageModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !el.manageModal.hidden) closeManageModal();
    });

    document.addEventListener("salon:i18n-changed", function () {
      renderServiceGrid();
      if (state.step === 2) renderTimeSlots();
      if (state.step === 4) renderSummary();
      if (!el.manageModal.hidden) renderManageList();
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
