// Settings design specimen. All identities, gyms and changes are fictional/local.
import {t,localize} from './public-copy.js';
import {refreshPrivateLinks} from './private-shell.js?v=cards1';
import {mountPublicNavigation} from './public-navigation.js?v=recovery1';
import {mountSettingsGuide} from './settings-onboarding.js?v=3';
mountPublicNavigation();
for (const selector of ['.compact-identity','.compact-review','.frame-heading','#dialog-cancel']) localize(document.querySelector(selector));
document.title=t(document.body.dataset.page==='account'?'Account settings':'Settings')+' — AIHarder';
const params=new URLSearchParams(location.search);
const accountPage=document.body.dataset.page==='account';
const onboarding=!accountPage&&params.get('onboarding')==='1';
const guide=onboarding?mountSettingsGuide(t):null;
document.body.classList.toggle('settings-onboarding',onboarding);
let linked=!onboarding&&params.get('state')!=='missing-connection';
let booking=true, publication=true, savedBooking=true, savedPublication=true;
let googleLinked=true, hasPassword=params.get('auth')!=='google-only', serial=3;
const gyms=[{id:'central',name:'Example Gym · Central'},{id:'north',name:'Example Gym · North'}];
let defaultGym='central',savedGym='central';
const initialClients=()=>[{id:1,name:'ChatGPT'},{id:2,name:'Hermes'}];
let clients=onboarding?[]:initialClients();
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
  if(onboarding) {
    if(!linked)return `<div class="aimharder-onboarding-callout"><div><strong>${t('Connect your account')}</strong><p>${t('Choose a default gym once you’re connected.')}</p></div><button class="primary" type="button" id="connect-upstream" data-action="connect-upstream">${t('Connect AimHarder')}</button></div>`;
    return `<div class="onboarding-account-grid"><div><span class="detail-label">${t('Account')}</span><div class="account-detail"><span>alex@example.com</span>${button('Disconnect','disconnect-upstream')}</div></div><div><label class="detail-label" for="default-gym">${t('Default gym')}</label>${gymSelect('default-gym',defaultGym)}</div></div>`;
  }
  return `<div class="account-detail"><div><span class="detail-label">${t('Account')}</span><p class="detail-value">${linked?'alex@example.com':t('Not connected')}</p></div>${linked?button('Disconnect','disconnect-upstream'):button('Connect AimHarder','connect-upstream')}</div>${gymSettings()}`;
}
function gymSelect(id,selected) {
  const available=params.get('gyms')==='single'?gyms.slice(0,1):gyms;
  return `<select class="settings-gym-select" id="${id}" name="default-gym">${available.map(gym=>`<option value="${gym.id}" ${selected===gym.id?'selected':''}>${t(gym.name)}</option>`).join('')}</select>`;
}
function clientName(client) {
  const repeated=clients.filter(item=>item.name===client.name).length>1;
  return t(client.name)+(repeated?' · #'+client.id:'');
}
function appContent() {
  if(onboarding&&!clients.length)return `<p class="onboarding-empty-apps"><span>${icon('message-circle')}</span>${t('No AI apps connected yet')}</p>`;
  return `<div class="client-list">${clients.map(client=>`<div class="client-row">${clientIcon(client.name)}<strong class="client-identity">${clientName(client)}</strong>${button('Disconnect','disconnect-client','client-'+client.id,`data-client="${client.id}" aria-label="${t('Disconnect')} ${clientName(client)}"`)}</div>`).join('')||`<p class="empty-apps">${t('No apps authorized.')}</p>`}</div>${onboarding?'':`<div class="client-add">${button('Connect an app','add-client')}</div>`}`;
}
function confirmationContent() {
  const editable=linked||onboarding;
  return `<div class="confirmation-options">${[['booking',booking,'Ask for confirmation when making a reservation'],['publication',publication,'Ask for confirmation when posting a new workout']].map(([id,checked,label])=>`<label class="confirmation-option"><span>${t(label)}</span><input type="checkbox" role="switch" id="${id}-confirmation" ${checked?'checked':''} ${editable?'':'disabled'} aria-describedby="${editable?'policy-note':'dependency-note'}"></label>`).join('')}</div>${editable?'':`<p class="dependency-note" id="dependency-note">${t('Connect AimHarder to edit these preferences.')}</p>`}<p class="policy-note" id="policy-note">${t('Cancellations and deletions always require confirmation.')}</p>`;
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
  const appAction=onboarding?`<button class="${linked?'primary':'secondary'}" type="button" id="add-client" data-action="add-client">${t('Connect an app')}</button>`:'';
  document.querySelector('#account-sections').innerHTML=sections.map(([label,content],i)=>`<section class="account-section ${!accountPage&&i===0?'aimharder-card':''}" aria-labelledby="section-${i}"><div class="section-heading"><h2 id="section-${i}" tabindex="-1">${t(label)}</h2>${i===1?appAction:''}</div><div class="section-content">${content}</div></section>`).join('');
  const actions=document.querySelector('#global-actions');
  actions.innerHTML=accountPage?'':`<button class="quiet-button" type="button" id="discard-preferences" data-action="discard">${t('Cancel')}</button><button class="primary" type="button" id="save-preferences" data-action="save">${t('Save changes')}</button>`;
  actions.hidden=accountPage;
  updateActions();
  for(const control of document.querySelectorAll('[data-fixture]'))control.setAttribute('aria-pressed',String(control.dataset.fixture===(linked?'configured':'missing-connection')));
}
function updateActions() {
  if(accountPage)return;
  const canSave=(linked||onboarding)&&dirty();
  document.querySelector('#save-preferences').disabled=!canSave;
  document.querySelector('#discard-preferences').disabled=!canSave;
}

