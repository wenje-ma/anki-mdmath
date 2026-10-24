# mdmath configuration

Card rendering is tuned here. Open Anki -> Tools -> Add-ons -> mdmath ->
Config, edit the JSON, save, then restart Anki. The card restyles on the
next review.

The look mirrors VSCode + Markdown Preview Enhanced (mpe); the relevant values
were ported from your .crossnote/style.less and exposed below so you can adjust
them without touching code. We do not load .crossnote at runtime: it is a Less
file that exists only on your machine, and its selectors do not match the card
DOM, so importing it directly would be fragile and non-portable.

## Options

- "fontSize" : body font size in pixels. (default 16)
    e.g. 14 = smaller, 18 = larger.
- "lineHeight" : vertical spacing between lines. (default 1.6)
    larger = airier, smaller = denser.
- "fontFamily" : body font stack, latin families first, then chinese.
    (default "LMRoman10","SimHei",serif)
    maps to the font setting in .crossnote style/config.
- "monoFont" : font stack for code blocks and inline code.
    (default Consolas,monospace)
- "textColor" : main text color, any CSS color. (default "#111")
- "bgColor" : card background color, any CSS color. (default "#fff")
- "pageMargin" : left/right margin on wide (desktop/tablet) screens, any CSS
    length. (default "1in") "2em" or "40px" also work.
- "pageMarginMobile" : left/right margin on narrow (phone) screens, applied
    when the viewport is under 768px. (default "0.5in")

## Example

{
  "fontSize": 18,
  "lineHeight": 1.8,
  "fontFamily": "\"Times New Roman\",\"SimHei\",serif",
  "monoFont": "Consolas,monospace",
  "textColor": "#222",
  "bgColor": "#fdfdfd",
  "pageMargin": "1in",
  "pageMarginMobile": "0.5in"
}
