#!/usr/bin/env node
/**
 * scripts/generate.js — تولید خودکار خروجی‌های گرامر برجسته‌سازی نحو کلنگ
 *
 * منابع:
 *   - واژه‌های کلیدی: «../kolang/keywords.json» (مخزن همسایهٔ مفسر کلنگ،
 *     تولیدشده از internal/token/token.go). می‌توان با متغیر محیطی
 *     KOLANG_KEYWORDS_JSON مسیر دیگری داد.
 *   - سایر توکن‌ها (builtins / types / modules / exceptions / operators /
 *     punctuation / comments): «kolang.grammar.json».
 *
 * کار:
 *   1. آرایه‌های کلیدواژهٔ kolang.grammar.json را در برابر keywords.json
 *      اعتبارسنجی می‌کند و «درِفت» (واژه‌هایی که مفسر نمی‌شناسد) را حذف و
 *      واژه‌های جاافتاده را اضافه می‌کند.
 *   2. خروجی‌ها را بازتولید می‌کند:
 *        - codemirror/kolang-syntax.js
 *        - textmate/kolang.tmLanguage.json
 *
 * این اسکریپت قطعی (deterministic) است: اجرای دوبارهٔ آن خروجی یکسان می‌دهد.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const KEYWORDS_PATH = process.env.KOLANG_KEYWORDS_JSON || path.resolve(ROOT, "..", "kolang", "keywords.json");
const GRAMMAR_PATH = path.join(ROOT, "kolang.grammar.json");
const CM_PATH = path.join(ROOT, "codemirror", "kolang-syntax.js");
const TM_PATH = path.join(ROOT, "textmate", "kolang.tmLanguage.json");

// ─── ورودی‌ها ────────────────────────────────────────────────────────────────

if (!fs.existsSync(KEYWORDS_PATH)) {
  console.error(`error: keywords.json یافت نشد: ${KEYWORDS_PATH}`);
  console.error("       این فایل خروجی مفسر کلنگ است (internal/token) و باید به‌عنوان مخزن همسایه موجود باشد:");
  console.error("       ../kolang/keywords.json   (یا KOLANG_KEYWORDS_JSON=/مسیر/keywords.json)");
  process.exit(1);
}

const kwData = JSON.parse(fs.readFileSync(KEYWORDS_PATH, "utf8"));
const keywords = kwData.keywords;
const grammar = JSON.parse(fs.readFileSync(GRAMMAR_PATH, "utf8"));

// ─── استخراج دسته‌ها از keywords.json (به ترتیب درج در فایل) ─────────────────

const byCategory = {};
for (const [word, meta] of Object.entries(keywords)) {
  (byCategory[meta.category] ||= []).push(word);
}

const control = byCategory.control || [];
const declaration = byCategory.declaration || [];
const copula = byCategory.copula || [];
const logical = byCategory.logical || [];
const scope = byCategory.scope || [];
const other = byCategory.other || [];
const concurrency = byCategory.concurrency || [];
const verbs = byCategory.verb || [];
const selfSuper = byCategory.self_super || [];
const literalWords = byCategory.literal || [];

const literals = {};
for (const w of literalWords) {
  if (w === "درست") literals.true = w;
  else if (w === "غلط") literals.false = w;
  else if (w === "تهی") literals.none = w;
  else throw new Error(`literal ناشناخته در keywords.json: ${w}`);
}
if (Object.keys(literals).length !== 3) {
  throw new Error("keywords.json باید دقیقاً سه literal داشته باشد: درست، غلط، تهی");
}

// ─── اعتبارسنجی / همگام‌سازی kolang.grammar.json در برابر keywords.json ──────

function syncArray(currentArr, expectedArr, label) {
  const cur = currentArr || [];
  const exp = expectedArr || [];
  const curSet = new Set(cur);
  const expSet = new Set(exp);
  const removed = cur.filter((w) => !expSet.has(w));
  const added = exp.filter((w) => !curSet.has(w));
  if (removed.length) console.log(`  ✗ حذف از «${label}»: ${removed.join("، ")}`);
  if (added.length) console.log(`  + افزوده به «${label}»: ${added.join("، ")}`);
  return exp;
}

console.log("همگام‌سازی واژه‌های کلیدی kolang.grammar.json با keywords.json:");
const kw = grammar.keywords || (grammar.keywords = {});
kw.control = syncArray(kw.control, control, "keywords.control");
kw.declaration = syncArray(kw.declaration, declaration, "keywords.declaration");
kw.copula = syncArray(kw.copula, copula, "keywords.copula");
kw.logical = syncArray(kw.logical, logical, "keywords.logical");
kw.scope = syncArray(kw.scope, scope, "keywords.scope");
kw.other = syncArray(kw.other, other, "keywords.other");
kw.concurrency = syncArray(kw.concurrency, concurrency, "keywords.concurrency");
grammar.verbs = syncArray(grammar.verbs, verbs, "verbs");
grammar.selfSuper = syncArray(grammar.selfSuper, selfSuper, "selfSuper");

{
  const curLitVals = Object.values(grammar.literals || {});
  const expLitSet = new Set(literalWords);
  const removed = curLitVals.filter((w) => !expLitSet.has(w));
  const added = literalWords.filter((w) => !curLitVals.includes(w));
  if (removed.length) console.log(`  ✗ حذف از «literals»: ${removed.join("، ")}`);
  if (added.length) console.log(`  + افزوده به «literals»: ${added.join("، ")}`);
}
grammar.literals = { true: literals.true, false: literals.false, none: literals.none };

grammar._comment =
  "گرامر کانونیکال زبان کلنگ — منبع حقیقت برای برجسته‌سازی نحو. واژه‌های کلیدی " +
  "(keywords.* / verbs / literals / selfSuper) آینهٔ «../kolang/keywords.json» " +
  "(تولیدشده از internal/token/token.go در مخزن مفسر) هستند و دستی ویرایش نمی‌شوند؛ " +
  "سایر توکن‌ها (builtins / types / modules / exceptions / operators / punctuation / comments) " +
  "منبع خودشان همین فایل است. خروجی‌ها با «node scripts/generate.js» بازتولید می‌شوند.";

// ─── تأیید پوشش کامل واژه‌های کلیدی ──────────────────────────────────────────

const generatedWords = [
  ...control, ...declaration, ...copula, ...logical, ...scope, ...other,
  ...concurrency, ...verbs, ...literalWords, ...selfSuper
];
{
  const expSet = new Set(Object.keys(keywords));
  const genSet = new Set(generatedWords);
  if (Object.keys(keywords).length !== generatedWords.length ||
      ![...expSet].every((w) => genSet.has(w))) {
    console.error("error: پوشش واژه‌های کلیدی با keywords.json یکی نیست — تولید متوقف شد.");
    process.exit(1);
  }
  console.log(`  ✓ هر ${Object.keys(keywords).length} واژهٔ کلیدی keywords.json پوشش داده شد.`);
}

// ─── ابزارهای کمکی ───────────────────────────────────────────────────────────

/** خروجی آرایهٔ JS با ۴ عنصر در هر خط؛ کسرهٔ اضافه (U+0650) به صورت \u0650. */
function fmtArr(arr) {
  if (arr.length === 0) return "[]";
  const lines = [];
  for (let i = 0; i < arr.length; i += 4) {
    const chunk = arr.slice(i, i + 4).map((s) => JSON.stringify(s).replace(/\u0650/g, "\\u0650"));
    lines.push("  " + chunk.join(", ") + (i + 4 < arr.length ? "," : ""));
  }
  return "[\n" + lines.join("\n") + "\n]";
}

