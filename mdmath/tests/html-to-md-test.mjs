//simulate anki field html(editor stores newlines as <br>), verify htmlToMdText restores markdown structure
import{marked}from"file:///C:/Users/18904/Github/anki/mdmath/.deps/node_modules/marked/lib/marked.esm.js";
import katex from"file:///C:/Users/18904/Github/anki/mdmath/.deps/node_modules/katex/dist/katex.mjs";
function htmlToMdText(html){
  return html
    .replace(/<br\s*\/?>/gi,"\n")
    .replace(/<\/(div|p|li|h1|h2|h3|h4|h5|h6|tr)>/gi,"\n")
    .replace(/<[^>]+>/g,"");
}
function pipeline(src){
  const ph=[];let k=0;let t=src;
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
const fieldHtml=`## 1.1-2<br>Let $\\left(X,d\\right)$ be a metric space, show that:<br>$$
d'\\left(x,y\\right)=\\frac{d\\left(x,y\\right)}{1+d\\left(x,y\\right)},\\quad \\forall x,y\\in X.
$$<br><br>- point 1: $a\\le b$<br>- point 2: $\\left|a\\right|+\\left|b\\right|$<br><br>\`\`\`python<br>def f(x):<br>    return x * 2<br>\`\`\``;
const md=htmlToMdText(fieldHtml);
console.log("==== restored markdown text ====");
console.log(JSON.stringify(md));
const{html,math}=pipeline(md);
let fails=0;
for(const o of math){
  try{katex.renderToString(o.tex,{displayMode:o.dis,throwOnError:true});}
  catch(e){fails++;console.log("  [KATEX-FAIL] "+o.tex+" :: "+e.message);}
}
console.log("==== math fragments:",math.length," katex failures:",fails,"====");
console.log("==== rendered html ====");
console.log(html);
if(html.includes("<h2>")&&html.includes("<li>")&&html.includes("<pre>")&&fails===0){
  console.log("\nPASS: headings/lists/code/math restored");
  process.exit(0);
}else{
  console.log("\nFAIL: structure not restored");
  process.exit(1);
}
