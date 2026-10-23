// MdMath 渲染管线自测（Node）
// 复刻 MdMath/templates.py 里的 _RENDER_JS 逻辑，验证：
//   1) Markdown -> HTML（含 GFM 表格）
//   2) $...$ / $$...$$ 数学先抽取保护，再还原
//   3) 每个数学片段能被 KaTeX 解析（throwOnError=true，报错即失败）
// 用用户作业中的真实语法样例测试。

import { marked } from "file:///C:/Users/18904/Github/anki/mdmath/.deps/node_modules/marked/lib/marked.esm.js";
import katex from "file:///C:/Users/18904/Github/anki/mdmath/.deps/node_modules/katex/dist/katex.mjs";

// ---- 与 _RENDER_JS 相同的抽取+还原（input 为字段纯文本）----
function pipeline(src) {
  const ph = [];
  let k = 0;
  let t = src;
  t = t.replace(/\$\$([\s\S]+?)\$\$/g, (m, p) => { ph.push({ tex: p, dis: true }); return "@@MDM" + (++k) + "@@"; });
  t = t.replace(/\$([^$\n]+?)\$/g, (m, p) => { ph.push({ tex: p, dis: false }); return "@@MDM" + (++k) + "@@"; });
  let html;
  try { html = marked.parse(t, { gfm: true, breaks: false }); } catch (e) { html = t; }
  html = html.replace(/@@MDM(\d+)@@/g, (m, n) => {
    const o = ph[parseInt(n, 10) - 1];
    return o ? (o.dis ? "$$" + o.tex + "$$" : "$" + o.tex + "$") : m;
  });
  return { html, math: ph };
}

// ---- 用 KaTeX 逐个解析数学片段（throwOnError=true 会抛错）----
function verifyKatex(ph) {
  let fail = 0;
  for (const o of ph) {
    try {
      katex.renderToString(o.tex, { displayMode: o.dis, throwOnError: true });
    } catch (e) {
      fail++;
      console.log("  [KATEX-FAIL] " + (o.dis ? "$$" : "$") + o.tex + (o.dis ? "$$" : "$") + " :: " + e.message);
    }
  }
  return fail;
}

// ---- 样例（来自 functional-analysis/week1.md 的真实语法）----
const sample = `## 1.1-2

设 $\\left(X,d\\right)$ 是度量空间，证明：

$$
d'\\left(x,y\\right)=\\frac{d\\left(x,y\\right)}{1+d\\left(x,y\\right)},\\quad d''\\left(x,y\\right)=\\ln\\left(1+d\\left(x,y\\right)\\right),\\quad \\forall x,y\\in X.
$$

也是 $X$ 上的度量。

> **基础知识: 实数绝对值的三角不等式**<br>对任意实数 $a,b$, 有 $\\left|a+b\\right|\\le\\left|a\\right|+\\left|b\\right|$.

| $x$ | 0 | 1 |
|---|---|---|
| $y$ | 85.00 | 79.19 |

\\begin{cases} x=t\\ln t,\\\\ y=e^t. \\end{cases}

$$\\int_0^1 g\\left(t\\right)\\,\\mathrm dt=0 \\tag{1}$$

\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}

\\begin{align} a &= b \\\\ c &= d \\end{align}

\\binom{k}{j}

\\mathbb R^3, \\mathcal S, \\mathfrak G, \\operatorname{co}, \\overset{m}{=}

\\sin u \\le u, \\quad \\frac{\\pi}{2}

> 构造思路: 要找一个函数值很小但系数很大的多项式 $\\left(-1\\right)^j$ 天然合适.

\\[
  x = \\cos\\alpha\\,y + \\sin\\alpha\\,u
\\]

\\\\( \\gamma \\le \\beta \\\\)
`;

const { html, math } = pipeline(sample);
console.log("==== 抽取到的数学片段数:", math.length, "====");
const fails = verifyKatex(math);
console.log("==== KaTeX 解析失败数:", fails, "====");
console.log("==== 渲染后的 HTML（截断）====");
console.log(html.slice(0, 2200));

process.exit(fails === 0 ? 0 : 1);