/** فرار کاراکترهای خاص regex؛ کسرهٔ اضافه به صورت \u0650. */
function regexEscape(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\u0650/g, "\\u0650");
}

// عملگرها — بلندترین‌ها اول (مرتب‌سازی پایدار)
const sortedOperators = grammar.operators.slice().sort((a, b) => b.length - a.length);

// کلاس کاراکتری نشانه‌گذاری (CodeMirror: «[» بی‌فرار و «]» با فرار)
const punctClassCM = grammar.punctuation.map((c) => (c === "]" ? "\\]" : c)).join("");

// کلاس کاراکتری نشانه‌گذاری (TextMate: هر دو براکت با فرار)
const punctClassTM =
  "[" +
  grammar.punctuation
    .map((c) => (c === "[" ? "\\[" : c === "]" ? "\\]" : c))
    .join("") +
  "]";

// مرز واژه برای TextMate (الگوهای \u0621…\u200C — در فایل به صورت \\u… ذخیره می‌شوند)
// توجه: در String.raw فرار انجام نمی‌شود؛ تک‌بک‌اسلش همان‌طور که هست می‌ماند و
// JSON.stringify آن را در فایل خروجی دوبرابر (\\u) می‌کند.
const BOUNDARY_PRE = String.raw`(?<![\u0621-\u064A\u0670-\u06FFA-Za-z0-9_\u200C])`;
const BOUNDARY_POST = String.raw`(?![\u0621-\u064A\u0670-\u06FFA-Za-z0-9_\u200C])`;
const kwRegex = (words) => BOUNDARY_PRE + "(" + words.map(regexEscape).join("|") + ")" + BOUNDARY_POST;

