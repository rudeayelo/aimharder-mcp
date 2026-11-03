// Public design navigation only; no authentication or account operation.
import {localize} from './public-copy.js';
import {mountPublicNavigation} from './public-navigation.js';
const closing=document.querySelector('#closing'),footer=document.querySelector('#site-footer');
closing.innerHTML=`<div class="footer-mascot-wrap" aria-hidden="true"><div class="footer-kettle"><div class="footer-kettle-ground"></div><img src="assets/kettle-neutral.png" loading="lazy" decoding="async" alt=""></div></div><div class="container closing-inner"><h2>Bring your training into the conversation.</h2><a class="primary closing-signin" data-signin href="login-study.html">Sign in</a></div>`;
footer.innerHTML=`<div class="container footer-inner"><div class="footer-project"><p class="footer-disclosure">An independent project. Not affiliated with AimHarder.</p></div><nav class="footer-links" aria-label="Project information"><a href="https://github.com/rudeayelo/aimharder-mcp">GitHub</a><a href="mailto:support@aiharder.link">Support</a><a class="footer-privacy" data-privacy href="privacy-study.html">Privacy</a></nav></div>`;
localize(closing);mountPublicNavigation({reloadAppearance:true});
await document.fonts.ready;
if(location.hash==='#closing'||location.hash==='#site-footer')document.querySelector(location.hash).scrollIntoView();
