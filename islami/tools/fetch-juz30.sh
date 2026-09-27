#!/usr/bin/env bash
# Downloads the Juz 30 recitation for children and writes a manifest the app
# can read, so the audio works offline and does not depend on archive.org.
#
#   bash tools/fetch-juz30.sh
#
# Needs: curl and python3.  Takes a few minutes.
set -e
ITEM="${1:-murottal-anak-juz-30-metode-ummi}"
OUT="assets/audio/juz30"
mkdir -p "$OUT"
echo "Asking archive.org what is in $ITEM ..."
curl -sL "https://archive.org/metadata/$ITEM" -o "$OUT/_meta.json"

python3 - "$ITEM" "$OUT" <<'PY'
import json,sys,os,re,urllib.request,urllib.parse
item,out=sys.argv[1],sys.argv[2]
meta=json.load(open(os.path.join(out,"_meta.json")))
files=[f["name"] for f in meta.get("files",[]) if re.search(r"\.(mp3|ogg|m4a)$",f["name"],re.I)]
if not files:
    print("No audio found in that item. Check the identifier."); sys.exit(1)
print(f"{len(files)} audio files found.")

NAMES={78:"naba",79:"naziat",80:"abasa",81:"takwir",82:"infitar",83:"mutaffifin",84:"insyiqaq",
85:"buruj",86:"tariq",87:"ala",88:"gasyiyah",89:"fajr",90:"balad",91:"syams",92:"lail",
93:"duha",94:"syarh",95:"tin",96:"alaq",97:"qadr",98:"bayyinah",99:"zalzalah",100:"adiyat",
101:"qariah",102:"takasur",103:"asr",104:"humazah",105:"fil",106:"quraisy",107:"maun",
108:"kausar",109:"kafirun",110:"nasr",111:"lahab",112:"ikhlas",113:"falaq",114:"nas"}
def norm(s): return re.sub(r"[^a-z0-9]","",s.lower())
manifest={}
for n,name in NAMES.items():
    hit=None
    for f in files:
        if norm(name) and norm(name) in norm(f): hit=f; break
    if not hit:
        for f in files:
            for p in (str(n),f"{n:02d}",f"{n:03d}"):
                if re.search(rf"(^|\D){p}(\D|$)",f): hit=f; break
            if hit: break
    if hit: manifest[str(n)]=hit

print(f"Matched {len(manifest)} of 37 surahs.")
missing=[n for n in NAMES if str(n) not in manifest]
if missing: print("Not matched:",missing)

base=f"https://archive.org/download/{item}/"
for k,fn in sorted(manifest.items(),key=lambda x:int(x[0])):
    dest=os.path.join(out,fn)
    os.makedirs(os.path.dirname(dest) or out,exist_ok=True)
    if os.path.exists(dest) and os.path.getsize(dest)>1000:
        print("have",fn); continue
    url=base+urllib.parse.quote(fn)
    print("get ",fn)
    try: urllib.request.urlretrieve(url,dest)
    except Exception as e: print("  failed:",e)
json.dump(manifest,open(os.path.join(out,"manifest.json"),"w"),ensure_ascii=False)
print("Wrote",os.path.join(out,"manifest.json"))
PY
rm -f "$OUT/_meta.json"
echo "Done. Reload juz30.html and the audio will play from your own copy."