// ─── ۱) خروجی CodeMirror ─────────────────────────────────────────────────────

const CM_HEADER = [
  "// ─────────────────────────────────────────────────────────────────────────────",
  "// kolang-syntax.js — خروجی فرمت CodeMirror از گرامر کلنگ",
  "//",
  "// ⚠️ GENERATED — این فایل به‌صورت خودکار تولید می‌شود؛ دستی ویرایش نکنید.",
  "//    GENERATED from kolang.grammar.json + keywords.json — do not edit by hand.",
  "//    Run: node scripts/generate.js",
  "//",
  "// منابع داده:",
  "//   - واژه‌های کلیدی: «../kolang/keywords.json» (تولیدشده از internal/token/token.go)",
  "//   - سایر توکن‌ها (builtins/types/modules/exceptions/operators/…): «kolang.grammar.json»",
  "//",
  "// مصرف‌کنندگان: kolang-web و kolang-mobile. این فایل فقط توکن‌ایزر / رنگ‌آمیزی را",
  "// شامل می‌شود؛ ورودی‌های مخصوص ویرایشگر (مانند جفت‌کردن خودکار گیومه‌های «» یا",
  "// میان‌برهای صفحه‌کلید) به مخزن ویرایشگر تعلق دارند و عمداً اینجا قرار ندارند.",
  "// ─────────────────────────────────────────────────────────────────────────────",
  "",
  "import { StreamLanguage, LanguageSupport } from \"@codemirror/language\";",
  "",
  "// ─── واژه‌ها (کلیدی از keywords.json؛ سایرین از kolang.grammar.json) ────────"
].join("\n");

