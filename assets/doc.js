/* ==========================================================================
   doc.js — tab and subtab behavior for documentation pages
   Zero per-page configuration. The tab strip is derived from the panels
   themselves, so adding a section means adding one <section> and nothing else.

   Markup contract
   ---------------
   Tabs:
     <nav class="tab-nav"><div class="container" id="tab-buttons"></div></nav>
     <section class="tab-panel is-active" data-tab="overview" data-tab-label="1. Overview">
     <section class="tab-panel" data-tab="setup" data-tab-label="2. Setup">

   Subtabs (buttons authored by hand, scoped to the nearest .subtabs):
     <div class="subtabs">
       <div class="subtab-nav">
         <button class="subtab-btn is-active" data-subtab="a">A</button>
       </div>
       <div class="subtab-panel is-active" data-subtab="a"> ... </div>
     </div>

   Behavior: click to switch, left/right arrows to move between tabs, the
   active tab is reflected in the URL hash and restored on load.
   ========================================================================== */

(function () {
  'use strict';

  var panels = Array.prototype.slice.call(document.querySelectorAll('.tab-panel'));
  var order = panels.map(function (p) { return p.dataset.tab; }).filter(Boolean);

  // --- build the tab strip from the panels --------------------------------

  var strip = document.getElementById('tab-buttons');
  if (strip && order.length) {
    strip.innerHTML = '';
    panels.forEach(function (panel) {
      if (!panel.dataset.tab) return;
      var btn = document.createElement('button');
      btn.className = 'tab-btn' + (panel.classList.contains('is-active') ? ' is-active' : '');
      btn.dataset.tab = panel.dataset.tab;
      btn.textContent = panel.dataset.tabLabel || panel.dataset.tab;
      btn.setAttribute('aria-controls', panel.dataset.tab);
      strip.appendChild(btn);
    });
  }

  var buttons = Array.prototype.slice.call(document.querySelectorAll('.tab-btn'));

  function activateTab(id) {
    if (!id || order.indexOf(id) === -1) return;
    buttons.forEach(function (b) { b.classList.toggle('is-active', b.dataset.tab === id); });
    panels.forEach(function (p) { p.classList.toggle('is-active', p.dataset.tab === id); });
    if (history.replaceState) history.replaceState(null, '', '#' + id);
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { activateTab(b.dataset.tab); });
  });

  // --- subtabs, scoped so several sets can coexist on one page ------------

  document.querySelectorAll('.subtab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var scope = btn.closest('.subtabs');
      if (!scope) return;
      var id = btn.dataset.subtab;
      scope.querySelectorAll('.subtab-btn').forEach(function (b) { b.classList.toggle('is-active', b === btn); });
      scope.querySelectorAll('.subtab-panel').forEach(function (p) { p.classList.toggle('is-active', p.dataset.subtab === id); });
    });
  });

  // --- keyboard navigation ------------------------------------------------

  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    if (['input', 'select', 'textarea'].indexOf(tag) !== -1) return;
    if (e.target.isContentEditable) return;
    var active = document.querySelector('.tab-btn.is-active');
    if (!active) return;
    var i = order.indexOf(active.dataset.tab);
    if (i === -1) return;
    if (e.key === 'ArrowRight' && i < order.length - 1) { activateTab(order[i + 1]); e.preventDefault(); }
    else if (e.key === 'ArrowLeft' && i > 0) { activateTab(order[i - 1]); e.preventDefault(); }
  });

  // --- restore the tab named in the URL ----------------------------------

  var hash = window.location.hash.replace('#', '');
  if (hash && order.indexOf(hash) !== -1) activateTab(hash);
})();
