// Privacy reading prototype. The copy remains a review draft, not a published policy.
const params = new URLSearchParams(location.search);
const modes = ['light', 'dark', 'system'];
let mode = modes.includes(params.get('theme')) ? params.get('theme') : 'system';
const system = matchMedia('(prefers-color-scheme: dark)');
function applyAppearance() {
  const theme = mode === 'system' ? (system.matches ? 'dark' : 'light') : mode;
  document.documentElement.dataset.theme = theme;
  const icon = mode === 'system' ? 'monitor' : mode === 'dark' ? 'moon' : 'sun';
  document.querySelector('#appearance-icon').style.setProperty('--icon', `url('./assets/lucide/${icon}.svg')`);
  const next = modes[(modes.indexOf(mode) + 1) % modes.length];
  document.querySelector('#appearance').setAttribute('aria-label', `Appearance: ${mode}. Switch to ${next}.`);
  for (const link of document.querySelectorAll('[data-home],[data-home-anchor]')) {
    const target = new URL('hero-motion-prototype.html', location.href);
    target.search = new URLSearchParams({theme: mode, reply: 'long', v: 'privacy1'});
    if (link.dataset.homeAnchor) target.hash = link.dataset.homeAnchor;
    link.href = target;
  }
  document.querySelector('#privacy-self').href = `privacy-study.html?theme=${mode}`;
}
applyAppearance();
document.querySelector('#appearance').addEventListener('click', () => {
  mode = modes[(modes.indexOf(mode) + 1) % modes.length];
  const url = new URL(location.href); url.searchParams.set('theme', mode);
  history.replaceState(null, '', url); applyAppearance();
});
system.addEventListener('change', () => { if (mode === 'system') applyAppearance(); });
document.querySelector('#privacy-signin').addEventListener('click', () => document.querySelector('#signin-notice').showModal());
try {
  const response = await fetch('./privacy-copy.json');
  if (!response.ok) throw new Error('Privacy copy unavailable');
  const copy = await response.json();
  document.querySelector('#privacy-intro').textContent = copy.intro;
  document.querySelector('#privacy-summary').textContent = copy.summary;
  for (const item of copy.sections) {
    const li = document.createElement('li'), link = document.createElement('a');
    link.href = `#${item.id}`; link.textContent = item.title; li.append(link);
    document.querySelector('#privacy-contents').append(li);
    const section = document.createElement('section'); section.className = 'privacy-section'; section.id = item.id;
    const heading = document.createElement('h2'); heading.textContent = item.title; section.append(heading);
    for (const text of item.paragraphs) { const p = document.createElement('p'); p.textContent = text; section.append(p); }
    if (item.email) {
      const contact = document.createElement('a'); contact.className = 'privacy-contact'; contact.href = `mailto:${item.email}`;
      const icon = document.createElement('i'); icon.className = 'icon'; icon.setAttribute('aria-hidden','true'); icon.style.setProperty('--icon', "url('./assets/lucide/mail.svg')");
      contact.append(icon, document.createTextNode(item.email)); section.append(contact);
    }
    document.querySelector('#privacy-sections').append(section);
  }
  const sections = [...document.querySelectorAll('.privacy-section')];
  const links = [...document.querySelectorAll('#privacy-contents a')];
  let scheduled = false;
  const selectSection = () => {
    scheduled = false;
    const current = sections.filter(section => section.getBoundingClientRect().top <= 120).at(-1) ?? sections[0];
    const last = sections.at(-1);
    const active = innerHeight + scrollY >= document.documentElement.scrollHeight - 8 ? last : current;
    for (const link of links) {
      if (link.hash === `#${active.id}`) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
  };
  addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(selectSection); } }, {passive:true});
  addEventListener('resize', selectSection);
  await document.fonts.ready;
  const anchor = sections.find(section => `#${section.id}` === location.hash);
  if (anchor) anchor.scrollIntoView();
  selectSection();
} catch {
  document.querySelector('#privacy-intro').textContent = 'Privacy content could not be loaded. Please reload this page or contact support@aiharder.link.';
  document.querySelector('#privacy-summary').hidden = true;
}
