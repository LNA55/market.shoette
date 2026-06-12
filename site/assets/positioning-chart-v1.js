/*!
 * PositioningChart v1 — moteur du graphique 2b (pipeline de veille concurrentielle)
 * Vanilla JS + SVG, zéro dépendance.
 *
 * API : PositioningChart.mount(element, RUN_DATA, { lang: "fr" })
 * Contrats : .claude/skills/read-the-market/references/site-contracts.md
 * Schéma des données : .claude/skills/read-the-market/references/data-schema.md
 *
 * Version figée : correctifs rétro-compatibles uniquement.
 * Changement d'API ou de comportement => nouveau fichier positioning-chart-v2.js.
 *
 * 2026-06-12 — ajout rétro-compatible (session moteur dédiée, Skill 3) :
 * marqueur « mon projet » via players[].is_mine (rayons radiaux, nom en gras,
 * badge tooltip/fiche, note de légende et ligne d'export conditionnelles).
 * Sans is_mine dans les données, le rendu est strictement inchangé.
 */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ i18n */

  const STR = {
    fr: {
      marketShare: "Part de marché (%)",
      growth: "Croissance (%)",
      chY: "Position Y", chX: "Position X + Couleur", chSize: "Taille",
      chOpacity: "Opacité", chBorder: "Bordure",
      none: "(aucune)",
      defaultLayerName: "Défaut (proposé par l'agent IA)",
      layers: "Calques", newLayer: "+ Nouveau calque", layerN: "Calque",
      layersHint: "Haut de liste = arrière-plan. Glisser ⠿ pour réordonner, cliquer pour activer.",
      channels: "Canaux visuels", addDim: "+ Ajouter une dimension",
      display: "Affichage", zoom: "Zoom", reset: "Réinitialiser la configuration par défaut",
      showLinks: "Afficher les lignes de liaison",
      exportLabel: "Exporter :",
      lastUpdated: "Dernière mise à jour",
      estimatedNote: "~ = valeur estimée",
      myProject: "mon projet",
      close: "✕", sourcesT: "Sources", factsT: "Faits marquants",
      lockTip: "Verrouiller (figer cette vue)", visTip: "Afficher / masquer",
      delTip: "Supprimer le calque", dragTip: "Glisser pour réordonner",
      opacityTip: "Opacité du calque",
      withoutData: "acteur(s) significatif(s) sans données chiffrées — détail sous le graphique",
      naBand: "Y inconnu",
      dimName: "Nom", dimType: "Type", numericT: "Numérique", ordinalT: "Ordinale",
      dimValues: "Valeurs ordonnées, séparées par des virgules",
      dimMin: "Min", dimMax: "Max", add: "Ajouter", cancel: "Annuler",
      lockedHint: "Calque verrouillé — déverrouille-le pour modifier ses canaux.",
      alignedY: "Aucune dimension en X : marqueurs alignés sur l'axe Y.",
      axisOfActive: "(axes du calque actif)",
      exportTitle: "Graphique de positionnement",
      run: "Run", activeLayers: "Calques actifs", legendT: "Légende",
      readingKeyT: "Clé de lecture",
      missing: "—",
    },
    en: {
      marketShare: "Market share (%)",
      growth: "Growth (%)",
      chY: "Y position", chX: "X position + Color", chSize: "Size",
      chOpacity: "Opacity", chBorder: "Border",
      none: "(none)",
      defaultLayerName: "Default (proposed by the AI agent)",
      layers: "Layers", newLayer: "+ New layer", layerN: "Layer",
      layersHint: "Top of list = background. Drag ⠿ to reorder, click to activate.",
      channels: "Visual channels", addDim: "+ Add a dimension",
      display: "Display", zoom: "Zoom", reset: "Reset to default configuration",
      showLinks: "Show linking lines",
      exportLabel: "Export:",
      lastUpdated: "Last updated",
      estimatedNote: "~ = estimated value",
      myProject: "my project",
      close: "✕", sourcesT: "Sources", factsT: "Key facts",
      lockTip: "Lock (save this view)", visTip: "Show / hide",
      delTip: "Delete layer", dragTip: "Drag to reorder",
      opacityTip: "Layer opacity",
      withoutData: "significant player(s) with no quantitative data — listed below the chart",
      naBand: "Y unknown",
      dimName: "Name", dimType: "Type", numericT: "Numeric", ordinalT: "Ordinal",
      dimValues: "Ordered values, comma-separated",
      dimMin: "Min", dimMax: "Max", add: "Add", cancel: "Cancel",
      lockedHint: "Layer is locked — unlock it to edit its channels.",
      alignedY: "No X dimension: markers aligned on the Y axis.",
      axisOfActive: "(axes of the active layer)",
      exportTitle: "Positioning chart",
      run: "Run", activeLayers: "Active layers", legendT: "Legend",
      readingKeyT: "Reading key",
      missing: "—",
    },
  };

  /* -------------------------------------------------------------- constants */

  const HUES = [221, 4, 158, 33, 262, 190, 320, 80];          // une teinte par calque
  const BORDER_TYPES = ["dashed-loose", "dashed-tight", "solid", "double", "triple"];
  const VB_W = 960, VB_H = 560;
  const MARGIN = { t: 26, r: 30, b: 52, l: 70 };
  const NA_BAND_H = 30;
  const SVGNS = "http://www.w3.org/2000/svg";

  /* ---------------------------------------------------------------- helpers */

  let UID = 0;
  function uid() { return "pc" + (++UID); }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function svgEl(tag, attrs) {
    const n = document.createElementNS(SVGNS, tag);
    if (attrs) for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  function fmtNum(v) {
    const r = Math.round(v * 10) / 10;
    return (r % 1 === 0 ? String(Math.round(r)) : String(r));
  }

  function slugify(s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "dim";
  }

  function wrapText(text, maxChars) {
    const words = String(text || "").split(/\s+/);
    const lines = [];
    let line = "";
    for (const w of words) {
      if ((line + " " + w).trim().length > maxChars) { if (line) lines.push(line); line = w; }
      else line = (line + " " + w).trim();
    }
    if (line) lines.push(line);
    return lines;
  }

  /* ----------------------------------------------------------------- Chart */

  function Chart(el, data, opts) {
    this.el = el;
    this.data = data || {};
    const lang = ((opts && opts.lang) || (this.data.market && this.data.market.language) || "fr").slice(0, 2);
    this.t = STR[lang] || STR.fr;
    this.lang = STR[lang] ? lang : "fr";

    this.dims = this.buildDims();
    this.layers = [this.makeDefaultLayer()];
    this.activeLayerId = this.layers[0].id;
    this.manualCount = 0;
    this.showLinks = false;
    this.zoom = 1;
    this.selectedPlayerId = null;
    this.dragLayerId = null;

    this.buildDOM();
    this.update();
  }

  /* ---- données & échelles ---- */

  Chart.prototype.buildDims = function () {
    const t = this.t, data = this.data;
    const players = data.players || [];
    const ext = (get) => {
      let min = Infinity, max = -Infinity;
      players.forEach((p) => {
        const o = get(p);
        if (o && typeof o.value === "number") { min = Math.min(min, o.value); max = Math.max(max, o.value); }
      });
      if (min === Infinity) { min = 0; max = 1; }
      if (min === max) { min -= 1; max += 1; }
      // marge haute proportionnelle à l'étendue (robuste aux valeurs négatives, ex. croissance)
      const pad = (max - min) * 0.08 || 1;
      return { min: Math.min(0, min), max: max + pad };
    };
    const dims = [
      { id: "market_share", label: t.marketShare, type: "numeric", unit: "%", scale: ext((p) => p.market_share_pct) },
      { id: "growth", label: t.growth, type: "numeric", unit: "%", scale: ext((p) => p.growth_pct) },
    ];
    const list = ((data.reading && data.reading.dimensions) || []).slice()
      .sort((a, b) => (a.rank || 99) - (b.rank || 99));
    list.forEach((d) => {
      dims.push({
        id: d.id, label: d.label || d.id, type: d.type || "numeric",
        unit: d.unit || "", scale: d.scale || null, description: d.description || "",
      });
    });
    return dims;
  };

  Chart.prototype.dim = function (id) {
    return this.dims.find((d) => d.id === id) || null;
  };

  Chart.prototype.rawValue = function (p, dimId) {
    if (!dimId) return null;
    if (dimId === "market_share") return p.market_share_pct || null;
    if (dimId === "growth") return p.growth_pct || null;
    return (p.dimensions || {})[dimId] || null;
  };

  // Liste ordonnée des valeurs d'une dimension ordinale/catégorielle
  Chart.prototype.ordinalValues = function (dim) {
    if (dim.scale && Array.isArray(dim.scale.values) && dim.scale.values.length) return dim.scale.values;
    const seen = [];
    (this.data.players || []).forEach((p) => {
      const o = this.rawValue(p, dim.id);
      if (o && o.value != null && seen.indexOf(o.value) === -1) seen.push(o.value);
    });
    return seen;
  };

  Chart.prototype.numericScale = function (dim) {
    if (dim.scale && typeof dim.scale.min === "number" && typeof dim.scale.max === "number" && dim.scale.max > dim.scale.min) {
      return { min: dim.scale.min, max: dim.scale.max };
    }
    let min = Infinity, max = -Infinity;
    (this.data.players || []).forEach((p) => {
      const o = this.rawValue(p, dim.id);
      if (o && typeof o.value === "number") { min = Math.min(min, o.value); max = Math.max(max, o.value); }
    });
    if (min === Infinity) { min = 0; max = 1; }
    if (min === max) { min -= 1; max += 1; }
    return { min: min, max: max };
  };

  // valeur -> [0,1] (null si manquante)
  Chart.prototype.norm = function (dimId, p) {
    const dim = this.dim(dimId);
    if (!dim) return null;
    const o = this.rawValue(p, dimId);
    if (!o || o.value == null) return null;
    if (dim.type === "numeric") {
      if (typeof o.value !== "number") return null;
      const s = this.numericScale(dim);
      return Math.max(0, Math.min(1, (o.value - s.min) / (s.max - s.min)));
    }
    const vals = this.ordinalValues(dim);
    const i = vals.indexOf(o.value);
    if (i === -1) return null;
    return vals.length > 1 ? i / (vals.length - 1) : 0.5;
  };

  Chart.prototype.fmtValue = function (dimId, p) {
    const t = this.t, dim = this.dim(dimId);
    const o = this.rawValue(p, dimId);
    if (!o || o.value == null) return t.missing;
    const prefix = o.estimated ? "~" : "";
    if (dim && dim.type === "numeric" && typeof o.value === "number") {
      return prefix + fmtNum(o.value) + (dim.unit ? " " + dim.unit : "");
    }
    return prefix + String(o.value);
  };

  /* ---- calques ---- */

  Chart.prototype.makeDefaultLayer = function () {
    const dc = (this.data.reading && this.data.reading.default_channels) || {};
    const valid = (id) => (id && this.dims.some((d) => d.id === id) ? id : null);
    return {
      id: uid(), isDefault: true, name: this.t.defaultLayerName,
      visible: true, locked: false, opacity: 1, userOpacity: false,
      config: {
        y: valid(dc.y) || "market_share",
        x_color: valid(dc.x_color),
        size: valid(dc.size),
        opacity: valid(dc.opacity),
        border: valid(dc.border),
      },
    };
  };

  Chart.prototype.activeLayer = function () {
    return this.layers.find((l) => l.id === this.activeLayerId) || this.layers[0];
  };

  Chart.prototype.effectiveOpacity = function (layer) {
    const othersVisible = this.layers.some((l) => l !== layer && l.visible);
    if (layer.isDefault && othersVisible && !layer.userOpacity) return Math.min(layer.opacity, 0.35);
    return layer.opacity;
  };

  Chart.prototype.layerHue = function (layer) {
    return HUES[this.layers.indexOf(layer) % HUES.length];
  };

  /* ---- DOM ---- */

  Chart.prototype.buildDOM = function () {
    const t = this.t;
    this.el.classList.add("pc-root");
    this.el.innerHTML =
      '<div class="pc-panel">' +
      '  <div class="pc-section pc-section-channels">' +
      '    <div class="pc-section-title">' + esc(t.channels) + ' <span class="pc-hint pc-axhint">' + esc(t.axisOfActive) + "</span></div>" +
      '    <div class="pc-channels"></div>' +
      '    <div class="pc-lockedhint pc-hint" hidden>' + esc(t.lockedHint) + "</div>" +
      '    <button type="button" class="pc-btn pc-adddim-open" data-action="adddim-open">' + esc(t.addDim) + "</button>" +
      '    <form class="pc-adddim" hidden>' +
      '      <input type="text" class="pc-adddim-name" placeholder="' + esc(t.dimName) + '" required>' +
      '      <select class="pc-adddim-type"><option value="numeric">' + esc(t.numericT) + '</option><option value="ordinal">' + esc(t.ordinalT) + "</option></select>" +
      '      <span class="pc-adddim-num"><input type="number" class="pc-adddim-min" value="0" title="' + esc(t.dimMin) + '"> – <input type="number" class="pc-adddim-max" value="10" title="' + esc(t.dimMax) + '"></span>' +
      '      <input type="text" class="pc-adddim-values" placeholder="' + esc(t.dimValues) + '" hidden>' +
      '      <button type="submit" class="pc-btn">' + esc(t.add) + "</button>" +
      '      <button type="button" class="pc-btn" data-action="adddim-cancel">' + esc(t.cancel) + "</button>" +
      "    </form>" +
      "  </div>" +
      '  <div class="pc-section pc-section-layers">' +
      '    <div class="pc-section-title">' + esc(t.layers) + "</div>" +
      '    <div class="pc-layers"></div>' +
      '    <button type="button" class="pc-btn" data-action="newlayer">' + esc(t.newLayer) + "</button>" +
      '    <div class="pc-hint">' + esc(t.layersHint) + "</div>" +
      "  </div>" +
      '  <div class="pc-section pc-section-display">' +
      '    <div class="pc-section-title">' + esc(t.display) + "</div>" +
      '    <label class="pc-row"><span>' + esc(t.zoom) + '</span> <input type="range" class="pc-zoom" min="50" max="200" value="100"> <span class="pc-zoomval">100%</span></label>' +
      '    <label class="pc-row"><input type="checkbox" class="pc-links"> ' + esc(t.showLinks) + "</label>" +
      '    <button type="button" class="pc-btn" data-action="reset">' + esc(t.reset) + "</button>" +
      '    <div class="pc-row pc-exportrow"><span>' + esc(t.exportLabel) + "</span> " +
      '      <button type="button" class="pc-btn" data-action="export-png">PNG</button>' +
      '      <button type="button" class="pc-btn" data-action="export-svg">SVG</button></div>' +
      "  </div>" +
      "</div>" +
      '<div class="pc-stage">' +
      '  <div class="pc-svgwrap"></div>' +
      '  <aside class="pc-side" hidden></aside>' +
      "</div>" +
      '<div class="pc-foot">' +
      '  <span class="pc-estnote">' + esc(t.estimatedNote) +
      ((this.data.players || []).some(function (p) { return p.is_mine; }) ? ' <span class="pc-minenote">· ✺ = ' + esc(t.myProject) + "</span>" : "") +
      "</span>" +
      (this.data.last_updated ? '  <span class="pc-updated">' + esc(t.lastUpdated) + " : " + esc(this.data.last_updated) + "</span>" : "") +
      "</div>" +
      '<div class="pc-tooltip" hidden></div>';

    this.$panel = this.el.querySelector(".pc-panel");
    this.$channels = this.el.querySelector(".pc-channels");
    this.$lockedHint = this.el.querySelector(".pc-lockedhint");
    this.$layers = this.el.querySelector(".pc-layers");
    this.$svgwrap = this.el.querySelector(".pc-svgwrap");
    this.$side = this.el.querySelector(".pc-side");
    this.$tooltip = this.el.querySelector(".pc-tooltip");
    this.$zoom = this.el.querySelector(".pc-zoom");
    this.$zoomval = this.el.querySelector(".pc-zoomval");
    this.$links = this.el.querySelector(".pc-links");
    this.$adddim = this.el.querySelector(".pc-adddim");

    this.bindEvents();
  };

  Chart.prototype.bindEvents = function () {
    const self = this;

    this.el.addEventListener("click", function (e) {
      const btn = e.target.closest("[data-action]");
      if (btn && self.el.contains(btn)) {
        const a = btn.getAttribute("data-action");
        const lid = btn.getAttribute("data-layer");
        if (a === "reset") self.reset();
        else if (a === "newlayer") self.newLayer();
        else if (a === "export-svg") self.exportChart("svg");
        else if (a === "export-png") self.exportChart("png");
        else if (a === "adddim-open") { self.$adddim.hidden = false; btn.hidden = true; }
        else if (a === "adddim-cancel") self.closeAddDim();
        else if (a === "side-close") { self.selectedPlayerId = null; self.renderSide(); }
        else if (a === "eye") { const l = self.byId(lid); if (l) { l.visible = !l.visible; self.update(); } }
        else if (a === "lock") { const l = self.byId(lid); if (l) { l.locked = !l.locked; self.update(); } }
        else if (a === "del") { self.deleteLayer(lid); }
        return;
      }
      const row = e.target.closest(".pc-layer");
      if (row && self.el.contains(row) && !e.target.closest("input")) {
        self.activeLayerId = row.getAttribute("data-layer");
        self.update();
      }
    });

    this.el.addEventListener("change", function (e) {
      const tgt = e.target;
      if (tgt.classList.contains("pc-chsel")) {
        const layer = self.activeLayer();
        if (layer.locked) return;
        const ch = tgt.getAttribute("data-channel");
        layer.config[ch] = tgt.value || null;
        self.update();
      } else if (tgt.classList.contains("pc-links")) {
        self.showLinks = tgt.checked;
        self.renderChart();
      } else if (tgt.classList.contains("pc-adddim-type")) {
        const ordinal = tgt.value === "ordinal";
        self.el.querySelector(".pc-adddim-values").hidden = !ordinal;
        self.el.querySelector(".pc-adddim-num").hidden = ordinal;
      } else if (tgt.classList.contains("pc-layername")) {
        const l = self.byId(tgt.getAttribute("data-layer"));
        if (l && !l.isDefault && !l.locked) { l.name = tgt.value || l.name; self.update(); }
      }
    });

    this.el.addEventListener("input", function (e) {
      const tgt = e.target;
      if (tgt.classList.contains("pc-zoom")) {
        self.zoom = Number(tgt.value) / 100;
        self.$zoomval.textContent = tgt.value + "%";
        self.applyZoom();
      } else if (tgt.classList.contains("pc-layeropacity")) {
        const l = self.byId(tgt.getAttribute("data-layer"));
        if (l) { l.opacity = Number(tgt.value) / 100; l.userOpacity = true; self.renderChart(); }
      }
    });

    this.$adddim.addEventListener("submit", function (e) {
      e.preventDefault();
      self.addDimension();
    });
  };

  Chart.prototype.byId = function (id) {
    return this.layers.find((l) => l.id === id) || null;
  };

  /* ---- actions ---- */

  Chart.prototype.reset = function () {
    this.layers = [this.makeDefaultLayer()];
    this.activeLayerId = this.layers[0].id;
    this.manualCount = 0;
    this.showLinks = false;
    this.$links.checked = false;
    this.zoom = 1;
    this.$zoom.value = 100;
    this.$zoomval.textContent = "100%";
    this.selectedPlayerId = null;
    this.update();
  };

  Chart.prototype.newLayer = function () {
    const src = this.activeLayer();
    this.manualCount++;
    const l = {
      id: uid(), isDefault: false, name: this.t.layerN + " " + this.manualCount,
      visible: true, locked: false, opacity: 1, userOpacity: false,
      config: Object.assign({}, src.config),
    };
    this.layers.push(l);
    this.activeLayerId = l.id;
    this.update();
  };

  Chart.prototype.deleteLayer = function (id) {
    const l = this.byId(id);
    if (!l || l.isDefault) return;
    this.layers = this.layers.filter((x) => x.id !== id);
    if (this.activeLayerId === id) this.activeLayerId = this.layers[0].id;
    this.update();
  };

  Chart.prototype.closeAddDim = function () {
    this.$adddim.hidden = true;
    this.$adddim.reset();
    this.el.querySelector(".pc-adddim-values").hidden = true;
    this.el.querySelector(".pc-adddim-num").hidden = false;
    this.el.querySelector(".pc-adddim-open").hidden = false;
  };

  Chart.prototype.addDimension = function () {
    const name = this.el.querySelector(".pc-adddim-name").value.trim();
    if (!name) return;
    const type = this.el.querySelector(".pc-adddim-type").value;
    let id = slugify(name), base = id, n = 2;
    while (this.dims.some((d) => d.id === id)) id = base + "_" + n++;
    const dim = { id: id, label: name, type: type === "ordinal" ? "ordinal" : "numeric", unit: "", custom: true };
    if (dim.type === "numeric") {
      const min = Number(this.el.querySelector(".pc-adddim-min").value);
      const max = Number(this.el.querySelector(".pc-adddim-max").value);
      dim.scale = { min: isFinite(min) ? min : 0, max: isFinite(max) && max > min ? max : (isFinite(min) ? min : 0) + 10 };
    } else {
      const vals = this.el.querySelector(".pc-adddim-values").value.split(",").map((s) => s.trim()).filter(Boolean);
      dim.scale = { values: vals.length ? vals : ["A", "B", "C"] };
    }
    this.dims.push(dim);
    this.closeAddDim();
    this.update();
  };

  /* ---- rendu : panneau ---- */

  Chart.prototype.renderPanel = function () {
    const t = this.t, self = this, active = this.activeLayer();

    const channels = [
      { key: "y", label: t.chY, required: true },
      { key: "x_color", label: t.chX },
      { key: "size", label: t.chSize },
      { key: "opacity", label: t.chOpacity },
      { key: "border", label: t.chBorder },
    ];
    this.$channels.innerHTML = channels.map(function (ch) {
      const opts = (ch.required ? "" : '<option value="">' + esc(t.none) + "</option>") +
        self.dims.map(function (d) {
          const sel = active.config[ch.key] === d.id ? " selected" : "";
          return '<option value="' + esc(d.id) + '"' + sel + ">" + esc(d.label) + "</option>";
        }).join("");
      return '<label class="pc-row"><span class="pc-chlabel">' + esc(ch.label) + "</span>" +
        '<select class="pc-chsel" data-channel="' + ch.key + '"' + (active.locked ? " disabled" : "") + ">" + opts + "</select></label>";
    }).join("");
    this.$lockedHint.hidden = !active.locked;

    this.$layers.innerHTML = this.layers.map(function (l) {
      const isActive = l.id === self.activeLayerId;
      const hue = self.layerHue(l);
      const nameHtml = l.isDefault
        ? '<span class="pc-layername-fixed">' + esc(l.name) + "</span>"
        : '<input type="text" class="pc-layername" data-layer="' + l.id + '" value="' + esc(l.name) + '"' + (l.locked ? " disabled" : "") + ">";
      return '<div class="pc-layer' + (isActive ? " pc-active" : "") + '" data-layer="' + l.id + '" draggable="true">' +
        '<span class="pc-drag" title="' + esc(t.dragTip) + '">⠿</span>' +
        '<span class="pc-swatch" style="background:hsl(' + hue + ',62%,52%)"></span>' +
        '<button type="button" class="pc-icon" data-action="eye" data-layer="' + l.id + '" title="' + esc(t.visTip) + '">' + (l.visible ? "👁" : "🚫") + "</button>" +
        nameHtml +
        '<input type="range" class="pc-layeropacity" data-layer="' + l.id + '" min="10" max="100" value="' + Math.round(self.effectiveOpacity(l) * 100) + '" title="' + esc(t.opacityTip) + '">' +
        '<button type="button" class="pc-icon" data-action="lock" data-layer="' + l.id + '" title="' + esc(t.lockTip) + '">' + (l.locked ? "🔒" : "🔓") + "</button>" +
        (l.isDefault ? "" : '<button type="button" class="pc-icon" data-action="del" data-layer="' + l.id + '" title="' + esc(t.delTip) + '">✕</button>') +
        "</div>";
    }).join("");

    // drag & drop pour réordonner
    this.$layers.querySelectorAll(".pc-layer").forEach(function (row) {
      row.addEventListener("dragstart", function (e) {
        self.dragLayerId = row.getAttribute("data-layer");
        e.dataTransfer.effectAllowed = "move";
        try { e.dataTransfer.setData("text/plain", self.dragLayerId); } catch (err) { /* IE */ }
      });
      row.addEventListener("dragover", function (e) { e.preventDefault(); row.classList.add("pc-dropover"); });
      row.addEventListener("dragleave", function () { row.classList.remove("pc-dropover"); });
      row.addEventListener("drop", function (e) {
        e.preventDefault();
        row.classList.remove("pc-dropover");
        const fromId = self.dragLayerId, toId = row.getAttribute("data-layer");
        if (!fromId || fromId === toId) return;
        const from = self.layers.findIndex((l) => l.id === fromId);
        const to = self.layers.findIndex((l) => l.id === toId);
        if (from === -1 || to === -1) return;
        const moved = self.layers.splice(from, 1)[0];
        self.layers.splice(to, 0, moved);
        self.dragLayerId = null;
        self.update();
      });
    });
  };

  /* ---- rendu : graphique ---- */

  Chart.prototype.geometry = function () {
    const visibles = this.layers.filter((l) => l.visible);
    let hasNA = false;
    const self = this;
    visibles.forEach(function (l) {
      (self.data.players || []).forEach(function (p) {
        if (self.norm(l.config.y, p) == null) hasNA = true;
      });
    });
    const naH = hasNA ? NA_BAND_H : 0;
    return {
      x0: MARGIN.l, x1: VB_W - MARGIN.r,
      y0: MARGIN.t, y1: VB_H - MARGIN.b - naH,
      naY: VB_H - MARGIN.b - naH / 2,
      hasNA: hasNA,
    };
  };

  Chart.prototype.markerGeom = function (layer, p, g) {
    const cfg = layer.config;
    const ny = this.norm(cfg.y, p);
    const nx = cfg.x_color ? this.norm(cfg.x_color, p) : null;
    const x = cfg.x_color
      ? (nx == null ? (g.x0 + g.x1) / 2 : g.x0 + nx * (g.x1 - g.x0))
      : (g.x0 + g.x1) / 2;
    const y = ny == null ? g.naY : g.y1 - ny * (g.y1 - g.y0);
    const ns = cfg.size ? this.norm(cfg.size, p) : null;
    const r = cfg.size ? (ns == null ? 10 : 9 + ns * 17) : 14;
    const no = cfg.opacity ? this.norm(cfg.opacity, p) : null;
    const op = cfg.opacity ? (no == null ? 1 : 0.3 + no * 0.7) : 1;
    const nb = cfg.border ? this.norm(cfg.border, p) : null;
    const border = cfg.border ? (nb == null ? "solid" : BORDER_TYPES[Math.min(4, Math.round(nb * 4))]) : "solid";
    const hue = this.layerHue(layer);
    const fill = cfg.x_color
      ? (nx == null ? "hsl(" + hue + ",12%,72%)" : "hsl(" + hue + ",62%," + Math.round(74 - nx * 38) + "%)")
      : "hsl(" + hue + ",58%,56%)";
    const stroke = "hsl(" + hue + ",60%,30%)";
    return { x: x, y: y, r: r, op: op, border: border, fill: fill, stroke: stroke, yMissing: ny == null };
  };

  Chart.prototype.renderChart = function () {
    const t = this.t, self = this;
    const g = this.geometry();
    const active = this.activeLayer();
    const players = this.data.players || [];

    const svg = svgEl("svg", {
      viewBox: "0 0 " + VB_W + " " + VB_H,
      "font-family": "system-ui, -apple-system, 'Segoe UI', sans-serif",
      role: "img",
    });
    svg.classList.add("pc-svg");
    const zoomG = svgEl("g", { class: "pc-zoomg" });
    svg.appendChild(zoomG);

    /* axes du calque actif */
    const axes = svgEl("g", {});
    zoomG.appendChild(axes);
    const yDim = this.dim(active.config.y);
    if (yDim) {
      axes.appendChild(svgEl("line", { x1: g.x0, y1: g.y0, x2: g.x0, y2: g.y1, stroke: "#94a3b8", "stroke-width": 1 }));
      const yLab = svgEl("text", { x: g.x0, y: g.y0 - 10, "font-size": 12, fill: "#475569", "font-weight": 600 });
      yLab.textContent = yDim.label;
      axes.appendChild(yLab);
      if (yDim.type === "numeric") {
        const s = this.numericScale(yDim);
        for (let i = 0; i <= 4; i++) {
          const v = s.min + (i / 4) * (s.max - s.min);
          const y = g.y1 - (i / 4) * (g.y1 - g.y0);
          axes.appendChild(svgEl("line", { x1: g.x0, y1: y, x2: g.x1, y2: y, stroke: "#e2e8f0", "stroke-width": 1 }));
          const txt = svgEl("text", { x: g.x0 - 8, y: y + 4, "font-size": 11, fill: "#64748b", "text-anchor": "end" });
          txt.textContent = fmtNum(v) + (yDim.unit === "%" ? "%" : "");
          axes.appendChild(txt);
        }
      } else {
        const vals = this.ordinalValues(yDim);
        vals.forEach(function (v, i) {
          const n = vals.length > 1 ? i / (vals.length - 1) : 0.5;
          const y = g.y1 - n * (g.y1 - g.y0);
          axes.appendChild(svgEl("line", { x1: g.x0, y1: y, x2: g.x1, y2: y, stroke: "#e2e8f0", "stroke-width": 1 }));
          const txt = svgEl("text", { x: g.x0 - 8, y: y + 4, "font-size": 11, fill: "#64748b", "text-anchor": "end" });
          txt.textContent = String(v);
          axes.appendChild(txt);
        });
      }
    }
    const xDim = this.dim(active.config.x_color);
    axes.appendChild(svgEl("line", { x1: g.x0, y1: g.y1, x2: g.x1, y2: g.y1, stroke: "#94a3b8", "stroke-width": 1 }));
    if (xDim) {
      const xLab = svgEl("text", { x: g.x1, y: g.y1 + 36, "font-size": 12, fill: "#475569", "font-weight": 600, "text-anchor": "end" });
      xLab.textContent = xDim.label + " " + t.axisOfActive;
      axes.appendChild(xLab);
      if (xDim.type === "numeric") {
        const s = this.numericScale(xDim);
        for (let i = 0; i <= 4; i++) {
          const v = s.min + (i / 4) * (s.max - s.min);
          const x = g.x0 + (i / 4) * (g.x1 - g.x0);
          const txt = svgEl("text", { x: x, y: g.y1 + 18, "font-size": 11, fill: "#64748b", "text-anchor": "middle" });
          txt.textContent = fmtNum(v);
          axes.appendChild(txt);
        }
      } else {
        const vals = this.ordinalValues(xDim);
        vals.forEach(function (v, i) {
          const n = vals.length > 1 ? i / (vals.length - 1) : 0.5;
          const x = g.x0 + n * (g.x1 - g.x0);
          const txt = svgEl("text", { x: x, y: g.y1 + 18, "font-size": 11, fill: "#64748b", "text-anchor": "middle" });
          txt.textContent = String(v);
          axes.appendChild(txt);
        });
      }
    } else {
      const note = svgEl("text", { x: (g.x0 + g.x1) / 2, y: g.y1 + 18, "font-size": 11, fill: "#94a3b8", "text-anchor": "middle" });
      note.textContent = t.alignedY;
      axes.appendChild(note);
    }
    if (g.hasNA) {
      axes.appendChild(svgEl("line", { x1: g.x0, y1: g.y1 + 1, x2: g.x1, y2: g.y1 + 1, stroke: "#cbd5e1", "stroke-dasharray": "2 3" }));
      const naTxt = svgEl("text", { x: g.x0 - 8, y: g.naY + 4, "font-size": 10, fill: "#94a3b8", "text-anchor": "end" });
      naTxt.textContent = t.naBand;
      axes.appendChild(naTxt);
    }

    const visibles = this.layers.filter((l) => l.visible);

    /* lignes de liaison (sous les marqueurs) */
    if (this.showLinks && visibles.length > 1) {
      const linksG = svgEl("g", {});
      zoomG.appendChild(linksG);
      players.forEach(function (p) {
        const pts = visibles.map(function (l) {
          const m = self.markerGeom(l, p, g);
          return m.x + "," + m.y;
        });
        if (pts.length > 1) {
          linksG.appendChild(svgEl("polyline", {
            points: pts.join(" "), fill: "none", stroke: "#94a3b8",
            "stroke-width": 1, "stroke-dasharray": "3 4", opacity: 0.8,
          }));
        }
      });
    }

    /* marqueurs, calque par calque (ordre de la liste = ordre de peinture) */
    visibles.forEach(function (layer) {
      const layerG = svgEl("g", { opacity: self.effectiveOpacity(layer) });
      zoomG.appendChild(layerG);
      players.forEach(function (p) {
        const m = self.markerGeom(layer, p, g);
        const mg = svgEl("g", { transform: "translate(" + m.x + "," + m.y + ")", cursor: "pointer" });
        mg.setAttribute("data-player", p.id);
        mg.setAttribute("data-layerid", layer.id);

        const circleAttrs = { r: m.r, fill: m.fill, "fill-opacity": m.op, stroke: m.stroke, "stroke-width": 1.5 };
        if (m.border === "dashed-loose") circleAttrs["stroke-dasharray"] = "7 6";
        else if (m.border === "dashed-tight") circleAttrs["stroke-dasharray"] = "2 3";
        mg.appendChild(svgEl("circle", circleAttrs));
        if (m.border === "double" || m.border === "triple") {
          mg.appendChild(svgEl("circle", { r: Math.max(2, m.r - 3.5), fill: "none", stroke: m.stroke, "stroke-width": 1.2 }));
        }
        if (m.border === "triple") {
          mg.appendChild(svgEl("circle", { r: Math.max(1, m.r - 7), fill: "none", stroke: m.stroke, "stroke-width": 1 }));
        }

        /* marqueur « mon projet » (Skill 3) : rayons radiaux hors du cercle —
           aucune collision avec les canaux bordure/couleur/taille/opacité */
        if (p.is_mine) {
          for (let k = 0; k < 8; k++) {
            const a = (k * Math.PI) / 4;
            mg.appendChild(svgEl("line", {
              x1: (m.r + 3) * Math.cos(a), y1: (m.r + 3) * Math.sin(a),
              x2: (m.r + 9) * Math.cos(a), y2: (m.r + 9) * Math.sin(a),
              stroke: "#0f172a", "stroke-width": 1.7, "stroke-linecap": "round",
            }));
          }
        }

        /* nom : dans le marqueur si la place le permet, sinon à côté */
        const name = p.name || p.id;
        const fits = name.length * 6.4 < (m.r - 3) * 2;
        const labelAttrs = fits
          ? { y: 4, "font-size": 11, fill: "#fff", "text-anchor": "middle", "font-weight": 600, "pointer-events": "none" }
          : { x: m.r + 5, y: 4, "font-size": 11, fill: "#334155", "text-anchor": "start", "pointer-events": "none" };
        if (p.is_mine) {
          labelAttrs["font-weight"] = fits ? 800 : 700;
          if (!fits) { labelAttrs.x = m.r + 12; labelAttrs.fill = "#0f172a"; }
        }
        const label = svgEl("text", labelAttrs);
        label.textContent = name;
        mg.appendChild(label);

        mg.addEventListener("mouseenter", function (e) { self.showTooltip(e, p, layer); });
        mg.addEventListener("mousemove", function (e) { self.moveTooltip(e); });
        mg.addEventListener("mouseleave", function () { self.hideTooltip(); });
        mg.addEventListener("click", function () { self.selectedPlayerId = p.id; self.renderSide(); });

        layerG.appendChild(mg);
      });
    });

    /* note acteurs sans données */
    const wod = this.data.players_without_data || [];
    if (wod.length) {
      const note = svgEl("text", { x: g.x0, y: VB_H - 8, "font-size": 11, fill: "#b45309" });
      note.textContent = "⚠ " + wod.length + " " + t.withoutData;
      svg.appendChild(note);
    }

    this.$svgwrap.innerHTML = "";
    this.$svgwrap.appendChild(svg);
    this.$svg = svg;
    this.applyZoom();
  };

  Chart.prototype.applyZoom = function () {
    if (!this.$svg) return;
    const zg = this.$svg.querySelector(".pc-zoomg");
    if (!zg) return;
    const cx = VB_W / 2, cy = VB_H / 2;
    zg.setAttribute("transform", "translate(" + cx + "," + cy + ") scale(" + this.zoom + ") translate(" + (-cx) + "," + (-cy) + ")");
  };

  /* ---- tooltip ---- */

  Chart.prototype.showTooltip = function (e, p, layer) {
    const t = this.t, self = this;
    const channels = [
      { key: "y", label: t.chY },
      { key: "x_color", label: t.chX },
      { key: "size", label: t.chSize },
      { key: "opacity", label: t.chOpacity },
      { key: "border", label: t.chBorder },
    ];
    let html = "<strong>" + esc(p.name || p.id) + "</strong>";
    if (p.is_mine) html += ' <span class="pc-tt-mine">✺ ' + esc(t.myProject) + "</span>";
    if (this.layers.filter((l) => l.visible).length > 1) {
      html += ' <span class="pc-tt-layer">· ' + esc(layer.name) + "</span>";
    }
    channels.forEach(function (ch) {
      const dimId = layer.config[ch.key];
      if (!dimId) return;
      const dim = self.dim(dimId);
      html += '<div class="pc-tt-row"><span>' + esc(dim ? dim.label : dimId) + "</span><b>" + esc(self.fmtValue(dimId, p)) + "</b></div>";
    });
    this.$tooltip.innerHTML = html;
    this.$tooltip.hidden = false;
    this.moveTooltip(e);
  };

  Chart.prototype.moveTooltip = function (e) {
    const rect = this.el.getBoundingClientRect();
    let x = e.clientX - rect.left + 14, y = e.clientY - rect.top + 14;
    const tw = this.$tooltip.offsetWidth, th = this.$tooltip.offsetHeight;
    if (x + tw > rect.width - 8) x = e.clientX - rect.left - tw - 10;
    if (y + th > rect.height - 8) y = e.clientY - rect.top - th - 10;
    this.$tooltip.style.left = x + "px";
    this.$tooltip.style.top = y + "px";
  };

  Chart.prototype.hideTooltip = function () {
    this.$tooltip.hidden = true;
  };

  /* ---- fiche acteur (panneau latéral) ---- */

  Chart.prototype.renderSide = function () {
    const t = this.t, self = this;
    const p = (this.data.players || []).find((x) => x.id === this.selectedPlayerId);
    if (!p) { this.$side.hidden = true; this.$side.innerHTML = ""; return; }
    const card = p.card || {};
    const dimsRows = [{ id: "market_share" }, { id: "growth" }].concat(
      this.dims.filter((d) => d.id !== "market_share" && d.id !== "growth")
    ).map(function (d) {
      const dim = self.dim(d.id);
      const o = self.rawValue(p, d.id);
      const note = o && o.note ? '<div class="pc-side-note">' + esc(o.note) + "</div>" : "";
      return "<tr><td>" + esc(dim.label) + "</td><td><b>" + esc(self.fmtValue(d.id, p)) + "</b>" + note + "</td></tr>";
    }).join("");
    const sources = (card.source_ids || []).map(function (id) {
      const s = (self.data.sources || []).find((x) => x.id === id);
      if (!s) return "";
      return "<li>" + (s.url ? '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.title || s.url) + "</a>" : esc(s.title || "")) +
        (s.accessed ? ' <span class="pc-hint">(' + esc(s.accessed) + ")</span>" : "") + "</li>";
    }).join("");
    this.$side.innerHTML =
      '<button type="button" class="pc-icon pc-side-close" data-action="side-close" title="' + esc(t.close) + '">✕</button>' +
      "<h3>" + esc(p.name || p.id) + (p.is_mine ? ' <span class="pc-side-mine">✺ ' + esc(t.myProject) + "</span>" : "") + "</h3>" +
      (card.summary ? "<p>" + esc(card.summary) + "</p>" : "") +
      (card.facts && card.facts.length ? "<h4>" + esc(t.factsT) + "</h4><ul>" + card.facts.map((f) => "<li>" + esc(f) + "</li>").join("") + "</ul>" : "") +
      "<table class='pc-side-table'>" + dimsRows + "</table>" +
      (sources ? "<h4>" + esc(t.sourcesT) + "</h4><ul class='pc-side-sources'>" + sources + "</ul>" : "");
    this.$side.hidden = false;
  };

  /* ---- export ---- */

  Chart.prototype.exportChart = function (format) {
    const t = this.t, self = this;
    const data = this.data;
    const active = this.activeLayer();
    const visibles = this.layers.filter((l) => l.visible);

    /* bloc d'annotations sous le graphique */
    const lines = [];
    const title = t.exportTitle + " — " + ((data.market && data.market.label) || "");
    const runLine = (data.run ? t.run + " " + data.run.number + " — " + data.run.date : "");
    lines.push({ text: title, size: 15, weight: 700, gap: 22 });
    if (runLine) lines.push({ text: runLine, size: 11, gap: 16 });
    lines.push({ text: t.activeLayers + " : " + visibles.map((l) => l.name).join(" · "), size: 11, gap: 18 });
    lines.push({ text: t.legendT + " :", size: 11, weight: 700, gap: 15 });
    [["y", t.chY], ["x_color", t.chX], ["size", t.chSize], ["opacity", t.chOpacity], ["border", t.chBorder]].forEach(function (ch) {
      const dimId = active.config[ch[0]];
      if (!dimId) return;
      const dim = self.dim(dimId);
      lines.push({ text: "   " + ch[1] + " : " + (dim ? dim.label : dimId), size: 11, gap: 14 });
    });
    lines.push({ text: t.estimatedNote, size: 10, gap: 16 });
    if ((data.players || []).some(function (p) { return p.is_mine; })) {
      lines.push({ text: "✺ = " + t.myProject, size: 10, gap: 16 });
    }
    const note = (data.reading && data.reading.export_note) || "";
    if (note) {
      lines.push({ text: t.readingKeyT + " :", size: 11, weight: 700, gap: 15 });
      wrapText(note, 130).forEach(function (l) { lines.push({ text: l, size: 11, gap: 14 }); });
    }
    const annotH = lines.reduce((a, l) => a + l.gap, 0) + 28;

    const out = svgEl("svg", {
      xmlns: SVGNS, viewBox: "0 0 " + VB_W + " " + (VB_H + annotH),
      width: VB_W, height: VB_H + annotH,
      "font-family": "system-ui, -apple-system, 'Segoe UI', sans-serif",
    });
    out.appendChild(svgEl("rect", { x: 0, y: 0, width: VB_W, height: VB_H + annotH, fill: "#ffffff" }));
    const chartClone = this.$svg.cloneNode(true);
    const holder = svgEl("g", {});
    Array.prototype.slice.call(chartClone.childNodes).forEach((n) => holder.appendChild(n.cloneNode(true)));
    out.appendChild(holder);
    out.appendChild(svgEl("line", { x1: 24, y1: VB_H + 2, x2: VB_W - 24, y2: VB_H + 2, stroke: "#cbd5e1" }));
    let y = VB_H + 24;
    lines.forEach(function (l) {
      const txt = svgEl("text", { x: 28, y: y, "font-size": l.size, fill: "#334155", "font-weight": l.weight || 400 });
      txt.textContent = l.text;
      out.appendChild(txt);
      y += l.gap;
    });

    const xml = new XMLSerializer().serializeToString(out);
    const slug = (data.market && data.market.slug) || "market";
    const runN = data.run ? data.run.number : "x";
    const dateStr = (data.run && data.run.date) || "";
    const base = "positioning-chart_" + slug + "_run" + runN + (dateStr ? "_" + dateStr : "");

    if (format === "svg") {
      this.download(new Blob([xml], { type: "image/svg+xml;charset=utf-8" }), base + ".svg");
      return;
    }
    const url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml;charset=utf-8" }));
    const img = new Image();
    img.onload = function () {
      const scale = 2;
      const canvas = document.createElement("canvas");
      canvas.width = VB_W * scale;
      canvas.height = (VB_H + annotH) * scale;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob(function (blob) {
        if (blob) self.download(blob, base + ".png");
      }, "image/png");
    };
    img.onerror = function () { URL.revokeObjectURL(url); };
    img.src = url;
  };

  Chart.prototype.download = function (blob, filename) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000);
  };

  /* ---- cycle ---- */

  Chart.prototype.update = function () {
    this.renderPanel();
    this.renderChart();
    this.renderSide();
  };

  /* ------------------------------------------------------------------ API */

  window.PositioningChart = {
    mount: function (el, data, opts) {
      if (!el) throw new Error("PositioningChart.mount: élément manquant");
      return new Chart(el, data, opts || {});
    },
    version: 1,
  };
})();
