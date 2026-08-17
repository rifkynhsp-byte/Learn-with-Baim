# Rumah Belajar — one super app

Six pages, one home screen. Reading (Bahasa Indonesia), English, the animal
encyclopedia, counting through food webs, handwriting, and the zoo.

## Publish
Upload everything, then Settings > Pages > main / root.

    index.html         home, game picker, settings, live progress
    membaca.html       Membaca      berhitung.html   Berhitung
    english.html       English      menulis.html     Menulis
    ensiklopedia.html  Ensiklopedia koleksi.html     Zoo, pets, parent view
    family.jpg         home screen photo
    audio/             KEEP YOUR EXISTING FOLDER

`common.js` is now inlined into every page, so nothing can fail to load.

## About that error message
`Uncaught ReferenceError: SUPER is not defined` had nothing to do with the ES6
`super()` keyword or with classes. `SUPER` is this app's own global, created by
`common.js`. The browser could not fetch that file, so the object never existed.
Refactoring to ES6 classes would not have fixed it. Inlining did.

## Points are paid for mastery, not volume
- First time right: full marks.
- Second try: under half.
- Third try or more: almost nothing.
- A clean run raises a streak multiplier, capped at 1.6x, and only clean
  first-time answers count, so the streak cannot be farmed by guessing.
- Harder levels pay more.

Answering also earns food. Food is the only way to feed a pet, so a pet only
grows if real learning happened.

## Writing
Each letter of a word is measured separately. Writing "sap" no longer completes
"sapi": all four letters must be traced. Stars come from a real match score
that combines how much of each letter was covered with how much ink landed
off the letter.

    95% and up  4 stars      72-84%  2 stars
    85-94%      3 stars      below   1 star

## The strip
A Touch Bar style row along the bottom of every game: contextual keys on the
left, then the live streak, total XP, and your pet with its food count.
Tap the pet to jump to the zoo.