const CM_TOKENIZER = String.raw`
// ─── مجموعه‌های جستجو ────────────────────────────────────────────────────────

const KEYWORD_SET = new Set([...CONTROL, ...DECLARATION, ...COPULA, ...LOGICAL, ...SCOPE, ...OTHER, ...CONCURRENCY]);
const EXCEPTION_SET = new Set(EXCEPTIONS);
const MODULE_SET = new Set(MODULES);
const VERB_SET = new Set(VERBS);
const BUILTIN_SET = new Set(BUILTINS);
const TYPE_SET = new Set(TYPES);
const LITERAL_SET = new Set([LITERALS.true, LITERALS.false, LITERALS.none]);
const SELF_SUPER_SET = new Set(SELF_SUPER);

// ─── الگوهای منظم ────────────────────────────────────────────────────────────

// عدد: ارقام فارسی (۰-۹ / U+06F0-U+06F9) + ارقام لاتین.
const HEX_RE = /[۰0][xX][0-9a-fA-F۰-۹]+/;
const BIN_RE = /[۰0][bB][01۰۱]+/;
const OCT_RE = /[۰0][oO][0-7۰-۷]+/;
const DEC_RE = /[۰-۹0-9]+(?:[٬,][۰-۹0-9]{3})*(?:[.]|[٫][۰-۹0-9]+)?(?:[eE][+-]?[۰-۹0-9]+)?/;

// شناسه: حروف فارسی (بلوک عربی، بدون نشانه‌های ترکیبی U+064B-U+065F)
// + لاتین + «_» + نیم‌فاصلهٔ U+200C (پس از حرف نخست).
const IDENT_RE = /[\u0621-\u064A\u0670-\u06FFA-Za-z_][\u0621-\u064A\u0670-\u06FFA-Za-z0-9_\u200C]*/;

// ─── حالت توکن‌ایزر ──────────────────────────────────────────────────────────

function startState() {
  return {
    inBlockComment: false,
    // پس از «تعریف» انتظار نام تابع داریم؛ پس از «گونه/رابط/وارث» انتظار نام نوع.
    expectFunc: false,
    expectType: false
  };
}

function clearPending(state) {
  state.expectFunc = false;
  state.expectType = false;
}

function token(stream, state) {
  // نظر بلوکی: «// ... //» (در یک خط؛ اگر بسته نشود تا پایان خط ادامه دارد)
  if (state.inBlockComment) {
    if (stream.match("//") || stream.eol()) state.inBlockComment = false;
    else stream.next();
    return "comment";
  }

  // نظر خطی: «/»
  if (stream.match("//")) {
    state.inBlockComment = true;
    return "comment";
  }
  if (stream.match("/")) {
    stream.skipToEnd();
    return "comment";
  }

  // رشتهٔ گیومه‌ای: « ... » (تک‌خطی؛ اگر بسته نشود تا پایان خط مصرف می‌شود)
  if (stream.match("«")) {
    const close = stream.string.indexOf("»", stream.pos);
    stream.pos = close === -1 ? stream.string.length : close + 1;
    clearPending(state);
    return "string";
  }

  // عدد
  if (stream.match(HEX_RE) || stream.match(BIN_RE) || stream.match(OCT_RE) || stream.match(DEC_RE)) {
    clearPending(state);
    return "number";
  }

  // عملگر (بلندترین‌ها اول)
  for (const op of OPERATORS) {
    if (stream.match(op)) {
      clearPending(state);
      return "operator";
    }
  }

  // نشانه‌گذاری
  if (stream.match(new RegExp("[" + PUNCTUATION + "]"))) {
    clearPending(state);
    return "punctuation";
  }

  // شناسه و واژه‌ها
  if (stream.match(IDENT_RE)) {
    const word = stream.current();
    const isCall = /^\s*\(/.test(stream.string.slice(stream.pos));

    if (state.expectType) {
      clearPending(state);
      return "typeName";
    }
    if (state.expectFunc && isCall) {
      clearPending(state);
      return "definition";
    }
    clearPending(state);

    if (KEYWORD_SET.has(word)) {
      // «تعریف» نام بعدی (همراه با «(») را تابع تعریف‌شده می‌کند؛
      // «گونه/رابط/وارث» نام بعدی را نام نوع.
      if (word === "تعریف") state.expectFunc = true;
      else if (word === "گونه" || word === "رابط" || word === "وارث") state.expectType = true;
      return "keyword";
    }
    if (EXCEPTION_SET.has(word)) return "exception";
    if (MODULE_SET.has(word)) return "namespace";
    if (VERB_SET.has(word)) return "builtin";
    if (BUILTIN_SET.has(word)) return "builtin";
    if (LITERAL_SET.has(word)) {
      return word === LITERALS.true || word === LITERALS.false ? "bool" : "null";
    }
    if (TYPE_SET.has(word)) return "typeName";
    if (SELF_SUPER_SET.has(word)) return "self";

    // شناسهٔ ساده — اگر بلافاصله «(» بیاید، فراخوانی تابع کاربر است.
    return isCall ? "function" : "variable";
  }

  // هر کاراکتر دیگری
  stream.next();
  return null;
}

// نگاشت نام توکن به برچسب سبک CodeMirror
const tokenTable = {
  keyword: "keyword",
  definition: "definition",
  builtin: "standard",
  typeName: "typeName",
  namespace: "namespace",
  exception: "invalid",
  bool: "bool",
  null: "null",
  self: "self",
  function: "function",
  variable: "variableName",
  string: "string",
  number: "number",
  comment: "comment",
  operator: "operator",
  punctuation: "punctuation"
};

/** تعریف StreamLanguage برای زبان کلنگ */
export const kolangSyntax = StreamLanguage.define({
  name: "kolang",
  startState,
  token,
  tokenTable
});

/** پشتیبانی زبان (LanguageSupport) برای استفاده در CodeMirror 6 */
export const kolangLanguageSupport = new LanguageSupport(kolangSyntax);

/** قرارداد مصرف‌کنندگان (kolang-web): تابع kolang() یک LanguageSupport برمی‌گرداند. */
export function kolang() {
  return kolangLanguageSupport;
}

export default kolangLanguageSupport;
`;

