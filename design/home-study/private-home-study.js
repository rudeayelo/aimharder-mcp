// Settings design specimen. All identities, gyms and changes are fictional/local.
import {t,localize} from './public-copy.js';
import {refreshPrivateLinks} from './private-shell.js?v=cards1';
import {mountPublicNavigation} from './public-navigation.js?v=recovery1';
mountPublicNavigation();
for (const selector of ['.compact-identity','.compact-review','.frame-heading','#dialog-cancel']) localize(document.querySelector(selector));
document.title=t(document.body.dataset.page==='account'?'Account settings':'Settings')+' — AIHarder';
const params=new URLSearchParams(location.search);
const accountPage=document.body.dataset.page==='account';
let linked=params.get('state')!=='missing-connection';
let booking=true, publication=true, savedBooking=true, savedPublication=true;
let googleLinked=true, hasPassword=params.get('auth')!=='google-only', serial=3;
const gyms=[{id:'central',name:'Example Gym · Central'},{id:'north',name:'Example Gym · North'}];
let defaultGym='central',savedGym='central';
const initialClients=()=>[{id:1,name:'ChatGPT'},{id:2,name:'Hermes'}];
let clients=initialClients();
const icon=name=>`<i class="icon" aria-hidden="true" style="--icon:url('./assets/lucide/${name}.svg')"></i>`;
function clientIcon(name) {
  const pair=name==='ChatGPT'?['chatgpt-light.png','chatgpt-dark.png']:name==='Hermes'?['hermes-selfhst-light.svg','hermes-selfhst-dark.svg']:null;
  return pair?`<img class="provider-mark-light" alt="" src="assets/apps/${pair[0]}"><img class="provider-mark-dark" alt="" src="assets/apps/${pair[1]}">`:icon('message-circle');
}
const dirty=()=>defaultGym!==savedGym||booking!==savedBooking||publication!==savedPublication;
const feedback=text=>document.querySelector('#frame-feedback').textContent=t(text);
const button=(label,action,id='',extra='')=>`<button class="secondary" type="button" data-action="${action}" id="${id||action}" ${extra}>${t(label)}</button>`;
function gymSettings() {
  const available=params.get('gyms')==='single'?gyms.slice(0,1):gyms;
  const plural=available.length>1;
  return `<div class="gym-heading"><span id="gym-label" class="detail-label">${t(plural?'Your gyms':'Your gym')}</span>${plural?`<p class="gym-help" id="gym-help">${t('Used when you don’t specify a gym in your request.')}</p>`:''}</div><fieldset class="gym-settings" aria-labelledby="gym-label" ${plural?'aria-describedby="gym-help"':''} ${linked?'':'disabled'}>${available.map(gym=>`<label class="gym-option">${plural?`<input type="radio" name="default-gym" value="${gym.id}" ${defaultGym===gym.id?'checked':''} aria-label="${t('Use as default')}: ${t(gym.name)}">`:''}<span>${t(gym.name)}</span>${defaultGym===gym.id?`<small>${t('Default')}</small>`:''}</label>`).join('')}</fieldset>${linked?'':`<p class="dependency-note">${t('Connect AimHarder to choose a gym.')}</p>`}`;
}
function upstreamContent() {
  return `<div class="account-detail"><div><span class="detail-label">${t('Account')}</span><p class="detail-value">${linked?'alex@example.com':t('Not connected')}</p></div>${linked?button('Disconnect','disconnect-upstream'):button('Connect AimHarder','connect-upstream')}</div>${gymSettings()}`;
}
function clientName(client) {
  const repeated=clients.filter(item=>item.name===client.name).length>1;
  return t(client.name)+(repeated?' · #'+client.id:'');
}
function appContent() {
  return `<div class="client-list">${clients.map(client=>`<div class="client-row">${clientIcon(client.name)}<strong class="client-identity">${clientName(client)}</strong>${button('Disconnect','disconnect-client','client-'+client.id,`data-client="${client.id}" aria-label="${t('Disconnect')} ${clientName(client)}"`)}</div>`).join('')||`<p class="empty-apps">${t('No apps authorized.')}</p>`}</div><div class="client-add">${button('Connect an app','add-client')}</div>`;
}
function confirmationContent() {
  return `<div class="confirmation-options">${[['booking',booking,'Ask for confirmation when making a reservation'],['publication',publication,'Ask for confirmation when posting a new workout']].map(([id,checked,label])=>`<label class="confirmation-option"><span>${t(label)}</span><input type="checkbox" role="switch" id="${id}-confirmation" ${checked?'checked':''} ${linked?'':'disabled'} aria-describedby="${linked?'policy-note':'dependency-note'}"></label>`).join('')}</div>${linked?'':`<p class="dependency-note" id="dependency-note">${t('Connect AimHarder to edit these preferences.')}</p>`}<p class="policy-note" id="policy-note">${t('Cancellations and deletions always require confirmation.')}</p>`;
}
function accountContent() {
  return `<div class="user-setting"><div><span class="detail-label">${t('Email')}</span><p class="detail-value">alex@example.com</p></div>${button('Change email','change-email')}</div><div class="user-setting"><div class="google-identity"><img src="assets/google-g.png" alt=""><div><span class="detail-value">Google</span><p class="detail-label">${googleLinked?'alex@example.com':t('Not connected')}</p></div></div>${googleLinked?button('Disconnect','disconnect-google','disconnect-google',`${hasPassword?'':'disabled aria-describedby="google-dependency"'} aria-label="${t('Disconnect Google')}"`):button('Connect Google','connect-google')}</div>${googleLinked&&!hasPassword?`<p class="dependency-note" id="google-dependency">${t('Add a password before disconnecting Google.')}</p>`:''}<div class="user-setting"><div><span class="detail-label">${t('AIHarder password')}</span><p class="detail-value">${hasPassword?'••••••••':t('Not set')}</p></div>${button(hasPassword?'Change password':'Add password','change-password')}</div>`;
}
function syncUrl() {
  const url=new URL(location.href);url.searchParams.delete('layout');url.searchParams.delete('step');
  url.searchParams.set('state',linked?'configured':'missing-connection');history.replaceState(null,'',url);
}
function render() {
  syncUrl();refreshPrivateLinks();
  const sections=accountPage?[['Account settings',accountContent()]]:[['AimHarder',upstreamContent()],['AI apps',appContent()],['Confirmations',confirmationContent()]];
  document.querySelector('#account-sections').innerHTML=sections.map(([label,content],i)=>`<section class="account-section ${!accountPage&&i===0?'aimharder-card':''}" aria-labelledby="section-${i}"><div class="section-heading"><h2 id="section-${i}" tabindex="-1">${t(label)}</h2></div><div class="section-content">${content}</div></section>`).join('');
  const actions=document.querySelector('#global-actions');
  actions.innerHTML=accountPage?'':`<button class="quiet-button" type="button" id="discard-preferences" data-action="discard" ${linked&&dirty()?'':'disabled'}>${t('Cancel')}</button><button class="primary" type="button" id="save-preferences" data-action="save" ${linked&&dirty()?'':'disabled'}>${t('Save changes')}</button>`;
  actions.hidden=accountPage;
  for(const control of document.querySelectorAll('[data-fixture]'))control.setAttribute('aria-pressed',String(control.dataset.fixture===(linked?'configured':'missing-connection')));
}
function updateActions() {
  if(accountPage)return;
  document.querySelector('#save-preferences').disabled=!linked||!dirty();
  document.querySelector('#discard-preferences').disabled=!linked||!dirty();
}

