// Privacy reading prototype. The copy remains a review draft, not a published policy.
import {lang,t,localize} from './public-copy.js';
import {mountPublicNavigation} from './public-navigation.js';
mountPublicNavigation();
localize(document.querySelector('.privacy-layout'));
document.title=t('Privacy')+' — AIHarder';
try {
  const response = await fetch(lang==='es'?'./privacy-copy.es.json':'./privacy-copy.json');
  if (!response.ok) throw new Error('Privacy copy unavailable');
  const copy = await response.json();
  document.querySelector('#privacy-title').textContent = copy.title;
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
  document.querySelector('#privacy-intro').textContent = t('Privacy content could not be loaded. Please reload this page or contact support@aiharder.link.');
  document.querySelector('#privacy-summary').hidden = true;
}
