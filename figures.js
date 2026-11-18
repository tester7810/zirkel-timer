(function (root) {
  // Seitenansicht: Boden bei y=175, Figur schaut nach rechts, Gelenke per Zwei-Knochen-IK.
  const L = { thigh: 46, shank: 44, torso: 56, uarm: 30, farm: 28, neck: 14, foot: 13 };
  const C = { near: '#2b2b2b', far: '#a3a3a3', hl: '#d6293e', prop: '#4a86b8', floor: '#333', arrow: '#e08a00', mat: '#c9d6e3', metal: '#555' };
  const rad = d => d * Math.PI / 180;
  const dir = a => [Math.cos(rad(a)), -Math.sin(rad(a))];
  const add = (p, v, k) => [p[0] + v[0] * k, p[1] + v[1] * k];
  const f = n => n.toFixed(1);
  const line = (a, b, col, w) => `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
  const wrap = g => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 215" role="img"><g transform="translate(0,30)">${g}</g></svg>`;

  function ik(a, c, l1, l2, bend, mid) {
    if (mid) return { mid, end: c };
    let dx = c[0] - a[0], dy = c[1] - a[1], d = Math.hypot(dx, dy);
    const max = l1 + l2 - 0.01;
    if (d > max) { c = [a[0] + dx * max / d, a[1] + dy * max / d]; dx = c[0] - a[0]; dy = c[1] - a[1]; d = max; }
    const x = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
    const h = Math.sqrt(Math.max(0, l1 * l1 - x * x));
    const p = [a[0] + dx * x / d, a[1] + dy * x / d];
    return { mid: [p[0] + bend * h * dy / d, p[1] - bend * h * dx / d], end: c };
  }

  function solve(p) {
    const hip = p.hip, neck = add(hip, dir(p.torso), L.torso);
    const head = add(neck, dir(p.torso + (p.headTilt || 0)), L.neck);
    head[1] -= (p.headLift || 0);
    const seg = { torso: [hip, neck] };
    ['N', 'F'].forEach(k => {
      const lg = p['leg' + k];
      if (lg) {
        const r = ik(hip, lg.foot, L.thigh, L.shank, lg.bend ?? 1, lg.knee);
        seg['thigh' + k] = [hip, r.mid]; seg['shank' + k] = [r.mid, r.end];
        seg['foot' + k] = [r.end, add(r.end, dir(lg.toe ?? 0), L.foot)];
      }
      const am = p['arm' + k];
      if (am) {
        const r = ik(neck, am.hand, L.uarm, L.farm, am.bend ?? -1, am.elbow);
        seg['uarm' + k] = [neck, r.mid]; seg['farm' + k] = [r.mid, r.end];
      }
    });
    return { hip, neck, head, seg };
  }

  function prop(x) {
    switch (x.t) {
      case 'mat': return `<rect x="${x.x1}" y="175" width="${x.x2 - x.x1}" height="7" rx="3" fill="${C.mat}"/>`;
      case 'bench': return `<rect x="${x.x}" y="${175 - x.h}" width="${x.w}" height="${x.h}" rx="4" fill="${C.prop}"/>`;
      case 'fix': return `<rect x="${x.x - 14}" y="${x.y - 12}" width="28" height="9" rx="3" fill="${C.prop}"/>`;
      case 'bar': return line([x.x1, x.y], [x.x2, x.y], C.metal, 6) + line([x.x1, x.y], [x.x1, x.y - 12], C.metal, 5) + line([x.x2, x.y], [x.x2, x.y - 12], C.metal, 5);
      case 'dipbar': return line([x.p1, x.y], [x.p1, 175], '#777', 5) + line([x.x2, x.y], [x.x2, 175], '#777', 5) + line([x.x1, x.y], [x.x2, x.y], C.metal, 6);
      case 'line': return line(x.a, x.b, x.c || C.prop, x.w || 6);
      case 'db': return `<rect x="${x.x - 9}" y="${x.y - 5}" width="18" height="10" rx="3" fill="${C.metal}"/>`;
      case 'treadmill': return `<rect x="40" y="175" width="215" height="8" rx="4" fill="#444"/>` + line([262, 175], [262, 70], C.metal, 6) + line([262, 70], [236, 76], C.metal, 6);
      case 'arrow': {
        const d = [x.to[0] - x.from[0], x.to[1] - x.from[1]], n = Math.hypot(d[0], d[1]), u = [d[0] / n, d[1] / n], q = [-u[1], u[0]];
        const b = [x.to[0] - u[0] * 11, x.to[1] - u[1] * 11];
        return line(x.from, b, C.arrow, 3.5) + `<polygon points="${f(x.to[0])},${f(x.to[1])} ${f(b[0] + q[0] * 6)},${f(b[1] + q[1] * 6)} ${f(b[0] - q[0] * 6)},${f(b[1] - q[1] * 6)}" fill="${C.arrow}"/>`;
      }
    }
    return '';
  }

  const ORDER = ['uarmF', 'farmF', 'thighF', 'shankF', 'footF', 'torso', 'thighN', 'shankN', 'footN', 'uarmN', 'farmN'];

  function side(p) {
    const s = solve(p);
    let g = (p.props || []).map(prop).join('');
    g += line([10, 175], [290, 175], C.floor, 2.5);
    ORDER.forEach(n => {
      if (!s.seg[n]) return;
      const col = (p.hl || []).includes(n) ? C.hl : (n.endsWith('F') ? C.far : C.near);
      g += line(s.seg[n][0], s.seg[n][1], col, 8);
    });
    g += `<circle cx="${f(s.head[0])}" cy="${f(s.head[1])}" r="11" fill="${C.near}"/>`;
    if ((p.dots || []).includes('shoulder')) g += `<circle cx="${f(s.neck[0])}" cy="${f(s.neck[1])}" r="6" fill="${C.hl}"/>`;
    (p.after || []).forEach(x => { g += prop(x); });
    return wrap(g);
  }

  // Frontansicht (für Seitheben / Reverse Fly): Arme per IK von den Schultern.
  function front(p) {
    const cx = 150, neckY = p.neckY ?? 20, shY = neckY + 6, hipY = 76;
    const sh = [[cx - 16, shY], [cx + 16, shY]], hp = [[cx - 9, hipY], [cx + 9, hipY]];
    const foot = [[hp[0][0] - 4, 166], [hp[1][0] + 4, 166]];
    let g = line([10, 175], [290, 175], C.floor, 2.5);
    [0, 1].forEach(i => {
      const k = p.knees ? p.knees[i] : [hp[i][0] + (i ? 2 : -2), 121];
      g += line(hp[i], k, C.near, 8) + line(k, foot[i], C.near, 8) + line(foot[i], [foot[i][0] + (i ? 10 : -10), 169], C.near, 8);
    });
    g += line([cx, neckY], [cx, hipY], C.near, 8) + line(sh[0], sh[1], C.near, 8) + line(hp[0], hp[1], C.near, 8);
    const hands = [];
    ['armL', 'armR'].forEach((k, i) => {
      const a = p[k]; if (!a) return;
      const r = ik(sh[i], a.hand, L.uarm, L.farm, a.bend, null);
      g += line(sh[i], r.mid, C.near, 8) + line(r.mid, r.end, C.near, 8);
      hands.push(r.end);
    });
    g += `<circle cx="${cx}" cy="${p.headY ?? 6}" r="11" fill="${C.near}"/>`;
    if (p.band) hands.forEach((h, i) => { g += line([foot[i][0], 168], h, C.arrow, 3); });
    if (p.band) g += line([foot[0][0], 168], [foot[1][0], 168], C.arrow, 3);
    sh.forEach(s => { g += `<circle cx="${f(s[0])}" cy="${f(s[1])}" r="6" fill="${C.hl}"/>`; });
    (p.after || []).forEach(x => { g += prop(x); });
    return wrap(g);
  }

  const render = p => (p.front ? front(p) : side(p));

  const MAT = { t: 'mat', x1: 20, x2: 280 };
  const NF = { foot: [71, 171], toe: 180 };
  const POSES = {
    liegestuetz: [
      { hip: [159.4, 132.2], torso: 20, legN: { foot: [75, 163], toe: -60 }, legF: { foot: [75, 163], toe: -60 }, armN: { hand: [212, 171], bend: -1 }, hl: ['uarmN', 'farmN'], dots: ['shoulder'], props: [MAT, { t: 'arrow', from: [262, 95], to: [262, 130] }] },
      { hip: [164.3, 153.8], torso: 5.9, legN: { foot: [75, 163], toe: -60 }, legF: { foot: [75, 163], toe: -60 }, armN: { hand: [220, 171], bend: -1 }, hl: ['uarmN', 'farmN'], dots: ['shoulder'], props: [MAT, { t: 'arrow', from: [262, 140], to: [262, 105] }] }
    ],
    pistol: [
      { hip: [130, 76], torso: 90, legN: { foot: [130, 166], toe: 0 }, legF: { foot: [219, 82], toe: 70 }, armN: { hand: [186, 28], bend: -1 }, hl: ['thighN', 'shankN'], props: [{ t: 'arrow', from: [60, 60], to: [60, 105] }] },
      { hip: [108, 150], torso: 60, headTilt: 15, legN: { foot: [130, 166], toe: 0 }, legF: { foot: [196, 148], toe: 70 }, armN: { hand: [192, 106], bend: -1 }, hl: ['thighN', 'shankN'], props: [{ t: 'arrow', from: [60, 145], to: [60, 100] }] }
    ],
    ironmike: [
      { hip: [134, 127], torso: 90, legN: { knee: [180, 127], foot: [180, 166], toe: 0 }, legF: { foot: [60, 158], toe: -60 }, armN: { hand: [152, 88], bend: -1 }, hl: ['thighN'] },
      { hip: [134, 92], torso: 90, legN: { foot: [176, 146], toe: -20 }, legF: { foot: [82, 140], toe: -70 }, armN: { hand: [152, 53], bend: -1 }, hl: ['thighN'], props: [{ t: 'arrow', from: [215, 150], to: [215, 105] }] }
    ],
    huefte_einbein: [
      { hip: [150, 171], torso: 180, headLift: 7, legN: { foot: [215, 127], toe: 60 }, legF: { foot: [192, 80], toe: 70 }, armN: { hand: [154, 172], bend: 1 }, hl: ['thighN'], props: [{ t: 'mat', x1: 20, x2: 200 }, { t: 'bench', x: 200, w: 70, h: 42 }] },
      { hip: [145.9, 139], torso: 215, headLift: 7, legN: { foot: [215, 127], toe: 60 }, legF: { foot: [224, 80], toe: 70 }, armN: { hand: [154, 172], bend: 1 }, hl: ['thighN'], props: [{ t: 'mat', x1: 20, x2: 200 }, { t: 'bench', x: 200, w: 70, h: 42 }, { t: 'arrow', from: [146, 172], to: [146, 150] }] }
    ],
    klimmzug: [
      { hip: [162, 120], torso: 90, legN: { foot: [128, 150], toe: -30 }, legF: { foot: [136, 156], toe: -30 }, armN: { hand: [192, 14], bend: -1 }, armF: { hand: [192, 14], bend: -1 }, hl: ['uarmN'], props: [{ t: 'bar', y: 14, x1: 150, x2: 235 }] },
      { hip: [170, 74], torso: 90, legN: { foot: [136, 105], toe: -30 }, legF: { foot: [144, 111], toe: -30 }, armN: { hand: [192, 14], bend: -1 }, armF: { hand: [192, 14], bend: -1 }, hl: ['uarmN'], props: [{ t: 'bar', y: 14, x1: 150, x2: 235 }] }
    ],
    nordic: [
      { hip: [115, 125], torso: 90, legN: { knee: [115, 171], ...NF }, legF: { knee: [115, 171], ...NF }, armN: { hand: [150, 108], bend: -1 }, hl: ['thighN', 'thighF'], props: [MAT, { t: 'fix', x: 71, y: 171 }] },
      { hip: [155, 148], torso: 30, legN: { knee: [115, 171], ...NF }, legF: { knee: [115, 171], ...NF }, armN: { hand: [226, 171], bend: -1 }, hl: ['thighN', 'thighF'], props: [MAT, { t: 'fix', x: 71, y: 171 }] }
    ],
    dips: [
      { hip: [170.5, 106.1], torso: 75, legN: { foot: [145, 146], toe: -30 }, legF: { foot: [151, 149], toe: -30 }, armN: { hand: [185, 110], bend: -1 }, hl: ['uarmN', 'farmN'], props: [{ t: 'dipbar', x1: 172, x2: 255, y: 110, p1: 215 }, { t: 'arrow', from: [275, 60], to: [275, 95] }] },
      { hip: [165.8, 136.6], torso: 70, legN: { foot: [138, 156], toe: -30 }, legF: { foot: [144, 158], toe: -30 }, armN: { hand: [187, 110], bend: -1 }, hl: ['uarmN', 'farmN'], props: [{ t: 'dipbar', x1: 172, x2: 255, y: 110, p1: 215 }, { t: 'arrow', from: [275, 95], to: [275, 60] }] }
    ],
    seitheben: [
      { front: true, band: true, armL: { hand: [130, 82], bend: -1 }, armR: { hand: [170, 82], bend: 1 } },
      { front: true, band: true, armL: { hand: [78, 34], bend: 1 }, armR: { hand: [222, 34], bend: -1 } }
    ],
    reverse_fly: [
      { front: true, band: true, neckY: 38, headY: 33, knees: [[134, 120], [166, 120]], armL: { hand: [134, 98], bend: -1 }, armR: { hand: [166, 98], bend: 1 } },
      { front: true, band: true, neckY: 38, headY: 33, knees: [[134, 120], [166, 120]], armL: { hand: [80, 46], bend: 1 }, armR: { hand: [220, 46], bend: -1 } }
    ],
    bizepscurl: [
      { hip: [114, 134], torso: 120, headTilt: -25, legN: { foot: [170, 171], toe: 0 }, legF: { foot: [176, 171], toe: 0 }, armN: { hand: [90, 143], bend: -1 }, armF: { hand: [100, 92], bend: -1 }, hl: ['uarmN'], props: [{ t: 'line', a: [111, 145], b: [74, 83], w: 10 }, { t: 'line', a: [95, 142], b: [170, 142], w: 9 }, { t: 'line', a: [108, 142], b: [108, 175], w: 5 }, { t: 'line', a: [160, 142], b: [160, 175], w: 5 }], after: [{ t: 'db', x: 90, y: 146 }] },
      { hip: [114, 134], torso: 120, headTilt: -25, legN: { foot: [170, 171], toe: 0 }, legF: { foot: [176, 171], toe: 0 }, armN: { hand: [100, 92], bend: -1 }, armF: { hand: [92, 143], bend: -1 }, hl: ['uarmN'], props: [{ t: 'line', a: [111, 145], b: [74, 83], w: 10 }, { t: 'line', a: [95, 142], b: [170, 142], w: 9 }, { t: 'line', a: [108, 142], b: [108, 175], w: 5 }, { t: 'line', a: [160, 142], b: [160, 175], w: 5 }], after: [{ t: 'db', x: 100, y: 89 }] }
    ],
    crunch: [
      { hip: [140, 171], torso: 180, headLift: 7, legN: { foot: [188, 171], toe: 0 }, legF: { foot: [194, 171], toe: 0 }, armN: { hand: [104, 160], bend: 1 }, hl: ['torso'], props: [MAT, { t: 'arrow', from: [60, 148], to: [76, 124] }] },
      { hip: [140, 171], torso: 145, legN: { foot: [188, 171], toe: 0 }, legF: { foot: [194, 171], toe: 0 }, armN: { hand: [112, 141], bend: 1 }, hl: ['torso'], props: [MAT] }
    ],
    reverse_crunch: [
      { hip: [140, 171], torso: 180, headLift: 7, legN: { knee: [140, 125], foot: [184, 127], toe: 30 }, legF: { knee: [146, 125], foot: [190, 127], toe: 30 }, armN: { hand: [141, 172], bend: 1 }, hl: ['torso'], props: [MAT] },
      { hip: [146, 160], torso: 191, headTilt: -11, headLift: 7, legN: { knee: [134, 115.6], foot: [174, 133.6], toe: 30 }, legF: { knee: [140, 118], foot: [180, 136], toe: 30 }, armN: { hand: [141, 172], bend: 1 }, hl: ['torso'], props: [MAT, { t: 'arrow', from: [112, 150], to: [112, 124] }] }
    ],
    joggen: [
      { hip: [150, 88], torso: 80, legN: { foot: [138, 166], toe: 0 }, legF: { foot: [152, 130], toe: -40 }, armN: { hand: [188, 58], bend: -1 }, armF: { hand: [124, 62], bend: -1 },       props: [{ t: 'treadmill' }] },
            { hip: [150, 88], torso: 80, legF: { foot: [138, 166], toe: 0 }, legN: { foot: [152, 130], toe: -40 }, armF: { hand: [188, 58], bend: -1 }, armN: { hand: [124, 62], bend: -1 }, props: [{ t: 'treadmill' }] }
    ],
    pike: [
      { hip: [130, 92], torso: -27.6, legN: { foot: [89, 166], toe: 0 }, legF: { foot: [89, 166], toe: 0 }, armN: { hand: [192, 171], bend: -1 }, dots: ['shoulder'] },
      { hip: [125, 93], torso: -45, legN: { foot: [89, 166], toe: 0 }, legF: { foot: [89, 166], toe: 0 }, armN: { hand: [192, 171], bend: -1 }, dots: ['shoulder'] }
    ],
    bulgarian: [
      { hip: [140, 88], torso: 90, legN: { foot: [178, 166], toe: 0 }, legF: { foot: [70, 128], toe: 180 }, armN: { hand: [146, 88], bend: -1 }, hl: ['thighN'], props: [{ t: 'bench', x: 30, w: 55, h: 42 }] },
      { hip: [140, 122], torso: 85, legN: { foot: [178, 166], toe: 0 }, legF: { foot: [70, 128], toe: 180 }, armN: { hand: [150, 122], bend: -1 }, hl: ['thighN'], props: [{ t: 'bench', x: 30, w: 55, h: 42 }] }
    ]
  };

  root.Fig = { render, POSES };
})(typeof window !== 'undefined' ? window : globalThis);
