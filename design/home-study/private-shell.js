// Shared navigation for the two fictional private settings studies.
const toggle=document.querySelector('#account-menu-toggle');
const menu=document.querySelector('#account-menu');
export function refreshPrivateLinks() {
const current=new URL(location.href);
for(const [selector,file] of [['[data-account-settings]','account-settings-study.html'],['[data-settings]','private-home-study.html']]) {
  for(const link of document.querySelectorAll(selector)) {
    const target=new URL(file,current);target.search=current.search;link.href=target;
    if(current.pathname.endsWith(file))link.setAttribute('aria-current','page');
  }
}
}
refreshPrivateLinks();
function closeMenu(restoreFocus=false) {
  menu.hidden=true;toggle.setAttribute('aria-expanded','false');
  if(restoreFocus)toggle.focus();
}
toggle.addEventListener('click',()=>{
  const open=menu.hidden;menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open));
  if(open)menu.querySelector('a').focus();
});
document.addEventListener('click',event=>{if(!event.target.closest('.avatar-menu'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!menu.hidden){closeMenu(true);event.preventDefault();}});
