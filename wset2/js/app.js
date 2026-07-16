// ─── WSET 2 STUDY APP ───────────────────────────────────────────
// Plain JS, no build step. Questions load from data/questions.json.

(function () {
  "use strict";

  // WSET grade boundaries, as fractions of a perfect score.
  const GRADE = { pass: 0.55, merit: 0.7, distinction: 0.85 };

  const TABS = [
    { id: "overview",   label: "Overview" },
    { id: "varieties",  label: "Varieties" },
    { id: "production", label: "Production" },
    { id: "labels",     label: "Labels" },
    { id: "sat",        label: "SAT Grid" },
    { id: "quiz",       label: "Quiz" },
  ];

  const state = {
    tab: "overview",
    varietyFilter: "all",
    openVarieties: new Set(),
    openProduction: null,
    questions: [],
    questionsError: null,
    quiz: null, // { qs, idx, sel, results, complete }
  };

  const tabBar = document.getElementById("tabBar");
  const content = document.getElementById("tabContent");

  // ── tiny DOM helpers ──────────────────────────────────────────
  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (k === "class") node.className = v;
        else if (k === "style") node.style.cssText = v;
        else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
        else if (v !== false && v != null) node.setAttribute(k, v === true ? "" : v);
      }
    }
    for (const child of children.flat()) {
      if (child == null || child === false) continue;
      node.append(child.nodeType ? child : document.createTextNode(child));
    }
    return node;
  }

  function render() {
    renderTabs();
    content.replaceChildren(
      { overview: renderOverview,
        varieties: renderVarieties,
        production: renderProduction,
        labels: renderLabels,
        sat: renderSAT,
        quiz: renderQuiz }[state.tab]()
    );
  }

  let renderedTab = null;
  function renderTabs() {
    if (renderedTab === state.tab) return;
    renderedTab = state.tab;
    tabBar.replaceChildren(...TABS.map(t =>
      el("button", {
        class: state.tab === t.id ? "active" : "",
        onclick: () => { state.tab = t.id; render(); },
      }, t.label)
    ));
  }

  // ── OVERVIEW ──────────────────────────────────────────────────
  function renderOverview() {
    const totalQ = EXAM_LOS.reduce((s, lo) => s + lo.q, 0);
    const priorityQ = EXAM_LOS.filter(lo => lo.priority).reduce((s, lo) => s + lo.q, 0);
    const priorityPct = Math.round((priorityQ / totalQ) * 100);
    return el("div", { class: "stack-lg" },
      el("div", { class: "strategy-box" },
        el("div", { class: "title" }, "The Strategy 🎯"),
        el("div", { class: "body" },
          "LO3 + LO4 together = ",
          el("strong", null, `${priorityQ} questions out of ${totalQ} — that's ${priorityPct}% of the exam.`),
          ` Nail grape varieties and their regions first. The exam is ${totalQ} MCQ, closed book, 60 minutes.`
        )
      ),
      el("div", { class: "card" },
        el("h2", { class: "country-heading", style: "margin:0 0 12px;font-size:0.95rem" }, "Exam Weight"),
        el("div", { class: "weight-bar" },
          EXAM_LOS.map((lo, i) =>
            el("div", { style: `width:${(lo.q / totalQ) * 100}%;background:${LO_COLORS[i]}` }, String(lo.q))
          )
        ),
        el("div", { class: "stack", style: "gap:8px" },
          EXAM_LOS.map((lo, i) =>
            el("div", { class: "lo-row" },
              el("div", { class: "swatch", style: `background:${LO_COLORS[i]}` }),
              el("div", { class: "name" }, el("strong", null, `LO${lo.id}`), ` — ${lo.name}`),
              el("span", { class: "count" }, String(lo.q))
            )
          )
        )
      )
    );
  }

  // ── VARIETIES (collapsible) ───────────────────────────────────
  function renderVarieties() {
    const filters = [
      { id: "all", label: "All" },
      { id: "red", label: "🔴 Red" },
      { id: "white", label: "⚪ White" },
    ];
    const visible = VARIETIES.filter(v => state.varietyFilter === "all" || v.type === state.varietyFilter);
    const allOpen = visible.length > 0 && visible.every(v => state.openVarieties.has(v.id));

    const groups = [
      { lo: 3, title: "LO3 — Principal Varieties" },
      { lo: 4, title: "LO4 — Regional Varieties" },
    ];

    return el("div", null,
      el("div", { class: "pill-row", style: "margin-bottom:16px" },
        filters.map(f =>
          el("button", {
            class: "pill" + (state.varietyFilter === f.id ? " active" : ""),
            onclick: () => { state.varietyFilter = f.id; render(); },
          }, f.label)
        ),
        el("button", {
          class: "pill", style: "margin-left:auto",
          onclick: () => {
            if (allOpen) visible.forEach(v => state.openVarieties.delete(v.id));
            else visible.forEach(v => state.openVarieties.add(v.id));
            render();
          },
        }, allOpen ? "Collapse all" : "Expand all")
      ),
      groups.map(g => {
        const items = visible.filter(v => v.lo === g.lo);
        if (!items.length) return null;
        return el("div", { style: "margin-bottom:18px" },
          el("div", { class: "country-heading" }, g.title),
          el("div", { class: "stack" }, items.map(renderVarietyCard))
        );
      })
    );
  }

  function renderVarietyCard(v) {
    const open = state.openVarieties.has(v.id);
    return el("div", { class: "variety-card" },
      el("div", { class: "strip", style: `background:${v.color}` }),
      el("div", { class: "content" },
        el("button", {
          class: "variety-header",
          onclick: () => {
            open ? state.openVarieties.delete(v.id) : state.openVarieties.add(v.id);
            render();
          },
        },
          el("span", { class: "vname" }, v.name),
          el("span", { class: "vhint" }, open ? "" : v.key),
          el("span", { class: "chevron" }, open ? "▲" : "▼")
        ),
        open && el("div", { class: "variety-body" },
          el("div", { class: "variety-key" }, v.key),
          el("div", { class: "struct-row" },
            el("div", null, el("strong", null, "Tannin: "), v.tannin),
            el("div", null, el("strong", null, "Acid: "), v.acid),
            el("div", null, el("strong", null, "Body: "), v.body)
          ),
          el("div", { class: "variety-style" }, v.style),
          el("div", { class: "stack", style: "gap:4px" },
            v.regions.map(reg =>
              el("div", { class: "region-row" },
                el("span", { class: "country" }, reg.c),
                el("span", null, el("strong", null, reg.r), reg.n ? ` — ${reg.n}` : "")
              )
            )
          ),
          v.terms.length > 0 && el("div", { style: "display:flex;gap:6px;margin-top:10px;flex-wrap:wrap" },
            v.terms.map(t => el("span", { class: "term-tag" }, t))
          )
        )
      )
    );
  }

  // ── PRODUCTION ────────────────────────────────────────────────
  function renderProduction() {
    return el("div", { class: "stack-lg" },
      el("div", { class: "section-heading" }, "Winemaking Processes"),
      PRODUCTION_STEPS.map(s => {
        const open = state.openProduction === s.id;
        return el("div", { class: "collapse-card" },
          el("button", {
            class: "collapse-header",
            onclick: () => { state.openProduction = open ? null : s.id; render(); },
          },
            el("span", { class: "label", style: `color:${s.color}` }, s.title),
            el("span", { style: "color:var(--muted)" }, open ? "▲" : "▼")
          ),
          open && el("div", { class: "collapse-body" },
            s.items.map(item =>
              el("div", { class: "step-row" },
                el("div", { class: "icon" }, item.icon),
                el("div", null, el("strong", null, item.n), item.d)
              )
            )
          )
        );
      }),
      el("div", { class: "section-heading", style: "margin-top:10px" }, "Sparkling"),
      el("div", { class: "stack" },
        SPARKLING_DATA.map(s => refCard(
          el("div", { class: "card-title", style: "display:flex;justify-content:space-between;gap:8px" },
            el("span", null, `${s.flag} ${s.name}`),
            el("span", { class: "method-badge" }, s.method)
          ),
          s.grapes, `${s.styles} ${s.note}`
        ))
      ),
      el("div", { class: "section-heading", style: "margin-top:10px" }, "Fortified"),
      el("div", { class: "stack" },
        FORTIFIED_DATA.map(s => refCard(
          el("div", null,
            el("div", { class: "card-title", style: "margin-bottom:4px" }, `${s.cat}: ${s.name}`),
            el("div", { style: "font-size:0.75rem;color:var(--amber);font-weight:700;margin-bottom:8px" }, s.aging)
          ),
          s.grapes, s.taste
        ))
      )
    );
  }

  function grapeChip(name, color) {
    return el("span", { class: "grape-chip" },
      el("span", { class: "dot", style: `background:${color}` }),
      name
    );
  }

  // Shared card layout for the sparkling and fortified reference sections.
  function refCard(header, grapes, note) {
    return el("div", { class: "card", style: "padding:14px" },
      header,
      el("div", { class: "grape-row" }, grapes.map(g => grapeChip(g.n, g.c))),
      el("div", { class: "card-note" }, note)
    );
  }

  // ── LABELS (grouped by country → region) ──────────────────────
  function renderLabels() {
    return el("div", null,
      LABEL_DATA.map(c =>
        el("div", { class: "country-group" },
          el("div", { class: "country-heading" }, c.country),
          el("div", { class: "stack" },
            c.groups.map(g =>
              el("div", null,
                el("div", { style: "font-size:0.78rem;font-weight:600;color:var(--muted);margin:6px 0" }, g.region),
                el("div", { class: "stack", style: "gap:8px" },
                  g.terms.map(t =>
                    el("div", { class: "label-row" },
                      el("span", { class: "term" }, t.term),
                      el("div", { class: "meaning" }, t.meaning)
                    )
                  )
                )
              )
            )
          )
        )
      )
    );
  }

  // ── SAT ───────────────────────────────────────────────────────
  function renderSAT() {
    return el("div", { class: "stack-lg" },
      SAT_DATA.map(t =>
        el("div", { class: "sat-tier", style: `border:1px solid ${t.color}40` },
          el("div", { class: "sat-tier-title", style: `color:${t.color};border-bottom:2px solid ${t.color}` }, t.tier),
          el("div", { class: "stack", style: "gap:8px" },
            t.items.map(item =>
              el("div", { class: "sat-row" },
                el("div", { class: "icon" }, item.i),
                el("div", { class: "name" }, item.n),
                el("div", { class: "desc" }, item.d)
              )
            )
          )
        )
      )
    );
  }

  // ── QUIZ ──────────────────────────────────────────────────────
  function quizCategories() {
    const cats = new Map();
    for (const q of state.questions) cats.set(q.cat, (cats.get(q.cat) || 0) + 1);
    return cats;
  }

  function getQs(cat) {
    return cat === "all" ? state.questions : state.questions.filter(q => q.cat === cat);
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function startQuiz(mode) {
    let qs = shuffle(getQs(state.quizCat || "all"));
    if (mode === "mock50") qs = qs.slice(0, 50);
    if (!qs.length) return;
    state.quiz = { qs, idx: 0, sel: null, results: [], complete: false };
    render();
  }

  function renderQuiz() {
    if (state.questionsError) {
      return el("div", { class: "card", style: "color:var(--red)" },
        "Could not load questions.json — if you opened this file directly, run a local server instead ",
        el("code", null, "(e.g. python3 -m http.server)"), ". ", state.questionsError
      );
    }
    if (!state.questions.length) {
      return el("div", { class: "card", style: "color:var(--muted)" }, "Loading questions…");
    }
    if (state.quiz && state.quiz.complete) return renderQuizResults();
    if (state.quiz) return renderQuizQuestion();
    return renderQuizSetup();
  }

  function renderQuizSetup() {
    const cats = quizCategories();
    const selCat = state.quizCat || "all";
    const pool = getQs(selCat);
    return el("div", { class: "card", style: "padding:20px" },
      el("h3", { style: "margin:0 0 12px;color:var(--primary)" }, "Choose Topic"),
      el("div", { class: "pill-row", style: "margin-bottom:24px" },
        el("button", {
          class: "pill" + (selCat === "all" ? " active" : ""),
          onclick: () => { state.quizCat = "all"; render(); },
        }, `All Topics (${state.questions.length})`),
        [...cats.entries()].map(([c, n]) =>
          el("button", {
            class: "pill" + (selCat === c ? " active" : ""),
            onclick: () => { state.quizCat = c; render(); },
          }, `${c} (${n})`)
        )
      ),
      el("div", { style: "display:flex;gap:10px;flex-wrap:wrap" },
        pool.length >= 50 && el("button", { class: "btn-primary", style: "flex:1;min-width:200px", onclick: () => startQuiz("mock50") }, "Start Random 50 Mock Exam"),
        el("button", { class: "btn-primary btn-dark", style: "flex:1;min-width:200px", onclick: () => startQuiz("all") }, `Start All ${pool.length} Questions`)
      )
    );
  }

  function renderQuizQuestion() {
    const quiz = state.quiz;
    const q = quiz.qs[quiz.idx];
    const answered = quiz.sel !== null;

    function next() {
      quiz.results.push({ correct: quiz.sel === q.a, q, sel: quiz.sel });
      if (quiz.idx + 1 >= quiz.qs.length) quiz.complete = true;
      else { quiz.idx += 1; quiz.sel = null; }
      render();
    }

    return el("div", { class: "stack" },
      el("div", { class: "card", style: "padding:14px" },
        el("div", { class: "quiz-meta" },
          el("span", null, `Question ${quiz.idx + 1} / ${quiz.qs.length}`),
          el("span", { class: "quiz-cat" }, q.cat)
        ),
        el("div", { class: "quiz-question" }, q.q),
        el("div", { class: "stack", style: "gap:8px" },
          q.opts.map((opt, i) => {
            let cls = "quiz-opt";
            if (answered) {
              if (i === q.a) cls += " correct";
              else if (i === quiz.sel) cls += " wrong";
            }
            return el("button", {
              class: cls, disabled: answered,
              onclick: () => { quiz.sel = i; render(); },
            }, opt);
          })
        ),
        answered && el("div", { class: "quiz-explain " + (quiz.sel === q.a ? "correct" : "wrong") },
          el("strong", null, quiz.sel === q.a ? "✓ Correct" : "✗ Not quite"),
          q.exp
        )
      ),
      answered && el("button", { class: "btn-primary", onclick: next },
        quiz.idx + 1 >= quiz.qs.length ? "Finish →" : "Next Question →")
    );
  }

  function renderQuizResults() {
    const results = state.quiz.results;
    const score = results.filter(r => r.correct).length;
    // Grade from the raw ratio, not the rounded percentage — 54.8% is not a pass.
    const ratio = score / results.length;
    const pct = Math.round(ratio * 100);
    const grade = ratio >= GRADE.distinction ? "Distinction 🏆" : ratio >= GRADE.merit ? "Merit 🎉" : ratio >= GRADE.pass ? "Pass ✓" : "Below pass — keep going!";
    const gradeColor = ratio >= GRADE.pass ? "var(--green)" : "var(--red)";

    const byCat = new Map();
    for (const r of results) {
      const c = byCat.get(r.q.cat) || { total: 0, correct: 0 };
      c.total += 1;
      if (r.correct) c.correct += 1;
      byCat.set(r.q.cat, c);
    }
    const missed = results.filter(r => !r.correct);

    return el("div", { class: "stack-lg" },
      el("div", { class: "card", style: "text-align:center;padding:30px" },
        el("div", { class: "result-score", style: `color:${gradeColor}` }, `${pct}%`),
        el("div", { class: "result-grade", style: `color:${gradeColor}` }, grade),
        el("div", { style: "margin-bottom:20px;color:var(--muted)" }, `${score} correct out of ${results.length}`),
        el("button", { class: "btn-primary", onclick: () => { state.quiz = null; render(); } }, "Back to Quiz Setup")
      ),
      el("div", { class: "card" },
        el("div", { class: "card-title" }, "By Category"),
        [...byCat.entries()].map(([cat, c]) =>
          el("div", { class: "cat-result-row" },
            el("span", null, cat),
            el("span", { style: `font-weight:700;color:${c.correct === c.total ? "var(--green)" : c.correct / c.total >= GRADE.pass ? "var(--amber)" : "var(--red)"}` },
              `${c.correct} / ${c.total}`)
          )
        )
      ),
      missed.length > 0 && el("div", { class: "card" },
        el("div", { class: "card-title" }, `Review Missed (${missed.length})`),
        el("div", { class: "stack", style: "gap:8px" },
          missed.map(r =>
            el("div", { class: "missed-q" },
              el("div", { class: "mq" }, r.q.q),
              el("div", { class: "ma" }, "✓ ", r.q.opts[r.q.a]),
              el("div", { style: "color:var(--muted);margin-top:2px" }, r.q.exp)
            )
          )
        )
      )
    );
  }

  // ── INIT ──────────────────────────────────────────────────────
  fetch("data/questions.json")
    .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
    .then(qs => {
      if (!Array.isArray(qs) || qs.length === 0) throw new Error("questions.json contains no questions");
      state.questions = qs;
      if (state.tab === "quiz") render();
    })
    .catch(e => { state.questionsError = String(e); if (state.tab === "quiz") render(); });

  render();
})();
