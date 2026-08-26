# گرامر زبان کلنگ

**منبع حقیقت گرامر برجسته‌سازی نحو زبان کلنگ** — نسخهٔ ۰٫۰٫۱ — مجوز MIT

این مخزن، تنها مرجع رسمی برای توکن‌ها و قواعد رنگ‌آمیزی زبان کلنگ است. همهٔ مخازن مصرف‌کننده (ویرایشگرها، وب، موبایل) گرامر را از همین‌جا دریافت می‌کنند و در هیچ‌کدام، گرامر مستقیم ویرایش نمی‌شود.

## این مخزن چیست؟

- `kolang.grammar.json` — گرامر کانونیکال: توصیف تک‌جایی دستورها، توابع و نوع‌های داخلی، عملگرها، نشانه‌گذاری و قواعد نظر و رشته، به‌همراه آینهٔ واژه‌های کلیدی.
- `scripts/generate.js` — مولد خودکار: خروجی‌های فرمتی را از روی منبع حقیقت تولید می‌کند.
- دو خروجی فرمتی که **به‌صورت خودکار** از روی منبع حقیقت ساخته می‌شوند:
  - `textmate/kolang.tmLanguage.json` — قالب **TextMate** برای **VS Code** (`kolang-vscode`).
  - `codemirror/kolang-syntax.js` — قالب **CodeMirror StreamLanguage** برای **وب و موبایل** (`kolang-web`، `kolang-mobile`).

## جریان تولید خودکار

```text
 kolang/ (مفسر)                        kolang-grammar/
 ─────────────────────                 ──────────────────────────────
 internal/token/token.go               kolang.grammar.json
        │  (go generate)                       │  (غیرکلیدواژه‌ها)
        ▼                                      ▼
 keywords.json ────────► scripts/generate.js ◄────────┘
                                │
                        ┌───────┴────────┐
                        ▼                ▼
           textmate/kolang.tmLanguage.json   codemirror/kolang-syntax.js
                        │                │
                        ▼                ▼
                 kolang-vscode      kolang-web / kolang-mobile
```

- **واژه‌های کلیدی** (`keywords.*`، `verbs`، `literals`، `selfSuper`) از `keywords.json` می‌آیند — خروجی مخزن همسایهٔ **مفسر کلنگ** (تولیدشده از `internal/token/token.go`). در `kolang.grammar.json` فقط آینه می‌شوند و دستی ویرایش نمی‌شوند؛ هر واژه‌ای که مفسر نشناسد «درِفت» است و مولد آن را حذف می‌کند.
- **سایر توکن‌ها** (`builtins`، `types`، `modules`، `exceptions`، `operators`، `punctuation`، `comments`) در خودِ `kolang.grammar.json` نگهداری می‌شوند — این‌ها تابع‌های زمان اجرا و نام نوع/ماژول هستند، نه کلیدواژهٔ lexer.
- اجرا: `npm run generate` (یا `node scripts/generate.js`).
- پیش‌فرض، `keywords.json` از مسیر همسایهٔ `../kolang/keywords.json` خوانده می‌شود؛ در CI هم باید مخزن مفسر کنار این مخزن checkout شود. مسیر دیگر با متغیر محیطی `KOLANG_KEYWORDS_JSON` قابل تعیین است.
- مولد **قطعی** است؛ اجرای دوباره خروجی یکسان می‌دهد.

## ساختار کانونیکال

| دسته | توضیح | تعداد |
|---|---|---|
| `keywords.control` | کلیدواژه‌های کنترلی (اگر، وگرنه، تاوقتی، …) | ۱۲ |
| `keywords.declaration` | کلیدواژه‌های اعلان (تعریف، گونه، رابط، …) | ۶ |
| `keywords.copula` | افعال ربطی (است، باشد، نباشد) | ۳ |
| `keywords.logical` | عملگرهای منطقی (همچنین، یا) | ۲ |
| `keywords.scope` | کلیدواژه‌های قلمرو (جهانی، نامحلی) | ۲ |
| `keywords.other` | سایر کلیدواژه‌ها (بانام، به، و، …) | ۵ |
| `keywords.concurrency` | واژه‌های همروندی (برو، ببند، بسته‌است، کانال، …) | ۵ |
| `verbs` | فعل‌های امری (بنویس، برگردان، بیافزا، …) | ۱۲ |
| `builtins` | توابع و نوع‌های داخلی (طول، جمع، اجرا، …) | ۳۰ |
| `types` | نوع‌های داده (صحیح، متن، فهرست، هر، …) | ۱۱ |
| `literals` | مقادیر ثابت (درست، غلط، تهی) | ۳ |
| `exceptions` | کلاس‌های خطا (خطای‌صفر، خطای‌مقدار، …) | ۸ |
| `modules` | نام ماژول‌ها (ریاضی، زمان، جیسون، …) | ۱۷ |
| `selfSuper` | «خود» و «والد» | ۲ |
| `operators` | عملگرها (بلندترین‌ها اول) | ۲۷ |
| `punctuation` | نشانه‌گذاری | ۱۱ |

