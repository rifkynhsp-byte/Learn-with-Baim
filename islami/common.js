/* ============================================================
   common.js  —  shared by every game in the super app
   Names, settings, navigation, credits.
   ============================================================ */
(function (global) {

  var DEFAULTS = {
    child: "Baim",        // the learner
    dad: "Papi Rifky",
    mum: "Mommy Keke",
    sib: "Ade Yahya",
    dadShort: "Papi",
    mumShort: "Mommy",
    childShort: "Baim",
    sibShort: "Ade"
  };

  function load() {
    try {
      var raw = JSON.parse(localStorage.getItem("super.names") || "{}");
      var out = {};
      for (var k in DEFAULTS) out[k] = (raw[k] && String(raw[k]).trim()) || DEFAULTS[k];
      return out;
    } catch (e) { return Object.assign({}, DEFAULTS); }
  }
  function save(n) {
    try { localStorage.setItem("super.names", JSON.stringify(n)); } catch (e) {}
    N = load();
  }
  var N = load();

  /* Replace the built-in family names anywhere they appear in text or speech.
     Longest first so "Papi Rifky" wins over "Papi". */
  var MAP = [
    ["Papi Rifky", "dad"], ["Mommy Keke", "mum"], ["Ade Yahya", "sib"],
    ["Rifky", "dadShort"], ["Keke", "mumShort"], ["Yahya", "sibShort"],
    ["Mommy", "mumShort"], ["Papi", "dadShort"], ["Baim", "child"]
  ];
  function P(s) {
    if (s == null) return s;
    s = String(s);
    for (var i = 0; i < MAP.length; i++) {
      var from = MAP[i][0], to = N[MAP[i][1]];
      if (to && to !== from) s = s.split(from).join(to);
    }
    return s;
  }

  /* short forms derived from a full name: "Papi Rifky" -> "Papi" */
  function shorten(full, fallback) {
    if (!full) return fallback;
    var bits = String(full).trim().split(/\s+/);
    return bits[0] || fallback;
  }

  var GAMES = [
    { id: "shalat", file: "shalat.html", icon: "\uD83E\uDDCE", en: "Prayer, step by step", idn: "Shalat",
      note: "92 steps with Arabic, meaning and audio", tone: "#1F6E4C" },
    { id: "doa", file: "doa.html", icon: "\uD83E\uDD32", en: "Everyday duas", idn: "Doa Harian",
      note: "20 duas for waking, eating and travelling", tone: "#0C556C" },
    { id: "juz30", file: "juz30.html", icon: "\uD83D\uDCD6", en: "Memorising Juz 30", idn: "Hafalan Juz 30",
      note: "37 surahs, listen and follow along", tone: "#7A4A22" },
    { id: "nabi", file: "nabi.html", icon: "\u2B50", en: "Stories of 25 prophets", idn: "Kisah 25 Nabi",
      note: "Who they were and what they teach us", tone: "#5A3E8A" },
    { id: "koleksi", file: "koleksi.html", icon: "\uD83C\uDFC5", en: "Progress", idn: "Pencapaian",
      note: "What has been learned, and how often", tone: "#8A3552" },
    { id: "periksa", file: "periksa.html", icon: "\uD83C\uDF9A\uFE0F", en: "Check the recitations", idn: "Periksa Rekaman",
      note: "Listen and correct any wrong file, for parents", tone: "#7A4A22" }
  ];

  var CREDITS = "Created with love and care by Papi Rifky and Mommy Keke " +
                "for beloved Abang Baim and Ade Yahya.";

  var CURRICULUM = [
    ["Arabic and Indonesian translation", "Kemenag rendering via the MIT licensed rioastamal/quran-json"],
    ["English translation and transliteration", "risan/quran-json, CC BY-SA 4.0"],
    ["Prayer steps, audio and postures", "learnsalah/learnsalah, MIT licence"],
    ["Dua audio", "Islami-fork/koleksi-doa-dzikir-audio, MIT licence"],
    ["Prophet illustrations", "Islami-fork/Kisah-25-Nabi (no licence stated, ask the author)"],
    ["Juz 30 recitation for children", "Murottal Anak Juz 30, Metode Ummi, archive.org"]
  ];

  /* a back button injected into any game page */
  function mountBack(title) {
    if (document.getElementById("superbar")) { if (title) document.title = P(title); return; }
    var a = document.createElement("a");
    a.href = "index.html";
    a.className = "super-back";
    a.setAttribute("aria-label", "Back to the menu");
    a.innerHTML = "\u2190";
    document.body.appendChild(a);
    var css = document.createElement("style");
    css.textContent =
      ".super-back{position:fixed;left:10px;bottom:10px;z-index:95;width:44px;height:44px;" +
      "border-radius:50%;display:grid;place-items:center;font-size:22px;text-decoration:none;" +
      "background:rgba(4,34,46,.72);color:#FFFBF2;border:1px solid rgba(247,233,204,.28);" +
      "box-shadow:0 6px 18px rgba(2,18,26,.45)}" +
      ".super-back:hover{background:rgba(4,34,46,.92)}" +
      "@media (min-aspect-ratio:1/1){.super-back{left:8px;bottom:8px;width:40px;height:40px}}";
    document.head.appendChild(css);
    if (title) document.title = P(title);
  }

  global.SUPER = {
    names: function () { return N; },
    defaults: DEFAULTS,
    save: save,
    reset: function () { try { localStorage.removeItem("super.names"); } catch (e) {} N = load(); },
    P: P,
    shorten: shorten,
    GAMES: GAMES,
    CREDITS: CREDITS,
    CURRICULUM: CURRICULUM,
    mountBack: mountBack
  };
})(window);

