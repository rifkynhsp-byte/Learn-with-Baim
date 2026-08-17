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
    { id: "membaca", file: "membaca.html", icon: "\uD83D\uDCD6", en: "Reading", idn: "Membaca",
      note: "Bahasa Indonesia, metode suku kata", tone: "#0C556C" },
    { id: "english", file: "english.html", icon: "\uD83D\uDDE3\uFE0F", en: "English", idn: "Bahasa Inggris",
      note: "Cambridge Starters & Movers", tone: "#2E7A55" },
    { id: "ensiklopedia", file: "ensiklopedia.html", icon: "\uD83E\uDD81", en: "Encyclopedia", idn: "Ensiklopedia",
      note: "Animals, Latin names, science, stories", tone: "#7A4A22" },
    { id: "berhitung", file: "berhitung.html", icon: "\uD83D\uDD22", en: "Counting", idn: "Berhitung",
      note: "Food webs, adding and taking away", tone: "#5A3E8A" },
    { id: "menulis", file: "menulis.html", icon: "\u270F\uFE0F", en: "Writing", idn: "Menulis",
      note: "Trace letters, numbers and words", tone: "#8A3552" },
    { id: "koleksi", file: "koleksi.html", icon: "\uD83E\uDD81", en: "Zoo & Pets", idn: "Koleksi",
      note: "Animals to collect, pets that grow, progress for parents", tone: "#1F6E4C" }
  ];

  var CREDITS = "Created with love and care by Papi Rifky and Mommy Keke " +
                "for beloved Abang Baim and Ade Yahya.";

  var CURRICULUM = [
    ["Cambridge Pre A1 Starters / A1 Movers", "English vocabulary and listening papers"],
    ["Cambridge Primary English & Science", "progression of comprehension and enquiry"],
    ["NSW Early Stage 1 and Stage 1 (Australia)", "phonics, number sense, handwriting"],
    ["Kurikulum Merdeka PAUD & SD (Indonesia)", "calistung, IPAS, Profil Pelajar Pancasila"],
    ["Metode Suku Kata & SAS", "Indonesian syllable reading method"]
  ];

  /* a back button injected into any game page */
  function mountBack(title) {
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

  var GRADES = [
    { xp: 0,     id: "kindy-a", label: "Kindy A",        note: "getting started" },
    { xp: 350,   id: "kindy-b", label: "Kindy B",        note: "letters, sounds, counting to 10" },
    { xp: 900,   id: "prep",    label: "Preparatory",    note: "blending, first words, writing" },
    { xp: 1800,  id: "g1",      label: "Primary Grade 1",note: "reading sentences, adding and taking away" },
    { xp: 3200,  id: "g2",      label: "Primary Grade 2",note: "comprehension, groups of animals" },
    { xp: 5200,  id: "g3",      label: "Primary Grade 3",note: "reasoning, food webs, longer writing" },
    { xp: 8000,  id: "g4",      label: "Primary Grade 4",note: "science vocabulary, Latin names" },
    { xp: 11500, id: "g5",      label: "Primary Grade 5",note: "systems, ethics, history" },
    { xp: 16000, id: "g6",      label: "Primary Grade 6",note: "independent reading and writing" }
  ];

  /* 50 animals to collect. The cost rises steeply so the rare ones
     really are rare. Kangaroo and koala are the last two. */
  var ZOO = [
    ["ant","\uD83D\uDC1C","Ant","Semut",40],
    ["fish","\uD83D\uDC1F","Fish","Ikan",70],
    ["chicken","\uD83D\uDC13","Chicken","Ayam",110],
    ["duck","\uD83E\uDD86","Duck","Bebek",160],
    ["cat","\uD83D\uDC08","Cat","Kucing",220],
    ["dog","\uD83D\uDC15","Dog","Anjing",290],
    ["rabbit","\uD83D\uDC30","Rabbit","Kelinci",370],
    ["butterfly","\uD83E\uDD8B","Butterfly","Kupu-kupu",460],
    ["bee","\uD83D\uDC1D","Bee","Lebah",560],
    ["frog","\uD83D\uDC38","Frog","Katak",670],
    ["snail","\uD83D\uDC0C","Snail","Siput",790],
    ["cow","\uD83D\uDC04","Cow","Sapi",920],
    ["goat","\uD83D\uDC10","Goat","Kambing",1060],
    ["horse","\uD83D\uDC0E","Horse","Kuda",1210],
    ["sheep","\uD83D\uDC11","Sheep","Domba",1370],
    ["bird","\uD83D\uDC26","Bird","Burung",1540],
    ["owl","\uD83E\uDD89","Owl","Burung hantu",1720],
    ["turtle","\uD83D\uDC22","Turtle","Penyu",1910],
    ["crab","\uD83E\uDD80","Crab","Kepiting",2110],
    ["shrimp","\uD83E\uDD90","Shrimp","Udang",2320],
    ["squid","\uD83E\uDD91","Squid","Cumi",2540],
    ["octopus","\uD83D\uDC19","Octopus","Gurita",2770],
    ["snake","\uD83D\uDC0D","Snake","Ular",3010],
    ["lizard","\uD83E\uDD8E","Lizard","Kadal",3260],
    ["monkey","\uD83D\uDC12","Monkey","Monyet",3520],
    ["deer","\uD83E\uDD8C","Deer","Rusa",3800],
    ["fox","\uD83E\uDD8A","Fox","Rubah",4100],
    ["boar","\uD83D\uDC17","Wild boar","Babi hutan",4420],
    ["penguin","\uD83D\uDC27","Penguin","Penguin",4760],
    ["peacock","\uD83E\uDD9A","Peacock","Merak",5120],
    ["parrot","\uD83E\uDD9C","Parrot","Nuri",5500],
    ["eagle","\uD83E\uDD85","Eagle","Elang",5900],
    ["dolphin","\uD83D\uDC2C","Dolphin","Lumba-lumba",6330],
    ["shark","\uD83E\uDD88","Shark","Hiu",6790],
    ["whale","\uD83D\uDC0B","Whale","Paus",7280],
    ["crocodile","\uD83D\uDC0A","Crocodile","Buaya",7800],
    ["zebra","\uD83E\uDD93","Zebra","Zebra",8360],
    ["camel","\uD83D\uDC2A","Camel","Unta",8960],
    ["buffalo","\uD83D\uDC03","Buffalo","Kerbau",9600],
    ["hippo","\uD83E\uDD9B","Hippopotamus","Kuda nil",10290],
    ["rhino","\uD83E\uDD8F","Rhinoceros","Badak",11030],
    ["giraffe","\uD83E\uDD92","Giraffe","Jerapah",11830],
    ["elephant","\uD83D\uDC18","Elephant","Gajah",12690],
    ["gorilla","\uD83E\uDD8D","Gorilla","Gorila",13620],
    ["orangutan","\uD83E\uDDA7","Orangutan","Orangutan",14620],
    ["lion","\uD83E\uDD81","Lion","Singa",15700],
    ["tiger","\uD83D\uDC05","Tiger","Harimau",16870],
    ["panda","\uD83D\uDC3C","Giant panda","Panda",18140],
    ["kangaroo","\uD83E\uDD98","Kangaroo","Kanguru",19520],
    ["koala","\uD83D\uDC28","Koala","Koala",21000]
  ].map(function (r) { return { id: r[0], emo: r[1], en: r[2], idn: r[3], xp: r[4] }; });

  /* pets grow up as the xp goes in */
  var PETS = [
    { id: "cat", en: "Cat", idn: "Kucing", stages: [
      { emo: "\uD83D\uDC31", en: "Kitten", xp: 0 },
      { emo: "\uD83D\uDC08", en: "Young cat", xp: 150 },
      { emo: "\uD83D\uDC08\u200D\u2B1B", en: "Grown cat", xp: 500 },
      { emo: "\uD83D\uDC06", en: "Big wild cat", xp: 1200 } ] },
    { id: "chick", en: "Chicken", idn: "Ayam", stages: [
      { emo: "\uD83E\uDD5A", en: "Egg", xp: 0 },
      { emo: "\uD83D\uDC23", en: "Hatching", xp: 90 },
      { emo: "\uD83D\uDC24", en: "Chick", xp: 260 },
      { emo: "\uD83D\uDC14", en: "Hen", xp: 620 },
      { emo: "\uD83D\uDC13", en: "Rooster", xp: 1400 } ] },
    { id: "frog", en: "Frog", idn: "Katak", stages: [
      { emo: "\uD83E\uDEB1", en: "Eggs in the pond", xp: 0 },
      { emo: "\uD83D\uDC1B", en: "Tadpole", xp: 110 },
      { emo: "\uD83D\uDC38", en: "Young frog", xp: 340 },
      { emo: "\uD83D\uDC0A", en: "Big pond friend", xp: 900 } ] },
    { id: "tree", en: "Tree", idn: "Pohon", stages: [
      { emo: "\uD83C\uDF30", en: "Seed", xp: 0 },
      { emo: "\uD83C\uDF31", en: "Sprout", xp: 80 },
      { emo: "\uD83E\uDEB4", en: "Young tree", xp: 300 },
      { emo: "\uD83C\uDF33", en: "Big tree", xp: 780 },
      { emo: "\uD83C\uDF33\uD83C\uDF3A", en: "Tree full of life", xp: 1600 } ] }
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
  var FOOD_COST = 12;      /* one feed */
  var FOOD_VALUE = 30;     /* how much the pet grows per feed */

  function award(game, o) {
    o = o || {};
    var level = o.level || 1, wrongs = o.wrongs || 0;
    var base = 4 + level * 2;
    var quality = wrongs === 0 ? 1 : (wrongs === 1 ? 0.45 : 0.2);
    var p = pget();
    var streak = wrongs === 0 ? (p.streak || 0) + 1 : 0;
    var mult = 1 + Math.min(10, streak) * 0.06;          /* caps at 1.6x */
    var xp = Math.max(1, Math.round(base * quality * mult));
    p.streak = streak;
    p.best = Math.max(p.best || 0, streak);
    p.food = (p.food || 0) + Math.max(0, Math.round(xp / 2));
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
    html += '<div class="k stat" title="Streak of clean first-time answers"><span class="em">' +
            (sk >= 3 ? "\uD83D\uDD25" : "\u26A1") + '</span><span>' + sk + '</span></div>';
    html += '<div class="k stat" title="Total XP"><span class="em">\u2B50</span><span>' + st.xp + "</span></div>";
    html += '<a class="k" href="koleksi.html" title="Zoo, pets and progress"><span class="em">' +
            stage.emo + '</span><span>\uD83C\uDF3D ' + fd + "</span></a>";
    bar.innerHTML = html;
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

  S.score = { award: award, food: food, streak: streakNow, feed: feed,
              stageOf: stageOf, petFed: petFed, FOOD_COST: FOOD_COST };
  S.bar = { mount: mountBar, render: renderBar, fly: flyXp,
            set: function (a) { barActions = a || []; renderBar(); } };

  S.GRADES = GRADES; S.ZOO = ZOO; S.PETS = PETS;
  S.xp = { add: addXp, stats: stats, award: award, gradeFor: gradeFor, nextGrade: nextGrade,
           unlockedZoo: unlockedZoo, petStage: petStage,
           reset: function () { pset({}); } };
})(window);
