#mdmath config css generator test
import sys,types
sys.path.insert(0,r'C:\Users\18904\Github\anki')
aqt=types.ModuleType('aqt')
aqt.mw=types.SimpleNamespace()
aqt.utils=types.SimpleNamespace()
aqt.utils.showWarning=lambda *a,**k:None
gh=types.SimpleNamespace()
gh.profile_did_open=types.SimpleNamespace()
gh.profile_did_open.append=lambda f:None
aqt.gui_hooks=gh
sys.modules['aqt']=aqt
sys.modules['aqt.utils']=aqt.utils
sys.modules['aqt.gui_hooks']=gh
import mdmath
print('--- custom ---')
print(mdmath._user_css({"fontSize":20,"lineHeight":1.8,"fontFamily":"serif","monoFont":"mono","textColor":"#000","bgColor":"#eee","pageMargin":"2in"}))
print('--- default ---')
print(mdmath._user_css())
assert "font-size:20px" in mdmath._user_css({"fontSize":20}), "fontSize not applied"
assert "padding:0 2in" in mdmath._user_css({"pageMargin":"2in"}), "pageMargin not applied"
assert "font-size:16px" in mdmath._user_css(), "default fontSize missing"
assert "padding:0 0.5in" in mdmath._user_css(), "default mobile margin missing"
assert "max-width:768px" in mdmath._user_css(), "media query missing"
assert "padding:0 1em" in mdmath._user_css({"pageMarginMobile":"1em"}), "mobile margin not applied"
print('ALL OK')
