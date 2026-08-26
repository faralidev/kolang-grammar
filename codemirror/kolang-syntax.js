// ─────────────────────────────────────────────────────────────────────────────
// kolang-syntax.js — خروجی فرمت CodeMirror از گرامر کلنگ
//
// ⚠️ GENERATED — این فایل به‌صورت خودکار تولید می‌شود؛ دستی ویرایش نکنید.
//    GENERATED from kolang.grammar.json + keywords.json — do not edit by hand.
//    Run: node scripts/generate.js
//
// منابع داده:
//   - واژه‌های کلیدی: «../kolang/keywords.json» (تولیدشده از internal/token/token.go)
//   - سایر توکن‌ها (builtins/types/modules/exceptions/operators/…): «kolang.grammar.json»
//
// مصرف‌کنندگان: kolang-web و kolang-mobile. این فایل فقط توکن‌ایزر / رنگ‌آمیزی را
// شامل می‌شود؛ ورودی‌های مخصوص ویرایشگر (مانند جفت‌کردن خودکار گیومه‌های «» یا
// میان‌برهای صفحه‌کلید) به مخزن ویرایشگر تعلق دارند و عمداً اینجا قرار ندارند.
// ─────────────────────────────────────────────────────────────────────────────

import { StreamLanguage, LanguageSupport } from "@codemirror/language";

// ─── واژه‌ها (کلیدی از keywords.json؛ سایرین از kolang.grammar.json) ────────

const CONTROL = [
  "اتمام", "از", "اگر", "برای",
  "بروبعدی", "بپا", "تا", "تاوقتی",
  "در", "درنهایت", "وگرنه", "گام"
];

const DECLARATION = [
  "تعریف", "رابط", "رهی", "وارث",
  "پوشش", "گونه"
];

const COPULA = [
  "است", "باشد", "نباشد"
];

const LOGICAL = [
  "همچنین", "یا"
];

const SCOPE = [
  "جهانی", "نامحلی"
];

const OTHER = [
  "با", "بانام", "به", "مثل",
  "و"
];

const CONCURRENCY = [
  "ببند", "برو", "بستهاست", "بسته‌است",
  "کانال"
];

const VERBS = [
  "بده", "برگردان", "بساز", "بسازاز",
  "بساز‌از", "بنویس", "بگیر", "بیار",
  "بیافزا", "تأخیری", "حذفکن", "حذف‌کن"
];

const BUILTINS = [
  "طول", "نوع", "بازه", "جمع",
  "کمینه", "بیشینه", "مرتب", "مطلق",
  "گرد", "معکوس", "شمارش", "بقچه",
  "نگاشت", "پالایش", "ویژگی", "دارد",
  "تنظیم‌ویژگی", "هویت", "اجرا", "خطا",
  "کانال", "صحیح", "اعشاری", "متن",
  "بولی", "فهرست", "گنجه", "قفسه",
  "مجموعه", "بازکردن"
];

const TYPES = [
  "صحیح", "اعشاری", "متن", "بولی",
  "فهرست", "گنجه", "قفسه", "مجموعه",
  "تهی", "هر", "خطا"
];

const LITERALS = { true: "درست", false: "غلط", none: "تهی" };

const EXCEPTIONS = [
  "خطای‌صفر", "خطای‌مقدار", "خطای‌نوع", "خطای‌کلید",
  "خطای‌نمایه", "خطای‌فایل", "توقف‌تکرار", "خطا"
];

const MODULES = [
  "ریاضی", "تصادفی", "زمان", "تقویم",
  "سیستم", "مسیر", "سیستم‌عامل", "رشته‌ها",
  "عبارت‌منظم", "رجکس", "جیسون", "اینترنت",
  "درخواست", "مجموعه‌داده", "تابع‌ابزار", "عملکرد",
  "پایگاه‌داده"
];

const SELF_SUPER = [
  "خود", "والد"
];

// عملگرها — بلندترین‌ها اول تا «طولانی‌ترین تطبیق» درست کار کند.
// "\u0650" همان کسرهٔ اضافه است (نشانهٔ دسترسی به عضو).
const OPERATORS = [
  "÷/=", "**=", "÷/", "==",
  "<=", ">=", "<<", ">>",
  "|>", "->", "+=", "-=",
  "×=", "÷=", "*=", "%=",
  "**", "+", "-", "×",
  "*", "÷", "%", "<",
  ">", "\u0650", "="
];

const PUNCTUATION = ":[\\](){}«»،؛";


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

