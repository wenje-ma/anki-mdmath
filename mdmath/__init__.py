# -*- coding: utf-8 -*-
"""mdmath —— Anki 插件：在卡片字段里写 Markdown + KaTeX 数学，复习时对标 VSCode+MPE 渲染。

用法：
- 安装后重启 Anki，会自动创建/更新笔记类型 "mdmath"（字段 Front / Back）。
- 在字段里直接写 Markdown（标题/加粗/引用/列表/表格/HTML/代码块）+ $...$、$$...$$ 数学。
- 复习时由插件注入的 marked + KaTeX 渲染，样式移植自 .crossnote/style.less。

自用插件。KaTeX / marked 为本地打包（离线可用）。
"""
from __future__ import annotations

import os
import re

from aqt import mw
from aqt.utils import showWarning

from .templates import BACK_TEMPLATE, FRONT_TEMPLATE, MEDIA_PREFIX

NOTETYPE_NAME = "mdmath"

# 本文件所在目录（插件安装目录）
ADDON_DIR = os.path.dirname(__file__)
ASSET_DIR = os.path.join(ADDON_DIR, "assets")
FONTS_DIR = os.path.join(ASSET_DIR, "fonts")


def _media_copies():
    """返回 [(media 名称, 本地文件路径)]，media 名称统一带 _mdmath_ 前缀。"""
    items = [
        ("katex.min.js", os.path.join(ASSET_DIR, "katex.min.js")),
        ("katex.min.css", os.path.join(ASSET_DIR, "katex.min.css")),
        ("auto-render.min.js", os.path.join(ASSET_DIR, "auto-render.min.js")),
        ("marked.min.js", os.path.join(ASSET_DIR, "marked.min.js")),
        ("style.css", os.path.join(ASSET_DIR, "style.css")),
    ]
    out = [(MEDIA_PREFIX + name, path) for name, path in items]
    if os.path.isdir(FONTS_DIR):
        for fn in sorted(os.listdir(FONTS_DIR)):
            out.append((MEDIA_PREFIX + "font_" + fn, os.path.join(FONTS_DIR, fn)))
    return out


def _inject_media():
    """把 assets 复制进 collection.media；katex.min.css 的字体 URL 改写为媒体名。"""
    mm = mw.col.media
    for media_name, local in _media_copies():
        if not os.path.isfile(local):
            continue
        if mm.have(media_name):
            continue
        if media_name == MEDIA_PREFIX + "katex.min.css":
            # url(fonts/KaTeX_X.woff2) -> url(_mdmath_font_KaTeX_X.woff2)
            text = open(local, "rb").read().decode("utf-8")
            text = re.sub(r"url\(fonts/([^)]+)\)",
                          "url(" + MEDIA_PREFIX + r"font_\1)", text)
            mm.write_data(media_name, text.encode("utf-8"))
        else:
            with open(local, "rb") as f:
                mm.write_data(media_name, f.read())


def _ensure_notetype():
    mm = mw.col.models
    nt = mm.by_name(NOTETYPE_NAME)
    if nt is None:
        nt = mm.new(NOTETYPE_NAME)
        nt["flds"] = [mm.new_field("Front"), mm.new_field("Back")]
        t = mm.new_template("Card 1")
        t["qfmt"] = FRONT_TEMPLATE
        t["afmt"] = BACK_TEMPLATE
        nt["tmpls"] = [t]
        mm.add(nt)
        return
    # 已存在：补齐字段与模板内容
    changed = False
    existing = [f["name"] for f in nt["flds"]]
    for fname in ("Front", "Back"):
        if fname not in existing:
            nt["flds"].append(mm.new_field(fname))
            changed = True
    if not nt["tmpls"]:
        t = mm.new_template("Card 1")
        t["qfmt"] = FRONT_TEMPLATE
        t["afmt"] = BACK_TEMPLATE
        nt["tmpls"] = [t]
        changed = True
    else:
        t0 = nt["tmpls"][0]
        if t0.get("qfmt") != FRONT_TEMPLATE:
            t0["qfmt"] = FRONT_TEMPLATE
            changed = True
        if t0.get("afmt") != BACK_TEMPLATE:
            t0["afmt"] = BACK_TEMPLATE
            changed = True
    if changed:
        mm.update(nt)


def _on_profile_loaded():
    try:
        _inject_media()
        _ensure_notetype()
    except Exception as e:  # noqa: BLE001
        showWarning("mdmath 初始化失败：%s" % e)


mw.addHook("profileLoaded", _on_profile_loaded)
