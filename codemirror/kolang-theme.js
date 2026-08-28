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
  '&': {
    height: '100%', // editor fills its container so .cm-scroller can scroll
    backgroundColor: '#1e1e2e',
    color: '#cdd6f4',
    direction: 'ltr', // keep layout/scrollbar sane
  },
  '.cm-scroller': {
    overflow: 'auto',
    scrollbarWidth: 'thin', // Firefox
    scrollbarColor: '#45475a #181825', // Firefox
  },
  '.cm-scroller::-webkit-scrollbar': { width: '10px', height: '10px' },
  '.cm-scroller::-webkit-scrollbar-track': { background: '#181825' },
  '.cm-scroller::-webkit-scrollbar-thumb': { background: '#45475a', borderRadius: '5px' },
  '.cm-scroller::-webkit-scrollbar-thumb:hover': { background: '#585b70' },
  '.cm-content': {
    caretColor: '#f5e0dc',
    direction: 'rtl',
    textAlign: 'right',
    fontFamily: "'Vazirmatn', 'Iranian Sans', 'Sahel', monospace",
  },
  '.cm-line': {
    direction: 'rtl',
  },
  '.cm-cursor, .cm-dropCursor': { borderLeftColor: '#f5e0dc' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': {
    backgroundColor: '#585b7080',
  },
  '.cm-gutters': {
    backgroundColor: '#181825',
    color: '#7f849c',
    border: 'none',
    // Gutter sits on the RIGHT for RTL: it is a flex child of .cm-scroller
    // (which is display:flex, row), so `order` moves it after the content.
    order: 2,
    // The gutter is position:sticky (set by CM6). Override the default
    // sticky `insetInlineStart: 0` so it pins to the right edge instead.
    right: 0,
    left: 'auto',
    // Separator between code (left) and line numbers (right).
    borderLeft: '1px solid #313244',
  },
  // Autocomplete tooltip: dark surface + RTL text for the Persian popup.
  '& .cm-tooltip': {
    backgroundColor: '#313244',
    border: '1px solid #45475a',
    borderRadius: '6px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
    fontFamily: "'Vazirmatn', 'Iranian Sans', monospace",
    fontSize: '13px',
  },
  '& .cm-tooltip-autocomplete': {
    direction: 'rtl',
    textAlign: 'right',
    '& > ul > li': {
      padding: '4px 10px',
      display: 'flex',
      alignItems: 'baseline',
      gap: '10px', // space between label and detail
    },
    '& > ul > li[aria-selected]': {
      backgroundColor: '#45475a',
      color: '#cdd6f4',
    },
    // Label (the completion name)
    '& .cm-completionLabel': {
      color: '#cdd6f4',
      fontWeight: '500',
      fontFamily: "'Vazirmatn', monospace",
    },
    // Detail (the Persian description) — muted, separated, truncated so long
    // doc descriptions don't blow up the popup width.
    '& .cm-completionDetail': {
      color: '#7f849c',
      fontSize: '12px',
      fontStyle: 'italic',
      paddingRight: '6px',
      borderRight: '1px solid #45475a', // visual separator
      marginRight: '2px',
      maxWidth: '24em',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    // Completion icon
    '& .cm-completionIcon': {
      color: '#cba6f7',
      marginRight: '4px',
    },
    // Type info if present
    '& .cm-completionType': {
      color: '#94e2d5',
      fontSize: '11px',
    },
  },
  // Lint gutter markers (dark theme) — override the default light-mode SVGs
  '.cm-lint-marker-error': {
    content: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 40 40\"><circle cx=\"20\" cy=\"20\" r=\"15\" fill=\"%23ff5c5c\" stroke=\"%23ff1f1f\" stroke-width=\"6\"/></svg>')",
  },
  '.cm-lint-marker-warning': {
    content: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 40 40\"><path fill=\"%23ffd066\" stroke=\"%23ffb300\" stroke-width=\"6\" stroke-linejoin=\"round\" d=\"M20 6L37 35L3 35Z\"/></svg>')",
  },
  '.cm-lint-marker-info': {
    content: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 40 40\"><path fill=\"%2366b8ff\" stroke=\"%233d9bff\" stroke-width=\"6\" stroke-linejoin=\"round\" d=\"M5 5L35 5L35 35L5 35Z\"/></svg>')",
  },
  // In-content underlines (dark)
  '.cm-lintRange-error': { borderBottom: '2px dotted #ff5c5c' },
  '.cm-lintRange-warning': { borderBottom: '2px dotted #ffb300' },
  '.cm-lintRange-info': { borderBottom: '2px dotted #66b8ff' },
  '.cm-lintRange-active': { backgroundColor: '#ffb30033' },
  // Diagnostic tooltip
  '.cm-tooltip-lint': {
    backgroundColor: '#1e1f22',
    color: '#d7dae0',
    border: '1px solid #3c3f45',
    borderRadius: '6px',
    direction: 'rtl',
    textAlign: 'right',
    fontFamily: "'Vazirmatn', monospace",
    fontSize: '12px',
  },
  '.cm-diagnosticText': { fontSize: '12px', lineHeight: '1.4' },
  '.cm-diagnosticSource': { color: '#888c93', fontStyle: 'italic' },
  '.cm-diagnostic-error': { color: '#ff5c5c' },
  '.cm-diagnostic-warning': { color: '#ffb300' },
  '.cm-diagnostic-info': { color: '#66b8ff' },
  // Hover documentation tooltip
  '.cm-kolang-hover': {
    direction: 'rtl',
    textAlign: 'right',
    maxWidth: '32em',
    padding: '6px 12px',
    fontSize: '12px',
    lineHeight: '1.7',
    fontFamily: "'Vazirmatn', monospace",
  },
  '.cm-kolang-hover-kind': {
    color: '#cba6f7',
    fontWeight: 'bold',
    fontSize: '11px',
    marginBottom: '2px',
  },
  '.cm-kolang-hover-desc': {
    color: '#cdd6f4',
    whiteSpace: 'pre-wrap',
  },
  '.cm-activeLine': { backgroundColor: '#31324440' },
  '.cm-activeLineGutter': { backgroundColor: '#313244', color: '#cdd6f4' },
  '.cm-foldGutter .cm-gutterElement': { color: '#7f849c', cursor: 'pointer' },
  '.cm-foldGutter .cm-gutterElement:hover': { color: '#cdd6f4' },
  '.cm-matchingBracket': { backgroundColor: '#585b7040', outline: '1px solid #89b4fa80' },
}, { dark: true })

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
  '&': {
    height: '100%',
    backgroundColor: '#eff1f5', // Latte Base
    color: '#4c4f69',           // Latte Text
    direction: 'ltr',
  },
  '.cm-scroller': {
    overflow: 'auto',
    scrollbarWidth: 'thin',
    scrollbarColor: '#acb0be #e6e9ef', // Surface2 / Mantle
  },
  '.cm-scroller::-webkit-scrollbar': { width: '10px', height: '10px' },
  '.cm-scroller::-webkit-scrollbar-track': { background: '#e6e9ef' },
  '.cm-scroller::-webkit-scrollbar-thumb': { background: '#acb0be', borderRadius: '5px' },
  '.cm-scroller::-webkit-scrollbar-thumb:hover': { background: '#9ca0b0' },
  '.cm-content': {
    caretColor: '#dc8a78', // Rosewater
    direction: 'rtl',
    textAlign: 'right',
    fontFamily: "'Vazirmatn', 'Iranian Sans', 'Sahel', monospace",
  },
  '.cm-line': {
    direction: 'rtl',
  },
  '.cm-cursor, .cm-dropCursor': { borderLeftColor: '#dc8a78' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': {
    backgroundColor: '#7287fd40', // Lavender @ 25%
  },
  '.cm-gutters': {
    backgroundColor: '#e6e9ef',   // Mantle
    color: '#6c6f85',             // Subtext0
    border: 'none',
    order: 2,
    right: 0,
    left: 'auto',
    borderLeft: '1px solid #bcc0cc', // Surface1
  },
  '& .cm-tooltip': {
    backgroundColor: '#ccd0da',   // Surface0
    border: '1px solid #acb0be',  // Surface2
    borderRadius: '6px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    fontFamily: "'Vazirmatn', 'Iranian Sans', monospace",
    fontSize: '13px',
  },
  '& .cm-tooltip-autocomplete': {
    direction: 'rtl',
    textAlign: 'right',
    '& > ul > li': {
      padding: '4px 10px',
      display: 'flex',
      alignItems: 'baseline',
      gap: '10px',
    },
    '& > ul > li[aria-selected]': {
      backgroundColor: '#bcc0cc', // Surface1
      color: '#4c4f69',           // Text
    },
    '& .cm-completionLabel': {
      color: '#4c4f69',
      fontWeight: '500',
      fontFamily: "'Vazirmatn', monospace",
    },
    '& .cm-completionDetail': {
      color: '#6c6f85',           // Subtext0
      fontSize: '12px',
      fontStyle: 'italic',
      paddingRight: '6px',
      borderRight: '1px solid #acb0be',
      marginRight: '2px',
      maxWidth: '24em',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    '& .cm-completionIcon': {
      color: '#8839ef',           // Mauve
      marginRight: '4px',
    },
    '& .cm-completionType': {
      color: '#179299',           // Teal
      fontSize: '11px',
    },
  },
  // Lint markers — same SVGs work on light (they're already bright colors).
  '.cm-lint-marker-error': {
    content: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 40 40\"><circle cx=\"20\" cy=\"20\" r=\"15\" fill=\"%23ff5c5c\" stroke=\"%23ff1f1f\" stroke-width=\"6\"/></svg>')",
  },
  '.cm-lint-marker-warning': {
    content: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 40 40\"><path fill=\"%23ffd066\" stroke=\"%23ffb300\" stroke-width=\"6\" stroke-linejoin=\"round\" d=\"M20 6L37 35L3 35Z\"/></svg>')",
  },
  '.cm-lint-marker-info': {
    content: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 40 40\"><path fill=\"%2366b8ff\" stroke=\"%233d9bff\" stroke-width=\"6\" stroke-linejoin=\"round\" d=\"M5 5L35 5L35 35L5 35Z\"/></svg>')",
  },
  '.cm-lintRange-error': { borderBottom: '2px dotted #d20f39' },     // Red
  '.cm-lintRange-warning': { borderBottom: '2px dotted #df8e1d' },   // Yellow
  '.cm-lintRange-info': { borderBottom: '2px dotted #1e66f5' },      // Blue
  '.cm-lintRange-active': { backgroundColor: '#df8e1d33' },
  '.cm-tooltip-lint': {
    backgroundColor: '#e6e9ef',   // Mantle
    color: '#4c4f69',             // Text
    border: '1px solid #bcc0cc',  // Surface1
    borderRadius: '6px',
    direction: 'rtl',
    textAlign: 'right',
    fontFamily: "'Vazirmatn', monospace",
    fontSize: '12px',
  },
  '.cm-diagnosticText': { fontSize: '12px', lineHeight: '1.4' },
  '.cm-diagnosticSource': { color: '#8c8fa1', fontStyle: 'italic' },
  '.cm-diagnostic-error': { color: '#d20f39' },   // Red
  '.cm-diagnostic-warning': { color: '#df8e1d' }, // Yellow
  '.cm-diagnostic-info': { color: '#1e66f5' },    // Blue
  '.cm-kolang-hover': {
    direction: 'rtl',
    textAlign: 'right',
    maxWidth: '32em',
    padding: '6px 12px',
    fontSize: '12px',
    lineHeight: '1.7',
    fontFamily: "'Vazirmatn', monospace",
  },
  '.cm-kolang-hover-kind': {
    color: '#8839ef',             // Mauve
    fontWeight: 'bold',
    fontSize: '11px',
    marginBottom: '2px',
  },
  '.cm-kolang-hover-desc': {
    color: '#4c4f69',             // Text
    whiteSpace: 'pre-wrap',
  },
  '.cm-activeLine': { backgroundColor: '#bcc0cc40' },         // Surface1 @ 25%
  '.cm-activeLineGutter': { backgroundColor: '#bcc0cc', color: '#4c4f69' },
  '.cm-foldGutter .cm-gutterElement': { color: '#6c6f85', cursor: 'pointer' },
  '.cm-foldGutter .cm-gutterElement:hover': { color: '#4c4f69' },
  '.cm-matchingBracket': { backgroundColor: '#7287fd40', outline: '1px solid #1e66f580' },
}, { dark: false })

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

// Returns [theme, syntaxHighlighting(highlight)] for the requested mode.
// Convenience for consumers that rebuild EditorState (IDE) or init a Compartment.
export function themeExtensions(isLight) {
  if (isLight) {
    return [editorThemeLight, syntaxHighlighting(kolangHighlightLight, { fallback: true })]
  }
  return [editorTheme, syntaxHighlighting(kolangHighlight, { fallback: true })]
}

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
