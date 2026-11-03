// Throwaway local recovery specimen: no email, user data or auth requests are sent.
import {t,localize} from './public-copy.js';
import {mountPublicNavigation} from './public-navigation.js?v=recovery1';
mountPublicNavigation();
localize(document.querySelector('.auth-preferences'));
localize(document.querySelector('.login-band'));
localize(document.querySelector('.privacy-review'));
document.title=t('Forgot password?')+' — AIHarder';
const form=document.querySelector('#recovery-form'),email=document.querySelector('#recovery-email'),submit=document.querySelector('#recovery-submit'),feedback=document.querySelector('#recovery-feedback');
const request=document.querySelector('#recovery-request'),sent=document.querySelector('#recovery-sent'),flow=document.querySelector('.recovery-flow');
const message=text=>{feedback.textContent=t(text);feedback.dataset.kind=text?'error':'info';};
const showSent=(focus=true)=>{email.value='';request.hidden=true;sent.hidden=false;flow.setAttribute('aria-labelledby','sent-title');if(focus)document.querySelector('#sent-title').focus();};
form.addEventListener('submit',event=>{
 event.preventDefault();
 if(submit.disabled)return;
 email.removeAttribute('aria-invalid');
 if(!email.value.trim()||!email.validity.valid){email.setAttribute('aria-invalid','true');message(email.value.trim()?'Enter a valid email address.':'Enter your email address.');email.focus();return;}
 email.disabled=submit.disabled=true;message('');submit.querySelector('span').textContent=t('Sending…');
 const spinner=document.createElement('i');spinner.className='icon';spinner.setAttribute('aria-hidden','true');spinner.style.setProperty('--icon',"url('./assets/lucide/loader-circle.svg')");submit.prepend(spinner);
 setTimeout(()=>{spinner.remove();submit.querySelector('span').textContent=t('Send reset link');email.disabled=submit.disabled=false;showSent();},650);
});
document.querySelector('#try-another-email').addEventListener('click',()=>{sent.hidden=true;request.hidden=false;flow.setAttribute('aria-labelledby','recovery-title');email.removeAttribute('aria-invalid');message('');email.focus();});
const previewLinks=()=>{for(const [id,state]of [['sent-preview','sent'],['request-preview','']]){const url=new URL(location.href);url.searchParams.delete('state');if(state)url.searchParams.set('state',state);document.getElementById(id).href=url;}};
previewLinks();document.querySelector('#appearance').addEventListener('click',previewLinks);
message('');email.disabled=submit.disabled=false;
if(new URLSearchParams(location.search).get('state')==='sent')showSent(false);
