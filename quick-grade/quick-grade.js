/* Quick Grade — zero dependencies. Load with: <script src="/quick-grade.js" defer></script> */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var root = $('qg'); if (!root) return;
  var KEY = 'qg:v1';
  var DEFAULTS = { total: 20, mode: 'correct', points: 1, decimals: 1, round: 'nearest', title: '', letter: true,
                   scale: { A: 90, B: 80, C: 70, D: 60 } };
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function load() {
    var out = clone(DEFAULTS);
    try {
      var saved = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (saved) { Object.assign(out, saved); out.scale = Object.assign({}, DEFAULTS.scale, saved.scale || {}); }
    } catch (e) {}
    return out;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  var s = load();

  function round(v, d, how) {
    var f = Math.pow(10, d), x = Math.round(v * f * 1e6) / 1e6; // kill float noise before ceil/floor
    return (how === 'up' ? Math.ceil(x) : how === 'down' ? Math.floor(x) : Math.round(x)) / f;
  }
  function letter(p) {
    var c = s.scale;
    return p >= c.A ? 'A' : p >= c.B ? 'B' : p >= c.C ? 'C' : p >= c.D ? 'D' : 'F';
  }

  function render() {
    var err = $('qg-error'), n = parseInt(s.total, 10);
    if (!isFinite(n) || n < 1 || n > 500) {
      err.hidden = false; err.textContent = 'Enter a whole number of questions from 1 to 500.'; return;
    }
    err.hidden = true;
    var pts = Math.max(0.25, Number(s.points) || 1), maxPts = round(n * pts, 2, 'nearest');
    var head = '<tr><th scope="col">' + (s.mode === 'correct' ? 'Correct' : 'Missed') + '</th>' +
      '<th scope="col">Score</th><th scope="col">Percent</th>' + (s.letter ? '<th scope="col">Grade</th>' : '') + '</tr>';
    var rows = [], i, desc = s.mode === 'correct';
    for (i = desc ? n : 0; desc ? i >= 0 : i <= n; desc ? i-- : i++) {
      var correct = desc ? i : n - i, pct = correct / n * 100;
      rows.push('<tr><th scope="row">' + i + '</th><td>' + round(correct * pts, 2, 'nearest') + ' / ' + maxPts + '</td><td>' +
        round(pct, s.decimals, s.round).toFixed(s.decimals) + '%</td>' +
        (s.letter ? '<td class="g-' + letter(pct) + '">' + letter(pct) + '</td>' : '') + '</tr>');
    }
    $('qg-table').tHead.innerHTML = head;
    $('qg-table').tBodies[0].innerHTML = rows.join('');
    $('qg-caption').textContent = 'Grading chart for ' + n + ' questions';
    $('qg-print-title').textContent = (s.title ? s.title + ' - ' : '') + 'Grading chart: ' + n + ' questions';
    save();
  }

  var grades = root.querySelectorAll('[data-grade]');
  function bind() {
    $('qg-total').value = s.total; $('qg-mode').value = s.mode; $('qg-points').value = s.points;
    $('qg-decimals').value = s.decimals; $('qg-round').value = s.round; $('qg-title-input').value = s.title;
    $('qg-showletter').checked = s.letter;
    Array.prototype.forEach.call(grades, function (el) { el.value = s.scale[el.getAttribute('data-grade')]; });
  }
  function on(id, ev, fn) { $(id).addEventListener(ev, fn); }
  on('qg-total', 'input', function (e) { s.total = e.target.value; render(); });
  on('qg-mode', 'change', function (e) { s.mode = e.target.value; render(); });
  on('qg-points', 'input', function (e) { s.points = e.target.value; render(); });
  on('qg-decimals', 'change', function (e) { s.decimals = +e.target.value; render(); });
  on('qg-round', 'change', function (e) { s.round = e.target.value; render(); });
  on('qg-title-input', 'input', function (e) { s.title = e.target.value; render(); });
  on('qg-showletter', 'change', function (e) { s.letter = e.target.checked; render(); });
  Array.prototype.forEach.call(grades, function (el) {
    el.addEventListener('input', function () { s.scale[el.getAttribute('data-grade')] = Number(el.value) || 0; render(); });
  });
  on('qg-reset', 'click', function () { s = clone(DEFAULTS); bind(); render(); });
  on('qg-print', 'click', function () { if ($('qg-error').hidden) window.print(); });

  bind(); render(); // chart is visible immediately on load
})();
