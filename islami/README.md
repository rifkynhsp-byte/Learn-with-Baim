# Rumah Islami

A companion to Rumah Belajar: prayer, everyday duas, memorising Juz 30, and the
stories of the 25 prophets. Arabic with both Indonesian and English meaning.

    Created with love and care by Papi Rifky and Mommy Keke
    for beloved Abang Baim and Ade Yahya.

## What is inside

| Page | Content |
|---|---|
| `index.html` | Home, progress, settings |
| `shalat.html` | Prayer in 92 steps, with posture, Arabic, meaning, audio |
| `doa.html` | 20 everyday duas with recited audio |
| `juz30.html` | All 37 surahs of Juz 30, 564 verses |
| `nabi.html` | 25 prophets, image, short story, and the lesson |
| `koleksi.html` | What has been opened, and how often |

## Shalat

**Choose the prayer**: Subuh, Zuhur, Asar, Magrib or Isya. Each is built with its
own rakaat structure, so the sequence is actually correct:

| Prayer | Rakaat | Steps | Notes |
|---|---|---|---|
| Subuh | 2 | 32 | qunut in the second rakaat |
| Zuhur, Asar, Isya | 4 | 56 | tasyahud awal after the second rakaat |
| Magrib | 3 | 44 | tasyahud awal after the second rakaat |

Al-Fatihah appears once per rakaat, and the **short surah in the first two
rakaat is drawn at random from the last ten surahs of Juz 30**: Al-Fil, Quraisy,
Al-Ma'un, Al-Kausar, Al-Kafirun, An-Nasr, Al-Lahab, Al-Ikhlas, Al-Falaq, An-Nas.
It uses the Juz 30 recitation and full text, so praying and memorising reinforce
each other. Each prayer picks fresh surahs, so over time he meets all ten.

The niat is different for every prayer, and the app shows which prayer time it
is now and opens that one first.

**Audio** is your own Riko The Series recording, cut into 23 clips at the exact
timestamps you gave, with 15 ms of padding at both ends. Two notes on your list:
the second entry labelled shubuh is Dzuhur by position, and doa itidal ran past
the takbir that follows it, so its end was clamped to 8:30.

**Highlighting follows by proximity, not exact sync.** The line being recited
glows brightly and its neighbours glow faintly.

**Every step is clickable**, with its own picture, the Arabic, Indonesian
transliteration, and the meaning in Indonesian and English. The 20 illustrations
are cropped from the Qanza poster you uploaded.

## It talks, because he cannot read yet

Every screen announces itself out loud in Indonesian the moment it opens:

- Shalat: *"Salat Subuh. Surah Al-Fatihah, rakaat satu."*
- Doa: *"Doa sebelum tidur"*, then the Arabic recitation.
- Kisah: *"Nabi Musa"*
- Hafalan: *"Surah An-Nas"*

He never has to read a label to know where he is.

## The voice, and why it sounded English

The prophet stories are written in Indonesian, but they were coming out with an
English accent. That was a bug in how the app looked for an Indonesian voice.

It only accepted the locale code `id-ID`. But **Android and anything built on
older Java report Indonesian as `in-ID`**, because `in` was the original ISO code
for the language. Some devices report a bare `id`. None of those matched, so the
app found no Indonesian voice, silently fell back to English, and read Indonesian
words as if they were English.

It now recognises `id`, `id-ID`, `in`, `in-ID`, `IN_ID`, `ind` and any voice whose
name mentions Indonesia or Bahasa. Tested against all of them.

### If the device genuinely has no Indonesian voice

Short labels are respelled so an English voice lands near the right sound:

    Nabi Musa          ->  Nahbee Moosah
    Doa sebelum tidur  ->  Dohah sehbehloom teedoor
    Salat Subuh        ->  Sahlaht Soobooh

Long story paragraphs are not respelled, because a whole page of that is worse
than useless. Those fall back to the English version of the same story instead.

**Settings now tells you which voice it found**, and lists the voices on the
device if it found none, with the exact steps to install Indonesian:

- iPad: Settings, Accessibility, Spoken Content, Voices, add Bahasa Indonesia
- Android: Settings, System, Languages, Text-to-speech, download Bahasa Indonesia

Installing it is worth doing. The respelling is a stopgap, not a substitute.

## The An-Nas bug, and why it happened

You were right that the code was at fault, not the file.

The old build worked out which recording belonged to which surah by looking for
the surah name inside the file name. For An-Nas it searched for `annas`, and
found it inside `Metode-Ummi-110-An-Nashr.mp3`, because **"annas" is a substring
of "annashr"**. An-Nasr came before An-Nas in the list, so it matched first and
An-Nas played the wrong recitation.