const cmSource = [
  CM_HEADER,
  "",
  `const CONTROL = ${fmtArr(control)};`,
  "",
  `const DECLARATION = ${fmtArr(declaration)};`,
  "",
  `const COPULA = ${fmtArr(copula)};`,
  "",
  `const LOGICAL = ${fmtArr(logical)};`,
  "",
  `const SCOPE = ${fmtArr(scope)};`,
  "",
  `const OTHER = ${fmtArr(other)};`,
  "",
  `const CONCURRENCY = ${fmtArr(concurrency)};`,
  "",
  `const VERBS = ${fmtArr(verbs)};`,
  "",
  `const BUILTINS = ${fmtArr(grammar.builtins)};`,
  "",
  `const TYPES = ${fmtArr(grammar.types)};`,
  "",
  `const LITERALS = { true: ${JSON.stringify(literals.true)}, false: ${JSON.stringify(literals.false)}, none: ${JSON.stringify(literals.none)} };`,
  "",
  `const EXCEPTIONS = ${fmtArr(grammar.exceptions)};`,
  "",
  `const MODULES = ${fmtArr(grammar.modules)};`,
  "",
  `const SELF_SUPER = ${fmtArr(selfSuper)};`,
  "",
  "// عملگرها — بلندترین‌ها اول تا «طولانی‌ترین تطبیق» درست کار کند.",
  '// "\\u0650" همان کسرهٔ اضافه است (نشانهٔ دسترسی به عضو).',
  `const OPERATORS = ${fmtArr(sortedOperators)};`,
  "",
  `const PUNCTUATION = "${punctClassCM.replace(/\\/g, "\\\\")}";`,
  "",
  CM_TOKENIZER
].join("\n");

fs.writeFileSync(CM_PATH, cmSource + "\n");

// ─── ۲) خروجی TextMate ───────────────────────────────────────────────────────

