(function (root) {
  // Übungsbibliothek. Neue Übungen: hier eintragen (und optional in figures.js eine Zeichnung, in info.js eine Infokarte).
  const EX = {
    liegestuetz: { name: 'Liegestütz', group: 'Brust · Trizeps · vordere Schulter', gear: 'Matte', hint: 'Körper gerade wie ein Brett, Brust Richtung Boden, kontrolliert hochdrücken.' },
    pistol: { name: 'Pistol Squat', group: 'Oberschenkelvorderseite · Gesäß', gear: 'Wand oder Stütze zur Hilfe', uni: true, hint: 'Standbein: Ferse am Boden, Knie über dem Fuß. Anderes Bein gestreckt vor. Zur Hälfte Seite wechseln.' },
    ironmike: { name: 'Iron Mikes', group: 'Beine · Schnellkraft', gear: 'Matte', hint: 'Tiefer Ausfallschritt, hochspringen, in der Luft Beine wechseln, weich landen.' },
    huefte_einbein: { name: 'Einbeinige Hüftstreckung', group: 'Oberschenkelrückseite · Gesäß', gear: 'Bank, Matte', uni: true, hint: 'Rückenlage, Fuß auf der Bank, anderes Bein gestreckt. Hüfte hoch, bis Schulter–Hüfte–Knie eine Linie sind. Zur Hälfte Seite wechseln.' },
    klimmzug: { name: 'Klimmzug', group: 'Rücken · Bizeps', gear: 'Klimmzugstange', hint: 'Aus dem Hang ziehen, Kinn über die Stange, kontrolliert ablassen.' },
    nordic: { name: 'Nordic Curl', group: 'Oberschenkelrückseite · Waden', gear: 'Matte, Fixierung der Füße', hint: 'Füße fixiert, Körper gerade, langsam nach vorn lehnen (3–5 s), mit den Händen abfangen.' },
    dips: { name: 'Dips', group: 'Brust · Trizeps · Schulter', gear: 'Dip-Stange', hint: 'Oberkörper leicht nach vorn, nur so tief, dass die Schultern angenehm bleiben, kräftig hochdrücken.' },
    seitheben: { name: 'Seitheben mit Band', group: 'Seitliche Schulter', gear: 'Theraband', hint: 'Auf dem Band stehen, Arme leicht gebeugt seitlich bis etwa Schulterhöhe heben.' },
    reverse_fly: { name: 'Reverse Fly mit Band', group: 'Hintere Schulter · oberer Rücken', gear: 'Theraband', hint: 'Oberkörper vorgebeugt, Arme seitlich auseinanderziehen, Schulterblätter zusammen.' },
    bizepscurl: { name: 'Bizepscurl', group: 'Bizeps', gear: 'Kurzhanteln, Bank', hint: 'Sitzend im Wechsel, Oberarm bleibt ruhig, volle Bewegung von gestreckt bis oben.' },
    crunch: { name: 'Crunch', group: 'Bauch (oberer gerader Bauchmuskel)', gear: 'Matte', hint: 'Unterer Rücken bleibt am Boden, Brustkorb Richtung Becken einrollen, Nacken locker.' },
    reverse_crunch: { name: 'Reverse Crunch', group: 'Bauch (unterer Teil) · schräge Bauchmuskeln', gear: 'Matte oder Schrägbank', hint: 'Knie zur Brust ziehen, Becken einrollen (kein Schwung), langsam ablassen.' },
    pike: { name: 'Pike Push-up', group: 'Schulter · Trizeps', gear: 'Matte', hint: 'Hüfte hoch (umgekehrtes V), Kopf zwischen die Hände senken, hochdrücken.' },
    bulgarian: { name: 'Bulgarian Split Squat', group: 'Oberschenkelvorderseite · Gesäß', gear: 'Bank', uni: true, hint: 'Hinterer Fuß auf der Bank, Oberkörper aufrecht, tief beugen. Zur Hälfte Seite wechseln.' },
    joggen: { name: 'Joggen (Laufband)', group: 'Ausdauer', gear: 'Laufband', hint: 'Locker und gleichmäßig laufen. Du solltest noch in ganzen Sätzen sprechen können.', virtual: true }
  };

  // Ablauf pro Einheit: 8 Stationen × 2 Runden. Die Beinstation rotiert über die Einheiten A/B/C.
  function mk(id, name, leg1, leg2) {
    const r1 = ['liegestuetz', leg1, 'klimmzug', 'nordic', 'dips', 'seitheben', 'bizepscurl', 'crunch'];
    const r2 = ['liegestuetz', leg2, 'klimmzug', 'nordic', 'dips', 'reverse_fly', 'bizepscurl', 'reverse_crunch'];
    const steps = [];
    [r1, r2].forEach((r, ri) => r.forEach((ex, si) => steps.push({ ex, st: si + 1, rd: ri + 1 })));
    return { id, name, steps };
  }

  const DEFAULT_CFG = {
    version: 1,
    times: { work: 45, rest: 20, prep: 10 },
    jog: { seconds: 750, speed: 11, incline: 'an (ca. 2 %)' },
    sound: { beep: true, voice: true, vibrate: true, halfway: true },
    workouts: [
      mk('A', 'Einheit A', 'ironmike', 'pistol'),
      mk('B', 'Einheit B', 'ironmike', 'huefte_einbein'),
      mk('C', 'Einheit C', 'pistol', 'huefte_einbein')
    ]
  };

  root.EX = EX;
  root.DEFAULT_CFG = DEFAULT_CFG;
})(typeof window !== 'undefined' ? window : globalThis);