Two fixes:

1. **Nothing is guessed any more.** The surah to file mapping is baked into
   `juz30.html`. It cannot fall back to name matching, and it no longer needs the
   network, so it also works offline and when opened straight from a file.
2. **The name matcher, still there for anyone pointing this at a different
   archive item, now matches on the surah number first and only then on a whole
   name, never a substring.**

Both are locked down by tests that play all 37 surahs with the network switched
off and check each one gets its own file, plus a test named after this exact bug.

## Periksa Rekaman

If you ever swap in a different recording set and one file turns out to be
mislabelled, open **Periksa Rekaman** from the home screen. Press Dengar on each
surah and, if the wrong one plays, pick the right file from the list beside it.
Corrections are saved on the device and used immediately by Hafalan and by the
short surah inside Shalat. There is a reset button.

## Juz 30

All 37 surahs from An-Naba to An-Nas, 564 verses, each with Arabic, Indonesian
(Kemenag rendering), English, and transliteration. The list starts at An-Nas and
works backwards, which is how hafalan is normally taught.

**The recitation.** Listening only for now, as you asked. The page asks
archive.org for the file list of `murottal-anak-juz-30-metode-ummi` and matches
files to surahs by name or number. If a surah's file is not found it says so
plainly and still shows the full text. To use a different recording, change
`ITEM` near the top of the script.

## Doa Harian

20 duas a young child actually uses: waking, the bathroom, leaving and entering
the house, the mosque, the call to prayer, before and after eating, breaking the
fast, travelling, rain, wind, sleeping, fear, anger, protection, difficulty, and
dhikr after prayer. Audio is the MIT licensed recording from
`Islami-fork/koleksi-doa-dzikir-audio`.

## Kisah 25 Nabi

All 25 in Quranic order with an illustration, the **full story** told simply, and
the lesson, in both Indonesian and English.

150 story parts in total, four to eight per prophet, 78 to 165 words each. Long
enough to be a real story with a beginning, a middle and an end, short enough for
a five year old to sit through. Nuh builds the ark and his son refuses to board.
Yusuf goes from the well to the prison to the palace and forgives his brothers.
Musa goes from the basket on the Nile to the parting of the sea.

Tap **Bacakan** and the device reads the whole story aloud, paragraph by
paragraph, in whichever language is selected.

## Where the content comes from

| Part | Source | Licence |
|---|---|---|
| Arabic + Indonesian (Kemenag) | rioastamal/quran-json | MIT |
| English + transliteration | risan/quran-json | CC BY-SA 4.0 |
| Prayer steps, audio, postures | learnsalah/learnsalah | MIT |
| Dua audio | Islami-fork/koleksi-doa-dzikir-audio | MIT |
| Prophet illustrations | Islami-fork/Kisah-25-Nabi | **no licence stated** |
| Juz 30 recitation | Murottal Anak Juz 30, Metode Ummi, archive.org | check the item page |

**Please read this one.** The prophet illustrations repository states no licence,
which in practice means all rights reserved. The images are linked from their
repository rather than copied into yours, but if you want to publish properly you
should ask the author for permission first. Everything else is MIT or CC BY-SA
and safe to use with attribution, which this README provides.

The prophet stories are written fresh for this app rather than copied, so they
are short enough for a five year old and carry no licence issue.

## A note on accuracy

The Arabic and the Indonesian translation of the Quran come straight from
published datasets, unedited. The Indonesian for the prayer dhikr and the duas
uses the standard, widely taught wordings, and I wrote those out rather than
generating them. Even so, please read through them once with your own eyes
before Baim learns them by heart. Where a source and your own knowledge disagree,
trust your teacher.

## The audio and images are bundled

Everything the app needs is in `assets/`. Nothing is fetched from anyone else's
server, so it works offline and will not break if a repository disappears.

    assets/audio/juz30/   37 surah recitations (Metode Ummi)
    assets/audio/doa/     20 recitations       (MIT)
    assets/audio/riko/    23 shalat clips      (your recording)
    assets/img/shalat/    20 poster steps      (Qanza poster you uploaded)
    assets/img/nabi/      25 illustrations     (no licence stated, see above)

161 files, about 43 MB.

### Juz 30 recitation

All 37 recordings are bundled in `assets/audio/juz30/`, one per surah, from
Murottal Anak Juz 30 by Metode Ummi. A `manifest.json` maps surah number to file,
so nothing has to be guessed at runtime.

To swap in a different recording from archive.org:

    bash tools/fetch-juz30.sh some-other-archive-item

## Publishing

Upload every file including the `assets` folder, then Settings, Pages,
main / root. Best on an iPad in landscape.