// قواعد ساختاری ثابت (نظر، رشته، عدد، کسرهٔ اضافه، معرفی نوع/تابع، …)
const tmStatic = {
  "comment-block": {
    _comment: "Block comment: // ... // (must precede line comment rule)",
    name: "comment.block.kolang",
    begin: "//",
    end: "//|\\n",
    beginCaptures: { "0": { name: "punctuation.definition.comment.begin.kolang" } },
    endCaptures: { "0": { name: "punctuation.definition.comment.end.kolang" } }
  },
  "comment-line": {
    name: "comment.line.kolang",
    match: "/.*$"
  },
  string: {
    _comment: "Guillemet string « ... » (single-line; unclosed consumes to EOL)",
    name: "string.quoted.guillemet.kolang",
    begin: "«",
    end: "»|\\n",
    beginCaptures: { "0": { name: "punctuation.definition.string.begin.kolang" } },
    endCaptures: { "0": { name: "punctuation.definition.string.end.kolang" } }
  },
  number: {
    _comment: "Persian ۰-۹ (U+06F0-06F9) + Latin 0-9. Hex/binary/octal then float/int with digit separators.",
    patterns: [
      { name: "constant.numeric.hex.kolang", match: "[۰0][xX][0-9a-fA-F۰-۹]+" },
      { name: "constant.numeric.binary.kolang", match: "[۰0][bB][01۰۱]+" },
      { name: "constant.numeric.octal.kolang", match: "[۰0][oO][0-7۰-۷]+" },
      {
        name: "constant.numeric.decimal.kolang",
        match: "[۰-۹0-9]+(?:[٬,][۰-۹0-9]{3})*(?:[\\.]|[٫][۰-۹0-9]+)?(?:[eE][+-]?[۰-۹0-9]+)?"
      }
    ]
  },
  ezafe: {
    _comment: "Ezafe kasra U+0650 — member-access operator. Matched before identifiers so it is never absorbed.",
    name: "keyword.operator.ezafe.kolang",
    match: "\\u0650"
  },
  "type-introduction": {
    _comment: "After گونه/رابط/وارث the next identifier is a type/class name. Captures the keyword + name as one construct (best-effort approximation of expectType lookahead).",
    match: String.raw`(?<![\u0621-\u064A\u0670-\u06FFA-Za-z0-9_\u200C])(گونه|رابط|وارث)\s+([\u0621-\u064A\u0670-\u06FFA-Za-z_][\u0621-\u064A\u0670-\u06FFA-Za-z0-9_\u200C]*)`,
    captures: {
      "1": { name: "keyword.declaration.kolang" },
      "2": { name: "entity.name.type.kolang" }
    }
  },
  "definition-introduction": {
    _comment: "تعریف name( → function definition. Captures keyword + function name.",
    match: String.raw`(?<![\u0621-\u064A\u0670-\u06FFA-Za-z0-9_\u200C])(تعریف)\s+([\u0621-\u064A\u0670-\u06FFA-Za-z_][\u0621-\u064A\u0670-\u06FFA-Za-z0-9_\u200C]*)\s*(?=\()`,
    captures: {
      "1": { name: "keyword.declaration.kolang" },
      "2": { name: "entity.name.function.kolang" }
    }
  },
  "function-call": {
    _comment: "Plain identifier immediately followed by '(' → user function call. Comes after all classified keywords/builtins so those win.",
    match: String.raw`(?<![\u0621-\u064A\u0670-\u06FFA-Za-z0-9_\u200C])([\u0621-\u064A\u0670-\u06FFA-Za-z_][\u0621-\u064A\u0670-\u06FFA-Za-z0-9_\u200C]*)(?=\s*\()`,
    captures: { "1": { name: "entity.name.function.call.kolang" } }
  },
  identifier: {
    _comment: "Plain identifier — Persian letters (Arabic block, excluding combining diacritics 0x064B-0x065F) + Latin + '_' + ZWNJ U+200C (after first char).",
    name: "variable.other.kolang",
    match: "[\\u0621-\\u064A\\u0670-\\u06FFA-Za-z_][\\u0621-\\u064A\\u0670-\\u06FFA-Za-z0-9_\\u200C]*"
  }
};

