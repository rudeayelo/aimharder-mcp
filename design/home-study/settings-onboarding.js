// Local walkthrough layered over the real Settings controls.
export function mountSettingsGuide(t) {
  const guide = document.createElement('div');
  guide.className = 'settings-guide';
  guide.hidden = true;
  guide.innerHTML = `
    <div class="guide-spotlight" aria-hidden="true"></div>
    <div class="guide-cue">
      <span class="guide-kettle" data-renderer="poster" aria-hidden="true"><img alt="" src="assets/kettle-hero-attention.png"></span>
      <p class="guide-bubble" id="settings-guide-message" role="status"></p>
    </div>
    <button type="button" class="guide-skip">${t('Skip guide')}</button>
  `;
  const success = document.createElement('dialog');
  success.className = 'guide-success';
  success.setAttribute('aria-labelledby', 'guide-success-message');
  success.innerHTML = `
    <span class="guide-kettle" data-renderer="poster" aria-hidden="true"><img alt="" src="assets/kettle-neutral.png"></span>
    <div class="guide-success-card">
      <p id="guide-success-message"></p>
      <button class="primary" type="button">${t('Done')}</button>
    </div>
  `;
  document.body.append(guide, success);

  const spotlight = guide.querySelector('.guide-spotlight');
  const cue = guide.querySelector('.guide-cue');
  const message = guide.querySelector('.guide-bubble');
  const skip = guide.querySelector('.guide-skip');
  const guideKettle = guide.querySelector('.guide-kettle');
  const successKettle = success.querySelector('.guide-kettle');
  let target, trigger, dismissed = false;
  let kettle, activeKettle;

  import('./onboarding-kettle.js?v=1')
    .then(({createOnboardingKettle}) => createOnboardingKettle())
    .then(renderer => {
      kettle = renderer;
      if (activeKettle) kettle.show(activeKettle, activeKettle === successKettle);
    })
    .catch(() => {
      for (const element of [guideKettle, successKettle]) element.dataset.renderer = 'poster';
    });

  function showKettle(element) {
    activeKettle = element;
    kettle?.show(element, element === successKettle);
  }

  function hideKettle() {
    activeKettle = null;
    kettle?.hide();
  }

  function position() {
    if (guide.hidden || !target?.isConnected) return;
    const rect = target.getBoundingClientRect();
    const compact = innerWidth <= 550;
    const cueWidth = cue.offsetWidth;
    const inset = guide.dataset.step === 'account' ? 0 : 5;
    Object.assign(spotlight.style, {
      left: `${rect.left - inset}px`, top: `${rect.top - inset}px`,
      width: `${rect.width + inset * 2}px`, height: `${rect.height + inset * 2}px`,
    });
    const preferredLeft = guide.dataset.step === 'account' ? rect.left + 9 : rect.right - cueWidth;
    cue.style.left = `${Math.max(12, Math.min(preferredLeft, innerWidth - cueWidth - 12))}px`;
    cue.style.top = `${Math.max(8, rect.top - (compact ? 76 : 96))}px`;
  }

  function hide() {
    guide.hidden = true;
    trigger?.removeAttribute('aria-describedby');
    hideKettle();
  }

  function show(step, focus = false) {
    if (dismissed) return;
    trigger = document.querySelector(step === 'account' ? '#connect-upstream' : '#add-client');
    target = step === 'account' ? trigger.closest('.aimharder-onboarding-callout') : trigger;
    guide.dataset.step = step;
    message.textContent = t(step === 'account' ? 'First, connect your AimHarder account!' : 'Now connect your AI app!');
    trigger.setAttribute('aria-describedby', message.id);
    target.scrollIntoView({block: 'nearest'});
    if (target.getBoundingClientRect().top < 112) target.scrollIntoView({block: 'center'});
    if (focus) trigger.focus({preventScroll: true});
    guide.hidden = false;
    position();
    showKettle(guideKettle);
  }

  function dismiss() {
    dismissed = true;
    hide();
  }

  skip.addEventListener('click', () => {
    dismiss();
    trigger?.focus();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !guide.hidden) {
      dismiss();
      event.preventDefault();
    }
  });
  document.addEventListener('focusin', event => {
    if (!guide.hidden && event.target !== trigger && event.target !== skip && !target.contains(event.target)) dismiss();
  });
  window.addEventListener('scroll', position, {passive: true});
  window.addEventListener('resize', position);
  success.querySelector('button').addEventListener('click', () => success.close());
  success.addEventListener('close', () => {
    hideKettle();
    document.querySelector('#section-1').focus({preventScroll: true});
  });

  return {
    show, hide,
    reset() { dismissed = false; },
    finish() {
      hide();
      if (dismissed) return;
      dismissed = true;
      success.querySelector('#guide-success-message').textContent = t('You’re ready to use AIHarder in your app!');
      success.showModal();
      showKettle(successKettle);
    },
  };
}
