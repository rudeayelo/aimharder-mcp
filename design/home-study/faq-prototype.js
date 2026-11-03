import {localize} from './public-copy.js';
// Isolated home-study FAQ. Mailto opens a draft; this page sends no email.
const section = document.querySelector('#faq');
const copy = await fetch('./faq-study-copy.json?v=aiharder-domain').then(response => response.json());
section.innerHTML = `
  <div class="container faq-layout">
    <div class="faq-introduction">
      <h2 id="faq-heading">${copy.heading}</h2>
      <p>${copy.supportIntro}</p>
      <a class="faq-support" href="mailto:${copy.supportEmail}"><i class="icon" style="--icon:url('./assets/lucide/mail.svg')" aria-hidden="true"></i><span>${copy.supportEmail}</span></a>
    </div>
    <div class="faq-list">
      ${copy.items.map((item, index) => `<details class="faq-item"${index === 0 ? ' open' : ''}>
        <summary>${item.question}<i class="icon" style="--icon:url('./assets/lucide/chevron-down.svg')" aria-hidden="true"></i></summary>
        <p>${item.answer}</p>
      </details>`).join('')}
    </div>
  </div>`;
localize(section);
await document.fonts.ready;
if (location.hash === '#faq') section.scrollIntoView();
