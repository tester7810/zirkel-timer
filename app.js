(function () {
  'use strict';
  const EX = window.EX, INFO = window.INFO || {}, TL = window.TL, Fig = window.Fig, DEF = window.DEFAULT_CFG;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clone = o => JSON.parse(JSON.stringify(o));
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* Speicher voll oder gesperrt */ } }
  };
  const KEY = { cfg: 'zt.cfg', hist: 'zt.hist', sess: 'zt.sess' };

  // ---------- Konfiguration ----------
  const validCfg = o => !!(o && Array.isArray(o.workouts) && o.workouts.length &&
    o.workouts.every(w => w && typeof w.id === 'string' && Array.isArray(w.steps) && w.steps.every(s => s && typeof s.ex === 'string')));
  function normCfg(o) {
    const d = clone(DEF), c = { ...d, ...o, times: { ...d.times, ...o.times }, jog: { ...d.jog, ...o.jog }, sound: { ...d.sound, ...o.sound } };
    delete c.sound.vibrate;
    return c;
  }
  let cfg = (() => { const s = store.get(KEY.cfg, null); return validCfg(s) ? normCfg(s) : clone(DEF); })();
  let hist = store.get(KEY.hist, []);
  let sess = store.get(KEY.sess, null);
  let selWid = null, editWid = null, lastDone = null, curIdx = -1, tickSec = -1, halfDone = false, curPhase = '', freshStart = false;

  const saveCfg = () => store.set(KEY.cfg, cfg);
  const saveHist = () => store.set(KEY.hist, hist);
  const saveSess = () => store.set(KEY.sess, sess);
  const exOf = id => EX[id] || { name: id, group: '', hint: '', gear: '' };
  const workoutById = id => cfg.workouts.find(w => w.id === id) || cfg.workouts[0];
  function nextWorkoutId() {
    const ws = cfg.workouts, last = [...hist].reverse().find(h => !h.partial);
    if (!last) return ws[0].id;
    return ws[(ws.findIndex(w => w.id === last.wid) + 1) % ws.length].id;
  }
  const weekStart = () => { const x = new Date(); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - (x.getDay() + 6) % 7); return x.getTime(); };

  // ---------- Bilder ----------
  const svgCache = {};
  const poses = id => svgCache[id] || (svgCache[id] = (Fig.POSES[id] || []).map(Fig.render));
  const figAnim = id => `<div class="fig anim">${poses(id).join('')}</div>`;
  const figThumb = id => `<div class="th">${poses(id)[0] || ''}</div>`;
  const figPair = id => `<div class="fig pair">${poses(id).map((s, i) => `<div>${s}<small>${i ? 'Ende' : 'Start'}</small></div>`).join('')}</div>`;

  // ---------- Hilfen: Dialog, Hinweis ----------
  function ask(html, buttons, read) {
    return new Promise(res => {
      const m = document.createElement('div');
      m.className = 'modal';
      m.innerHTML = `<div>${html}<div class="btns">${buttons.map((b, i) => `<button class="${b.cls || ''}" data-i="${i}">${esc(b.t)}</button>`).join('')}</div></div>`;
      document.body.appendChild(m);
      m.addEventListener('click', e => {
        const b = e.target.closest('button[data-i]');
        if (!b) return;
        const data = read ? read(m) : null;
        m.remove();
        res({ v: buttons[+b.dataset.i].v, data });
      });
    });
  }
  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2600);
  }

  // ---------- Ton, Sprache, Bildschirm ----------
  let actx = null, lock = null;
  function audioInit() {
    try {
      const fresh = !actx;
      if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      if (fresh) warmVoice();
    } catch (e) { /* kein Ton verfügbar */ }
  }
  function beep(freq, dur, vol = 0.3, delay = 0) {
    if (!cfg.sound.beep || !actx) return;
    const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + delay;
    o.frequency.value = freq; o.connect(g); g.connect(actx.destination);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.01);
    g.gain.setValueAtTime(vol, t + Math.max(0.02, dur - 0.04)); g.gain.linearRampToValueAtTime(0, t + dur);
    o.start(t); o.stop(t + dur + 0.02);
  }
  // Ansagen sind vorab erzeugte Clips (Männerstimme, Ordner v/), damit die Stimme auf jedem Handy gleich ist.
  const clips = {};
  let voiceSrc = [], voiceSeq = 0;
  function loadClip(n) {
    if (!actx) return Promise.resolve(null);
    return clips[n] || (clips[n] = fetch(`v/${n}.mp3`).then(r => r.ok ? r.arrayBuffer() : Promise.reject(new Error(n)))
      .then(b => actx.decodeAudioData(b)).catch(() => null));
  }
  const speedClip = v => Number.isInteger(v * 2) && v >= 4 && v <= 16 ? 'speed_' + String(v).replace('.', '_') : 'jog';
  const exClip = id => 'ex_' + id;
  function warmVoice() {
    if (!cfg.sound.voice || !sess) return;
    const names = ['prep', 'next', 'tre', 'side', 'done', 'jog'];
    sess.steps.forEach(s => names.push(exClip(s.ex)));
    sess.tl.segs.forEach(g => { if (g.kind === 'jog') names.push(speedClip(g.speed)); });
    new Set(names).forEach(loadClip);
  }
  // lead: Sekunden Abstand zu einem direkt davor gespielten Piepton
  async function say(lead, ...names) {
    if (!cfg.sound.voice || !actx) return;
    const my = ++voiceSeq;
    const bufs = await Promise.all(names.map(loadClip));
    if (my !== voiceSeq) return;
    voiceSrc.forEach(s => { try { s.stop(); } catch (e) { /* schon beendet */ } });
    voiceSrc = [];
    let t = actx.currentTime + lead;
    bufs.forEach(b => {
      if (!b) return;
      const s = actx.createBufferSource();
      s.buffer = b; s.connect(actx.destination); s.start(t);
      t += b.duration + 0.12; voiceSrc.push(s);
    });
  }
  function stopVoice() { voiceSeq++; voiceSrc.forEach(s => { try { s.stop(); } catch (e) { /* schon beendet */ } }); voiceSrc = []; }
  async function wake() {
    try {
      if ('wakeLock' in navigator && !lock && document.visibilityState === 'visible') {
        lock = await navigator.wakeLock.request('screen');
        lock.addEventListener('release', () => { lock = null; });
      }
    } catch (e) { lock = null; }
  }
  function unwake() { try { if (lock) lock.release(); } catch (e) { /* egal */ } lock = null; }

  // ---------- Training ----------
  const elapsed = () => (!sess ? 0 : sess.paused ? sess.offset : sess.offset + (Date.now() - sess.resumed) / 1000);

  function start(wid) {
    audioInit();
    const wk = clone(workoutById(wid)), tl = TL.build(wk, cfg);
    if (!tl.segs.length) { toast('Die Einheit hat keine Übungen.'); return; }
    sess = { wid: wk.id, name: wk.name, steps: wk.steps, tl, offset: 0, resumed: Date.now(), paused: false, touched: Date.now() };
    saveSess(); curIdx = -1; freshStart = true; wake(); warmVoice(); go('run');
  }

  function finish(completed, save) {
    const s = sess;
    if (!s) return;
    const sec = Math.round(Math.min(elapsed(), s.tl.total));
    sess = null; saveSess(); unwake(); stopVoice(); curIdx = -1;
    if (completed || save) {
      hist.push({ ts: Date.now(), wid: s.wid, name: s.name, sec, partial: !completed });
      saveHist();
    }
    if (completed) {
      lastDone = { name: s.name, sec };
      beep(660, 0.2); beep(880, 0.2, 0.3, 0.22); beep(1100, 0.4, 0.3, 0.44);
      say(1, 'done');
      go('done');
    } else go('');
  }

  function seek(sec) {
    sess.offset = sec; sess.resumed = Date.now(); sess.touched = Date.now(); saveSess(); tick();
  }
  function togglePause() {
    if (!sess.paused) { sess.offset = elapsed(); sess.paused = true; unwake(); stopVoice(); }
    else { sess.resumed = Date.now(); sess.paused = false; wake(); audioInit(); }
    sess.touched = Date.now(); saveSess(); tick();
  }

  function onSegment(el) {
    const seg = sess.tl.segs[curIdx];
    if (el - seg.start > 1.5) return; // Wiederaufnahme nach längerer Pause: keine alten Signale
    const st = sess.steps;
    if (seg.kind === 'prep') say(0.05, 'prep', exClip(st[seg.step].ex));
    else if (seg.kind === 'work') beep(880, 0.45);
    else if (seg.kind === 'rest') {
      beep(520, 0.3);
      if (seg.next != null) say(0.4, 'next', exClip(st[seg.next].ex)); else say(0.4, 'tre');
    } else if (seg.kind === 'jog') {
      beep(660, 0.5);
      say(0.55, speedClip(seg.speed));
    }
  }

  function runBody() {
    if (!$('#wk') || !sess) return;
    const seg = sess.tl.segs[curIdx], st = sess.steps, n = st.length;
    const maxRd = Math.max(1, ...st.map(s => s.rd || 1));
    let exId, cls, pos, next = '', note = '';
    const stepLabel = i => `Übung ${i + 1}/${n}` + (st[i].rd ? ` · Runde ${st[i].rd}/${maxRd}` : '');
    if (seg.kind === 'jog') {
      exId = 'joggen'; cls = 'jog'; curPhase = 'LAUFBAND'; pos = 'Laufband';
      if (seg.part < seg.parts - 1) next = 'Danach folgt der nächste Abschnitt';
    } else if (seg.kind === 'rest') {
      cls = 'rest';
      if (seg.next != null) { exId = st[seg.next].ex; pos = stepLabel(seg.next); curPhase = 'WECHSEL'; next = `Danach ${st[seg.next].work ?? cfg.times.work} s Belastung`; }
      else { exId = 'joggen'; pos = 'Laufband'; curPhase = 'ZUM LAUFBAND'; }
    } else {
      exId = st[seg.step].ex; pos = stepLabel(seg.step);
      if (seg.kind === 'prep') { cls = 'prep'; curPhase = 'GLEICH GEHT’S LOS'; }
      else {
        cls = 'work'; curPhase = 'BELASTUNG';
        next = seg.step + 1 < n ? `Danach: ${exOf(st[seg.step + 1].ex).name}` : 'Danach: Laufband';
        if (exOf(exId).uni) note = 'Erste Seite';
      }
    }
    const e = exOf(exId);
    $('#wk').className = 'run ' + cls;
    $('#wkPos').textContent = pos;
    $('#wkFig').innerHTML = figAnim(exId);
    if (exId === 'joggen') {
      $('#wkName').textContent = `Joggen · ${String(seg.speed ?? cfg.jog.speed).replace('.', ',')} km/h`;
      $('#wkCue').textContent = `Steigung: ${seg.incline || cfg.jog.incline}. ${e.hint}`;
    } else { $('#wkName').textContent = e.name; $('#wkCue').textContent = e.hint; }
    $('#wkNote').textContent = note;
    $('#wkNext').textContent = next;
    $('#wkPhase').textContent = curPhase;
    $('#wkVoice').textContent = cfg.sound.voice ? '🔊 Ansage' : '🔇 Ansage aus';
  }

  function tick() {
    if (!sess) return;
    const el = elapsed(), tl = sess.tl;
    if (el >= tl.total - 1e-6) { finish(true); return; }
    const idx = TL.index(tl, el);
    if (idx !== curIdx) { curIdx = idx; tickSec = -1; halfDone = false; onSegment(el); runBody(); }
    const seg = tl.segs[idx], left = seg.end - el;
    if ($('#wkTime')) {
      $('#wkTime').textContent = TL.fmt(left);
      $('#wkLeft').textContent = `noch ${TL.fmt(tl.total - el)}`;
      $('#wkBar').style.width = (100 * el / tl.total) + '%';
      $('#wkPause').textContent = sess.paused ? '▶' : '⏸';
      $('#wkPhase').textContent = sess.paused ? 'PAUSE' : curPhase;
    }
    if (sess.paused) return;
    const sec = Math.ceil(left - 1e-9);
    if (sec >= 1 && sec <= 3 && sec !== tickSec && seg.dur > 3) { tickSec = sec; beep(sec === 1 ? 740 : 660, 0.12, 0.25); }
    if (seg.kind === 'work' && cfg.sound.halfway && exOf(sess.steps[seg.step].ex).uni && !halfDone && el - seg.start >= seg.dur / 2) {
      halfDone = true;
      beep(700, 0.12, 0.3); beep(700, 0.12, 0.3, 0.2); say(0.5, 'side');
      if ($('#wkNote')) $('#wkNote').textContent = 'Seite wechseln!';
    }
  }

  function restore() {
    if (!sess) return;
    const stale = Date.now() - (sess.touched || 0) > 12 * 3600e3;
    if (!sess.tl || stale) { sess = null; saveSess(); return; }
    const over = elapsed() - sess.tl.total;
    if (over >= 0) {
      if (over < 600) { const s = sess; hist.push({ ts: Date.now(), wid: s.wid, name: s.name, sec: Math.round(s.tl.total) }); saveHist(); }
      sess = null; saveSess();
    } else if (!sess.paused) wake();
  }

  // ---------- Ansichten ----------
  const maxRound = wk => Math.max(1, ...wk.steps.map(s => s.rd || 1));
  const stepLine = (s, withTime) => {
    const e = exOf(s.ex);
    const tm = [s.work != null ? `${s.work} s` : '', s.rest != null ? `Wechsel ${s.rest} s` : ''].filter(Boolean).join(' · ');
    return `<div class="nm">${esc(e.name)}<small>${s.st && s.rd ? `Station ${s.st} · Runde ${s.rd}` : esc(e.group)}${withTime && tm ? ' · ' + tm : ''}</small></div>`;
  };

  function viewHome() {
    if (!selWid || !cfg.workouts.some(w => w.id === selWid)) selWid = nextWorkoutId();
    const wk = workoutById(selWid), tl = TL.build(wk, cfg);
    const jogSec = tl.segs.filter(s => s.kind === 'jog').reduce((a, s) => a + s.dur, 0);
    const stations = wk.steps.every(s => s.st && s.rd) ? `${new Set(wk.steps.map(s => s.st)).size} Stationen × ${maxRound(wk)} Runden` : `${wk.steps.length} Übungen`;
    const week = hist.filter(h => !h.partial && h.ts >= weekStart()).length;
    const banner = sess ? `<div class="card banner"><b>Training läuft</b> – ${esc(sess.name)}, ${TL.fmt(elapsed())} von ${TL.fmt(sess.tl.total)}
      <div class="row" style="margin-top:10px"><button data-act="resume">Weiter zum Training</button><button class="ghost" data-act="end">Beenden</button></div></div>` : '';
    return `<h1>Zirkel-Timer</h1>${banner}
      <div class="card">
        <label for="wsel">Einheit</label>
        <select id="wsel" data-chg="selw">${cfg.workouts.map(w => `<option value="${esc(w.id)}" ${w.id === selWid ? 'selected' : ''}>${esc(w.name)}${w.id === nextWorkoutId() ? ' (als Nächstes)' : ''}</option>`).join('')}</select>
        <p>${stations} · ${cfg.times.work} s Belastung / ${cfg.times.rest} s Wechsel</p>
        ${jogSec ? `<p>Joggen ${TL.fmt(jogSec)} min · ${String(cfg.jog.speed).replace('.', ',')} km/h · Steigung ${esc(cfg.jog.incline)}</p>` : ''}
        <p><b>Gesamt ${TL.fmt(tl.total)} min</b></p>
        <details><summary>Ablauf ansehen</summary><ul class="steps">${wk.steps.map(s => `<li>${figThumb(s.ex)}${stepLine(s, true)}</li>`).join('')}</ul></details>
        <button class="big" data-act="start">Training starten</button>
      </div>
      <div class="grid2">
        <button data-go="lib">Übungen &amp; Infos</button><button data-go="plan">Plan bearbeiten</button>
        <button data-go="log">Verlauf</button><button data-go="set">Einstellungen</button>
      </div>
      <p class="mut">Diese Woche: ${week} Einheit${week === 1 ? '' : 'en'}</p>`;
  }

  const viewRun = () => `<section class="run" id="wk">
    <div class="top"><span id="wkPos"></span><span id="wkLeft"></span></div><div class="bar"><i id="wkBar"></i></div>
    <div class="phase" id="wkPhase"></div><div class="time" id="wkTime">00:00</div>
    <div id="wkFig"></div><div class="name" id="wkName"></div><div class="cue" id="wkCue"></div>
    <div class="note" id="wkNote"></div><div class="next" id="wkNext"></div>
    <div class="ctrl"><button data-act="prev" aria-label="Zurück">⏮</button><button data-act="pause" id="wkPause" aria-label="Pause">⏸</button><button data-act="skip" aria-label="Weiter">⏭</button></div>
    <div class="foot"><button class="ghost" data-act="voice" id="wkVoice"></button><button class="ghost" data-act="exinfo">ⓘ Info</button><button class="ghost" data-go="">Menü</button><button class="ghost" data-act="end">Beenden</button></div></section>`;

  function infoBlock(id) {
    const i = INFO[id];
    if (!i) return '<p class="mut">Für diese Übung gibt es noch keine Infokarte.</p>';
    const list = (t, a, tag) => a && a.length ? `<h3>${t}</h3><${tag}>${a.map(x => `<li>${esc(x)}</li>`).join('')}</${tag}>` : '';
    return `<div class="info">
      ${i.evidenz ? `<p class="mut">${esc(i.evidenz)}</p>` : ''}
      ${list('Ausführung', i.steps, 'ol')}${list('Typische Fehler', i.fehler, 'ul')}
      ${i.tempo ? `<h3>Tempo &amp; Bewegungsumfang</h3><p>${esc(i.tempo)}</p>` : ''}
      ${i.sicherheit ? `<h3>Sicherheit</h3><p>${esc(i.sicherheit)}</p>` : ''}
      ${i.warum ? `<h3>Wissenschaftlicher Hintergrund</h3><p>${esc(i.warum)}</p>` : ''}
      ${list('Quellen', i.quellen, 'ul').replace('<ul>', '<ul class="src">')}
      <p class="src">Zusammenfassung veröffentlichter Studien, meist kleine EMG-Untersuchungen. Kein Ersatz für ärztlichen Rat. Bei Schmerzen abbrechen.</p></div>`;
  }

  const viewLib = () => `<a class="back" href="#/">‹ Zurück</a><h1>Übungen &amp; Infos</h1>
    <div class="libgrid">${Object.keys(EX).filter(k => !EX[k].virtual || INFO[k]).map(k => `<a href="#/ex/${k}">${figAnim(k)}<div class="t">${esc(EX[k].name)}</div><small>${esc(EX[k].group)}</small></a>`).join('')}</div>`;

  function viewEx(id) {
    const e = exOf(id);
    return `<a class="back" href="javascript:history.back()">‹ Zurück</a><h1>${esc(e.name)}</h1>
      <p class="mut">${esc(e.group)}${e.gear ? ' · ' + esc(e.gear) : ''}</p>${figPair(id)}<p>${esc(e.hint)}</p>${infoBlock(id)}`;
  }

  function viewSet() {
    const num = (label, path, step = 1) => `<label>${label}</label><input type="number" inputmode="decimal" min="0" step="${step}" data-k="${path}" value="${path.split('.').reduce((o, k) => o[k], cfg)}">`;
    const chk = (label, path) => `<label class="chk"><input type="checkbox" data-k="${path}" ${path.split('.').reduce((o, k) => o[k], cfg) ? 'checked' : ''}>${label}</label>`;
    const js = cfg.jog.seconds;
    return `<a class="back" href="#/">‹ Zurück</a><h1>Einstellungen</h1>
      <div class="card"><h2>Zeiten (Standard für alle Übungen)</h2>
        ${num('Belastung (Sekunden)', 'times.work')}${num('Wechsel / Pause (Sekunden)', 'times.rest')}${num('Vorbereitung vor dem Start (Sekunden, 0 = sofort)', 'times.prep')}
        <h2>Joggen am Ende</h2>
        <div class="row"><div><label>Minuten</label><input type="number" inputmode="numeric" min="0" id="jm" data-chg="jog" value="${Math.floor(js / 60)}"></div>
        <div><label>Sekunden</label><input type="number" inputmode="numeric" min="0" max="59" id="js" data-chg="jog" value="${js % 60}"></div></div>
        ${num('Geschwindigkeit (km/h)', 'jog.speed', 0.5)}
        <label>Steigung (Text)</label><input type="text" data-k="jog.incline" value="${esc(cfg.jog.incline)}">
        <p id="tot" class="mut"></p></div>
      <div class="card"><h2>Signale</h2>${chk('Töne (Piepen)', 'sound.beep')}${chk('Sprachansagen (Männerstimme)', 'sound.voice')}${chk('Seitenwechsel-Signal bei einbeinigen Übungen', 'sound.halfway')}<p class="mut">Die Ansage lässt sich auch im Training mit dem Lautsprecher-Knopf unten an- und ausschalten.</p></div>
      <div class="card"><h2>Sichern &amp; Übertragen</h2>
        <div class="grid2"><button data-act="exp">Konfiguration exportieren</button><button data-act="imp">Konfiguration importieren</button></div>
        <input type="file" id="file" accept="application/json,.json" hidden>
        <button class="danger" style="margin-top:8px;width:100%" data-act="reset">Alles auf Standard zurücksetzen</button></div>`;
  }

  function viewPlan() {
    if (!editWid || !cfg.workouts.some(w => w.id === editWid)) editWid = cfg.workouts[0].id;
    const wk = workoutById(editWid), tl = TL.build(wk, cfg);
    return `<a class="back" href="#/">‹ Zurück</a><h1>Plan bearbeiten</h1>
      <div class="card"><div class="row"><select data-chg="pw">${cfg.workouts.map(w => `<option value="${esc(w.id)}" ${w.id === editWid ? 'selected' : ''}>${esc(w.name)}</option>`).join('')}</select>
        <button class="sm" data-act="dupW" title="Kopieren">⧉</button><button class="sm" data-act="delW" title="Löschen">🗑</button></div>
        <label>Name</label><input type="text" data-chg="pname" value="${esc(wk.name)}">
        <p class="mut">Dauer: ${TL.fmt(tl.total)} min · ${wk.steps.length} Übungen. Die Reihenfolge der Einheiten bestimmt, welche als Nächstes kommt.</p></div>
      <ul class="steps card">${wk.steps.map((s, i) => `<li>${figThumb(s.ex)}${stepLine(s, true)}
        <button class="sm" data-act="up" data-i="${i}">↑</button><button class="sm" data-act="dn" data-i="${i}">↓</button>
        <button class="sm" data-act="ed" data-i="${i}">✎</button><button class="sm" data-act="rm" data-i="${i}">✕</button></li>`).join('')}</ul>
      <div class="grid2"><button data-act="addEx">＋ Übung</button><button data-act="addW">＋ Neue Einheit</button></div>`;
  }

  function viewLog() {
    const list = [...hist].reverse();
    return `<a class="back" href="#/">‹ Zurück</a><h1>Verlauf</h1>
      <div class="card">${list.length ? `<ul class="steps">${list.map(h => `<li><div class="nm">${esc(h.name)}${h.partial ? ' <span class="tag">abgebrochen</span>' : ''}<small>${new Date(h.ts).toLocaleString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })} · ${TL.fmt(h.sec)} min</small></div></li>`).join('')}</ul>` : '<p class="mut">Noch keine Einheit abgeschlossen.</p>'}</div>
      ${list.length ? '<button class="ghost" style="width:100%" data-act="clearLog">Verlauf löschen</button>' : ''}`;
  }

  function viewDone() {
    if (!lastDone) return viewHome();
    return `<h1>Geschafft! 💪</h1><div class="card"><p><b>${esc(lastDone.name)}</b> abgeschlossen – ${TL.fmt(lastDone.sec)} min.</p>
      <p class="mut">Nächste Einheit: ${esc(workoutById(nextWorkoutId()).name)}</p><button class="big" data-go="">Zum Menü</button></div>`;
  }

  // ---------- Router ----------
  const app = $('#app');
  const go = p => { location.hash = '#/' + p; };
  function route() {
    const parts = (location.hash || '#/').slice(2).split('/').filter(Boolean), p = parts[0] || '';
    if (p === 'run' && !sess) { go(''); return; }
    const views = { '': viewHome, lib: viewLib, set: viewSet, plan: viewPlan, log: viewLog, done: viewDone, run: viewRun, ex: () => viewEx(parts[1]) };
    app.innerHTML = (views[p] || viewHome)();
    window.scrollTo(0, 0);
    if (p === 'run') {
      if (curIdx < 0) {
        curIdx = TL.index(sess.tl, elapsed());
        if (freshStart) { freshStart = false; onSegment(elapsed()); }
      }
      runBody(); tick();
      if (!actx || actx.state !== 'running') toast('Einmal auf den Bildschirm tippen, damit Ton und Ansagen aktiv werden.');
    }
    if (p === 'set') updateTotals();
  }
  function updateTotals() {
    const t = $('#tot');
    if (t) t.textContent = cfg.workouts.map(w => `${w.name}: ${TL.fmt(TL.build(w, cfg).total)} min`).join(' · ');
  }

  // ---------- Aktionen ----------
  const mutate = (fn) => { const wk = workoutById(editWid); fn(wk); wk.steps.forEach(s => { delete s.st; delete s.rd; }); saveCfg(); route(); };
  const exOptions = sel => Object.keys(EX).filter(k => !EX[k].virtual).map(k => `<option value="${k}" ${k === sel ? 'selected' : ''}>${esc(EX[k].name)}</option>`).join('');
  const nextId = () => { for (let c = 65; c < 91; c++) if (!cfg.workouts.some(w => w.id === String.fromCharCode(c))) return String.fromCharCode(c); return 'W' + Date.now(); };

  const actions = {
    start: () => start(selWid),
    resume: () => go('run'),
    async end() {
      if (!sess) return;
      const long = elapsed() >= 60;
      const r = await ask('<h2>Training beenden?</h2>', [{ t: 'Weitermachen', v: 'no' }, ...(long ? [{ t: 'Beenden und im Verlauf speichern', v: 'save' }] : []), { t: 'Beenden ohne Speichern', v: 'drop', cls: 'danger' }]);
      if (r.v === 'save') finish(false, true); else if (r.v === 'drop') finish(false, false);
    },
    pause: togglePause,
    voice() {
      cfg.sound.voice = !cfg.sound.voice; saveCfg();
      if (cfg.sound.voice) warmVoice(); else stopVoice();
      $('#wkVoice').textContent = cfg.sound.voice ? '🔊 Ansage' : '🔇 Ansage aus';
    },
    skip: () => { const seg = sess.tl.segs[curIdx]; seek(seg.end + 0.001); },
    prev: () => {
      const segs = sess.tl.segs, seg = segs[curIdx];
      seek(elapsed() - seg.start > 3 || curIdx === 0 ? seg.start : segs[curIdx - 1].start);
    },
    exinfo: () => { const seg = sess.tl.segs[curIdx], st = sess.steps; const i = seg.kind === 'rest' ? seg.next : seg.kind === 'jog' ? null : seg.step; go('ex/' + (i == null ? 'joggen' : st[i].ex)); },
    up: t => mutate(w => { const i = +t.dataset.i; if (i > 0) [w.steps[i - 1], w.steps[i]] = [w.steps[i], w.steps[i - 1]]; }),
    dn: t => mutate(w => { const i = +t.dataset.i; if (i < w.steps.length - 1) [w.steps[i + 1], w.steps[i]] = [w.steps[i], w.steps[i + 1]]; }),
    rm: t => mutate(w => { w.steps.splice(+t.dataset.i, 1); }),
    async ed(t) {
      const wk = workoutById(editWid), s = wk.steps[+t.dataset.i];
      const r = await ask(`<h2>Übung bearbeiten</h2><label>Übung</label><select id="e1">${exOptions(s.ex)}</select>
        <label>Belastung in Sekunden (leer = Standard ${cfg.times.work})</label><input id="e2" type="number" min="1" inputmode="numeric" value="${s.work ?? ''}">
        <label>Wechsel danach in Sekunden (leer = Standard ${cfg.times.rest})</label><input id="e3" type="number" min="0" inputmode="numeric" value="${s.rest ?? ''}">`,
        [{ t: 'Speichern', v: 'ok' }, { t: 'Abbrechen', v: 'no', cls: 'ghost' }],
        m => ({ ex: $('#e1', m).value, work: $('#e2', m).value, rest: $('#e3', m).value }));
      if (r.v !== 'ok') return;
      s.ex = r.data.ex;
      ['work', 'rest'].forEach(k => { if (r.data[k] === '') delete s[k]; else s[k] = Math.max(0, Number(r.data[k])); });
      saveCfg(); route();
    },
    async addEx() {
      const r = await ask(`<h2>Übung hinzufügen</h2><label>Übung</label><select id="e1">${exOptions('')}</select>`, [{ t: 'Hinzufügen', v: 'ok' }, { t: 'Abbrechen', v: 'no', cls: 'ghost' }], m => $('#e1', m).value);
      if (r.v === 'ok') mutate(w => { w.steps.push({ ex: r.data }); });
    },
    addW() { const id = nextId(); cfg.workouts.push({ id, name: 'Einheit ' + id, steps: [] }); editWid = id; saveCfg(); route(); },
    dupW() { const w = clone(workoutById(editWid)), id = nextId(); w.id = id; w.name = 'Einheit ' + id; cfg.workouts.push(w); editWid = id; saveCfg(); route(); },
    async delW() {
      if (cfg.workouts.length < 2) { toast('Mindestens eine Einheit muss bleiben.'); return; }
      const r = await ask(`<h2>„${esc(workoutById(editWid).name)}“ löschen?</h2>`, [{ t: 'Löschen', v: 'ok', cls: 'danger' }, { t: 'Abbrechen', v: 'no', cls: 'ghost' }]);
      if (r.v === 'ok') { cfg.workouts = cfg.workouts.filter(w => w.id !== editWid); editWid = null; selWid = null; saveCfg(); route(); }
    },
    exp() {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([JSON.stringify(cfg, null, 2)], { type: 'application/json' }));
      a.download = 'zirkel-timer-konfig.json'; document.body.appendChild(a); a.click(); a.remove();
    },
    imp: () => $('#file').click(),
    async reset() {
      const r = await ask('<h2>Alles zurücksetzen?</h2><p>Plan und Einstellungen gehen auf den Standard zurück. Der Verlauf bleibt erhalten.</p>', [{ t: 'Zurücksetzen', v: 'ok', cls: 'danger' }, { t: 'Abbrechen', v: 'no', cls: 'ghost' }]);
      if (r.v === 'ok') { cfg = clone(DEF); selWid = editWid = null; saveCfg(); route(); toast('Zurückgesetzt'); }
    },
    async clearLog() {
      const r = await ask('<h2>Verlauf löschen?</h2>', [{ t: 'Löschen', v: 'ok', cls: 'danger' }, { t: 'Abbrechen', v: 'no', cls: 'ghost' }]);
      if (r.v === 'ok') { hist = []; saveHist(); route(); }
    }
  };
  const changes = {
    selw: t => { selWid = t.value; route(); },
    pw: t => { editWid = t.value; route(); },
    pname: t => { workoutById(editWid).name = t.value.trim() || workoutById(editWid).name; saveCfg(); },
    jog: () => { cfg.jog.seconds = Math.max(0, (+$('#jm').value || 0) * 60 + (+$('#js').value || 0)); saveCfg(); updateTotals(); }
  };

  app.addEventListener('click', e => {
    const g = e.target.closest('[data-go]');
    if (g) { go(g.dataset.go); return; }
    const a = e.target.closest('[data-act]');
    if (a && actions[a.dataset.act]) actions[a.dataset.act](a, e);
  });
  app.addEventListener('change', e => {
    const t = e.target;
    if (t.dataset.chg) { changes[t.dataset.chg](t); return; }
    if (t.id === 'file') {
      const f = t.files[0]; if (!f) return;
      f.text().then(async txt => {
        let o; try { o = JSON.parse(txt); } catch (err) { o = null; }
        if (!validCfg(o)) { toast('Datei ungültig'); return; }
        const r = await ask('<h2>Konfiguration importieren?</h2><p>Die aktuelle Konfiguration wird ersetzt.</p>', [{ t: 'Importieren', v: 'ok' }, { t: 'Abbrechen', v: 'no', cls: 'ghost' }]);
        if (r.v === 'ok') { cfg = normCfg(o); selWid = editWid = null; saveCfg(); route(); toast('Importiert'); }
      });
      return;
    }
    if (t.dataset.k) {
      const path = t.dataset.k.split('.'), key = path.pop(), obj = path.reduce((o, k) => o[k], cfg);
      obj[key] = t.type === 'checkbox' ? t.checked : t.type === 'number' ? Math.max(0, Number(t.value) || 0) : t.value;
      saveCfg(); updateTotals();
    }
  });

  window.addEventListener('hashchange', route);
  document.addEventListener('pointerdown', audioInit);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && sess && !sess.paused) { wake(); tick(); } });

  restore();
  const demo = new URLSearchParams(location.search).get('demo');
  if (demo && !sess) {
    const [w, t, p] = demo.split(',');
    start(w || 'A'); sess.offset = Number(t) || 0; sess.paused = p !== 'run'; saveSess();
  }
  setInterval(tick, 200);
  route();
})();
