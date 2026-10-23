# -*- coding: utf-8 -*-
"""MdMath 卡片模板。

模板在卡片复习时加载 assets 中的 marked + KaTeX（经 collection.media 注入），
把字段里的 Markdown 文本转成 HTML，再渲染数学公式 —— 效果对标 VSCode + MPE。

媒体文件均以 _mdmath_ 前缀命名（见 __init__.py 的注入逻辑）。
"""

MEDIA_PREFIX = "_mdmath_"

# 渲染脚本：把 Markdown 字段内容转 HTML + KaTeX 渲染
_RENDER_JS = """
<script>
(function () {
  function mdMathToText(el) {
    var clone = el.cloneNode(true);
    var brs = clone.querySelectorAll('br');
    for (var i = 0; i < brs.length; i++) brs[i].replaceWith(document.createTextNode('\\n'));
    var blocks = clone.querySelectorAll('div,p,li,h1,h2,h3,h4,h5,h6,tr');
    for (var j = 0; j < blocks.length; j++) blocks[j].appendChild(document.createTextNode('\\n'));
    return clone.textContent;
  }
  function renderOne(el) {
    var src = mdMathToText(el);
    var ph = [], k = 0;
    src = src.replace(/\\$\\$([\\s\\S]+?)\\$\\$/g, function (m, p) { ph.push({tex: p, dis: true}); return '@@MDM' + (++k) + '@@'; });
    src = src.replace(/\\$([^$\\n]+?)\\$/g, function (m, p) { ph.push({tex: p, dis: false}); return '@@MDM' + (++k) + '@@'; });
    var html;
    try { html = marked.parse(src, {gfm: true, breaks: false}); } catch (e) { html = src; }
    html = html.replace(/@@MDM(\\d+)@@/g, function (m, n) {
      var o = ph[parseInt(n, 10) - 1];
      return o ? (o.dis ? '$$' + o.tex + '$$' : '$' + o.tex + '$') : m;
    });
    el.innerHTML = html;
    if (window.renderMathInElement) {
      renderMathInElement(el, {
        delimiters: [
          {left: '$$', right: '$$', display: true},
          {left: '$', right: '$', display: false}
        ],
        throwOnError: false
      });
    }
  }
  var els = document.querySelectorAll('.mdmath');
  for (var i = 0; i < els.length; i++) renderOne(els[i]);
})();
</script>
"""

_HEAD = (
    '<link rel="stylesheet" href="' + MEDIA_PREFIX + 'katex.min.css">\n'
    '<link rel="stylesheet" href="' + MEDIA_PREFIX + 'style.css">\n'
)

_SCRIPTS = (
    '<script src="' + MEDIA_PREFIX + 'marked.min.js"></script>\n'
    '<script src="' + MEDIA_PREFIX + 'katex.min.js"></script>\n'
    '<script src="' + MEDIA_PREFIX + 'auto-render.min.js"></script>\n'
)

FRONT_TEMPLATE = _HEAD + (
    '<div class="mdmath" id="mdmath-front">{{Front}}</div>\n'
) + _SCRIPTS + _RENDER_JS

BACK_TEMPLATE = _HEAD + (
    '<div class="mdmath" id="mdmath-front">{{Front}}</div>\n'
    '<hr>\n'
    '<div class="mdmath" id="mdmath-back">{{Back}}</div>\n'
) + _SCRIPTS + _RENDER_JS
