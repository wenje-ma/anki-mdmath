# mdmath — Anki 插件

在 Anki 卡片字段里写 **Markdown + KaTeX 数学**，复习时渲染效果对标 VSCode + Markdown Preview Enhanced（MPE）。自用。

## 功能
- 提供笔记类型 **mdmath**：字段 `Front`（题目）/ `Back`（解答）。
- 字段里直接写 Markdown，复习时自动渲染：
  - Markdown 基础（标题 / 加粗 / 引用 / 列表 / 分隔线）
  - 行内数学 `$...$`、块级数学 `$$...$$`（含 `\tag` 编号、`\begin{cases/pmatrix/align}` 等）
  - 管道表格（单元格可含数学）
  - HTML 直通（`<br>`、`<div align=center>`）
  - 代码块（python / bash / latex / 无语言，纯等宽渲染，不加高亮）
- 数学渲染器 **KaTeX**（与 MPE 默认一致），本地打包、离线可用。
- 样式移植自 `.crossnote/style.less`：字体 LMRoman10 / SimHei / FangSong、KaTeX `.tag` 编号修复等。

## 安装
推荐用打包文件安装（只含插件运行文件）：
1. 在本目录执行 `build.ps1`，生成 `mdmath.ankiaddon`。
2. Anki → 工具 → 插件 → 从文件安装 → 选 `mdmath.ankiaddon`。
3. 重启 Anki，插件自动创建 / 更新笔记类型 **mdmath** 并注入渲染资源。
4. 新建笔记选 **mdmath** 类型，在 Front/Back 字段写 Markdown。

> 也可手动复制插件文件夹到 Anki 插件目录：Windows 为 `%APPDATA%\Anki2\addons21\mdmath`。
> 注意只需复制插件运行文件（`__init__.py`、`templates.py`、`manifest.json`、`assets/`）；
> 本目录的 `.deps/`、`tests/`、`README.md`、`build.ps1` 是开发/打包用，不需要装进 Anki。

## 使用提示
- 字段里写 Markdown，换行、`#`、`$...$` 等原样保留即可；复习时自动渲染。
- 每个 `## 题目` 段：`Front` 放题目，`Back` 放题目+解答（`### 解答`），可自行决定。

## 打包
在本目录执行 `build.ps1`，生成 `mdmath.ankiaddon`（Anki「从文件安装」用）。

## 说明
- 自用插件，未发布。
- KaTeX（0.16.21）+ marked（12.0.2）为本地打包资源，位于 `assets/`。
