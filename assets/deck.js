/* ==========================================================================
   deck.js — slide navigation for full-screen deck pages
   Zero per-page configuration: slides are discovered from the DOM and the
   counter derives its total from them, so adding a slide is one <section>.

   Markup contract
   ---------------
     <div class="progress" id="progress"></div>
     <div class="deck">
       <section class="slide hero active"> ... </section>
       <section class="slide"> ... </section>
     </div>
     <div class="counter" id="counter"></div>
     <button class="navbtn" id="prevBtn">  <button class="navbtn" id="nextBtn">

   Jump to a slide from anywhere with data-goto="3" (1-based).

   Keys: right arrow / space / page down / enter advance, left arrow /
   page up go back, home and end jump to the ends. The current slide is
   mirrored to the URL hash so a deep link opens on that slide.
   ========================================================================== */

(function () {
  'use strict';

  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  if (!slides.length) return;

  var total = slides.length;
  var progress = document.getElementById('progress');
  var counter = document.getElementById('counter');
  var current = 0;

  function clamp(n) { return Math.max(0, Math.min(total - 1, n)); }

  function show(idx, updateHash) {
    current = clamp(idx);
    slides.forEach(function (s, i) { s.classList.toggle('active', i === current); });

    var isHero = slides[current].classList.contains('hero');
    if (progress) progress.style.width = ((current + 1) / total * 100) + '%';
    if (counter) {
      counter.textContent = (current + 1) + ' / ' + total;
      counter.style.color = isHero ? '#fff' : '';
      counter.style.background = isHero ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.65)';
    }

    if (updateHash !== false) {
      if (history && history.replaceState) history.replaceState(null, '', '#' + (current + 1));
      else location.hash = current + 1;
    }
  }

  function next() { show(current + 1); }
  function prev() { show(current - 1); }

  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    if (['input', 'select', 'textarea'].indexOf(tag) !== -1) return;
    switch (e.key) {
      case 'ArrowRight': case ' ': case 'PageDown': case 'Enter': e.preventDefault(); next(); break;
      case 'ArrowLeft': case 'PageUp': e.preventDefault(); prev(); break;
      case 'Home': e.preventDefault(); show(0); break;
      case 'End': e.preventDefault(); show(total - 1); break;
    }
  });

  var nextBtn = document.getElementById('nextBtn');
  var prevBtn = document.getElementById('prevBtn');
  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);

  document.querySelectorAll('[data-goto]').forEach(function (el) {
    el.addEventListener('click', function () {
      var target = parseInt(el.getAttribute('data-goto'), 10);
      if (!isNaN(target)) show(target - 1);
    });
  });

  var start = parseInt((location.hash || '').replace('#', ''), 10);
  show(isNaN(start) ? 0 : start - 1, false);
})();