const dialog=document.querySelector('#settings-dialog');
let dialogAction='',dialogClient=null,returnFocus='';
const exampleField=(label,value)=>`<span class="example-field-label">${t(label)}</span><div class="example-field">${value}</div>`;
function showDialog(action,client,opener) {
  dialogAction=action;dialogClient=client;returnFocus=opener.id;
  let title='',content='',accept='';
  if(action==='disconnect-upstream') {
    title='Disconnect AimHarder?';content=`<p>${t('Your AI apps keep their access. Reconnect AimHarder to use your training data.')}</p>`;accept='Disconnect';
  } else if(action==='disconnect-client') {
    title=t('Disconnect')+' '+clientName(client)+'?';content=`<p>${t('Only this installation loses access. Your other connections stay in place.')}</p>`;accept='Disconnect';
  } else if(action==='connect-upstream') {
    title='Connect AimHarder';content=`<div role="img" aria-label="${t('Fictional AimHarder login fields')}">${exampleField('AimHarder username','alex@example.com')}${exampleField('AimHarder password','••••••••')}</div>`;accept='Connect';
  } else if(action==='add-client') {
    title='Connect an app';content=`<div class="provider-list" role="group" aria-label="${t('Choose your AI app')}">${['ChatGPT','Hermes','Other clients'].map((name,i)=>`<label class="provider-option">${clientIcon(name)}<span>${t(name)}</span><input type="radio" name="example-provider" value="${name}" ${i===0?'checked':''}></label>`).join('')}</div>`;accept='Connect app';
  } else if(action==='change-email') {
    title='Change email';content=`<p>${t('Verify your new email before it replaces your current one.')}</p><div role="img" aria-label="${t('Fictional email example')}">${exampleField('New email','alex.new@example.com')}</div>`;accept='Send verification';
  } else if(action==='change-password') {
    title=hasPassword?'Change password':'Add password';content=`<div role="img" aria-label="${t('Fictional password examples')}">${hasPassword?exampleField('Current password','••••••••'):''}${exampleField('New password','••••••••••••')}${exampleField('Confirm new password','••••••••••••')}</div>`;accept=title;
  } else if(action==='disconnect-google') {
    title='Disconnect Google?';content=`<p>${t('You can still sign in with your AIHarder password.')}</p>`;accept='Disconnect';
  } else if(action==='connect-google') {
    title='Connect Google';content=`<div class="google-identity"><img src="assets/google-g.png" alt=""><span>alex@example.com</span></div><p class="dialog-note">${t('Use the Google account with the same verified email.')}</p>`;accept='Continue with Google';
  } else return;
  document.querySelector('#dialog-title').textContent=t(title);document.querySelector('#dialog-content').innerHTML=content;
  document.querySelector('#dialog-accept').textContent=t(accept);dialog.showModal();
}
function resetPreferences(){booking=publication=savedBooking=savedPublication=true;defaultGym=savedGym;}
document.querySelector('.account-frame').addEventListener('click',event=>{
  const control=event.target.closest('button');if(!control||control.disabled)return;
  if(control.dataset.action==='save'||control.dataset.action==='discard') {
    if(control.dataset.action==='save'&&linked){savedBooking=booking;savedPublication=publication;savedGym=defaultGym;feedback('Saved');}
    else {booking=savedBooking;publication=savedPublication;defaultGym=savedGym;feedback('');}
    render();document.querySelector('#frame-title').focus();return;
  }
  const client=clients.find(item=>item.id===Number(control.dataset.client));
  showDialog(control.dataset.action,client,control);
});
document.querySelector('#account-sections').addEventListener('change',event=>{
  if(event.target.name==='default-gym'&&linked&&gyms.some(gym=>gym.id===event.target.value)) {
    defaultGym=event.target.value;render();document.querySelector(`input[name="default-gym"][value="${defaultGym}"]`).focus();feedback('');return;
  }
  if(!linked)return;
  if(event.target.id==='booking-confirmation')booking=event.target.checked;
  if(event.target.id==='publication-confirmation')publication=event.target.checked;
  updateActions();feedback('');
});
document.querySelector('#dialog-cancel').addEventListener('click',()=>dialog.close());
document.querySelector('#dialog-accept').addEventListener('click',()=>{
  let message='';
  if(dialogAction==='disconnect-upstream'){linked=false;resetPreferences();}
  else if(dialogAction==='connect-upstream'){linked=true;resetPreferences();}
  else if(dialogAction==='disconnect-client'){clients=clients.filter(client=>client.id!==dialogClient.id);}
  else if(dialogAction==='add-client') {
    const chosen=dialog.querySelector('input[name=example-provider]:checked')?.value;
    if(['ChatGPT','Hermes','Other clients'].includes(chosen))clients.push({id:serial++,name:chosen});
  } else if(dialogAction==='disconnect-google'&&hasPassword)googleLinked=false;
  else if(dialogAction==='connect-google')googleLinked=true;
  else if(dialogAction==='change-email')message='Email verification preview · No email sent';
  else if(dialogAction==='change-password'){hasPassword=true;message='Password update preview · No password changed';}
  render();feedback(message);dialog.close();
});
dialog.addEventListener('close',()=>{
  const section=accountPage?0:dialogAction.includes('upstream')?0:1;
  (document.getElementById(returnFocus)||document.querySelector('#section-'+section)).focus();
});
for(const control of document.querySelectorAll('[data-fixture]'))control.addEventListener('click',()=>{
  linked=control.dataset.fixture==='configured';if(linked)clients=initialClients();resetPreferences();feedback('');render();
});
document.querySelector('#appearance').addEventListener('click',()=>{syncUrl();refreshPrivateLinks();});render();
