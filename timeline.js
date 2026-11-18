(function (root) {
  const fmt = s => {
    s = Math.max(0, Math.ceil(s - 1e-9));
    return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  };
  const num = (v, d) => (Number.isFinite(Number(v)) && v !== null && v !== '' ? Number(v) : d);

  // Baut aus einer Einheit eine Liste von Abschnitten: prep, work, rest, jog (jeweils mit start/end in Sekunden).
  function build(workout, cfg) {
    const t = cfg.times, steps = workout.steps || [], segs = [];
    const jog = workout.jog || cfg.jog || {};
    const jogSec = num(jog.seconds, 0);
    const parts = jog.parts && jog.parts.length ? jog.parts : (jogSec > 0 ? [{ seconds: jogSec, speed: jog.speed }] : []);
    const prep = num(t.prep, 0);
    if (prep > 0 && steps.length) segs.push({ kind: 'prep', dur: prep, step: 0 });
    steps.forEach((s, i) => {
      const work = num(s.work, num(t.work, 45));
      if (work > 0) segs.push({ kind: 'work', dur: work, step: i });
      const rest = num(s.rest, num(t.rest, 20));
      const last = i === steps.length - 1;
      if (rest > 0 && (!last || parts.length)) segs.push({ kind: 'rest', dur: rest, step: i, next: last ? null : i + 1 });
    });
    parts.forEach((p, j) => {
      const dur = num(p.seconds, 0);
      if (dur > 0) segs.push({ kind: 'jog', dur, speed: p.speed ?? jog.speed, incline: jog.incline, part: j, parts: parts.length });
    });
    let acc = 0;
    segs.forEach(s => { s.start = acc; acc += s.dur; s.end = acc; });
    return { segs, total: acc };
  }

  function index(tl, el) {
    const segs = tl.segs;
    for (let i = segs.length - 1; i >= 0; i--) if (el >= segs[i].start) return i;
    return 0;
  }

  root.TL = { build, index, fmt };
})(typeof window !== 'undefined' ? window : globalThis);
