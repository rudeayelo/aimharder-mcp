// Local interaction specimen only: never send, log or persist field values.
import {lang,t,localize} from './public-copy.js';
import {mountPublicNavigation} from './public-navigation.js';
mountPublicNavigation();
localize(document.querySelector('.auth-preferences'));
localize(document.querySelector('.login-band'));localize(document.querySelector('.privacy-review'));localize(document.querySelector('dialog'));
document.title=t('Sign in')+' — AIHarder';
const form=document.querySelector('#login-form'),email=document.querySelector('#email'),password=document.querySelector('#password'),submit=document.querySelector('#login-submit'),feedback=document.querySelector('#form-feedback');
const label=submit.querySelector('span');
const message=(text,kind='info')=>{feedback.textContent=t(text);feedback.dataset.kind=kind;};
const notice=document.querySelector('#login-notice');
for(const [id,title,body] of [
 ['google-signin','Google sign-in','Google sign-in will be connected during implementation. This preview does not contact Google or connect an account.'],
 ['forgot-password','Password recovery','The password recovery page is the next design step. This preview sends no recovery email.'],
 ['resend-verification','Email verification','The verification page will be designed separately. This preview sends no verification email.']
])document.querySelector('#'+id).addEventListener('click',()=>{notice.querySelector('h2').textContent=t(title);notice.querySelector('p').textContent=t(body);notice.showModal();});
form.addEventListener('submit',event=>{
 event.preventDefault();
 for(const input of [email,password])input.removeAttribute('aria-invalid');
 if(!email.value.trim()||!email.validity.valid){email.setAttribute('aria-invalid','true');message(email.value.trim()?'Enter a valid email address.':'Enter your email address.','error');email.focus();return;}
 if(!password.value){password.setAttribute('aria-invalid','true');message('Enter your password.','error');password.focus();return;}
 submit.disabled=true;email.disabled=password.disabled=true;label.textContent=t('Signing in…');message('');
 const spinner=document.createElement('i');spinner.className='icon';spinner.setAttribute('aria-hidden','true');spinner.style.setProperty('--icon',"url('./assets/lucide/loader-circle.svg')");submit.prepend(spinner);
 setTimeout(()=>{spinner.remove();submit.disabled=false;email.disabled=password.disabled=false;password.value='';label.textContent=t('Sign in');message('Preview only. No sign-in request was sent.');},650);
});
if(new URLSearchParams(location.search).get('state')==='error')message('We couldn’t sign you in. Check your details and try again.','error');
const updatePreviewLinks=()=>{for(const [id,state]of [['error-preview','error'],['reset-preview','']]){const url=new URL(location.href);url.searchParams.set('lang',lang);if(state)url.searchParams.set('state',state);else url.searchParams.delete('state');document.querySelector('#'+id).href=url;}};
updatePreviewLinks();document.querySelector('#appearance').addEventListener('click',updatePreviewLinks);

// Enable only after all local submit handlers are installed; HTML fails closed.
if(new URLSearchParams(location.search).get('state')!=='error')message('');
email.disabled=password.disabled=submit.disabled=false;
