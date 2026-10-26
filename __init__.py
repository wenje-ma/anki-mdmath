# -*- coding: utf-8 -*-
"""mdmath:markdown+katex cards for anki, renders like vscode+mpe."""
from __future__ import annotations
import os
import re
from aqt import mw,gui_hooks
from aqt.utils import showWarning
from .templates import BACK_TEMPLATE,FRONT_TEMPLATE,MEDIA_PREFIX

NOTETYPE_NAME="mdmath"
ADDON_DIR=os.path.dirname(__file__)
ASSET_DIR=os.path.join(ADDON_DIR,"assets")
FONTS_DIR=os.path.join(ASSET_DIR,"fonts")

def _media_copies():
  items=[
    ("katex.min.js",os.path.join(ASSET_DIR,"katex.min.js")),
    ("katex.min.css",os.path.join(ASSET_DIR,"katex.min.css")),
    ("auto-render.min.js",os.path.join(ASSET_DIR,"auto-render.min.js")),
    ("marked.min.js",os.path.join(ASSET_DIR,"marked.min.js")),
    ("style.css",os.path.join(ASSET_DIR,"style.css")),
  ]
  out=[(MEDIA_PREFIX+name,path) for name,path in items]
  if os.path.isdir(FONTS_DIR):
    for fn in sorted(os.listdir(FONTS_DIR)):
      out.append((MEDIA_PREFIX+"font_"+fn,os.path.join(FONTS_DIR,fn)))
  return out

def _inject_media():
  mm=mw.col.media
  for media_name,local in _media_copies():
    if not os.path.isfile(local):
      continue
    if media_name.startswith(MEDIA_PREFIX+"font_") and mm.have(media_name):
      continue
    if media_name==MEDIA_PREFIX+"style.css":
      if mm.have(media_name):
        continue
      with open(local,"rb") as f:
        mm.write_data(media_name,f.read())
    elif media_name==MEDIA_PREFIX+"katex.min.css":
      text=open(local,"rb").read().decode("utf-8")
      text=re.sub(r"url\(fonts/([^)]+)\)","url("+MEDIA_PREFIX+r"font_\1)",text)
      mm.write_data(media_name,text.encode("utf-8"))
    else:
      with open(local,"rb") as f:
        mm.write_data(media_name,f.read())

def _ensure_notetype():
  mm=mw.col.models
  nt=mm.by_name(NOTETYPE_NAME)
  if nt is None:
    nt=mm.new(NOTETYPE_NAME)
    nt["flds"]=[mm.new_field("Front"),mm.new_field("Back")]
    t=mm.new_template("Card 1")
    t["qfmt"]=FRONT_TEMPLATE
    t["afmt"]=BACK_TEMPLATE
    nt["tmpls"]=[t]
    mm.add(nt)
    return
  changed=False
  existing=[f["name"] for f in nt["flds"]]
  for fname in ("Front","Back"):
    if fname not in existing:
      nt["flds"].append(mm.new_field(fname))
      changed=True
  if not nt["tmpls"]:
    t=mm.new_template("Card 1")
    t["qfmt"]=FRONT_TEMPLATE
    t["afmt"]=BACK_TEMPLATE
    nt["tmpls"]=[t]
    changed=True
  else:
    t0=nt["tmpls"][0]
    if t0.get("qfmt")!=FRONT_TEMPLATE:
      t0["qfmt"]=FRONT_TEMPLATE
      changed=True
    if t0.get("afmt")!=BACK_TEMPLATE:
      t0["afmt"]=BACK_TEMPLATE
      changed=True
  if changed:
    mm.update(nt)

def _on_profile_loaded():
  try:
    _inject_media()
    _ensure_notetype()
  except Exception as e:
    showWarning("mdmath init failed: %s"%e)

def _maybe_init():
  if getattr(mw,"col",None) is not None:
    _on_profile_loaded()

gui_hooks.profile_did_open.append(_on_profile_loaded)
_maybe_init()
