/* Raster UI v0.3.0 — pixel particles and interaction, no dependencies. */
(function (global) {
  'use strict';
  if (global.RasterUI) return;
  const SPRITE = `<svg id="rg-symbols" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>
<pattern id="rg-dither" width="2" height="2" patternUnits="userSpaceOnUse"><path d="M0 0h1v1H0zM1 1h1v1H1z" fill="currentColor"/></pattern>
<symbol id="rg-i-grid" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M2 2h8v8H2zm2 2v4h4V4zm10-2h8v8h-8zm2 2v4h4V4zM2 14h8v8H2zm2 2v4h4v-4zm10-2h8v8h-8zm2 2v4h4v-4z"/></symbol>
<symbol id="rg-i-folder" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M3 4h7v2h3v2h9v14H2V6h1zm1 3v13h16V10h-9V8H9V7z"/></symbol>
<symbol id="rg-i-design" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M4 2h8v2h2v3h8v15H2V5h2zm1 4v14h15V9h-8V7h-2V6z"/><path d="M5 17h3v-2h3v-2h3v-2h6v9H5z" fill="url(#rg-dither)"/></symbol>
<symbol id="rg-i-web" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M2 2h20v2h1v18H1V4h1zm1 2v4h18V4zm0 6v10h18V10z"/><path d="M5 5h1v2H5zm3 0h1v2H8zm3 0h1v2h-1z"/></symbol>
<symbol id="rg-i-phone" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M6 1h12v1h1v20h-1v1H6v-1H5V2h1zm1 3v16h10V4z"/><path d="M8 5h4v1H8zm0 3h2v1H8zm1 9h6v1H9z"/></symbol>
<symbol id="rg-i-doc" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M4 1h11v2h3v2h2v3h1v15H3V1zm1 2v18h14V9h-6V3z"/><path d="M7 11h10v2H7zm0 4h10v2H7zm0 4h7v1H7z"/></symbol>
<symbol id="rg-i-data" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M5 2h14v2h3v16h-3v2H5v-2H2V4h3zm1 2v2h12V4zM4 6v4h2v2h12v-2h2V6h-2v2H6V6zm0 8v4h2v2h12v-2h2v-4h-2v2H6v-2z"/></symbol>
<symbol id="rg-i-gear" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M9 1h6v3h3V3h3v3h-1v3h3v6h-3v3h1v3h-3v-1h-3v3H9v-3H6v1H3v-3h1v-3H1V9h3V6H3V3h3v1h3zm2 3v3H7v4H4v2h3v4h4v3h2v-3h4v-4h3v-2h-3V7h-4V4zm-1 5h4v1h1v4h-1v1h-4v-1H9v-4h1z"/></symbol>
<symbol id="rg-i-search" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M6 2h8v2h2v2h2v8h-2v2h-2v2H6v-2H4v-2H2V6h2V4h2zm0 4v8h8V6z"/><path d="M16 16h2v2h2v2h2v3h-3v-3h-3z"/></symbol>
<symbol id="rg-i-arrow" viewBox="0 0 24 24"><path d="M13 3h2v3h3v3h3v2h2v2h-2v2h-3v3h-3v3h-2v-4h3v-3H2v-3h14V8h-3z"/></symbol>
<symbol id="rg-i-plus" viewBox="0 0 24 24"><path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z"/></symbol>
<symbol id="rg-i-add" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M2 2h20v20H2zm8 4v4H6v4h4v4h4v-4h4v-4h-4V6z"/></symbol>
<symbol id="rg-i-close" viewBox="0 0 24 24"><path d="M3 3h4v4h3v3h4V7h3V3h4v4h-4v3h-3v4h3v3h4v4h-4v-4h-3v-3h-4v3H7v4H3v-4h4v-3h3v-4H7V7H3z"/></symbol>
<symbol id="rg-i-check" viewBox="0 0 24 24"><path d="M2 11h4v4h4v-4h3V8h3V5h3V2h3v6h-3v3h-3v3h-3v3h-3v4H6v-4H2z"/></symbol>
</defs></svg>`;
  const ICON_NAMES = ['grid','folder','design','web','phone','doc','data','gear','search','arrow','plus','add','close','check'];
  const initialized = new WeakSet(), loadingStates = new WeakMap(), dialogOpeners = new WeakMap();
  const motions = new WeakMap(), runningMotions = new Set(), closingDialogs = new WeakMap(), feedbackTimers = new WeakMap();
  const systemMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let motionPreference = 'auto';
  try { if (localStorage.getItem('raster-ui.motion') === 'reduced') motionPreference = 'reduced'; } catch {}
  const q = (s, root = document) => root.querySelector(s);
  const all = (s, root = document) => [...root.querySelectorAll(s)];
  let unique = 0, eventsInstalled = false;
  function emit(el, name, detail) { el.dispatchEvent(new CustomEvent(name, { bubbles: true, detail })); }
  function reducedMotion() { return motionPreference === 'reduced' || systemMotion.matches; }
  function cancelMotion(el) {
    const active = motions.get(el);
    if (active) { active.cancel(); runningMotions.delete(active); motions.delete(el); }
  }
  async function play(el, frames, duration = 160, steps = 2, delay = 0) {
    cancelMotion(el);
    if (reducedMotion() || !el?.isConnected || typeof el.animate !== 'function') return;
    const token = {80:'press',120:'exit',160:'select',200:'enter',240:'confirm'}[duration];
    if (token) {
      const value = getComputedStyle(el).getPropertyValue('--rg-motion-' + token).trim();
      const parsed = parseFloat(value) * (value.endsWith('ms') ? 1 : 1000);
      if (Number.isFinite(parsed) && parsed >= 0) duration = parsed;
    }
    const animation = el.animate(frames, { duration, delay, easing: `steps(${steps}, end)`, fill: 'both' });
    motions.set(el, animation); runningMotions.add(animation);
    try { await animation.finished; } catch {} finally {
      runningMotions.delete(animation);
      if (motions.get(el) === animation) { animation.cancel(); motions.delete(el); }
    }
  }
  function applyMotionPreference() {
    document.documentElement.dataset.rgMotion = reducedMotion() ? 'reduced' : 'full';
    if (reducedMotion()) for (const animation of runningMotions) animation.cancel();
    emit(document, 'rg:motionchange', getMotion());
  }
  function getMotion() { return { preference: motionPreference, reduced: reducedMotion() }; }
  // A single, short-lived pixel canvas. No idle render loop or input interception.
  const particleJobs = new Set();
  let particleLayer, particleContext, particleFrame = 0;
  const snapPixel = n => Math.round(n / 2) * 2;
  const clamp01 = n => Math.max(0, Math.min(1, n));
  function dropParticleLayer() {
    if (particleJobs.size) return;
    cancelAnimationFrame(particleFrame); particleFrame = 0;
    particleLayer?.remove(); particleLayer = particleContext = null;
  }
  function finishParticleJob(job, completed = false) {
    if (!particleJobs.delete(job)) return;
    job.resolve(completed); dropParticleLayer();
  }
  function clearParticles() { for (const job of [...particleJobs]) finishParticleJob(job); }
  function makeParticleLayer() {
    if (particleLayer) return true;
    const layer = document.createElement('canvas');
    layer.className = 'rg-particles'; layer.setAttribute('aria-hidden','true');
    const scale = Math.min(2, global.devicePixelRatio || 1);
    layer.width = Math.ceil(innerWidth * scale); layer.height = Math.ceil(innerHeight * scale);
    layer.style.width = innerWidth + 'px'; layer.style.height = innerHeight + 'px';
    const context = layer.getContext('2d'); if (!context) return false;
    context.setTransform(scale,0,0,scale,0,0); context.imageSmoothingEnabled = false;
    document.body.append(layer);
    // A manual popover keeps decorative pixels above native dialogs without focus.
    if (typeof layer.showPopover === 'function') {
      layer.setAttribute('popover','manual');
      try { layer.showPopover(); } catch { layer.removeAttribute('popover'); }
    }
    particleLayer = layer; particleContext = context; return true;
  }
  function visibleRect(el) {
    if (!(el instanceof Element) || !el.isConnected || !el.getClientRects().length || getComputedStyle(el).visibility === 'hidden') return null;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth ? r : null;
  }
  function particles(target, options = {}) {
    const noop = () => ({ finished: Promise.resolve(false), cancel() {} });
    const rect = visibleRect(target);
    if (!rect || reducedMotion() || document.hidden) return noop();
    let effect = options.effect || 'burst';
    if (!['burst','assemble','transfer'].includes(effect)) throw new RangeError('Unknown particle effect.');
    let destination = effect === 'transfer' ? visibleRect(options.to) : null;
    if(destination) {
      const x=destination.left+destination.width/2,y=destination.top+destination.height/2;
      if(x<0||x>innerWidth||y<0||y>innerHeight)destination=null;
      for(const el of document.querySelectorAll('[data-rg-particle-exclude]')) {
        const b=visibleRect(el); if(b && x>=b.left && x<=b.right && y>=b.top && y<=b.bottom)destination=null;
      }
    }
    if (effect === 'transfer' && !destination) effect = 'burst';
    // Replace, never queue. At most two concurrent fields / 48 squares on desktop.
    for (const job of [...particleJobs]) if (job.target === target) finishParticleJob(job);
    while (particleJobs.size >= 2) finishParticleJob(particleJobs.values().next().value);
    if (!makeParticleLayer()) return noop();
    const small = innerWidth <= 640, soft = options.intensity === 'soft';
    const baseCount = small ? (soft ? 10 : 16) : (soft ? 14 : 24);
    const count = effect === 'transfer' ? Math.ceil(baseCount*.6) : baseCount;
    const css = getComputedStyle(target);
    const palette = ['--rg-ink','--rg-accent','--rg-control-line'].map((key,i) => css.getPropertyValue(key).trim() || ['#203227','#4d7043','#75846e'][i]);
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    const reach = (small ? 48 : 72) * (soft ? .7 : 1);
    const boundary = visibleRect(options.boundary || target.closest('[data-rg-particle-boundary]'));
    let resolve;
    const finished = new Promise(r => { resolve = r; });
    const job = { target, rect, destination, effect, count, palette, boundary, resolve,
      start: performance.now(), duration: {burst:720,assemble:820,transfer:880}[effect], points:[] };
    for (let i=0; i<count; i++) {
      const angle = (i / count) * Math.PI * 2 + .18;
      const cos = Math.cos(angle), sin = Math.sin(angle);
      const edge = Math.min((rect.width/2+8)/Math.max(.01,Math.abs(cos)), (rect.height/2+8)/Math.max(.01,Math.abs(sin)));
      const vary = .52 + ((i * 7) % 11) / 20;
      job.points.push({ x:cx+cos*edge, y:cy+sin*edge,
        dx:cos*reach*vary, dy:sin*reach*vary, delay:(i%4)*.025,
        size:i%5===0 ? 6 : (i%3===0 ? 2 : 4), color:palette[i%3] });
    }
    particleJobs.add(job);
    particleLayer.dataset.rgParticleCount = String([...particleJobs].reduce((sum,j)=>sum+j.count,0));
    particleLayer.dataset.rgParticleEffects = [...particleJobs].map(j=>j.effect).join(' ');
    if (!particleFrame) particleFrame = requestAnimationFrame(drawParticles);
    return { finished, cancel: () => finishParticleJob(job) };
  }
  function drawParticles(now) {
    particleFrame = 0;
    const ctx = particleContext; if (!ctx) return;
    ctx.clearRect(0,0,innerWidth,innerHeight);
    for (const job of [...particleJobs]) {
      const t = (now-job.start)/job.duration;
      if (t >= 1 || !job.target.isConnected || reducedMotion()) { finishParticleJob(job,t>=1); continue; }
      ctx.save();
      if (job.boundary) { const b=job.boundary; ctx.beginPath();ctx.rect(b.left,b.top,b.width,b.height);ctx.clip(); }
      // Keep navigation, notifications and explicit protected controls clear.
      for(const el of document.querySelectorAll('[data-rg-particle-exclude],.rg-toaster')) {
        const b=visibleRect(el); if(!b)continue;
        ctx.beginPath();ctx.rect(0,0,innerWidth,innerHeight);ctx.rect(b.left,b.top,b.width,b.height);ctx.clip('evenodd');
      }
      for (let i=0;i<job.points.length;i++) {
        const p=job.points[i], local=clamp01((t-p.delay)/(1-p.delay));
        if(t<p.delay) continue;
        let x,y,alpha;
        if(job.effect==='burst') {
          const travel=1-Math.pow(1-local,3);
          x=p.x+p.dx*travel; y=p.y+p.dy*travel + 12*local*local;
          alpha=local<.55 ? 1 : 1-(local-.55)/.45;
        } else if(job.effect==='assemble') {
          const travel=1-Math.pow(1-clamp01(local/.68),3);
          x=p.x+p.dx*(1-travel); y=p.y+p.dy*(1-travel);
          alpha=Math.min(1,local*8) * (local>.82 ? (1-local)/.18 : 1);
        } else {
          const a=job.rect,b=job.destination, horizontal=Math.abs(b.left-a.left)>Math.abs(b.top-a.top);
          const direction=horizontal ? Math.sign(b.left-a.left) : Math.sign(b.top-a.top);
          const startX=horizontal ? (direction>0?a.right+4:a.left-4) : a.left+a.width/2;
          const startY=horizontal ? a.top+a.height/2 : (direction>0?a.bottom+4:a.top-4);
          const endX=horizontal ? (direction>0?b.left-4:b.right+4) : b.left+b.width/2;
          const endY=horizontal ? b.top+b.height/2 : (direction>0?b.top-4:b.bottom+4);
          const u=clamp01((t-i*.024)/.58), arc=Math.sin(Math.PI*u);
          const lane=((i%5)-2)*4;
          x=startX+(endX-startX)*u+(horizontal?0:arc*(20+lane));
          y=startY+(endY-startY)*u+(horizontal?-arc*(28+lane):0);
          alpha=u===0||u===1 ? 0 : Math.min(1,u*10,(1-u)*10);
        }
        ctx.globalAlpha = Math.max(0,Math.ceil(alpha*5)/5); ctx.fillStyle=p.color;
        ctx.fillRect(snapPixel(x-p.size/2),snapPixel(y-p.size/2),p.size,p.size);
      }
      // Four short angular brackets give the field a clear silhouette, not a halo.
      const r=job.effect==='transfer' ? job.destination : job.rect;
      const arrival=job.effect==='transfer' ? clamp01((t-.52)/.48) : t;
      const expansion=job.effect==='burst' ? 8+24*t : 8+20*(1-clamp01(arrival/.7));
      const bracketAlpha=job.effect==='transfer' && t<.52 ? 0 : Math.sin(Math.PI*arrival)*.65;
      ctx.globalAlpha=Math.max(0,Math.round(bracketAlpha*5)/5);ctx.fillStyle=job.palette[1];
      const l=snapPixel(r.left-expansion), top=snapPixel(r.top-expansion), right=snapPixel(r.right+expansion), bottom=snapPixel(r.bottom+expansion);
      for(const [x,y,sx,sy] of [[l,top,1,1],[right,top,-1,1],[l,bottom,1,-1],[right,bottom,-1,-1]]) {
        ctx.fillRect(x+(sx<0?-12:0),y,12,2); ctx.fillRect(x,y+(sy<0?-12:0),2,12);
        ctx.fillRect(x+sx*4,y+sy*4,2,2);
      }
      ctx.restore();
    }
    if(particleJobs.size) {
      particleLayer.dataset.rgParticleCount=String([...particleJobs].reduce((sum,j)=>sum+j.count,0));
      particleFrame=requestAnimationFrame(drawParticles);
    } else dropParticleLayer();
  }
  document.addEventListener('rg:motionchange', () => { if(reducedMotion()) clearParticles(); });
  document.addEventListener('visibilitychange', () => { if(document.hidden) clearParticles(); });
  global.addEventListener('scroll', clearParticles, {passive:true,capture:true});
  global.addEventListener('resize', clearParticles, {passive:true});
  function setMotion(preference = 'auto') {
    if (!['auto', 'reduced'].includes(preference)) throw new RangeError('Motion preference must be auto or reduced.');
    motionPreference = preference;
    try { localStorage.setItem('raster-ui.motion', preference); } catch {}
    applyMotionPreference(); return getMotion();
  }
  systemMotion.addEventListener('change', applyMotionPreference);
  global.addEventListener('storage', event => {
    if (event.key === 'raster-ui.motion') { motionPreference = event.newValue === 'reduced' ? 'reduced' : 'auto'; applyMotionPreference(); }
  });
  function feedback(el, kind = 'success') {
    if (!(el instanceof Element) || !['success', 'error', 'select', 'press'].includes(kind)) return Promise.resolve();
    clearTimeout(feedbackTimers.get(el)); el.dataset.rgFeedback = kind;
    feedbackTimers.set(el, setTimeout(() => { if (el.dataset.rgFeedback === kind) delete el.dataset.rgFeedback; }, 720));
    if (kind === 'error') return play(el, [{ transform:'translateX(0)' },{ transform:'translateX(-4px)',offset:.33 },{ transform:'translateX(4px)',offset:.66 },{ transform:'translateX(0)' }], 160, 1);
    if (kind === 'press') return play(el, [{ transform:'translateY(2px)' },{ transform:'translateY(0)' }], 80, 2);
    const color = getComputedStyle(el).getPropertyValue('--rg-accent').trim() || '#4d7043';
    return play(el, [{ boxShadow:`inset 0 -4px 0 ${color}` },{ boxShadow:`inset 0 -2px 0 ${color}`,offset:.5 },{ boxShadow:'inset 0 0 0 transparent' }], kind === 'success' ? 240 : 160, 2);
  }
  function reveal(root, options = {}) {
    if (!(root instanceof Element)) return Promise.resolve();
    const children = options.children ? all(options.children, root).slice(0, 12) : [root];
    return Promise.all(children.map((el, index) => play(el, [{ transform:'translateY(8px)', opacity:.65 },{ transform:'translateY(4px)', opacity:1, offset:.5 },{ transform:'translateY(0)', opacity:1 }], 160, 1, Math.min(index * 24, 96))));
  }
  function installSprite() {
    if (document.getElementById('rg-symbols')) return;
    const host = document.createElement('div');
    host.hidden = true; host.innerHTML = SPRITE;
    document.body.prepend(host);
  }
  function icon(name, options = {}) {
    if (!ICON_NAMES.includes(name)) throw new RangeError('Unknown Raster UI icon: ' + name);
    const size = options.size ?? 24;
    if (![24, 48, 72].includes(size)) throw new RangeError('Use a 24, 48 or 72 px icon.');
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    el.classList.add('rg-icon'); if (size !== 24) el.classList.add('rg-icon--' + size);
    if (options.label) { el.setAttribute('role', 'img'); el.setAttribute('aria-label', options.label); }
    else el.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS(el.namespaceURI, 'use'); use.setAttribute('href', '#rg-i-' + name); el.append(use);
    return el;
  }
  function chooseSegment(group, button, focus = false, notify = true) {
    if (!button || button.disabled) return;
    const previous = group.querySelector('[aria-pressed="true"]')?.dataset.value;
    all('button[data-value]', group).forEach(b => { b.setAttribute('aria-pressed', String(b === button)); b.tabIndex = b === button ? 0 : -1; });
    if (focus) button.focus();
    if (notify && previous !== button.dataset.value) { feedback(button, 'select'); emit(group, 'rg:change', { value: button.dataset.value }); }
  }
  function chooseTab(group, button, focus = false, notify = true) {
    if (!button || button.disabled) return;
    const previous = group.querySelector('[role="tab"][aria-selected="true"]')?.id;
    all('[role="tab"]', group).forEach(tab => {
      tab.setAttribute('aria-selected', String(tab === button)); tab.tabIndex = tab === button ? 0 : -1;
      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      if (panel && group.contains(panel)) { panel.hidden = tab !== button; panel.setAttribute('role', 'tabpanel'); panel.setAttribute('aria-labelledby', tab.id); }
    });
    if (focus) button.focus();
    if (notify && previous !== button.id) {
      feedback(button, 'select');
      const panel = document.getElementById(button.getAttribute('aria-controls')); if (panel) reveal(panel);
      emit(group, 'rg:tabchange', { value: button.dataset.value || button.id, panel: button.getAttribute('aria-controls') });
    }
  }
  function moveFocus(event, nodes, select) {
    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    const enabled = nodes.filter(b => !b.disabled); if (!enabled.length) return;
    let i = enabled.indexOf(event.target);
    if (i < 0) return;
    if (event.key === 'Home') i = 0;
    else if (event.key === 'End') i = enabled.length - 1;
    else i = (i + (event.key === 'ArrowRight' ? 1 : -1) + enabled.length) % enabled.length;
    event.preventDefault(); select(enabled[i]);
  }
  function resolveDialog(target) {
    const el = typeof target === 'string' ? document.getElementById(target) : target;
    if (!(el instanceof HTMLDialogElement)) throw new TypeError('Expected a native dialog element or its ID.');
    return el;
  }
  function openDialog(target, opener = document.activeElement) {
    const dialog = resolveDialog(target);
    if (dialog.open) { if (closingDialogs.has(dialog)) { closingDialogs.delete(dialog); cancelMotion(dialog); reveal(dialog); } return dialog; }
    init(dialog); dialogOpeners.set(dialog, opener); dialog.showModal();
    play(dialog, [{ transform:'translateY(12px)',opacity:.6 },{ transform:'translateY(8px)',opacity:1,offset:.33 },{ transform:'translateY(4px)',opacity:1,offset:.66 },{ transform:'translateY(0)',opacity:1 }], 200, 1);
    emit(dialog, 'rg:dialogchange', { open: true }); return dialog;
  }
  function closeDialog(target, value = '') {
    const dialog = resolveDialog(target); if (!dialog.open) return Promise.resolve(false);
    if (closingDialogs.has(dialog)) return closingDialogs.get(dialog).promise;
    const record = {};
    closingDialogs.set(dialog, record);
    record.promise = (async () => {
      await play(dialog, [{transform:'translateY(0)',opacity:1},{transform:'translateY(8px)',opacity:0}], 120, 2);
      if (closingDialogs.get(dialog) !== record || !dialog.open) return false;
      closingDialogs.delete(dialog); dialog.close(value); return true;
    })();
    return record.promise;
  }
  function toast(message, options = {}) {
    const duration = Math.max(0, Number.isFinite(options.duration) ? options.duration : 4500);
    const origin = document.activeElement;
    let region = q('.rg-toaster');
    if (!region) { region = document.createElement('div'); region.className = 'rg-root rg-toaster'; region.setAttribute('aria-label', '通知'); document.body.append(region); }
    const el = document.createElement('div'); el.className = 'rg-toast' + (options.variant === 'error' ? ' rg-toast--error' : '');
    el.setAttribute('role', options.variant === 'error' ? 'alert' : 'status');
    const text = document.createElement('span'); text.className = 'rg-toast__text'; text.textContent = String(message);
    const close = document.createElement('button'); close.type = 'button'; close.className = 'rg-toast__close'; close.setAttribute('aria-label', '关闭通知'); close.append(icon('close'));
    let timer, start = 0, remaining = duration, dismissed = false, dismissPromise;
    const dismiss = () => {
      if (dismissed) return dismissPromise; dismissed = true; clearTimeout(timer);
      dismissPromise = (async () => {
        await play(el,[{transform:'translateY(0)',opacity:1},{transform:'translateY(8px)',opacity:0}],120,2);
        const restore = el.contains(document.activeElement); el.remove();
        if (restore && origin instanceof HTMLElement && origin.isConnected && !origin.matches(':disabled')) origin.focus({preventScroll:true});
      })();
      return dismissPromise;
    };
    const pause = () => { clearTimeout(timer); if (start) remaining = Math.max(0, remaining - (Date.now() - start)); start = 0; };
    const resume = () => { if (dismissed || !duration || el.matches(':hover') || el.contains(document.activeElement)) return; clearTimeout(timer); start = Date.now(); timer = setTimeout(dismiss, remaining); };
    close.addEventListener('click', dismiss); el.addEventListener('mouseenter', pause); el.addEventListener('mouseleave', resume); el.addEventListener('focusin', pause); el.addEventListener('focusout', () => setTimeout(resume, 0));
    el.append(icon(options.variant === 'error' ? 'close' : 'check'), text);
    if (options.action && typeof options.action.onClick === 'function') {
      const action = document.createElement('button'); action.type = 'button'; action.className = 'rg-toast__action'; action.textContent = String(options.action.label || '撤销');
      action.addEventListener('click', async () => {
        action.disabled = true;
        try { await options.action.onClick(); dismiss(); }
        catch { action.disabled = false; toast('操作未完成，请重试。', { variant:'error' }); }
      }); el.append(action);
    }
    el.append(close); region.append(el); reveal(el); resume();
    return { element: el, dismiss };
  }
  function setLoading(button, loading = true, label = '正在处理') {
    if (!(button instanceof HTMLButtonElement)) throw new TypeError('setLoading expects a button.');
    if (loading) {
      if (loadingStates.has(button)) return;
      loadingStates.set(button, { disabled: button.disabled, label: button.getAttribute('aria-label'), busy: button.getAttribute('aria-busy'), focused: document.activeElement === button });
      button.disabled = true; button.setAttribute('aria-busy', 'true'); button.setAttribute('aria-label', label);
    } else {
      const original = loadingStates.get(button); if (!original) return;
      button.disabled = original.disabled;
      for (const [name, value] of [['aria-label', original.label], ['aria-busy', original.busy]]) { if (value === null) button.removeAttribute(name); else button.setAttribute(name, value); }
      if (original.focused && document.activeElement === document.body && button.isConnected && !button.disabled) button.focus({preventScroll:true});
      loadingStates.delete(button);
    }
  }
  function init(root = document) {
    if (!document.body) return;
    installSprite();
    applyMotionPreference();
    const nodes = selector => [...(root instanceof Element && root.matches(selector) ? [root] : []), ...all(selector, root)];
    nodes('.rg-field').forEach(field => {
      const label = q('.rg-label', field), control = q('input, textarea, select', field);
      if (label && control && !control.hasAttribute('aria-label') && !control.hasAttribute('aria-labelledby')) {
        if (!label.id) label.id = 'rg-label-' + (++unique);
        control.setAttribute('aria-labelledby', label.id);
      }
    });
    nodes('[data-rg-segmented]').forEach(group => {
      if (initialized.has(group)) return;
      group.setAttribute('role', 'group');
      chooseSegment(group, q('button[aria-pressed="true"]:not(:disabled)', group) || q('button[data-value]:not(:disabled)', group), false, false);
      initialized.add(group);
    });
    nodes('[data-rg-tabs]').forEach(group => {
      if (initialized.has(group)) return;
      const list = q('.rg-tablist', group); if (list) list.setAttribute('role', 'tablist');
      all('[role="tab"]', group).forEach(tab => { if (!tab.id) tab.id = 'rg-tab-' + (++unique); });
      chooseTab(group, q('[role="tab"][aria-selected="true"]:not(:disabled)', group) || q('[role="tab"]:not(:disabled)', group), false, false);
      initialized.add(group);
    });
    nodes('[data-rg-indeterminate]').forEach(el => { if (!initialized.has(el)) { el.indeterminate = true; initialized.add(el); } });
    nodes('dialog.rg-dialog').forEach(dialog => {
      if (initialized.has(dialog)) return;
      dialog.addEventListener('close', () => {
        if (dialog.open) return;
        closingDialogs.delete(dialog); cancelMotion(dialog);
        const opener = dialogOpeners.get(dialog); if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
        emit(dialog, 'rg:dialogchange', { open: false, value: dialog.returnValue });
      });
      dialog.addEventListener('cancel', event => { event.preventDefault(); closeDialog(dialog); });
      dialog.addEventListener('submit', event => {
        if (!event.defaultPrevented && (event.submitter?.getAttribute('formmethod') || event.target.method) === 'dialog') { event.preventDefault(); closeDialog(dialog, event.submitter?.value || ''); }
      });
      dialog.addEventListener('click', e => {
        const b = dialog.getBoundingClientRect();
        if (dialog.hasAttribute('data-rg-dismiss-outside') && e.target === dialog && (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom)) closeDialog(dialog);
      });
      initialized.add(dialog);
    });
    if (eventsInstalled) return;
    eventsInstalled = true;
    document.addEventListener('click', e => {
      const button = e.target.closest('button'); if (!button || button.disabled) return;
      if (button.classList.contains('rg-button')) feedback(button, 'press');
      if (button.hasAttribute('data-rg-open')) openDialog(button.dataset.rgOpen, button);
      if (button.hasAttribute('data-rg-close')) { const dialog = button.closest('dialog'); if (dialog) closeDialog(dialog, button.dataset.rgClose); }
      const group = button.closest('[data-rg-segmented]'); if (group && button.hasAttribute('data-value')) chooseSegment(group, button);
      if (button.getAttribute('role') === 'tab') { const tabs = button.closest('[data-rg-tabs]'); if (tabs) chooseTab(tabs, button); }
    });
    document.addEventListener('keydown', e => {
      if (!(e.target instanceof HTMLButtonElement)) return;
      const group = e.target.closest('[data-rg-segmented]');
      if (group) moveFocus(e, all('button[data-value]', group), b => chooseSegment(group, b, true));
      const tabs = e.target.closest('[data-rg-tabs]');
      if (tabs && e.target.getAttribute('role') === 'tab') moveFocus(e, all('[role="tab"]', tabs), b => chooseTab(tabs, b, true));
    });
  }
  global.RasterUI = Object.freeze({ version: '0.3.0', icons: Object.freeze([...ICON_NAMES]), init, icon, openDialog, closeDialog, toast, setLoading, feedback, reveal, setMotion, getMotion, particles });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init(), { once: true });
  else init();
})(window);
