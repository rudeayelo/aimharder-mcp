// Closing/footer for the design study; no authentication or policy publication.
const closing = document.querySelector('#closing');
const footer = document.querySelector('#site-footer');
closing.innerHTML = `<div class="footer-mascot-wrap" aria-hidden="true"><div class="footer-kettle"><div class="footer-kettle-ground"></div><img src="assets/kettle-neutral.png" loading="lazy" decoding="async" alt=""></div></div><div class="container closing-inner"><h2>Bring your training into the conversation.</h2><button class="primary closing-signin" type="button">Sign in</button></div>`;
footer.innerHTML = `<div class="container footer-inner"><div class="footer-project"><p class="footer-disclosure">An independent project. Not affiliated with AimHarder.</p></div><nav class="footer-links" aria-label="Project information"><a href="https://github.com/rudeayelo/aimharder-mcp">GitHub</a><a href="mailto:support@aiharder.link">Support</a><a class="footer-privacy" href="privacy-study.html?theme=${encodeURIComponent(new URLSearchParams(location.search).get('theme') || document.documentElement.dataset.theme)}">Privacy</a></nav></div>`;
const dialog = document.createElement('dialog');
dialog.className = 'footer-notice';
dialog.setAttribute('aria-labelledby', 'footer-notice-title');
dialog.innerHTML = `<form method="dialog"><h2 id="footer-notice-title">Design prototype</h2><p></p><button class="primary" type="submit">Close</button></form>`;
document.body.append(dialog);
const showNotice = () => {
  dialog.querySelector('p').textContent = 'Real sign-in will be connected during implementation. This view is for reviewing the design and animation.';
  dialog.showModal();
};
closing.querySelector('button').addEventListener('click', () => showNotice());
await document.fonts.ready;
if (location.hash === '#closing' || location.hash === '#site-footer') document.querySelector(location.hash).scrollIntoView();
