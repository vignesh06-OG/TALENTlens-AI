/**
 * TalentLens AI — headless engine tests
 * Run: node tests/engine.test.js
 *
 * Extracts the pure-JS discovery engine from index.html and validates:
 *  1. Deep Job Understanding (JD parsing)
 *  2. Contextual / semantic relevance
 *  3. Multi-signal ranking discrimination
 *  4. CSV parsing & explainability
 */
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const js = html.match(/<script>([\s\S]*)<\/script>/)[1];

/* ---- minimal browser stubs so the script evaluates headlessly ---- */
global.performance = { now: () => Date.now() };
const elements = {};
const makeEl = () => ({
  innerHTML: "", textContent: "", value: "45", style: {}, dataset: {},
  classList: { add(){}, remove(){}, toggle(){}, contains(){ return false; } },
  addEventListener(){}, setAttribute(){}, querySelectorAll(){ return []; },
  appendChild(){}, click(){}, focus(){}, getContext(){ return null; },
});
global.document = {
  getElementById: id => (elements[id] ||= makeEl()),
  querySelectorAll: () => [], querySelector: () => makeEl(), createElement: () => makeEl(),
};
global.window = { matchMedia: () => ({ matches: true }), addEventListener(){} };
global.URL = { createObjectURL: () => "", revokeObjectURL(){} };
global.Blob = class {}; global.FileReader = class { readAsText(){} };
global.requestAnimationFrame = () => {};

let passed = 0, failed = 0;
function assert(cond, msg) {
  if (cond) { passed++; console.log("  ✓", msg); }
  else { failed++; console.error("  ✗ FAIL:", msg); }
}

const harness = `
;(function(){
  const W = { skill: 45, exp: 20, career: 15, act: 20 };
  const rankAll = jd => POOL
    .map(c => { const sc = scoreCandidate(c, jd); return { c, sc, score: composite(sc, W) }; })
    .sort((a, b) => b.score - a.score);

  console.log("\\n[1] Deep Job Understanding");
  let jd = parseJD(PRESETS.ml);
  __assert(jd.skills.length >= 10, "ML JD: extracts 10+ skills (got " + jd.skills.length + ")");
  const mustNames = jd.skills.filter(s => s.must).map(s => s.name);
  const niceNames = jd.skills.filter(s => !s.must).map(s => s.name);
  __assert(mustNames.includes("pytorch") && mustNames.includes("llm"), "ML JD: pytorch & llm classified as must-have");
  __assert(niceNames.includes("langchain") && niceNames.includes("kubernetes"), "ML JD: langchain & k8s classified as nice-to-have");
  __assert(jd.minYears === 3, "ML JD: min years = 3 (got " + jd.minYears + ")");
  __assert(parseJD(PRESETS.fe).seniority === "Senior", "FE JD: seniority = Senior");
  __assert(parseJD(PRESETS.devops).minYears === 8, "DevOps JD: min years = 8");

  console.log("\\n[2] Contextual / semantic relevance (beyond keywords)");
  __assert(skillMatch("react", ["react"]).type === "exact", "exact match: react = react");
  const rel = skillMatch("llm", ["rag", "java"]);
  __assert(rel.type === "related" && rel.v > 0.5, "semantic: candidate with RAG gets credit for LLM (via " + rel.via + ")");
  __assert(skillMatch("vue", ["react", "css"]).type === "category", "category: react dev gets partial credit for vue");
  __assert(skillMatch("kubernetes", ["figma"]).type === "miss", "miss: designer gets zero for k8s");
  __assert(canon("k8s") === "kubernetes" && canon("GenAI") === "llm", "aliases: k8s→kubernetes, GenAI→llm");

  console.log("\\n[3] Ranking discrimination across 4 JDs");
  const top3 = jd => rankAll(parseJD(jd)).slice(0, 3).map(r => r.c.archetype);
  __assert(top3(PRESETS.ml).every(a => /ML|GenAI|Data Scientist/.test(a)), "ML JD: top-3 are all ML/GenAI profiles");
  __assert(top3(PRESETS.fe).every(a => /Frontend|Full-Stack/.test(a)), "FE JD: top-3 are all frontend profiles");
  __assert(top3(PRESETS.devops).every(a => /DevOps/.test(a)), "DevOps JD: top-3 are all DevOps profiles");
  __assert(top3(PRESETS.ds).every(a => /Data Scientist|ML/.test(a)), "DS JD: top-3 are all DS/ML profiles");
  const ranked = rankAll(parseJD(PRESETS.ml));
  __assert(ranked[0].score - ranked[ranked.length - 1].score >= 30, "score spread >= 30 pts (top " + ranked[0].score + " vs bottom " + ranked[ranked.length-1].score + ")");
  __assert(ranked.every(r => r.score >= 0 && r.score <= 100), "all scores within 0-100");

  console.log("\\n[4] CSV parsing & explainability");
  const rows = parseCSV('name,skills\\n"Verma, Asha",python;ml\\nRohit,react');
  __assert(rows.length === 3 && rows[1][0] === "Verma, Asha", "CSV: quoted comma field parsed correctly");
  const why = explain(ranked[0].c, ranked[0].sc, parseJD(PRESETS.ml), ranked[0].score).replace(/<[^>]+>/g, "");
  __assert(why.includes("matched exactly") && why.length > 60, "explainability produces substantive reasoning");
})();
`;

global.__assert = assert;
console.log("TalentLens AI — engine test suite");
eval(js + harness);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
