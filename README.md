# گرامر زبان کلنگ

**منبع حقیقت گرامر برجسته‌سازی نحو زبان کلنگ** — نسخهٔ ۰٫۰٫۱ — مجوز MIT

این مخزن، تنها مرجع رسمی برای توکن‌ها و قواعد رنگ‌آمیزی زبان کلنگ است. همهٔ مخازن مصرف‌کننده (ویرایشگرها، وب، موبایل) گرامر را از همین‌جا دریافت می‌کنند و در هیچ‌کدام، گرامر مستقیم ویرایش نمی‌شود.

## این مخزن چیست؟

- `kolang.grammar.json` — گرامر کانونیکال: توصیف تک‌جایی همهٔ کلیدواژه‌ها، دستورها (فعل‌های امری)، توابع و نوع‌های داخلی، عملگرها، نشانه‌گذاری و قواعد نظر و رشته.
- دو خروجی فرمتی که از روی منبع حقیقت ساخته می‌شوند:
  - `textmate/kolang.tmLanguage.json` — قالب **TextMate** برای **VS Code** (`kolang-vscode`).
  - `codemirror/kolang-syntax.js` — قالب **CodeMirror StreamLanguage** برای **وب و موبایل** (`kolang-web`، `kolang-mobile`).

## ساختار کانونیکال

| دسته | توضیح | تعداد |
|---|---|---|
| `keywords.control` | کلیدواژه‌های کنترلی (اگر، وگرنه، تاوقتی، …) | ۱۲ |
| `keywords.declaration` | کلیدواژه‌های اعلان (تعریف، گونه، رابط، …) | ۶ |
| `keywords.copula` | افعال ربطی (باشد، نباشد) | ۲ |
| `keywords.logical` | عملگرهای منطقی (همچنین، یا) | ۲ |
| `keywords.scope` | کلیدواژه‌های قلمرو (جهانی، نامحلی) | ۲ |
| `keywords.other` | سایر کلیدواژه‌ها (بانام، به، و، …) | ۶ |
| `verbs` | فعل‌های امری (بنویس، برگردان، بیافزا، …) | ۱۵ |
| `builtins` | توابع و نوع‌های داخلی (طول، جمع، اجرا، …) | ۳۰ |
| `types` | نوع‌های داده (صحیح، متن، فهرست، …) | ۱۱ |
| `literals` | مقادیر ثابت (درست، غلط، تهی) | ۳ |
| `exceptions` | کلاس‌های خطا (خطای‌صفر، خطای‌مقدار، …) | ۸ |
| `modules` | نام ماژول‌ها (ریاضی، زمان، جیسون، …) | ۱۷ |
| `selfSuper` | «خود» و «والد» | ۲ |
| `operators` | عملگرها (بلندترین‌ها اول) | ۲۷ |
| `punctuation` | نشانه‌گذاری | ۱۱ |

## نحوهٔ استفاده (مصرف‌کننده‌ها)

هر مصرف‌کننده فقط قالب مربوط به خودش را کپی یا symlink می‌کند:

- **kolang-vscode**: `textmate/kolang.tmLanguage.json` ← `syntaxes/kolang.tmLanguage.json`
- **kolang-web** / **kolang-mobile**: `codemirror/kolang-syntax.js` ← `src/kolang-syntax.js`

خروجی‌ها را **دست‌کاری نکنید**؛ در منبع حقیقت تغییر دهید و دوباره همگام کنید.

## اسکریپت‌های همگام‌سازی

```bash
npm run sync:vscode   # یا: bash scripts/sync-vscode.sh
npm run sync:web      # یا: bash scripts/sync-web.sh
```

هر اسکریپت یک مسیر مقصد دلخواه هم می‌پذیرد:

```bash
bash scripts/sync-vscode.sh /مسیر/دلخواه/kolang.tmLanguage.json
bash scripts/sync-web.sh    /مسیر/دلخواه/kolang-syntax.js
```

## افزودن کلیدواژه یا دستور جدید

1. `kolang.grammar.json` را ویرایش کنید و واژه را به دستهٔ درست اضافه کنید.
   - واژه‌های ترکیبی را با **نیم‌فاصلهٔ دقیق** (`U+200C`) بنویسید — مثل `خطای‌صفر`، `بسته‌است`.
2. خروجی‌های فرمتی را از منبع بازتولید کنید (این مخزن فعلاً دو خروجی دست‌ساز دارد که از روی کانونیکال نگهداری می‌شوند؛ در نسخه‌های بعدی تولید خودکار خواهند شد).
3. همگام‌سازی کنید:
   ```bash
   npm run sync:vscode
   npm run sync:web
   ```
4. صحت خروجی‌ها را بررسی کنید (JSON معتبر / JS بدون خطای syntax) و سپس commit کنید.

## همگام‌سازی معکوس ممنوع

هرگز در `kolang-vscode` یا `kolang-web` گرامر را مستقیم ویرایش نکنید — همهٔ تغییرها باید از این مخزن انجام و سپس همگام شود.

---

## English (summary)

**Kolang Grammar** is the canonical source of truth for the Kolang highlighting grammar (v0.0.1, MIT, © 2026 FaraliDev and contributors).

- `kolang.grammar.json` — canonical token grammar (keywords, verbs, builtins, types, literals, exceptions, modules, operators, punctuation, comment/string rules).
- Two generated outputs: `textmate/kolang.tmLanguage.json` (for **VS Code**) and `codemirror/kolang-syntax.js` (**CodeMirror StreamLanguage** for web/mobile).
- Consumers copy/symlink only their own format; never edit grammars in consumer repos.
- Sync scripts: `npm run sync:vscode` and `npm run sync:web`.
- To add a keyword: edit `kolang.grammar.json`, keep exact Persian (ZWNJ) forms, regenerate format files, run sync scripts.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution guide.