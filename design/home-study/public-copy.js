// Localized design copy only. No user data, services or persistent preferences.
export const lang = new URLSearchParams(location.search).get('lang') === 'es' ? 'es' : 'en';
document.documentElement.lang = lang;
const translations = lang === 'es' ? await fetch('./public-copy.es.json').then(response => {
  if (!response.ok) throw new Error('Localized design copy unavailable');
  return response.json();
}) : {};
export const t = text => translations[text] ?? text;
export function localize(root) {
  if (!root || lang === 'en') return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    if (node.parentElement.closest('script,style,option,[data-no-translate]')) continue;
    const value = node.textContent.trim(), translated = t(value);
    if (translated !== value) node.textContent = node.textContent.replace(value, translated);
  }
  for (const node of [root, ...root.querySelectorAll('*')]) {
    for (const attr of ['aria-label','title','placeholder','data-placeholder','alt']) {
      if (node.hasAttribute?.(attr)) node.setAttribute(attr, t(node.getAttribute(attr)));
    }
  }
}