دسته‌های `keywords.*`، `verbs`، `literals` و `selfSuper` از `keywords.json` (مفسر) می‌آیند؛ بقیه از خودِ `kolang.grammar.json`.

## نحوهٔ استفاده (مصرف‌کننده‌ها)

هر مصرف‌کننده فقط قالب مربوط به خودش را کپی یا symlink می‌کند:

- **kolang-vscode**: `textmate/kolang.tmLanguage.json` ← `syntaxes/kolang.tmLanguage.json`
- **kolang-web** / **kolang-mobile**: `codemirror/kolang-syntax.js` ← `src/kolang-syntax.js`

خروجی‌ها را **دست‌کاری نکنید**؛ در منبع حقیقت تغییر دهید و دوباره همگام کنید.

## اسکریپت‌های همگام‌سازی

```bash
npm run sync:vscode   # یا: bash scripts/sync-vscode.sh
```

اسکریپت یک مسیر مقصد دلخواه هم می‌پذیرد:

```bash
bash scripts/sync-vscode.sh /مسیر/دلخواه/kolang.tmLanguage.json
```

> **نکته:** خروجی CodeMirror (`codemirror/kolang-syntax.js`) مستقیماً از طریق وابستگی npm `@kolang/grammar` توسط ویرایشگرهای وب و موبایل مصرف می‌شود و نیازی به اسکریپت همگام‌سازی جداگانه ندارد.

## افزودن کلیدواژه یا دستور جدید

**کلیدواژهٔ جدید** (کنترل، اعلان، copula، همروندی، فعل امری، literal، …):
1. به `internal/token/token.go` در مخزن مفسر کلنگ اضافه کنید (منبع حقیقت lexer).
2. `keywords.json` در آن مخزن بازتولید شود (`go generate`).
3. اینجا: `npm run generate` — مولد، واژه را به آرایه‌های مربوطه می‌افزاید و `kolang.grammar.json` را به‌روز می‌کند.
4. همگام‌سازی و تست.

**توکن غیرکلیدواژه** (builtin، type، module، exception، عملگر، نشانه‌گذاری):
1. `kolang.grammar.json` را ویرایش کنید و توکن را به دستهٔ درست اضافه کنید.
   - واژه‌های ترکیبی را با **نیم‌فاصلهٔ دقیق** (`U+200C`) بنویسید — مثل `خطای‌صفر`، `بسته‌است`.
2. `npm run generate` — خروجی‌ها بازتولید می‌شوند.
3. صحت خروجی‌ها را بررسی کنید (JSON معتبر / JS بدون خطای syntax) و سپس commit کنید.

در هر دو حالت پس از تولید:

```bash
npm run sync:vscode
```

## همگام‌سازی معکوس ممنوع

هرگز در `kolang-vscode` یا `kolang-web` گرامر را مستقیم ویرایش نکنید. واژه‌های کلیدی از مخزن **مفسر کلنگ** (`keywords.json`) می‌آیند و توکن‌های غیرکلیدواژه از `kolang.grammar.json`؛ خروجی‌ها فقط با `node scripts/generate.js` بازتولید می‌شوند و سپس با اسکریپت‌های sync به مصرف‌کننده‌ها می‌رسند.

---

## English (summary)

**Kolang Grammar** is the canonical source of truth for the Kolang highlighting grammar (v0.0.1, MIT, © 2026 FaraliDev and contributors).

- `kolang.grammar.json` — canonical non-keyword grammar (builtins, types, modules, exceptions, operators, punctuation, comment/string rules) plus a mirror of keywords.
- `scripts/generate.js` — deterministic generator. Keywords come from `keywords.json` (the interpreter's lexer output, sibling repo `../kolang/keywords.json`, overridable via `KOLANG_KEYWORDS_JSON`); non-keyword tokens come from `kolang.grammar.json`. Run `npm run generate` (or `npm run prepublishOnly`).
- Two generated outputs: `textmate/kolang.tmLanguage.json` (for **VS Code**) and `codemirror/kolang-syntax.js` (**CodeMirror StreamLanguage** for web/mobile). **Do not edit them by hand.**
- Drift is removed automatically: keywords present in the grammar but absent from `keywords.json` (e.g. `ساخت`, `بخوان`) are dropped and reported.
- Consumers copy/symlink only their own format; VS Code sync: `npm run sync:vscode`. CodeMirror output is consumed directly via the `@kolang/grammar` npm dependency by web/mobile editors (no sync script needed).
- To add a keyword: add it in the interpreter's `internal/token/token.go`; to add a non-keyword token: edit `kolang.grammar.json`. Either way, keep exact Persian (ZWNJ) forms, then run `npm run generate` and the sync scripts.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution guide.