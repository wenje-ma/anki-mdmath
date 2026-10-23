// 模拟 Anki 字段 HTML（编辑器把换行存成 <br>），验证 htmlToMdText 还原 Markdown 结构
import { marked } from "file:///C:/Users/18904/Github/anki/mdmath/.deps/node_modules/marked/lib/marked.esm.js";
import katex from "file:///C:/Users/18904/Github/anki/mdmath/.deps/node_modules/katex/dist/katex.mjs";

// 复刻模板 htmlToMdText：<br> -> \n，块级元素后补 \n，去标签取文本（正则等价于 DOM 结果）
function htmlToMdText(html) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(div|p|li|h1|h2|h3|h4|h5|h6|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, "");
}

function pipeline(src) {
  const ph = []; let k = 0; let t = src;
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

// Anki 会把换行存成 <br>。字段：标题 + 段落 + 行内数学 + 列表 + 块级公式 + 代码块
const fieldHtml = `## 1.1-2<br>设 $\\left(X,d\\right)$ 是度量空间，证明：<br>$$
d'\\left(x,y\\right)=\\frac{d\\left(x,y\\right)}{1+d\\left(x,y\\right)},\\quad \\forall x,y\\in X.
$$<br><br>- 第一点：$a\\le b$<br>- 第二点：$\\left|a\\right|+\\left|b\\right|$<br><br>\`\`\`python<br>def f(x):<br>    return x * 2<br>\`\`\``;

const md = htmlToMdText(fieldHtml);
console.log("==== 还原后的 markdown 文本 ====");
console.log(JSON.stringify(md));
const { html, math } = pipeline(md);
let fails = 0;
for (const o of math) {
  try { katex.renderToString(o.tex, { displayMode: o.dis, throwOnError: true }); }
  catch (e) { fails++; console.log("  [KATEX-FAIL] " + o.tex + " :: " + e.message); }
}
console.log("==== 数学片段数:", math.length, " KaTeX 失败数:", fails, "====");
console.log("==== 渲染 HTML ====");
console.log(html);

if (html.includes("<h2>") && html.includes("<li>") && html.includes("<pre>") && fails === 0) {
  console.log("\nPASS: 标题/列表/代码块/数学均正常还原");
  process.exit(0);
} else {
  console.log("\nFAIL: 有结构未还原");
  process.exit(1);
}
