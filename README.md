# mdmath — Anki add-on

Write **Markdown + KaTeX math** in Anki card fields; renders like VSCode + Markdown Preview Enhanced (MPE) on review.

**Author:** wenje

## Features
- Note type **mdmath**: fields `Front` (question) / `Back` (answer).
- Markdown in fields, auto-rendered on review:
  - Markdown basics (headings / bold / blockquote / lists / horizontal rule)
  - Inline `$...$` and display `$$...$$` math (incl. `\tag` numbering, `\begin{cases/pmatrix/align}` etc.)
  - Pipe tables (cells may contain math)
  - HTML passthrough (`<br>`, `<div align=center>`)
  - Code blocks (python / bash / latex / none, monospace, no highlight)
- Math rendered by **KaTeX** (same as MPE default), bundled locally, works offline.
- Styles ported from `.crossnote/style.less`: fonts LMRoman10 / SimHei / FangSong, KaTeX `.tag` numbering fix etc.

## Install
Recommended: install the packaged file (runtime files only).
1. Run `build.ps1` in this directory to build `mdmath.ankiaddon`.
2. Anki -> Tools -> Add-ons -> Install from file... -> pick `mdmath.ankiaddon`.
3. Restart Anki; the add-on creates/updates note type **mdmath** and injects rendering assets.
4. New note -> type **mdmath** -> write Markdown in Front/Back.

> Or copy the add-on folder to the Anki add-ons dir: Windows `%APPDATA%\Anki2\addons21\mdmath`.
> Only the runtime files are needed (`__init__.py`, `templates.py`, `manifest.json`, `assets/`);
> `.deps/`, `tests/`, `README.md`, `build.ps1` are for development/packaging.

## Usage
- Write Markdown in fields as-is (newlines, `#`, `$...$` kept); auto-rendered on review.
- For each `## question` section: put the question in `Front`, question+answer (`### answer`) in `Back`; your choice.

## Markdown `<` `>` note
Anki injects card fields as HTML, not raw Markdown. A bare `<` is read as the start of an HTML tag, so in `0<p<1` everything after `<` is dropped on review. **Always put a space after `<` and `>`** (e.g. `0< p< 1`, `\left< x \right>`) so the browser does not treat them as tags; the space is harmless in math.

To fix existing files automatically, run the helper script:
```
python C:\Users\18904\Github\wenje-codes\space_gt.py <folder>
```
It recursively inserts a space after `<`/`>` in `.md`/`.qmd`/`.tex` files (and keeps `<br>` intact).

## Customize layout
Edit `config.json` in the add-on folder (Windows: `%APPDATA%\Anki2\addons21\mdmath\config.json`), then **restart Anki** to apply:
- `fontSize`: base font size, px (default 16)
- `lineHeight`: line spacing (default 1.6)
- `fontFamily`: body font stack (e.g. `"LMRoman10","SimHei",serif`)
- `monoFont`: code font (default `Consolas,monospace`)
- `textColor` / `bgColor`: text / background color
- `pageMargin` / `pageMarginMobile`: desktop / mobile page margins (default `1in` / `0.5in`)

## Packaging
Run `build.ps1` in this directory -> `mdmath.ankiaddon` (for Anki "Install from file").

## Notes
- Published on AnkiWeb; MIT licensed.
- KaTeX (0.16.21) + marked (12.0.2) bundled in `assets/`.
