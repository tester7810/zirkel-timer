(function (root) {
  // Infokarten pro Übung. Schlüssel = Übungs-ID aus exercises.js.
  // Felder: steps, fehler, tempo, sicherheit, warum, quellen, evidenz.
  // "Praxis-Konsens" = übliche Trainerempfehlung ohne eigene Studie zu genau dieser Übung.
  root.INFO = {
    liegestuetz: {
      evidenz: 'Evidenz: teilweise belegt',
      steps: [
        'Hände etwa schulterbreit unter die Schultern, Körper von Kopf bis Ferse als gerade Linie, Bauch und Gesäß anspannen.',
        'Ellbogen schräg nach hinten führen (ca. 45° zum Rumpf, Pfeilform statt T-Form).',
        'Brust kontrolliert absenken, bis die Ellbogen etwa 90° gebeugt sind.',
        'Bis zur vollen Armstreckung hochdrücken und oben die Schulterblätter noch leicht auseinanderschieben.'
      ],
      fehler: [
        'Hüfte hängt durch oder der Po ragt nach oben.',
        'Ellbogen weit nach außen und Schultern zu den Ohren gezogen.',
        'Halbe Wiederholungen ohne volle Streckung oben.'
      ],
      tempo: 'Ca. 2 s absenken, kraftvoll hochdrücken. Das Tempo ist Praxis-Konsens. Die volle Streckung oben passt zu den Messungen von Kang 2019.',
      sicherheit: 'Bei Schulter- oder Handgelenkschmerz die Hände auf die Bank stellen (leichtere Variante). Immer auf festem Untergrund bleiben, auf instabilem Untergrund arbeitet der obere Trapezius mehr.',
      warum: 'Der Standard-Liegestütz aktiviert Brustmuskel und Trizeps stark und den Serratus anterior (Schulterblatt-Stabilisator) ebenfalls (Kowalski 2022, Scoping Review mit 30 Studien). Die Schulterblatt-Streckung am Ende erhöht die Serratus-Aktivität bei geringerer Aktivität des oberen Trapezius (Kang 2019, Meta-Analyse). Alles sind EMG-Daten, keine Trainingsstudien.',
      quellen: [
        'Kowalski 2022, Shoulder Elbow – Scoping Review, 30 Studien (PMID 35599715)',
        'Kang 2019, J Athl Train – Meta-Analyse, 19 Studien (PMID 31584855)',
        'Cogley 2005, J Strength Cond Res – enge Handposition: mehr Brust- und Trizepsaktivität (PMID 16095413)'
      ]
    },

    pistol: {
      evidenz: 'Evidenz: indirekt (aus Studien zur Einbeinkniebeuge)',
      steps: [
        'Seitlich an Wand oder Stütze stellen, auf einem Bein stehen, das andere Bein gestreckt vor dem Körper.',
        'Ganzer Fuß flach am Boden, Knie zeigt in dieselbe Richtung wie die Fußspitze.',
        'Kontrolliert nach hinten-unten setzen, Arme als Gegengewicht nach vorn. Das Knie darf über die Zehen wandern.',
        'Nur so tief gehen, wie die Ferse unten bleibt und das Knie nicht nach innen fällt.',
        'Über die ganze Fußsohle hochdrücken, ohne an der Stütze zu ziehen. Zur Hälfte der Zeit die Seite wechseln.'
      ],
      fehler: [
        'Knie kippt nach innen.',
        'Ferse hebt ab (oft zu wenig Beweglichkeit im Sprunggelenk).',
        'Fallen lassen und mit Schwung wieder hochfedern.'
      ],
      tempo: 'Ca. 2–3 s absenken, kontrolliert aufstehen. Die Tiefe schrittweise steigern. Das Tempo ist Praxis-Konsens.',
      sicherheit: 'Dass das Knie über die Zehen darf, solange die Ferse unten bleibt, passt zu Fry 2003 (Kniebeuge, nur 7 Personen). Wenn das Knie schmerzt: weniger tief gehen und die Wand zur Hilfe nehmen.',
      warum: 'Zum Pistol Squat selbst habe ich keine Studie gefunden. Die einbeinige Kniebeuge zählte mit Zusatzlast zu den besten Übungen für den mittleren Gesäßmuskel (Collings 2023). Knieeinwärtsknicken hängt laut Übersichtsarbeit unter anderem von Gesäßkraft und Sprunggelenksbeweglichkeit ab (Wilczyński 2020).',
      quellen: [
        'Collings 2023, Med Sci Sports Exerc – 14 Fußballerinnen (PMID 36918403)',
        'Wilczyński 2020, Int J Environ Res Public Health – Review (PMID 33172101)',
        'Fry 2003, J Strength Cond Res – Kniebeuge, n=7 (PMID 14636100)',
        'Pallarés 2021, Scand J Med Sci Sports – voller Bewegungsumfang brachte mehr Kraft, Meta-Analyse (PMID 34170576)'
      ]
    },

    ironmike: {
      evidenz: 'Evidenz: überwiegend Praxis-Konsens',
      steps: [
        'Im tiefen Ausfallschritt starten: vorderes Knie ca. 90° über dem Fuß, hinteres Knie knapp über dem Boden, Oberkörper aufrecht.',
        'Kraftvoll aus dem vorderen Fuß nach oben springen und die Arme mitschwingen.',
        'In der Luft die Beine wechseln.',
        'Weich landen: ganzer Fuß, Hüfte, Knie und Sprunggelenk beugen und abfedern, Knie über der Fußlinie.',
        'Direkt in den nächsten Sprung gehen. Werden die Landungen lauter oder unsauberer, kleiner springen.'
      ],
      fehler: [
        'Steife, fast gestreckte Landung (hohe Bodenreaktionskräfte, Fong 2011).',
        'Knie knickt beim Landen nach innen (Krosshaug 2007, Videoanalyse von Kreuzbandverletzungen).',
        'Müde, unsaubere Sprünge weiterführen.'
      ],
      tempo: 'Explosiv springen, aber leise und kontrolliert gebeugt landen. Das ist Praxis-Konsens, eine Dosierungsstudie zu dieser Übung habe ich nicht gefunden.',
      sicherheit: 'Wegen deiner Knie beim Joggen: lieber niedriger springen und sauber landen. Bei Knieschmerz Sprunghöhe senken oder Ausfallschritte ohne Sprung machen.',
      warum: 'Zu dieser Übung selbst habe ich keine direkte Studie gefunden. Plyometrisches Training verbesserte in einem 16-Wochen-RCT mit 24 Männern Landemechanik und Beinkraft (Bocheng 2024). Krafttraining insgesamt senkte Sportverletzungen deutlich (Lauersen 2014, Meta-Analyse).',
      quellen: [
        'Fong 2011, J Athl Train – Landung, 35 Personen (PMID 21214345)',
        'Krosshaug 2007, Am J Sports Med – 39 Kreuzbandverletzungen im Video (PMID 17092928)',
        'Bocheng 2024, Eur J Sport Sci – RCT, 24 Männer (PMID 39022860)',
        'Lauersen 2014, Br J Sports Med – Meta-Analyse, 25 Studien (PMID 24100287)'
      ]
    },

    huefte_einbein: {
      evidenz: 'Evidenz: teilweise belegt (EMG)',
      steps: [
        'Auf den Rücken legen, Schultern am Boden, Arme seitlich. Ferse des einen Fußes auf die Bank, das andere Bein anheben.',
        'Ferse in die Bank drücken und das Becken heben, bis Schulter, Hüfte und Knie eine Linie bilden.',
        'Becken waagerecht halten, Gesäß und Bauch anspannen, oben ca. 1 s halten.',
        'Langsam absenken. Zur Hälfte der Zeit die Seite wechseln.',
        'Je weiter der Fuß entfernt (Knie gestreckter), desto mehr arbeitet die Oberschenkelrückseite. Je näher der Fuß, desto mehr das Gesäß.'
      ],
      fehler: [
        'Hohlkreuz am Endpunkt statt echter Hüftstreckung.',
        'Becken kippt oder dreht zur Seite.',
        'Hochreißen mit maximaler Geschwindigkeit. Die Aktivierung stieg dann auf über 90 % der Maximalkraft (Sano 2025), das ist für den Anfang zu viel.'
      ],
      tempo: 'Ca. 2 s heben, 1 s halten, ca. 3 s senken. Das ist Praxis-Konsens.',
      sicherheit: 'Wegen deiner Oberschenkelrückseiten-Vorgeschichte: kontrolliert arbeiten. Bei Zerrungsgefühl den Fuß näher stellen und das Knie stärker beugen. In Lehecka 2017 sank die Hamstring-Aktivität dadurch von ca. 75 % auf ca. 23 %.',
      warum: 'Die einbeinige Brücke trainiert Gesäß und Oberschenkelrückseite zusammen (Youdas 2017: Gesäß ca. 34 %, Hamstrings ca. 28 % der Maximalaktivität). Im MRT war vor allem der Semitendinosus aktiv und der lange Bizepskopf stärker als der kurze (Bourne 2018). Ho 2020 und Lehecka 2017 zeigen: Das Knie weniger zu beugen erhöht die Hamstring-Aktivität. Eine Studie (Breed 2026) nennt für die einbeinige Hamstring-Brücke Spitzenkräfte ähnlich dem Maximalsprint. Dort habe ich nur das Abstract gelesen, die genaue Variante ist nicht gesichert.',
      quellen: [
        'Lehecka 2017, Int J Sports Phys Ther – 28 Personen (PMID 28900560)',
        'Ho 2020, Res Sports Med – 25 Männer (PMID 32567954)',
        'Youdas 2017, Physiother Theory Pract – 26 Personen (PMID 28095102)',
        'Bourne 2018, Int J Sports Med – MRT, n=9 (PMID 29161747)',
        'Sano 2025, Int J Sports Med – 26 Männer (PMID 39933727)',
        'Breed 2026, Br J Sports Med – nur Abstract gelesen (PMID 41730607)'
      ]
    },

    klimmzug: {
      evidenz: 'Evidenz: teilweise belegt (EMG)',
      steps: [
        'Stange im Obergriff etwas breiter als schulterbreit (Pull-up) oder im Untergriff schulterbreit (Chin-up) greifen.',
        'Im aktiven Hang starten: Arme gestreckt, Schulterblätter leicht nach unten gezogen, Rumpf angespannt.',
        'Ellbogen nach unten zur Hüfte ziehen, Brust zur Stange.',
        'Kinn über die Stange, ohne den Kopf vorzustrecken.',
        'Kontrolliert bis fast zur Armstreckung absenken.'
      ],
      fehler: [
        'Mit Schwung oder Beinkick hochkippen.',
        'Halbe Wiederholungen ohne fast gestreckte Arme unten.',
        'Schultern zu den Ohren ziehen.'
      ],
      tempo: 'Zügig, aber kontrolliert hochziehen (1–2 s), ca. 2–3 s absenken. Das Tempo ist Praxis-Konsens. Die Zugphase war in einer EMG-Studie aktiver als die Ablassphase (Dickie 2017).',
      sicherheit: 'Nicht ruckartig in den passiven Hang fallen lassen. Bei Ellbogen- oder Schulterschmerz weniger Wiederholungen machen oder mit Band unterstützen.',
      warum: 'Klimmzüge aktivieren den breiten Rückenmuskel (117–130 % der Maximalaktivität), den Bizeps (78–96 %) und den Infraspinatus stark (Youdas 2010, 25 Personen). Der Untergriff fordert Brust und Bizeps etwas mehr, der Obergriff den unteren Trapezius. Sonst sind die Griffe ähnlich (Dickie 2017).',
      quellen: [
        'Youdas 2010, J Strength Cond Res – 25 Personen (PMID 21068680)',
        'Dickie 2017, J Electromyogr Kinesiol – 19 Männer (PMID 28011412)',
        'Rabello 2024, J Bodyw Mov Ther – Review, 33 Studien (PMID 39593452)'
      ]
    },

    nordic: {
      evidenz: 'Evidenz: gut belegt (Verletzungsvorbeugung Oberschenkelrückseite)',
      steps: [
        'Auf eine gepolsterte Matte knien, Füße und Fersen sicher fixieren (bei dir: unter der Küchenschiene).',
        'Körper vom Knie bis zum Kopf gerade, Hüfte gestreckt, Bauch und Gesäß anspannen, Arme vor der Brust.',
        'So langsam wie möglich nach vorn lehnen und mit der Oberschenkelrückseite bremsen.',
        'Verlierst du die Kontrolle, mit den Händen abfangen.',
        'Mit den Händen nur so viel abdrücken, dass du wieder hochkommst. Die Hüfte bleibt dabei gestreckt.'
      ],
      fehler: [
        'In der Hüfte abknicken (Po nach hinten). Dann arbeitet die Oberschenkelrückseite weniger (Šarabon 2019).',
        'Ungebremst nach vorn fallen.',
        'Bei Muskelkater oder Schmerz unsauber weitermachen.'
      ],
      tempo: 'So langsam wie möglich absenken. Das Tempo ist Praxis-Konsens. Eine schräge Unterschenkel-Auflage (20–40°) erlaubte in einer Studie einen größeren Bewegungsumfang bei ähnlicher Spitzenkraft (Šarabon 2019).',
      sicherheit: 'Muskelkater ist bei dieser Übung häufig. Höhere Volumina erhöhten ihn in einem 6-Wochen-RCT (Behan 2023). Stechender Schmerz in Oberschenkelrückseite oder Wade ist etwas anderes: dann abbrechen. Immer mit den Händen auffangen.',
      warum: 'Programme mit Nordic Curl senkten Verletzungen der Oberschenkelrückseite um bis zu 51 % (RR 0,49; 15 Studien, 8459 Sportler; van Dyk 2019). Im Amateurfußball gab es weniger, aber nicht mildere Verletzungen (van der Horst 2015). Die Übung aktiviert den Bizepsmuskel der Oberschenkelrückseite stark (Llurda-Almuzara 2021) und bevorzugt den Semitendinosus (Bourne 2017). Der seitliche Wadenmuskel wurde in einer Studie mitgemessen und blieb auch bei mehr Hüftbeugung aktiv (Šarabon 2019). Dass Nordics Wadenverletzungen vorbeugen, ist aber nicht belegt.',
      quellen: [
        'van Dyk 2019, Br J Sports Med – Meta-Analyse, 15 Studien, 8459 Athleten (PMID 30808663)',
        'Petersen 2011, Am J Sports Med – Cluster-RCT, 942 Fußballer (PMID 21825112)',
        'van der Horst 2015, Am J Sports Med – RCT, 579 Fußballer (PMID 25794868)',
        'Šarabon 2019, PLoS One – 18 Erwachsene, auch Gastrocnemius gemessen (PMID 31644582)',
        'Behan 2023, Scand J Med Sci Sports – RCT, 40 Männer (PMID 36651719)',
        'Cuthbert 2020, Sports Med – niedrigere Volumina mit ähnlichem Zuwachs, Meta-Analyse (PMID 31502142)',
        'Bourne 2017, Br J Sports Med – 24 Männer (PMID 27467123)',
        'Llurda-Almuzara 2021, Int J Environ Res Public Health – Review (PMID 34444481)'
      ]
    },

    dips: {
      evidenz: 'Evidenz: dünn (eine Studie) und Praxis-Konsens',
      steps: [
        'Mit gestreckten Armen an der Dip-Stange abstützen, Schultern aktiv nach unten (weg von den Ohren), Beine angewinkelt.',
        'Ellbogen beugen und kontrolliert absenken. Die Ellbogen zeigen nach hinten und bleiben körpernah, der Oberkörper ist leicht nach vorn geneigt.',
        'Nur so tief gehen, dass die Schultern nicht nach vorn kippen und es vorn in der Schulter nicht „zieht“.',
        'Bis fast zur vollen Armstreckung hochdrücken, die Schultern bleiben unten.',
        'Kein Schwung und kein Pendeln, besonders bei Ermüdung.'
      ],
      fehler: [
        'Zu tief absacken, sodass die Schulter in die Endstellung rutscht (McKenzie 2022).',
        'Schultern hochziehen oder nach vorn rollen lassen.',
        'Ermüdet mit Schwung weitermachen.'
      ],
      tempo: 'Ca. 2 s absenken, ca. 1 s hochdrücken. Das Tempo ist Praxis-Konsens. Die Tiefe lieber begrenzen als ausreizen.',
      sicherheit: 'Schulter: Bank-Dips (Hände hinter dem Körper) meiden. McKenzie 2022 empfiehlt sie nicht als Standardübung, weil sie die vordere Schulterkapsel belasten könnten. Das ist die Schlussfolgerung der Autoren, kein Verletzungsnachweis. Bei Schulterschmerz mit Fußaufstellung oder Bandunterstützung ausweichen.',
      warum: 'Stangen-Dips erzeugten bei 13 erfahrenen Männern höhere Aktivierung als Bank-Dips in Brust, vorderem Deltamuskel, Trizeps, oberem Trapezius, Serratus und breitem Rückenmuskel. Die Autoren sehen den Stangen-Dip als sinnvolle Progression nach dem Bank-Dip. Das ist die einzige Studie, die ich gefunden habe. Sie hat eine kleine Stichprobe und keine Verletzungsdaten.',
      quellen: [
        'McKenzie 2022, Int J Environ Res Public Health – 13 Männer (PMID 36293792)'
      ]
    },

    seitheben: {
      evidenz: 'Evidenz: indirekt (aus Hantel- und Band-Studien)',
      steps: [
        'Mittig auf das Band stellen (Füße hüftbreit), Enden greifen, Arme seitlich, Ellbogen leicht gebeugt.',
        'Rumpf aufrichten, Rippen unten, Schultern von den Ohren weg.',
        'Arme seitlich bis höchstens Schulterhöhe heben. Die Hände führen nicht höher als die Ellbogen.',
        'Oben kurz halten, die Ellbogenbeugung bleibt gleich.',
        'Langsam gegen den Zug des Bandes absenken.'
      ],
      fehler: [
        'Schultern zucken lassen oder die Daumen nach unten drehen („Kanne ausgießen“). Das verlagert Arbeit auf hinteren Deltamuskel und oberen Trapezius (Coratella 2020).',
        'Mit dem Rumpf schwingen.',
        'Ellbogen stark anwinkeln. Der seitliche Deltamuskel arbeitet dann weniger (Coratella 2020).'
      ],
      tempo: 'Ca. 2 s heben, ca. 2 s senken (so wurde es in einer Band-Studie zum Reverse Fly gemessen, Bergquist 2018). Der Bandzug nimmt zum Ende der Bewegung zu.',
      sicherheit: 'Nicht über Schulterhöhe heben. Bei Schulterschmerz leicht vor der Körperseite arbeiten. Das Band nie über das Dreifache seiner Ruhelänge dehnen (Herstellerangabe) und vorher auf Risse prüfen.',
      warum: 'Seitheben und Abduktionen brachten laut Review die höchste Aktivierung des seitlichen Deltamuskels (Rabello 2024). Eine Studie speziell zum Seitheben mit Theraband habe ich nicht gefunden. Bei Reverse Flys war die Aktivität des seitlichen Deltamuskels mit Band höher als mit Hanteln (Bergquist 2018).',
      quellen: [
        'Rabello 2024, J Bodyw Mov Ther – Review, 33 Studien (PMID 39593452)',
        'Coratella 2020, Int J Environ Res Public Health – 10 Bodybuilder (PMID 32824894)',
        'Bergquist 2018, J Hum Kinet – 29 Personen, Band vs. Hantel (PMID 29599855)'
      ]
    },

    reverse_fly: {
      evidenz: 'Evidenz: indirekt, Technik überwiegend Praxis-Konsens',
      steps: [
        'Mittig auf das Band stellen, Enden greifen. Mit geradem Rücken aus der Hüfte nach vorn beugen, Arme hängen nach unten, Ellbogen leicht gebeugt.',
        'Arme im Bogen seitlich nach außen ziehen, bis sie in Höhe des Oberkörpers sind.',
        'Am Ende die Schulterblätter leicht zusammenführen, ohne ins Hohlkreuz zu gehen.',
        'Kontrolliert zurücklassen, das Band bleibt gespannt.'
      ],
      fehler: [
        'Schultern zu den Ohren ziehen. Mit Band stieg die Aktivität von oberem Trapezius und seitlichem Deltamuskel deutlich (Bergquist 2018).',
        'Rumpf aufrichten oder mit Schwung ziehen.',
        'Ellbogen stark beugen oder ganz strecken.'
      ],
      tempo: 'Ca. 2 s nach außen, ca. 2 s zurück (Protokoll von Bergquist 2018). Der Widerstand nimmt zum Ende zu.',
      sicherheit: 'Band nie über das Dreifache der Ruhelänge dehnen und auf Risse prüfen. Bei Schulterschmerz oder Nackenverspannung ein leichteres Band nehmen und die Schultern bewusst tief halten.',
      warum: 'Mit Band war die Aktivität des hinteren Deltamuskels etwas niedriger als mit Hanteln, die von seitlichem Deltamuskel und Trapezius aber deutlich höher. Die Autoren sehen Bänder als praktikable Alternative (Bergquist 2018, 29 Personen). Der hintere Deltamuskel wird auch bei Klimmzügen stark aktiviert (Rabello 2024), die Übung ergänzt also den Zug.',
      quellen: [
        'Bergquist 2018, J Hum Kinet – 29 Personen (PMID 29599855)',
        'Kumar 2018, J Back Musculoskelet Rehabil – Bauchlage-Variante, 10 Männer (PMID 30010102)',
        'Rabello 2024, J Bodyw Mov Ther – Review (PMID 39593452)'
      ]
    },

    bizepscurl: {
      evidenz: 'Evidenz: teilweise belegt',
      steps: [
        'Auf die Schrägbank setzen, Rücken und Kopf angelehnt, Arme hängen gestreckt neben der Bank, Handflächen nach vorn.',
        'Mit fast gestrecktem Ellbogen in der gedehnten Position starten.',
        'Einen Ellbogen beugen und die Handfläche nach oben drehen. Der Oberarm bleibt ruhig.',
        'Beugen, bis der Unterarm fast senkrecht ist, ohne die Schulter nach vorn zu schieben.',
        'Langsam bis fast zur Streckung absenken, dann die andere Seite.'
      ],
      fehler: [
        'Oberarm schwingt mit und die Schulter schiebt nach vorn (Gewicht zu schwer).',
        'Unten den Ellbogen nie mehr fast strecken. Der gedehnte Bereich brachte beim Curl mehr Zuwachs am unteren Bizepsende (Pedrosa 2023).',
        'Rücken löst sich von der Bank.'
      ],
      tempo: 'Ca. 1–2 s hoch, ca. 2–3 s runter. Das Tempo ist Praxis-Konsens. Bei trainierten Personen war der Vorteil des Teilbereichs gegenüber dem vollen Bewegungsumfang nur klein (Havers 2025).',
      sicherheit: 'Moderates Gewicht wählen und die Hantel nicht in die gedehnte Position fallen lassen. Bei Schmerz in der vorderen Schulter oder der Bizepssehne stoppen. Eine Verletzungsstudie dazu habe ich nicht gefunden.',
      warum: 'Der Incline-Curl und der Standard-Curl aktivierten den langen Bizepskopf über den ganzen Bewegungsumfang ähnlich, der Preacher-Curl nur in einem kurzen Winkelbereich (Oliveira 2009). Training im Anfangsbereich mit gestrecktem Ellbogen brachte beim Preacher-Curl mehr Zuwachs am unteren Bizeps als im Endbereich (Pedrosa 2023). Dass die Schrägbank selbst zusätzlich Muskelaufbau bringt, ist nicht belegt (Attarieh 2025).',
      quellen: [
        'Oliveira 2009, J Sports Sci Med – 22 Personen (PMID 24150552)',
        'Pedrosa 2023, Sports (Basel) – 19 Frauen, 8 Wochen (PMID 36828324)',
        'Havers 2025, Eur J Sport Sci – 13 Trainierte, 8 Wochen (PMID 41247250)',
        'Attarieh 2025, Eur J Sport Sci – 15 Männer, 10 Wochen (PMID 40082069)'
      ]
    },

    crunch: {
      evidenz: 'Evidenz: teilweise belegt (EMG)',
      steps: [
        'Auf den Rücken legen, Knie angewinkelt, Füße flach. Hände seitlich am Kopf oder vor der Brust, nicht am Nacken ziehen.',
        'Nacken lang halten, Blick zur Decke.',
        'Kopf, Schultern und oberen Rücken nur wenige Zentimeter vom Boden rollen. Der untere Rücken bleibt am Boden.',
        'Dabei ausatmen, den Bauch zusammenziehen und kurz halten.',
        'Kontrolliert wieder absenken.'
      ],
      fehler: [
        'Mit den Händen am Nacken ziehen.',
        'Zu weit hochkommen (Richtung Sit-up). Dann übernimmt der Hüftbeuger mehr und die Wirbelsäule wird stärker belastet (Escamilla 2006, Axler & McGill 1997).',
        'Mit Schwung hochkommen.'
      ],
      tempo: 'Ca. 1–2 s hochrollen, ca. 2 s absenken. Das Tempo ist Praxis-Konsens. Den Bewegungsumfang klein halten: Teil-Curl-ups hatten in einer Studie das beste Verhältnis von Bauchaktivierung zu Wirbelsäulenlast (Axler & McGill 1997, n=9).',
      sicherheit: 'Keine einzelne Bauchübung trainiert nach Axler & McGill 1997 alle Bauchmuskeln bei minimaler Wirbelsäulenlast. Deshalb wechselt der Plan zwischen Crunch und Reverse Crunch. Bei Rückenschmerzen klein bleiben.',
      warum: 'Der Crunch ist eine einfache Übung für den geraden Bauchmuskel mit geringer Lendenwirbelsäulenlast. In der EMG-Studie von Escamilla 2006 (21 Personen) lagen aber Reverse Crunch, hängendes Knieheben und Power Wheel bei Rectus abdominis und innerer Schräge vorn. Gezieltes Fett abbauen am Bauch geht durch Bauchübungen nicht (Vispute 2011).',
      quellen: [
        'Escamilla 2006, Phys Ther – 21 Personen (PMID 16649890)',
        'Axler & McGill 1997, Med Sci Sports Exerc – 9 Personen, 12 Bauchübungen (PMID 9219209)',
        'Vispute 2011, J Strength Cond Res – keine punktuelle Fettreduktion'
      ]
    },

    reverse_crunch: {
      evidenz: 'Evidenz: teilweise belegt (EMG)',
      steps: [
        'Auf den Rücken legen (Matte oder Schrägbank, Kopf am hohen Ende), Hüfte und Knie ca. 90° gebeugt.',
        'Ausatmen und die Knie zur Brust ziehen. Dabei das Becken einrollen, sodass das Gesäß vom Untergrund abhebt.',
        'Der Impuls kommt aus dem Bauch, nicht aus Schwung der Beine. Oben ca. 1 s halten.',
        'Das Becken kontrolliert abrollen, bis der untere Rücken wieder aufliegt. Die Beine bleiben gebeugt.'
      ],
      fehler: [
        'Mit den Beinen schwingen oder das Becken hochreißen.',
        'Nur die Beine zur Brust ziehen, ohne das Becken einzurollen. Dann arbeitet vor allem der Hüftbeuger (Escamilla 2006).',
        'Beine beim Absenken zu weit strecken und ins Hohlkreuz fallen.'
      ],
      tempo: 'Ca. 1–2 s einrollen, ca. 2–3 s absenken. Das Tempo ist Praxis-Konsens. Die hohe Aktivierung wurde auf einer 30°-Schräge gemessen. Eine flache Matte wurde dort nicht untersucht.',
      sicherheit: 'Die Aktivität des geraden Oberschenkelmuskels (Hüftbeuger) war dabei hoch und kann bei Rückenproblemen ungünstig sein (Escamilla 2006). Klein und kontrolliert bleiben, kein Hohlkreuz beim Absenken.',
      warum: 'Der Reverse Crunch (30°-Schräge) gehörte in der EMG-Studie mit 21 Personen zu den Übungen mit der höchsten Aktivierung von oberem und unterem geraden Bauchmuskel sowie innerer Schräge (Escamilla 2006). Trainingseffekte wurden dort nicht gemessen.',
      quellen: [
        'Escamilla 2006, Phys Ther – 21 Personen (PMID 16649890)'
      ]
    },

    joggen: {
      evidenz: 'Evidenz: teilweise belegt',
      steps: [
        'Laufband auf 11–12 km/h und 1–2 % Steigung stellen. Bei 10,5–12 km/h entsprach Außenlaufen 0–1 % Steigung, 2 % war schon etwas anstrengender als draußen (Jones & Doust 1996).',
        'Aufrecht laufen, Schultern locker, Arme ca. 90° gebeugt, Blick nach vorn.',
        'Optional: die Schrittfrequenz um ca. 5 % erhöhen (Schritte pro Minute zählen) und weich landen.',
        'Intensität ohne Pulsmesser über den Sprechtest steuern: Du solltest noch in ganzen Sätzen sprechen können.'
      ],
      fehler: [
        'Zu lange Schritte mit hartem Aufsetzen vor dem Körper (mehr Energieaufnahme im Knie, Heiderscheit 2011).',
        'Zu schnell werden, sodass Sprechen nicht mehr geht. Bequemes Sprechen ist wahrscheinlich nur unterhalb der Ventilationsschwelle möglich (Reed & Pipe 2014).',
        'Am Geländer festhalten oder nach unten schauen.'
      ],
      tempo: 'Gleichmäßig und locker laufen. Der Sprechtest ist ein brauchbarer Intensitätsmarker (Foster 2008, Woltmann 2015). Er neigt aber dazu, „bestanden“ zu zeigen, wenn man schon etwas über der Schwelle liegt.',
      sicherheit: '5 % mehr Schritte senkten die Energieaufnahme im Knie um ca. 20 % (Heiderscheit 2011). Bei +10 % war laut Lenhart 2014 die Spitzenlast der Oberschenkelrückseite in der späten Schwungphase höher als bei 10 % weniger Schritten. Wegen deiner Vorgeschichte also nicht übertreiben. Bei stechendem Schmerz in Knie, Oberschenkelrückseite oder Wade abbrechen.',
      warum: 'Laufen nach dem Krafttraining und nur ca. 13 Minuten sind bewusst gewählt: Gleichzeitiges Lauftraining minderte in einer Meta-Analyse Muskelaufbau und Kraft, und zwar stärker bei mehr Häufigkeit und Dauer (Wilson 2012). Kraft vor Ausdauer war für die Beinkraft günstiger (Eddens 2018).',
      quellen: [
        'Jones & Doust 1996, J Sports Sci – 9 Läufer (PMID 8887211)',
        'Heiderscheit 2011, Med Sci Sports Exerc – 45 Läufer (PMID 20581720)',
        'Lenhart 2014, Med Sci Sports Exerc – 30 Personen (PMID 23917470)',
        'Foster 2008, J Cardiopulm Rehabil Prev – Sprechtest (PMID 18277826)',
        'Reed & Pipe 2014, Curr Opin Cardiol – Review (PMID 25010379)',
        'Woltmann 2015, J Strength Cond Res – 16 Personen (PMID 25536539)',
        'Wilson 2012, J Strength Cond Res – Meta-Analyse, 21 Studien (PMID 22002517)',
        'Eddens 2018, Sports Med – Meta-Analyse, 10 Studien (PMID 28917030)'
      ]
    },

    pike: {
      evidenz: 'Evidenz: Praxis-Konsens (keine eigene Recherche)',
      steps: [
        'Hände schulterbreit, Hüfte hoch (umgekehrtes V), Beine fast gestreckt.',
        'Kopf zwischen die Hände senken, Ellbogen schräg nach hinten.',
        'Kräftig hochdrücken, bis die Arme gestreckt sind.'
      ],
      fehler: ['Hüfte sackt ab (wird zum normalen Liegestütz).', 'Ellbogen weit nach außen.'],
      tempo: 'Ca. 2 s absenken, kontrolliert hochdrücken.',
      sicherheit: 'Bei Schulterschmerz abbrechen. Mehr Infos habe ich dazu nicht recherchiert.'
    },

    bulgarian: {
      evidenz: 'Evidenz: Praxis-Konsens (keine eigene Recherche)',
      steps: [
        'Hinteren Fuß auf die Bank legen, vorderen Fuß so weit vorn, dass das Knie unten über dem Fuß bleibt.',
        'Oberkörper aufrecht, tief beugen, Knie zeigt in Richtung Fußspitze.',
        'Über den ganzen vorderen Fuß hochdrücken. Zur Hälfte der Zeit die Seite wechseln.'
      ],
      fehler: ['Knie fällt nach innen.', 'Zu kurzer Schritt: Ferse hebt ab.'],
      tempo: 'Ca. 2 s absenken, kontrolliert hochdrücken.',
      sicherheit: 'Bei Knieschmerz weniger tief gehen. Mehr Infos habe ich dazu nicht recherchiert.'
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
