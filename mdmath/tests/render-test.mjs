//mdmath render pipeline test(node), replicates _RENDER_JS from templates.py
import{marked}from"file:///C:/Users/18904/Github/anki/mdmath/.deps/node_modules/marked/lib/marked.esm.js";
import katex from"file:///C:/Users/18904/Github/anki/mdmath/.deps/node_modules/katex/dist/katex.mjs";
function pipeline(src){
  const ph=[];
  let k=0;
  let t=src;
  t=t.replace(/\$\$([\s\S]+?)\$\$/g,(m,p)=>{ph.push({tex:p,dis:true});return"@@MDM"+(++k)+"@@";});
  t=t.replace(/\$([^$\n]+?)\$/g,(m,p)=>{ph.push({tex:p,dis:false});return"@@MDM"+(++k)+"@@";});
  let html;
  try{html=marked.parse(t,{gfm:true,breaks:false});}catch(e){html=t;}
  html=html.replace(/@@MDM(\d+)@@/g,(m,n)=>{
    const o=ph[parseInt(n,10)-1];
    return o?(o.dis?"$$"+o.tex+"$$":"$"+o.tex+"$"):m;
  });
  return{html,math:ph};
}
function verifyKatex(ph){
  let fail=0;
  for(const o of ph){
    try{
      katex.renderToString(o.tex,{displayMode:o.dis,throwOnError:true});
    }catch(e){
      fail++;
      console.log("  [KATEX-FAIL] "+(o.dis?"$$":"$")+o.tex+(o.dis?"$$":"$")+" :: "+e.message);
    }
  }
  return fail;
}
const sample=`## 1.1-2

Let $\\left(X,d\\right)$ be a metric space, show that:

$$
d'\\left(x,y\\right)=\\frac{d\\left(x,y\\right)}{1+d\\left(x,y\\right)},\\quad d''\\left(x,y\\right)=\\ln\\left(1+d\\left(x,y\\right)\\right),\\quad \\forall x,y\\in X.
$$

is also a metric on $X$.

> **Basic fact: triangle inequality for real absolute value**<br>For any reals $a,b$, we have $\\left|a+b\\right|\\le\\left|a\\right|+\\left|b\\right|$.

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

> Idea: find a polynomial with tiny value but large coefficient; $\\left(-1\\right)^j$ fits naturally.

\\[
  x = \\cos\\alpha\\,y + \\sin\\alpha\\,u
\\]

\\\\( \\gamma \\le \\beta \\\\)
`;
const{html,math}=pipeline(sample);
console.log("==== extracted math fragments:",math.length,"====");
const fails=verifyKatex(math);
console.log("==== katex parse failures:",fails,"====");
console.log("==== rendered html(truncated)====");
console.log(html.slice(0,2200));
process.exit(fails===0?0:1);