/* ============================================================
   PROGRESS: xp, grade bands, the zoo and the pets
   ============================================================ */
(function (global) {
  var S = global.SUPER;

  /* Thresholds assume roughly 40 answers a day. Early bands sit on level 1-2
     work (about 4 XP an answer), later bands on level 6+ work (about 18).
     Kindy A to Kindy B is around two weeks of real practice, not two days. */
  var GRADES = [
    { xp: 0,      id: "kindy-a", label: "Kindy A",         note: "getting started" },
    { xp: 2500,   id: "kindy-b", label: "Kindy B",         note: "letters, sounds, counting to 10" },
    { xp: 7000,   id: "prep",    label: "Preparatory",     note: "blending, first words, writing" },
    { xp: 15000,  id: "g1",      label: "Primary Grade 1", note: "reading sentences, adding and taking away" },
    { xp: 28000,  id: "g2",      label: "Primary Grade 2", note: "comprehension, groups of animals" },
    { xp: 46000,  id: "g3",      label: "Primary Grade 3", note: "reasoning, food webs, longer writing" },
    { xp: 70000,  id: "g4",      label: "Primary Grade 4", note: "science vocabulary, Latin names" },
    { xp: 100000, id: "g5",      label: "Primary Grade 5", note: "systems, ethics, history" },
    { xp: 140000, id: "g6",      label: "Primary Grade 6", note: "independent reading and writing" }
  ];

  /* 50 animals to collect. The cost rises steeply so the rare ones
     really are rare. Kangaroo and koala are the last two. */
  var ZOO = [
    ["ant","\uD83D\uDC1C","Ant","Semut",40],
    ["fish","\uD83D\uDC1F","Fish","Ikan",45],
    ["chicken","\uD83D\uDC13","Chicken","Ayam",55],
    ["duck","\uD83E\uDD86","Duck","Bebek",65],
    ["cat","\uD83D\uDC08","Cat","Kucing",75],
    ["dog","\uD83D\uDC15","Dog","Anjing",90],
    ["rabbit","\uD83D\uDC30","Rabbit","Kelinci",110],
    ["butterfly","\uD83E\uDD8B","Butterfly","Kupu-kupu",130],
    ["bee","\uD83D\uDC1D","Bee","Lebah",150],
    ["frog","\uD83D\uDC38","Frog","Katak",180],
    ["snail","\uD83D\uDC0C","Snail","Siput",210],
    ["cow","\uD83D\uDC04","Cow","Sapi",240],
    ["goat","\uD83D\uDC10","Goat","Kambing",290],
    ["horse","\uD83D\uDC0E","Horse","Kuda",340],
    ["sheep","\uD83D\uDC11","Sheep","Domba",400],
    ["bird","\uD83D\uDC26","Bird","Burung",470],
    ["owl","\uD83E\uDD89","Owl","Burung hantu",560],
    ["turtle","\uD83D\uDC22","Turtle","Penyu",650],
    ["crab","\uD83E\uDD80","Crab","Kepiting",770],
    ["shrimp","\uD83E\uDD90","Shrimp","Udang",910],
    ["squid","\uD83E\uDD91","Squid","Cumi",1050],
    ["octopus","\uD83D\uDC19","Octopus","Gurita",1250],
    ["snake","\uD83D\uDC0D","Snake","Ular",1500],
    ["lizard","\uD83E\uDD8E","Lizard","Kadal",1750],
    ["monkey","\uD83D\uDC12","Monkey","Monyet",2050],
    ["deer","\uD83E\uDD8C","Deer","Rusa",2450],
    ["fox","\uD83E\uDD8A","Fox","Rubah",2850],
    ["boar","\uD83D\uDC17","Wild boar","Babi hutan",3400],
    ["penguin","\uD83D\uDC27","Penguin","Penguin",4000],
    ["peacock","\uD83E\uDD9A","Peacock","Merak",4700],
    ["parrot","\uD83E\uDD9C","Parrot","Nuri",5550],
    ["eagle","\uD83E\uDD85","Eagle","Elang",6550],
    ["dolphin","\uD83D\uDC2C","Dolphin","Lumba-lumba",7700],
    ["shark","\uD83E\uDD88","Shark","Hiu",9100],
    ["whale","\uD83D\uDC0B","Whale","Paus",10500],
    ["crocodile","\uD83D\uDC0A","Crocodile","Buaya",12500],
    ["zebra","\uD83E\uDD93","Zebra","Zebra",15000],
    ["camel","\uD83D\uDC2A","Camel","Unta",17500],
    ["buffalo","\uD83D\uDC03","Buffalo","Kerbau",20500],
    ["hippo","\uD83E\uDD9B","Hippopotamus","Kuda nil",24500],
    ["rhino","\uD83E\uDD8F","Rhinoceros","Badak",28500],
    ["giraffe","\uD83E\uDD92","Giraffe","Jerapah",34000],
    ["elephant","\uD83D\uDC18","Elephant","Gajah",40000],
    ["gorilla","\uD83E\uDD8D","Gorilla","Gorila",47000],
    ["orangutan","\uD83E\uDDA7","Orangutan","Orangutan",55500],
    ["lion","\uD83E\uDD81","Lion","Singa",65500],
    ["tiger","\uD83D\uDC05","Tiger","Harimau",77000],
    ["panda","\uD83D\uDC3C","Giant panda","Panda",90500],
    ["kangaroo","\uD83E\uDD98","Kangaroo","Kanguru",107000],
    ["koala","\uD83D\uDC28","Koala","Koala",126000]
  ].map(function (r) { return { id: r[0], emo: r[1], en: r[2], idn: r[3], xp: r[4] }; });

  /* pets grow up as the xp goes in */
  var PETS = [
    { id: "cat", en: "Cat", idn: "Kucing", stages: [
      { emo: "\uD83D\uDC31", en: "Kitten", xp: 0 },
      { emo: "\uD83D\uDC08", en: "Young cat", xp: 450 },
      { emo: "\uD83D\uDC08\u200D\u2B1B", en: "Grown cat", xp: 1500 },
      { emo: "\uD83D\uDC06", en: "Big wild cat", xp: 3600 } ] },
    { id: "chick", en: "Chicken", idn: "Ayam", stages: [
      { emo: "\uD83E\uDD5A", en: "Egg", xp: 0 },
      { emo: "\uD83D\uDC23", en: "Hatching", xp: 270 },
      { emo: "\uD83D\uDC24", en: "Chick", xp: 780 },
      { emo: "\uD83D\uDC14", en: "Hen", xp: 1860 },
      { emo: "\uD83D\uDC13", en: "Rooster", xp: 4200 } ] },
    { id: "frog", en: "Frog", idn: "Katak", stages: [
      { emo: "\uD83E\uDEB1", en: "Eggs in the pond", xp: 0 },
      { emo: "\uD83D\uDC1B", en: "Tadpole", xp: 330 },
      { emo: "\uD83D\uDC38", en: "Young frog", xp: 1020 },
      { emo: "\uD83D\uDC0A", en: "Big pond friend", xp: 2700 } ] },
    { id: "tree", en: "Tree", idn: "Pohon", stages: [
      { emo: "\uD83C\uDF30", en: "Seed", xp: 0 },
      { emo: "\uD83C\uDF31", en: "Sprout", xp: 240 },
      { emo: "\uD83E\uDEB4", en: "Young tree", xp: 900 },
      { emo: "\uD83C\uDF33", en: "Big tree", xp: 2340 },
      { emo: "\uD83C\uDF33\uD83C\uDF3A", en: "Tree full of life", xp: 4800 } ] }
  ];

  function pget() {
    try { return JSON.parse(localStorage.getItem("super.progress") || "{}"); }
    catch (e) { return {}; }
  }
  function pset(o) { try { localStorage.setItem("super.progress", JSON.stringify(o)); } catch (e) {} }

  function addXp(game, n) {
    var p = pget();
    p.xp = (p.xp || 0) + n;
    p.games = p.games || {};
    p.games[game] = (p.games[game] || 0) + n;
    p.answers = (p.answers || 0) + 1;
    var today = new Date().toISOString().slice(0, 10);
    p.days = p.days || {};
    p.days[today] = (p.days[today] || 0) + n;
    pset(p);
    return p.xp;
  }
  function gradeFor(xp) {
    var g = GRADES[0];
    for (var i = 0; i < GRADES.length; i++) if (xp >= GRADES[i].xp) g = GRADES[i];
    return g;
  }
  function nextGrade(xp) {
    for (var i = 0; i < GRADES.length; i++) if (xp < GRADES[i].xp) return GRADES[i];
    return null;
  }
  function unlockedZoo(xp) { return ZOO.filter(function (z) { return xp >= z.xp; }); }
  function petStage(pet, xp) {
    var s = pet.stages[0];
    for (var i = 0; i < pet.stages.length; i++) if (xp >= pet.stages[i].xp) s = pet.stages[i];
    return s;
  }
  function stats() {
    var p = pget(), xp = p.xp || 0;
    return { xp: xp, answers: p.answers || 0, games: p.games || {}, days: p.days || {},
             grade: gradeFor(xp), next: nextGrade(xp),
             zoo: unlockedZoo(xp).length, zooTotal: ZOO.length };
  }


  /* ============================================================
     SCORING
     Research note: streaks help young learners, but rewards that
     pay for volume alone push guessing. So points are paid for
     QUALITY: first time right is worth full marks, a second try
     less than half, and a third barely anything. The streak only
     counts clean first-time answers, so it cannot be farmed.
     ============================================================ */
  var FOOD_COST = 25;      /* one feed */
  var FOOD_VALUE = 25;     /* how much the pet grows per feed */

  function award(game, o) {
    o = o || {};
    var level = o.level || 1, wrongs = o.wrongs || 0;
    /* difficulty is weighted, not linear: level 1 is worth 3, level 8 is worth 22.
       Easy levels can no longer be farmed to climb the grades. */
    var base = Math.round(2 + Math.pow(level, 1.55));
    var quality = wrongs === 0 ? 1 : (wrongs === 1 ? 0.45 : 0.2);
    if (o.partial != null) quality *= Math.max(0.15, Math.min(1, o.partial));
    var p = pget();
    var streak = wrongs === 0 ? (p.streak || 0) + 1 : 0;
    var mult = 1 + Math.min(10, streak) * 0.06;          /* caps at 1.6x */
    var xp = Math.max(1, Math.round(base * quality * mult));
    p.streak = streak;
    p.best = Math.max(p.best || 0, streak);
    p.food = (p.food || 0) + Math.max(1, Math.round(xp / 3));
    p.xp = (p.xp || 0) + xp;
    p.games = p.games || {};
    p.games[game] = (p.games[game] || 0) + xp;
    p.answers = (p.answers || 0) + 1;
    if (wrongs === 0) p.clean = (p.clean || 0) + 1;
    var today = new Date().toISOString().slice(0, 10);
    p.days = p.days || {};
    p.days[today] = (p.days[today] || 0) + xp;
    pset(p);
    return { xp: xp, streak: streak, mult: mult, food: p.food, total: p.xp };
  }
  function food() { return pget().food || 0; }
  function streakNow() { return pget().streak || 0; }
  function petFed(id) { var p = pget(); return (p.fed || {})[id] || 0; }
  function feed(id) {
    var p = pget();
    if ((p.food || 0) < FOOD_COST) return null;
    p.food -= FOOD_COST;
    p.fed = p.fed || {};
    p.fed[id] = (p.fed[id] || 0) + FOOD_VALUE;
    pset(p);
    return { food: p.food, fed: p.fed[id] };
  }
  function stageOf(pet) {
    var f = petFed(pet.id), s = pet.stages[0];
    for (var i = 0; i < pet.stages.length; i++) if (f >= pet.stages[i].xp) s = pet.stages[i];
    return s;
  }

  /* ============================================================
     THE STRIP  —  a Touch Bar style row of live, contextual keys
     ============================================================ */
  function mountBar(actions) {
    try { noteVisit((location.pathname.split("/").pop() || "index.html")); } catch (e) {}
    if (document.getElementById("superbar")) return;
    var css = document.createElement("style");
    css.textContent =
     "#superbar{position:fixed;left:0;right:0;bottom:0;z-index:96;display:flex;align-items:center;gap:6px;" +
     "padding:6px 10px;background:linear-gradient(180deg,rgba(6,20,28,.86),rgba(3,12,18,.96));" +
     "border-top:1px solid rgba(247,233,204,.18);backdrop-filter:blur(8px);overflow-x:auto;scrollbar-width:none}" +
     "#superbar::-webkit-scrollbar{display:none}" +
     "#superbar .k{flex:none;display:flex;align-items:center;gap:6px;height:40px;padding:0 13px;border-radius:12px;" +
     "background:rgba(247,233,204,.10);border:1px solid rgba(247,233,204,.18);color:#FFFBF2;cursor:pointer;" +
     "font-family:Fredoka,Nunito,sans-serif;font-weight:600;font-size:14px;white-space:nowrap;transition:.15s}" +
     "#superbar .k:hover{background:rgba(247,233,204,.2)}#superbar .k:active{transform:scale(.95)}" +
     "#superbar .k.stat{cursor:default;background:rgba(6,20,28,.5)}" +
     "#superbar .k .em{font-size:17px}" +
     "#superbar .k.hot{background:linear-gradient(180deg,#FFB247,#E58A2C);color:#40230A;border-color:#FFB247}" +
     "#superbar .grow{flex:1 1 auto;min-width:4px}" +
     "#superbar .gain{position:fixed;pointer-events:none;font-family:Fredoka,sans-serif;font-weight:700;" +
     "font-size:18px;color:#5FE0A4;text-shadow:0 2px 8px rgba(0,0,0,.6)}" +
     "@keyframes floatup{to{transform:translateY(-46px);opacity:0}}" +
     "body{padding-bottom:56px}.super-back{bottom:60px!important}" +
     "@media (min-aspect-ratio:1/1){#superbar{padding:4px 8px}#superbar .k{height:36px;font-size:13px;padding:0 11px}" +
     "body{padding-bottom:48px}.super-back{bottom:52px!important}}";
    document.head.appendChild(css);
    var bar = document.createElement("div");
    bar.id = "superbar";
    document.body.appendChild(bar);
    barActions = actions || [];
    renderBar();
    return bar;
  }
  var barActions = [];
  function renderBar() {
    var bar = document.getElementById("superbar"); if (!bar) return;
    var st = stats(), fd = food(), sk = streakNow();
    var pet = PETS[0], stage = stageOf(pet);
    var html = "";
    barActions.forEach(function (a, i) {
      html += '<button class="k' + (a.hot ? " hot" : "") + '" data-i="' + i + '">' +
              '<span class="em">' + a.icon + '</span>' + (a.label ? "<span>" + a.label + "</span>" : "") + "</button>";
    });
    html += '<span class="grow"></span>';
    html += '<a class="k" href="../index.html" title="Rumah Belajar"><span class="em">\uD83C\uDFE1</span></a>';
    html += '<a class="k" href="index.html" title="Rumah Islami"><span class="em">\uD83D\uDD4C</span></a>';
    html += '<button class="k" id="sbSet" title="Settings"><span class="em">\u2699\uFE0F</span></button>';
    html += '<div class="k stat" title="Streak of clean first-time answers"><span class="em">' +
            (sk >= 3 ? "\uD83D\uDD25" : "\u26A1") + '</span><span>' + sk + '</span></div>';
    html += '<div class="k stat" title="Total XP"><span class="em">\u2B50</span><span>' + st.xp + "</span></div>";
    html += '<a class="k" href="../koleksi.html" title="Zoo, pets and progress"><span class="em">' +
            stage.emo + '</span><span>\uD83C\uDF3D ' + fd + "</span></a>";
    bar.innerHTML = html;
    var setBtn = bar.querySelector("#sbSet");
    if (setBtn) setBtn.addEventListener("click", function () { openSettings(); });
    bar.querySelectorAll("button[data-i]").forEach(function (b) {
      b.addEventListener("click", function () {
        var a = barActions[Number(b.dataset.i)];
        if (a && a.fn) a.fn();
      });
    });
  }
  function flyXp(n, streak) {
    var bar = document.getElementById("superbar");
    var g = document.createElement("div");
    g.className = "gain";
    g.textContent = "+" + n + (streak >= 3 ? "  \uD83D\uDD25" + streak : "");
    g.style.right = "18px";
    g.style.bottom = "60px";
    g.style.animation = "floatup 1s ease-out forwards";
    document.body.appendChild(g);
    setTimeout(function () { g.remove(); }, 1000);
    renderBar();
  }


  /* ============================================================
     SETTINGS, available from every page in the app
     ============================================================ */
  function openSettings() {
    if (document.getElementById("supersheet")) {
      document.getElementById("supersheet").classList.add("on");
      fillSettings(); return;
    }
    var css = document.createElement("style");
    css.textContent =
     "#supersheet{position:fixed;inset:0;z-index:120;background:rgba(3,16,22,.95);display:none;" +
     "overflow-y:auto;padding:18px;font-family:Nunito,system-ui,sans-serif}" +
     "#supersheet.on{display:block}" +
     "#supersheet .pn{background:#0B3C4E;border:1px solid rgba(247,233,204,.2);border-radius:22px;" +
     "padding:20px;max-width:640px;margin:0 auto;color:#FFFBF2}" +
     "#supersheet h2{font-family:Fredoka,sans-serif;margin:0 0 4px;font-size:21px;color:#F7E9CC}" +
     "#supersheet h3{font-family:Fredoka,sans-serif;margin:16px 0 6px;font-size:15px;color:#FFB247}" +
     "#supersheet p{margin:0 0 10px;font-size:13.5px;line-height:1.6;color:rgba(255,251,242,.82)}" +
     "#supersheet label{display:block;font-size:12px;color:rgba(255,251,242,.7);margin:9px 0 4px}" +
     "#supersheet input{width:100%;padding:11px 13px;border-radius:12px;font-size:15px;font-family:inherit;" +
     "background:rgba(4,34,46,.6);color:#FFFBF2;border:1px solid rgba(247,233,204,.25)}" +
     "#supersheet .two{display:grid;grid-template-columns:1fr 1fr;gap:10px}" +
     "#supersheet ul{font-size:12.5px;line-height:1.6;padding-left:16px;margin:0;color:rgba(255,251,242,.78)}" +
     "#supersheet li{margin-bottom:5px}#supersheet li b{color:#F7E9CC}" +
     "#supersheet .luv{background:rgba(255,178,71,.13);border:1px solid rgba(255,178,71,.35);" +
     "border-radius:14px;padding:12px 14px;font-size:13px;line-height:1.6;text-align:center}" +
     "#supersheet .rw{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}" +
     "#supersheet button{font-family:Fredoka,sans-serif;font-weight:600;font-size:15px;border-radius:999px;" +
     "padding:11px 20px;cursor:pointer;background:rgba(247,233,204,.13);color:#FFFBF2;" +
     "border:1px solid rgba(247,233,204,.24)}" +
     "#supersheet button.go{background:#FFB247;color:#40230A;border-color:#FFB247}";
    document.head.appendChild(css);
    var sh = document.createElement("div");
    sh.id = "supersheet";
    sh.innerHTML =
     '<div class="pn">' +
      '<h2>Settings</h2>' +
      '<p>Change the names and the whole app follows: every prompt, every bit of praise, every voice.</p>' +
      '<label for="sxChild">Who is learning?</label><input id="sxChild" type="text" autocomplete="off">' +
      '<div class="two"><div><label for="sxDad">Father</label><input id="sxDad" type="text" autocomplete="off"></div>' +
      '<div><label for="sxMum">Mother</label><input id="sxMum" type="text" autocomplete="off"></div></div>' +
      '<label for="sxSib">Brother or sister</label><input id="sxSib" type="text" autocomplete="off">' +
      '<h3>Suara</h3><div id="sxVoice" class="luv" style="text-align:left"></div>' +
      '<h3>Built on</h3><ul id="sxRefs"></ul>' +
      '<h3>With love</h3><div class="luv" id="sxLove"></div>' +
      '<div class="rw">' +
       '<button class="go" id="sxSave">Save</button>' +
       '<button id="sxReset">Reset names</button>' +
       '<a href="index.html" style="text-decoration:none"><button>\uD83C\uDFE0 Home</button></a>' +
       '<button id="sxClose">Close</button>' +
      '</div></div>';
    document.body.appendChild(sh);
    sh.addEventListener("click", function (e) { if (e.target.id === "supersheet") sh.classList.remove("on"); });
    document.getElementById("sxClose").onclick = function () { sh.classList.remove("on"); };
    document.getElementById("sxReset").onclick = function () { S.reset(); fillSettings(); };
    document.getElementById("sxSave").onclick = function () {
      var D = S.defaults;
      var c = document.getElementById("sxChild").value.trim() || D.child;
      var d = document.getElementById("sxDad").value.trim() || D.dad;
      var m = document.getElementById("sxMum").value.trim() || D.mum;
      var b = document.getElementById("sxSib").value.trim() || D.sib;
      S.save({ child: c, dad: d, mum: m, sib: b,
             childShort: S.shorten(c, c), dadShort: S.shorten(d, "Papi"),
             mumShort: S.shorten(m, "Mommy"), sibShort: S.shorten(b, "Ade") });
      sh.classList.remove("on");
      location.reload();
    };
    sh.classList.add("on");
    fillSettings();
  }
  function fillSettings() {
    var n = S.names();
    document.getElementById("sxChild").value = n.child;
    document.getElementById("sxDad").value = n.dad;
    document.getElementById("sxMum").value = n.mum;
    document.getElementById("sxSib").value = n.sib;
    var vb = document.getElementById("sxVoice");
    if (vb) {
      pickTalk();
      var v = S.say.voices();
      if (v.id) {
        vb.innerHTML = "Suara Indonesia siap: <b>" + v.id.name + "</b> (" + v.id.lang + ").";
      } else {
        vb.innerHTML = "<b>Belum ada suara Indonesia di perangkat ini.</b><br>" +
          "Teks Indonesia akan dibacakan suara Inggris dengan ejaan yang disesuaikan, " +
          "jadi bunyinya mendekati tapi tidak sempurna.<br><br>" +
          "iPad: Settings, Accessibility, Spoken Content, Voices, tambahkan Bahasa Indonesia.<br>" +
          "Android: Settings, Sistem, Bahasa, Text-to-speech, unduh Bahasa Indonesia.<br><br>" +
          "<span style='opacity:.75;font-size:12px'>Suara yang terdeteksi: " +
          (v.all && v.all.length ? v.all.slice(0, 8).map(function (x) {
            return x.name + " (" + x.lang + ")"; }).join(", ") : "belum dimuat") + "</span>";
      }
    }
    document.getElementById("sxRefs").innerHTML = S.CURRICULUM
      .map(function (r) { return "<li><b>" + r[0] + "</b> — " + r[1] + "</li>"; }).join("");
    document.getElementById("sxLove").innerHTML =
      "Created with love and care by <b>" + n.dad + "</b> and <b>" + n.mum +
      "</b><br>for beloved <b>" + n.child + "</b> and <b>" + n.sib + "</b>.";
  }
  S.settings = { open: openSettings };


  /* ============================================================
     VISITS
     Two different questions, two different answers:

     1. "How much has my child used this?"  -> kept on the device.
        Private, works offline, never leaves the iPad.
     2. "How many people opened my site?"   -> needs a server.
        Set COUNTER_URL below and it lights up. Left blank it stays
        quiet and nothing is ever sent anywhere.
     ============================================================ */
  var COUNTER_URL = "";   /* e.g. "https://your-worker.workers.dev/hit" */

  function vget() {
    try { return JSON.parse(localStorage.getItem("super.visits") || "{}"); }
    catch (e) { return {}; }
  }
  function vset(o) { try { localStorage.setItem("super.visits", JSON.stringify(o)); } catch (e) {} }

  function noteVisit(page) {
    var v = vget(), now = Date.now();
    var today = new Date().toISOString().slice(0, 10);
    var who = S.names().child || "child";
    if (!v.first) { v.first = today; v.player = who; }
    /* a new session is any gap of more than 30 minutes */
    if (!v.last || now - v.last > 30 * 60 * 1000) v.sessions = (v.sessions || 0) + 1;
    v.last = now;
    v.dayList = v.dayList || [];
    if (v.dayList.indexOf(today) < 0) v.dayList.push(today);
    v.opens = v.opens || {};
    if (page) v.opens[page] = (v.opens[page] || 0) + 1;
    /* names that have used this copy, so a shared iPad shows more than one player */
    v.players = v.players || [];
    if (v.players.indexOf(who) < 0) v.players.push(who);
    vset(v);
    return v;
  }
  function visitStats() {
    var v = vget();
    var days = (v.dayList || []).length;
    var streak = 0;
    if (days) {
      var d = new Date(), i = 0;
      for (;;) {
        var key = new Date(d.getTime() - i * 86400000).toISOString().slice(0, 10);
        if ((v.dayList || []).indexOf(key) >= 0) { streak++; i++; }
        else if (i === 0) { i++; }          /* today may not have happened yet */
        else break;
        if (i > 400) break;
      }
    }
    return { sessions: v.sessions || 0, days: days, streak: streak,
             first: v.first || null, opens: v.opens || {},
             players: v.players || [] };
  }
  /* optional global count. Fails quietly, never blocks the page. */
  function globalCount(cb) {
    if (!COUNTER_URL) { cb(null); return; }
    var once = "super.counted." + new Date().toISOString().slice(0, 10);
    var already = false;
    try { already = !!sessionStorage.getItem(once); } catch (e) {}
    var url = COUNTER_URL + (already ? (COUNTER_URL.indexOf("?") < 0 ? "?peek=1" : "&peek=1") : "");
    try {
      fetch(url, { cache: "no-store" })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          try { sessionStorage.setItem(once, "1"); } catch (e) {}
          cb(j && (j.count != null ? j.count : (j.value != null ? j.value : null)));
        })
        .catch(function () { cb(null); });
    } catch (e) { cb(null); }
  }

  S.visits = { note: noteVisit, stats: visitStats, global: globalCount,
               url: function (u) { COUNTER_URL = u || ""; },
               reset: function () { vset({}); } };


  /* ============================================================
     RECITATION FIXES
     If a file in the archive turns out to hold a different surah
     than its name claims, the parent can remap it here without
     touching any code. Saved on the device.
     ============================================================ */
  function fixGet(){ try{ return JSON.parse(localStorage.getItem("juz.fix")||"{}"); }catch(e){ return {}; } }
  function fixSet(o){ try{ localStorage.setItem("juz.fix", JSON.stringify(o)); }catch(e){} }
  function fixFor(n, fallback){ var f=fixGet(); return f[String(n)] || fallback; }
  function fixPut(n, file){ var f=fixGet(); if(file) f[String(n)]=file; else delete f[String(n)]; fixSet(f); }
  S.juzfix = { get: fixGet, set: fixSet, for: fixFor, put: fixPut,
               clear: function(){ fixSet({}); } };

  /* ============================================================
     SAY IT OUT LOUD
     He cannot read yet, so every screen announces itself: which
     dua, which prophet, which prayer and which step.
     ============================================================ */
  var vID = null, vEN = null, voiceList = [];

  /* Indonesian voices do not all report the same locale code. Android and
     anything built on old Java report "in-ID", because "in" was the original
     ISO code for Indonesian. Chrome reports "id-ID", some report bare "id".
     Matching only /^id[-_]/ missed them, the voice fell back to English, and
     Indonesian text came out with an English accent. */
  function isIndonesian(v){
    var lang = String(v.lang || "").toLowerCase().replace("_", "-");
    var name = String(v.name || "").toLowerCase();
    if (lang === "id" || lang === "in") return true;
    if (lang.indexOf("id-") === 0 || lang.indexOf("in-") === 0) return true;
    if (lang.indexOf("ind") === 0) return true;
    return /indonesia|bahasa|damayanti|andika|gadis|reza/.test(name);
  }
  function isEnglish(v){
    var lang = String(v.lang || "").toLowerCase();
    return lang.indexOf("en") === 0;
  }
  function pickTalk(){
    if(!("speechSynthesis" in window)) return;
    voiceList = speechSynthesis.getVoices() || [];
    vID = voiceList.filter(isIndonesian)[0] || null;
    vEN = voiceList.filter(isEnglish)[0] || null;
  }
  if("speechSynthesis" in window){
    pickTalk();
    speechSynthesis.addEventListener("voiceschanged", pickTalk);
    setTimeout(pickTalk, 500); setTimeout(pickTalk, 1500); setTimeout(pickTalk, 3000);
  }

  /* If there really is no Indonesian voice on the device, an English voice
     reading Indonesian sounds wrong and teaches nothing. Respell it so the
     English voice at least lands near the right sounds. Indonesian spelling is
     regular, so this is a small, honest mapping. */
  function respell(text){
    var V = { a:"ah", e:"eh", i:"ee", o:"oh", u:"oo" };
    return String(text).split(/(\s+)/).map(function(w){
      if(!/[a-zA-Z]/.test(w)) return w;
      var upper = /^[A-Z]/.test(w);
      var t = w.toLowerCase();
      /* consonants first, then every vowel in ONE pass so the letters we
         insert are never re-processed */
      t = t.replace(/sy/g, "sh").replace(/c/g, "ch");
      t = t.replace(/[aeiou]/g, function(m){ return V[m]; });
      return upper ? t.charAt(0).toUpperCase() + t.slice(1) : t;
    }).join("");
  }
  function haveIndonesian(){ return !!vID; }

  var lastSaid = "", lastAt = 0, spokeCount = 0, lastError = null, fallbackCount = 0;
  function voicesReady(){
    /* Android reports an empty list until the engine wakes up. Deciding too
       early meant falling back to English on the very first tap. */
    return new Promise(function(res){
      pickTalk();
      if(voiceList.length) return res();
      var tries = 0;
      var iv = setInterval(function(){
        pickTalk(); tries++;
        if(voiceList.length || tries > 12){ clearInterval(iv); res(); }
      }, 120);
    });
  }
  function announce(text, opts){
    opts = opts || {};
    if(!text) return Promise.resolve();
    return voicesReady().then(function(){ return speakNow(text, opts); });
  }
  function speakNow(text, opts){
    var now = Date.now();
    if(text === lastSaid && now - lastAt < 1500) return Promise.resolve();
    lastSaid = text; lastAt = now;
    return new Promise(function(res){
      if(!("speechSynthesis" in window)){ res(); return; }
      try{
        speechSynthesis.cancel();
        var en = opts.lang === "en";
        var body = S.P(text);
        var usedFallback = false;
        if(!en && !vID){
          /* No Indonesian voice on this device. Keep the Indonesian words,
             respelled so an English voice lands near the right sounds.
             Never swap in an English translation: the language being taught
             must not change just because a voice is missing. */
          body = respell(body);
          en = true;
          usedFallback = true;
        }
        var u = new SpeechSynthesisUtterance(body);
        u.lang = en ? "en-GB" : "id-ID";
        u.voice = en ? vEN : vID;
        u.rate = opts.rate || 0.86;
        u.pitch = 1.05;
        u.volume = 1;
        u.onend = res; u.onerror = res;
        speechSynthesis.speak(u);
        spokeCount++;
        if(usedFallback) fallbackCount++;
        setTimeout(res, Math.max(2500, String(body).length * 95));
      }catch(e){
        /* this used to fail silently, which is how a scope bug hid for a
           whole round. Say so out loud in the console. */
        lastError = String(e && e.message || e);
        if (window.console && console.warn) console.warn("SUPER.say failed:", lastError);
        res();
      }
    });
  }

  S.say = { it: announce, stop: function(){ try{ speechSynthesis.cancel(); }catch(e){} },
            voices: function(){ return { id: vID, en: vEN, all: voiceList }; },
            haveIndonesian: haveIndonesian, respell: respell,
            count: function(){ return spokeCount; }, error: function(){ return lastError; },
            usedFallback: function(){ return fallbackCount > 0; },
            isIndonesian: isIndonesian, refresh: pickTalk };

  S.score = { award: award, food: food, streak: streakNow, feed: feed,
              stageOf: stageOf, petFed: petFed, FOOD_COST: FOOD_COST };
  S.bar = { mount: mountBar, render: renderBar, fly: flyXp,
            set: function (a) { barActions = a || []; renderBar(); } };

  S.GRADES = GRADES; S.ZOO = ZOO; S.PETS = PETS;
  S.xp = { add: addXp, stats: stats, award: award, gradeFor: gradeFor, nextGrade: nextGrade,
           unlockedZoo: unlockedZoo, petStage: petStage,
           reset: function () { pset({}); } };
})(window);