const dialog=document.querySelector('#settings-dialog');
let dialogAction='',dialogClient=null,returnFocus='',celebrateAfterDialog=false;
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
  guide?.hide();
  document.querySelector('#dialog-title').textContent=t(title);document.querySelector('#dialog-content').innerHTML=content;
  document.querySelector('#dialog-accept').textContent=t(accept);dialog.showModal();
}
function resetPreferences(){booking=publication=savedBooking=savedPublication=true;defaultGym=savedGym;}
document.querySelector('.account-frame').addEventListener('click',event=>{
  const control=event.target.closest('button');if(!control||control.disabled)return;
  if(control.dataset.action==='save'||control.dataset.action==='discard') {
    if(control.dataset.action==='save'&&(linked||onboarding)){savedBooking=booking;savedPublication=publication;savedGym=defaultGym;feedback('Saved');}
    else {booking=savedBooking;publication=savedPublication;defaultGym=savedGym;feedback('');}
    render();document.querySelector('#frame-title').focus();return;
  }
  const client=clients.find(item=>item.id===Number(control.dataset.client));
  showDialog(control.dataset.action,client,control);
});
document.querySelector('#account-sections').addEventListener('change',event=>{
  if(event.target.name==='default-gym'&&linked&&gyms.some(gym=>gym.id===event.target.value)) {
    defaultGym=event.target.value;
    if(onboarding)updateActions();
    else {render();document.querySelector(`input[name="default-gym"][value="${defaultGym}"]`).focus();}
    feedback('');return;
  }
  if(!linked&&!onboarding)return;
  if(event.target.id==='booking-confirmation')booking=event.target.checked;
  if(event.target.id==='publication-confirmation')publication=event.target.checked;
  updateActions();feedback('');
});
document.querySelector('#dialog-cancel').addEventListener('click',()=>dialog.close());
document.querySelector('#dialog-accept').addEventListener('click',()=>{
  let message='';
  if(onboarding&&dialogAction==='connect-upstream') {
    dialogAction='confirm-upstream';
    document.querySelector('#dialog-title').textContent=t('Confirm your AimHarder account');
    document.querySelector('#dialog-content').innerHTML=`<div class="connection-review"><span class="detail-label">${t('Account')}</span><p>alex@example.com</p><label class="detail-label" for="connection-gym">${t('Default gym')}</label>${gymSelect('connection-gym',defaultGym)}</div>`;
    document.querySelector('#dialog-accept').textContent=t('Save connection');
    document.querySelector('#connection-gym').focus();
    return;
  }
  if(dialogAction==='disconnect-upstream'){linked=false;if(!onboarding)resetPreferences();}
  else if(dialogAction==='connect-upstream'){linked=true;resetPreferences();}
  else if(dialogAction==='confirm-upstream'){linked=true;savedGym=defaultGym=document.querySelector('#connection-gym').value;}
  else if(dialogAction==='disconnect-client'){clients=clients.filter(client=>client.id!==dialogClient.id);}
  else if(dialogAction==='add-client') {
    const chosen=dialog.querySelector('input[name=example-provider]:checked')?.value;
    if(['ChatGPT','Hermes','Other clients'].includes(chosen)) {
      celebrateAfterDialog=onboarding&&linked&&clients.length===0;
      clients.push({id:serial++,name:chosen});
    }
  } else if(dialogAction==='disconnect-google'&&hasPassword)googleLinked=false;
  else if(dialogAction==='connect-google')googleLinked=true;
  else if(dialogAction==='change-email')message='Email verification preview · No email sent';
  else if(dialogAction==='change-password'){hasPassword=true;message='Password update preview · No password changed';}
  render();feedback(message);dialog.close();
});
dialog.addEventListener('close',()=>{
  const section=accountPage?0:dialogAction.includes('upstream')?0:1;
  (document.getElementById(returnFocus)||document.querySelector('#section-'+section)).focus();
  if(celebrateAfterDialog){celebrateAfterDialog=false;guide.finish();}
  else if(guide&&!linked)guide.show('account',true);
  else if(guide&&!clients.length)guide.show('app',true);
});
for(const control of document.querySelectorAll('[data-fixture]'))control.addEventListener('click',()=>{
  guide?.hide();
  linked=control.dataset.fixture==='configured';
  if(linked||onboarding)clients=linked?initialClients():[];
  resetPreferences();feedback('');render();
  if(guide&&!linked){guide.reset();guide.show('account',true);}
});
document.querySelector('#appearance').addEventListener('click',()=>{syncUrl();refreshPrivateLinks();});render();
guide?.show('account');