// قواعد داده‌محور (از keywords.json / kolang.grammar.json)
const tmData = {
  operators: {
    _comment: "Longest-match-first ordering derived from kolang.grammar.json operators.",
    name: "keyword.operator.kolang",
    match: sortedOperators.map(regexEscape).join("|")
  },
  punctuation: {
    name: "punctuation.kolang",
    match: punctClassTM
  },
  "control-keyword": { name: "keyword.control.kolang", match: kwRegex(control) },
  "declaration-keyword": {
    _comment: "پوشش در قاعدهٔ جداگانهٔ decorator-keyword می‌آید.",
    name: "keyword.declaration.kolang",
    match: kwRegex(declaration.filter((w) => w !== "پوشش"))
  },
  "copula-keyword": { name: "keyword.other.copula.kolang", match: kwRegex(copula) },
  "logical-keyword": { name: "keyword.operator.logical.kolang", match: kwRegex(logical) },
  "other-keyword": { name: "keyword.other.kolang", match: kwRegex(other) },
  "scope-keyword": {
    _comment: "واژه‌های دامنه (جهانی، نامحلی) — از keywords.json.",
    name: "keyword.other.scope.kolang",
    match: kwRegex(scope)
  },
  "concurrency-keyword": {
    _comment: "واژه‌های همروندی (برو، ببند، بسته‌است، کانال، …) — از keywords.json.",
    name: "keyword.control.kolang",
    match: kwRegex(concurrency)
  },
  "exception-class": { name: "support.class.exception.kolang", match: kwRegex(grammar.exceptions) },
  "builtin-function": { name: "support.function.builtin.kolang", match: kwRegex(verbs) },
  "builtin-type": { name: "support.type.builtin.kolang", match: kwRegex(grammar.builtins) },
  "module-name": { name: "entity.name.namespace.kolang", match: kwRegex(grammar.modules) },
  "boolean-literal": {
    name: "constant.language.boolean.kolang",
    match: kwRegex([literals.true, literals.false])
  },
  "null-literal": { name: "constant.language.null.kolang", match: kwRegex([literals.none]) },
  "self-super": { name: "variable.language.this.kolang", match: kwRegex(selfSuper) },
  "decorator-keyword": {
    name: "meta.decorator.kolang",
    match: kwRegex(declaration.filter((w) => w === "پوشش"))
  }
};

const repository = { ...tmStatic, ...tmData };

const expressionPatterns = [
  { include: "#comment-block" },
  { include: "#comment-line" },
  { include: "#string" },
  { include: "#number" },
  { include: "#ezafe" },
  { include: "#definition-introduction" },
  { include: "#type-introduction" },
  { include: "#control-keyword" },
  { include: "#declaration-keyword" },
  { include: "#copula-keyword" },
  { include: "#logical-keyword" },
  { include: "#other-keyword" },
  { include: "#scope-keyword" },
  { include: "#concurrency-keyword" },
  { include: "#exception-class" },
  { include: "#builtin-function" },
  { include: "#builtin-type" },
  { include: "#module-name" },
  { include: "#boolean-literal" },
  { include: "#null-literal" },
  { include: "#self-super" },
  { include: "#decorator-keyword" },
  { include: "#operators" },
  { include: "#function-call" },
  { include: "#identifier" },
  { include: "#punctuation" }
];

const tm = {
  $schema: "https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json",
  _comment: "GENERATED — do not edit by hand. Run: node scripts/generate.js",
  _commentFa: "خروجی خودکار از kolang.grammar.json + keywords.json — دستی ویرایش نکنید؛ با «node scripts/generate.js» بازتولید شود.",
  name: "Kolang",
  scopeName: "source.kolang",
  patterns: [{ include: "#expression" }],
  repository: { ...repository, expression: { patterns: expressionPatterns } }
};

fs.writeFileSync(TM_PATH, JSON.stringify(tm, null, 2).replace(/\u0650/g, "\\u0650") + "\n");

// ─── ۳) نوشتن kolang.grammar.json ────────────────────────────────────────────

fs.writeFileSync(GRAMMAR_PATH, JSON.stringify(grammar, null, 2).replace(/\u0650/g, "\\u0650") + "\n");

// ─── گزارش ───────────────────────────────────────────────────────────────────

console.log("\nخلاصه:");
console.log(`  واژه‌های کلیدی (از keywords.json): ${Object.keys(keywords).length}`);
console.log(`  verbs: ${verbs.length} | concurrency: ${concurrency.length} | builtins: ${grammar.builtins.length} | types: ${grammar.types.length}`);
console.log(`  exceptions: ${grammar.exceptions.length} | modules: ${grammar.modules.length} | operators: ${grammar.operators.length} | punctuation: ${grammar.punctuation.length}`);
console.log(`  نوشته شد: kolang.grammar.json`);
console.log(`  نوشته شد: ${path.relative(ROOT, CM_PATH)}`);
console.log(`  نوشته شد: ${path.relative(ROOT, TM_PATH)}`);
console.log("\nپایان. برای همگام‌سازی با VS Code: npm run sync:vscode");