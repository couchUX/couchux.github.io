# WSET Level 2 — Study App

A dependency-free, static study app. No build step, no frameworks — just
open it on GitHub Pages (`couchux.github.io/wset2/`) or serve locally:

```bash
cd wset2
python3 -m http.server 8000
# then open http://localhost:8000
```

(Opening `index.html` directly from disk won't load the quiz — browsers
block `fetch()` on `file://` URLs. Use a local server as above.)

## Structure

| Path | Purpose |
|---|---|
| `index.html` | Page shell |
| `css/style.css` | All styling |
| `js/data.js` | Study reference data (varieties, labels, sparkling/fortified, SAT) |
| `js/app.js` | App logic (tabs, collapsibles, quiz engine) |
| `data/questions.json` | The quiz bank — **edit this to add questions** |

## Adding quiz questions

Append objects to `data/questions.json`:

```json
{
  "cat": "Varieties",
  "q": "Which grape ... ?",
  "opts": ["option A", "option B", "option C", "option D"],
  "a": 2,
  "exp": "Why the answer is right."
}
```

- `a` is the zero-based index of the correct option (0=A, 1=B, 2=C, 3=D).
- `cat` groups questions into the topic filters. Existing categories:
  Varieties, Regions, Production, Environment, Sparkling, Fortified,
  Labels, SAT, Food & Wine, Storage & Service. New category names create
  new filter pills automatically.

### Keeping the bank unbiased

When adding questions in bulk, keep correct answers spread evenly across
positions A–D, and don't let the correct option be systematically the
longest one. The bank was generated with a balancing script that enforces
an even A/B/C/D split and checks length bias — worth re-checking after
large additions.
