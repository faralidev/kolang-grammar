// ─────────────────────────────────────────────────────────────────────────────
// kolang-theme.js — تم و برجسته‌سازی CodeMirror ۶ برای کلنگ (مشترک)
//
// این فایل تم تیره/روشن (EditorView.theme) و سبک برجسته‌سازی (HighlightStyle)
// را برای ویرایشگر کلنگ تعریف می‌کند. هم kolang-mobile (وب‌‌ویو) و هم kolang-docs
// (محیط آزمایش) از همین تعاریف استفاده می‌کنند تا رنگ‌ها یکسان بمانند.
//
// پالت: Catppuccin Mocha (تیره) و Catppuccin Latte (روشن).
//
// همچنین highlightCss() را صادر می‌کند که قواعد CSS برای توکن‌های استاتیک
// (pre.kolang-code) را بر همین پالت می‌سازد — برای صفحه‌های مستندات که
// ویرایشگر زنده ندارند اما می‌خواهند رنگ‌ها با ویرایشگر یکی باشد.
// ─────────────────────────────────────────────────────────────────────────────

import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

// ─── پوستهٔ تیرهٔ CodeMirror (Catppuccin Mocha) ──────────────────────────────

export const editorTheme = EditorView.theme({
  '&': { height: '100%', backgroundColor: '#1e1e2e', color: '#cdd6f4', direction: 'rtl' },
  '.cm-scroller': {
    overflow: 'auto',
    scrollbarWidth: 'thin',
    scrollbarColor: '#45475a #181825',
    direction: 'rtl',
  },
  '.cm-scroller::-webkit-scrollbar': { width: '8px' },
  '.cm-scroller::-webkit-scrollbar-track': { background: '#181825' },
  '.cm-scroller::-webkit-scrollbar-thumb': { background: '#45475a', borderRadius: '4px' },
  '.cm-content': { caretColor: '#f5e0dc', direction: 'rtl', textAlign: 'right', fontFamily: "'Vazirmatn','Iranian Sans','Sahel',monospace" },
  '.cm-line': { direction: 'rtl', textAlign: 'right' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': { backgroundColor: '#585b7040' },
  '.cm-cursor': { borderLeftColor: '#f5e0dc' },
  '.cm-activeLine': { backgroundColor: '#31324440' },
  '.cm-activeLineGutter': { backgroundColor: '#313244', color: '#cdd6f4' },
  '.cm-gutters': { backgroundColor: '#181825', color: '#585b70', border: 'none', direction: 'rtl' },
  '.cm-matchingBracket': { backgroundColor: '#585b7040', outline: '1px solid #89b4fa80' },
}, { dark: true });

// ─── برجسته‌سازی تیره (Catppuccin Mocha) ─────────────────────────────────────

export const kolangHighlight = HighlightStyle.define([
  { tag: tags.comment, color: '#7f849c', fontStyle: 'italic' },
  { tag: tags.string, color: '#a6e3a1' },
  { tag: tags.number, color: '#fab387' },
  { tag: tags.bool, color: '#fab387', fontWeight: 'bold' },
  { tag: tags.null, color: '#fab387' },
  { tag: tags.controlKeyword, color: '#cba6f7', fontWeight: 'bold' },
  { tag: tags.definitionKeyword, color: '#f9e2af', fontWeight: 'bold' },
  { tag: tags.keyword, color: '#89dceb', fontStyle: 'italic' },
  { tag: tags.operatorKeyword, color: '#f38ba8' },
  { tag: tags.operator, color: '#89b4fa' },
  { tag: tags.standard(tags.function(tags.variableName)), color: '#a6e3a1' },
  { tag: tags.function(tags.variableName), color: '#89b4fa' },
  { tag: tags.typeName, color: '#94e2d5', fontStyle: 'italic' },
  { tag: tags.className, color: '#f38ba8', textDecoration: 'underline' },
  { tag: tags.namespace, color: '#74c7ec', fontStyle: 'italic' },
  { tag: tags.self, color: '#f38ba8', fontStyle: 'italic' },
  { tag: tags.variableName, color: '#cdd6f4' },
  { tag: tags.punctuation, color: '#9399b2' },
  { tag: tags.meta, color: '#f5c2e7' },
]);

// ─── پوستهٔ روشن CodeMirror (Catppuccin Latte) ──────────────────────────────

export const editorThemeLight = EditorView.theme({
  '&': { height: '100%', backgroundColor: '#eff1f5', color: '#4c4f69', direction: 'rtl' },
  '.cm-scroller': {
    overflow: 'auto',
    scrollbarWidth: 'thin',
    scrollbarColor: '#bcc0cc #e6e9ef',
    direction: 'rtl',
  },
  '.cm-scroller::-webkit-scrollbar': { width: '8px' },
  '.cm-scroller::-webkit-scrollbar-track': { background: '#e6e9ef' },
  '.cm-scroller::-webkit-scrollbar-thumb': { background: '#bcc0cc', borderRadius: '4px' },
  '.cm-content': { caretColor: '#dc8a78', direction: 'rtl', textAlign: 'right', fontFamily: "'Vazirmatn','Iranian Sans','Sahel',monospace" },
  '.cm-line': { direction: 'rtl', textAlign: 'right' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': { backgroundColor: '#acb0be80' },
  '.cm-cursor': { borderLeftColor: '#dc8a78' },
  '.cm-activeLine': { backgroundColor: '#bcc0cc40' },
  '.cm-activeLineGutter': { backgroundColor: '#ccd0da', color: '#4c4f69' },
  '.cm-gutters': { backgroundColor: '#e6e9ef', color: '#acb0be', border: 'none', direction: 'rtl' },
  '.cm-matchingBracket': { backgroundColor: '#acb0be40', outline: '1px solid #1e66f580' },
}, { dark: false });

// ─── برجسته‌سازی روشن (Catppuccin Latte) ─────────────────────────────────────

export const kolangHighlightLight = HighlightStyle.define([
  { tag: tags.comment, color: '#7c7f93', fontStyle: 'italic' },
  { tag: tags.string, color: '#40a02b' },
  { tag: tags.number, color: '#fe640b' },
  { tag: tags.bool, color: '#fe640b', fontWeight: 'bold' },
  { tag: tags.null, color: '#fe640b' },
  { tag: tags.controlKeyword, color: '#8839ef', fontWeight: 'bold' },
  { tag: tags.definitionKeyword, color: '#df8e1d', fontWeight: 'bold' },
  { tag: tags.keyword, color: '#04a5e5', fontStyle: 'italic' },
  { tag: tags.operatorKeyword, color: '#d20f39' },
  { tag: tags.operator, color: '#1e66f5' },
  { tag: tags.standard(tags.function(tags.variableName)), color: '#40a02b' },
  { tag: tags.function(tags.variableName), color: '#1e66f5' },
  { tag: tags.typeName, color: '#179299', fontStyle: 'italic' },
  { tag: tags.className, color: '#d20f39', textDecoration: 'underline' },
  { tag: tags.namespace, color: '#04a5e5', fontStyle: 'italic' },
  { tag: tags.self, color: '#d20f39', fontStyle: 'italic' },
  { tag: tags.variableName, color: '#4c4f69' },
  { tag: tags.punctuation, color: '#7c7f93' },
  { tag: tags.meta, color: '#ea76cb' },
]);

// ─── افزونه‌های آماده (dark + light) ─────────────────────────────────────────
// راحت‌ترین راه برای مصرف‌کننده: syntaxHighlighting(kolangHighlight)

export const kolangHighlightExtension = syntaxHighlighting(kolangHighlight);
export const kolangHighlightExtensionLight = syntaxHighlighting(kolangHighlightLight);

// ─── CSS برای توکن‌های استاتیک (pre.kolang-code در مستندات) ──────────────────
// این قواعد را در docs.css اضافه کنید تا بلوک‌های کد استاتیک همان رنگ
// ویرایشگر زنده را داشته باشند. نام کلاس‌ها با خروجی highlightTree همخوان است.

export function highlightCss() {
  return `
/* ── Kolang syntax highlighting — dark (Catppuccin Mocha) ── */
.kolang-code .tok-comment        { color: #7f849c; font-style: italic; }
.kolang-code .tok-string         { color: #a6e3a1; }
.kolang-code .tok-number         { color: #fab387; }
.kolang-code .tok-bool           { color: #fab387; font-weight: bold; }
.kolang-code .tok-null           { color: #fab387; }
.kolang-code .tok-controlKeyword { color: #cba6f7; font-weight: bold; }
.kolang-code .tok-definitionKeyword { color: #f9e2af; font-weight: bold; }
.kolang-code .tok-keyword        { color: #89dceb; font-style: italic; }
.kolang-code .tok-operatorKeyword { color: #f38ba8; }
.kolang-code .tok-operator       { color: #89b4fa; }
.kolang-code .tok-variableName.standard.function { color: #a6e3a1; }
.kolang-code .tok-variableName.function { color: #89b4fa; }
.kolang-code .tok-typeName       { color: #94e2d5; font-style: italic; }
.kolang-code .tok-className      { color: #f38ba8; text-decoration: underline; }
.kolang-code .tok-namespace      { color: #74c7ec; font-style: italic; }
.kolang-code .tok-self           { color: #f38ba8; font-style: italic; }
.kolang-code .tok-variableName   { color: #cdd6f4; }
.kolang-code .tok-punctuation    { color: #9399b2; }
.kolang-code .tok-meta           { color: #f5c2e7; }

/* ── Kolang syntax highlighting — light (Catppuccin Latte) ── */
html[data-theme="light"] .kolang-code .tok-comment        { color: #7c7f93; font-style: italic; }
html[data-theme="light"] .kolang-code .tok-string         { color: #40a02b; }
html[data-theme="light"] .kolang-code .tok-number         { color: #fe640b; }
html[data-theme="light"] .kolang-code .tok-bool           { color: #fe640b; font-weight: bold; }
html[data-theme="light"] .kolang-code .tok-null           { color: #fe640b; }
html[data-theme="light"] .kolang-code .tok-controlKeyword { color: #8839ef; font-weight: bold; }
html[data-theme="light"] .kolang-code .tok-definitionKeyword { color: #df8e1d; font-weight: bold; }
html[data-theme="light"] .kolang-code .tok-keyword        { color: #04a5e5; font-style: italic; }
html[data-theme="light"] .kolang-code .tok-operatorKeyword { color: #d20f39; }
html[data-theme="light"] .kolang-code .tok-operator       { color: #1e66f5; }
html[data-theme="light"] .kolang-code .tok-variableName.standard.function { color: #40a02b; }
html[data-theme="light"] .kolang-code .tok-variableName.function { color: #1e66f5; }
html[data-theme="light"] .kolang-code .tok-typeName       { color: #179299; font-style: italic; }
html[data-theme="light"] .kolang-code .tok-className      { color: #d20f39; text-decoration: underline; }
html[data-theme="light"] .kolang-code .tok-namespace      { color: #04a5e5; font-style: italic; }
html[data-theme="light"] .kolang-code .tok-self           { color: #d20f39; font-style: italic; }
html[data-theme="light"] .kolang-code .tok-variableName   { color: #4c4f69; }
html[data-theme="light"] .kolang-code .tok-punctuation    { color: #7c7f93; }
html[data-theme="light"] .kolang-code .tok-meta           { color: #ea76cb; }
`;
}
