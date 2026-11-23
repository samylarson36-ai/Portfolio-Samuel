/* ===== PORTFOLIO FUTURISTE – SCRIPT ===== */
(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- À MODIFIER : compétences (nom, niveau sur 100) ---------- */
  var SKILLS = {
    'Langages': [['HTML', 90], ['CSS', 85], ['JavaScript', 75], ['Python', 55], ['C', 65], ['Java', 55], ['PHP', 50]],
    'Frameworks': [['Bootstrap', 80], ['React', 55], ['Laravel', 50]],
    'Outils': [['Pack Office', 85], ['Canva', 85]]
  };
  /* ---------- À MODIFIER : phrases qui s’écrivent ---------- */
  var INTRO = ['Étudiant en IA & Big Data', 'Développeur web', 'Créateur de solutions d’automatisation'];
  var ROLES = ['Étudiant en IA & Big Data', 'Développeur web front-end', 'Créateur de solutions d’automatisation'];

  /* ---------- Machine à écrire ---------- */
  function typer(el, words, speed) {
    if (rm) { el.textContent = words[0]; return; }
    var w = 0, c = 0, del = false;
    (function step() {
      var t = words[w];
      if (!del) { c++; if (c === t.length) { del = true; el.textContent = t; return setTimeout(step, 1600); } }
      else { c--; if (c === 0) { del = false; w = (w + 1) % words.length; } }
      el.textContent = t.slice(0, c);
      setTimeout(step, del ? speed / 2 : speed);
    })();
  }

  /* ---------- Nom lettre par lettre ---------- */
  var nm = $('#itName'), txt = nm.textContent.trim().split(' '), n = 0;
  nm.textContent = '';
  txt.forEach(function (word) {
    var sp = document.createElement('span');
    word.split('').forEach(function (ch) { var e = document.createElement('em'); e.textContent = ch; e.style.setProperty('--i', n++); sp.appendChild(e); });
    nm.appendChild(sp);
  });
  setTimeout(function () { typer($('#itSub'), INTRO, 70); }, 1600);

  /* ---------- Fond d’étoiles (portail) ---------- */
  var cv = $('#stars'), cx = cv.getContext('2d'), W, H, stars = [], speed = 0.0018, run = true;
  function size() { W = cv.width = innerWidth; H = cv.height = innerHeight; }
  size(); window.addEventListener('resize', size);
  for (var i = 0; i < 170; i++) stars.push({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random(), c: ['#38ffd0', '#8b6cff', '#ffffff', '#ffb86b'][i % 4] });
  (function draw() {
    if (!run) return;
    cx.fillStyle = 'rgba(5,7,15,' + (speed > .01 ? .25 : .45) + ')'; cx.fillRect(0, 0, W, H);
    stars.forEach(function (s) {
      var px = s.x / s.z * W * .25 + W / 2, py = s.y / s.z * H * .25 + H / 2;
      s.z -= speed;
      if (s.z <= .02 || px < 0 || px > W || py < 0 || py > H) { s.x = Math.random() * 2 - 1; s.y = Math.random() * 2 - 1; s.z = 1; return; }
      var qx = s.x / (s.z + speed * 6) * W * .25 + W / 2, qy = s.y / (s.z + speed * 6) * H * .25 + H / 2;
      cx.strokeStyle = s.c; cx.lineWidth = (1 - s.z) * 2.4 + .3; cx.beginPath(); cx.moveTo(qx, qy); cx.lineTo(px, py); cx.stroke();
    });
    requestAnimationFrame(draw);
  })();

  /* ---------- Entrée par le portail ---------- */
  var started = false;
  function enter() {
    if (started) return; started = true;
    var intro = $('#intro'); intro.classList.add('entering'); speed = .03;
    setTimeout(function () {
      intro.classList.add('out'); document.body.classList.remove('lock'); window.scrollTo(0, 0);
      setTimeout(function () { run = false; intro.style.display = 'none'; }, 800);
      start();
    }, rm ? 50 : 1100);
  }
  $('#enter').addEventListener('click', enter);

  /* ---------- Radar des compétences ---------- */
  function radar() {
    var d = SKILLS['Langages'], N = d.length, C = 170, R = 112, svg = $('#radar'), h = '';
    function pt(i, r) { var a = -Math.PI / 2 + i * 2 * Math.PI / N; return [C + Math.cos(a) * r, C + Math.sin(a) * r]; }
    [.25, .5, .75, 1].forEach(function (k) { h += '<polygon class="gr" points="' + d.map(function (_, i) { return pt(i, R * k).join(','); }).join(' ') + '"/>'; });
    d.forEach(function (s, i) {
      var e = pt(i, R), l = pt(i, R + 22), cs = Math.cos(-Math.PI / 2 + i * 2 * Math.PI / N);
      h += '<line class="gr" x1="' + C + '" y1="' + C + '" x2="' + e[0] + '" y2="' + e[1] + '"/><text x="' + l[0] + '" y="' + (l[1] + 4) + '" text-anchor="' + (cs > .3 ? 'start' : cs < -.3 ? 'end' : 'middle') + '">' + s[0] + '</text>';
    });
    h += '<polygon class="rd" points="' + d.map(function (s, i) { return pt(i, R * s[1] / 100).join(','); }).join(' ') + '"/>';
    d.forEach(function (s, i) { var p = pt(i, R * s[1] / 100); h += '<circle class="pt" cx="' + p[0] + '" cy="' + p[1] + '" r="4.5"><title>' + s[0] + ' : ' + s[1] + ' %</title></circle>'; });
    svg.innerHTML = h;
    var b = '';
    Object.keys(SKILLS).forEach(function (g) {
      b += '<div class="grp"><h3>' + g.toUpperCase() + '</h3>';
      SKILLS[g].forEach(function (s, i) { b += '<div class="row"><span>' + s[0] + '<em>' + s[1] + ' %</em></span><div class="bar" style="--w:' + s[1] + '%;--d:' + (i * .12) + 's"><i></i></div></div>'; });
      b += '</div>';
    });
    $('#bars').innerHTML = b;
  }

  /* ---------- Bandeau technologies ---------- */
  var tech = ['HTML', 'CSS', 'JavaScript', 'React', 'Bootstrap', 'Laravel', 'PHP', 'Python', 'Java', 'C', 'Tailwind', 'Canva', 'IA', 'Big Data', 'Automatisation'];
  $('#tick').innerHTML = tech.concat(tech).map(function (t) { return '<span>' + t + '</span>'; }).join('');

  /* ---------- Tout ce qui démarre après le portail ---------- */
  function start() {
    typer($('#type'), ROLES, 65);
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in'); io.unobserve(e.target);
        var c = $('[data-n]', e.target);
        if (c) { var to = +c.getAttribute('data-n'), k = 0; var t = setInterval(function () { c.textContent = ++k; if (k >= to) clearInterval(t); }, 220); }
      });
    }, { threshold: .15 });
    $$('.rv').forEach(function (el) { io.observe(el); });
  }
  radar();

  /* ---------- Menu, progression, lien actif ---------- */
  var links = $('#links'), bg = $('#burger');
  bg.onclick = function () { var o = links.classList.toggle('open'); bg.setAttribute('aria-expanded', o); };
  $$('[data-go]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault(); var t = $(a.getAttribute('href'));
      if (t) t.scrollIntoView({ behavior: rm ? 'auto' : 'smooth' });
      links.classList.remove('open'); bg.setAttribute('aria-expanded', 'false');
    });
  });
  var ls = $$('.links a'), so = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) ls.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); }); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('section').forEach(function (s) { so.observe(s); });
  var bar = $('#bar'), tick = false;
  window.addEventListener('scroll', function () {
    if (tick) return; tick = true;
    requestAnimationFrame(function () { var h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')'; tick = false; });
  }, { passive: true });

  /* ---------- Halo souris + inclinaison des cartes ---------- */
  var gl = $('#glow');
  if (!rm && matchMedia('(hover: hover)').matches) {
    window.addEventListener('pointermove', function (e) { gl.style.left = e.clientX + 'px'; gl.style.top = e.clientY + 'px'; });
    $$('.pj,.facts .cd,.goals .cd,.stats .cd').forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.transform = 'perspective(900px) rotateX(' + ((.5 - y) * 6) + 'deg) rotateY(' + ((x - .5) * 8) + 'deg) translateY(-4px)';
      });
      c.addEventListener('pointerleave', function () { c.style.transform = ''; });
    });
  }

  /* ---------- Filtre des projets ---------- */
  var fb = $$('.flt button'), pj = $$('.pj');
  fb.forEach(function (b) {
    b.onclick = function () {
      fb.forEach(function (x) { x.classList.remove('on'); }); b.classList.add('on');
      var f = b.getAttribute('data-f');
      pj.forEach(function (p) {
        var show = f === 'all' || p.getAttribute('data-t') === f;
        p.classList.toggle('hide', !show); p.classList.add('in'); p.classList.remove('pop');
        if (show) { void p.offsetWidth; p.classList.add('pop'); }
      });
    };
  });

  /* ---------- Diaporama des captures ---------- */
  var lb = $('#lb'), li = $('#lbi'), lc = $('#lbc'), imgs = [], ix = 0, opener = null;
  function show() { li.src = imgs[ix]; lc.textContent = (ix + 1) + ' / ' + imgs.length; $('#lbp').style.visibility = $('#lbn').style.visibility = imgs.length > 1 ? 'visible' : 'hidden'; }
  function close() { lb.classList.remove('open'); if (opener) opener.focus(); }
  $$('.shots').forEach(function (b) {
    b.onclick = function () {
      var a = b.closest('.pj'); imgs = a.getAttribute('data-imgs').split(','); ix = 0; opener = b;
      li.alt = $('h3', a).textContent; show(); lb.classList.add('open'); $('#lbx').focus();
    };
  });
  $('#lbp').onclick = function () { ix = (ix - 1 + imgs.length) % imgs.length; show(); };
  $('#lbn').onclick = function () { ix = (ix + 1) % imgs.length; show(); };
  $('#lbx').onclick = close;
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (lb.classList.contains('open')) {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') $('#lbp').click();
      if (e.key === 'ArrowRight') $('#lbn').click();
    } else if (!started && e.key === 'Enter' && document.activeElement === document.body) enter();
  });

  /* ---------- Formulaire : ouvre l’application e-mail ---------- */
  $('#form').addEventListener('submit', function (e) {
    e.preventDefault();
    var s = encodeURIComponent('Contact depuis votre portfolio – ' + $('#fn').value);
    location.href = 'mailto:samylarson36@gmail.com?subject=' + s + '&body=' + encodeURIComponent($('#fm').value);
  });
  $('#yr').textContent = new Date().getFullYear();
})();
