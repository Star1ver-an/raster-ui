/* UICollection: business state remains with the consumer; animations are optional. */
(function(global){
  'use strict';
  const roots=new WeakSet(),motions=new Set(),active=new WeakMap(),busy=new WeakMap(),dialogs=new WeakMap();
  const system=matchMedia('(prefers-reduced-motion: reduce)');
  const scope=el=>el?.closest('.uc-root')||document.body;
  const reduced=el=>system.matches||scope(el).dataset.motion==='reduced';
  const duration=(el,key,fallback)=>parseFloat(getComputedStyle(el).getPropertyValue('--uc-'+key))||fallback;
  function animate(el,frames,options={}){
    active.get(el)?.cancel();
    if(reduced(el)||!el.animate)return Promise.resolve(false);
    const animation=el.animate(frames,{duration:duration(el,'enter',260),easing:getComputedStyle(el).getPropertyValue('--uc-ease').trim()||'ease-out',...options});
    active.set(el,animation);motions.add(animation);
    return animation.finished.then(()=>true,()=>false).finally(()=>{motions.delete(animation);if(active.get(el)===animation)active.delete(el);});
  }
  function syncMotion(root){
    root.dataset.reduced=String(reduced(root));
    if(reduced(root))for(const animation of [...motions])if(root.contains(animation.effect?.target))animation.cancel();
    root.dispatchEvent(new CustomEvent('uc:motionchange',{bubbles:true,detail:{reduced:reduced(root),preference:root.dataset.motion||'auto'}}));
  }
  function setMotion(root,value){if(!['auto','reduced'].includes(value))throw new TypeError('Motion must be auto or reduced');root.dataset.motion=value;syncMotion(root);}
  system.addEventListener('change',()=>document.querySelectorAll('.uc-root').forEach(syncMotion));
  function reveal(el,{children}={}){const distance=duration(el,'distance',12);if(children)return Promise.all([...el.querySelectorAll(children)].slice(0,12).map((child,i)=>animate(child,[{opacity:.15,transform:`translateY(${distance}px)`},{opacity:1,transform:'translateY(0)'}],{delay:Math.min(i*36,120)})));return animate(el,[{opacity:.15,transform:`translateY(${distance}px)`},{opacity:1,transform:'translateY(0)'}]);}
  function feedback(el,type='press'){
    const style=scope(el).dataset.style;
    const frames=type==='error'?[{transform:'translateX(0)'},{transform:'translateX(-3px)'},{transform:'translateX(3px)'},{transform:'translateX(0)'}]:style==='brutal'?[{transform:'translate(0,0)'},{transform:'translate(4px,4px)'},{transform:'translate(0,0)'}]:style==='expressive'?[{transform:'scale(1)'},{transform:'scale(.94)',borderRadius:'30px'},{transform:'scale(1)'}]:[{transform:'scale(1)'},{transform:'scale(.97)'},{transform:'scale(1)'}];
    return animate(el,frames,{duration:duration(el,'fast',140)});
  }
  function setLoading(button,value,label='正在处理'){
    if(value){if(!busy.has(button))busy.set(button,{disabled:button.disabled,busy:button.getAttribute('aria-busy'),label:button.getAttribute('aria-label')});button.disabled=true;button.setAttribute('aria-busy','true');button.setAttribute('aria-label',label);}
    else if(busy.has(button)){const old=busy.get(button);button.disabled=old.disabled;for(const [attr,key] of [['aria-busy','busy'],['aria-label','label']]){if(old[key]===null)button.removeAttribute(attr);else button.setAttribute(attr,old[key]);}busy.delete(button);}
  }
  function openDialog(dialog,origin=document.activeElement){
    if(!dialog)return;active.get(dialog)?.cancel();const state=dialogs.get(dialog)||{};state.version=(state.version||0)+1;if(!dialog.open)state.origin=origin;dialogs.set(dialog,state);if(!dialog.open)dialog.showModal();reveal(dialog);
  }
  async function closeDialog(dialog){
    if(!dialog?.open)return false;const state=dialogs.get(dialog)||{version:0};const version=++state.version;dialogs.set(dialog,state);
    await animate(dialog,[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(8px)'}],{duration:duration(dialog,'exit',160),easing:'ease-in'});
    if(state.version!==version)return false;dialog.querySelectorAll('.uc-toast-region').forEach(region=>region.querySelectorAll('[data-toast-close]').forEach(button=>button.click()));dialog.close();if(state.origin?.isConnected)state.origin.focus({preventScroll:true});return true;
  }
  function toast(message,{context=document.querySelector('.uc-root')||document.body,error=false,duration:life=4200,action}={}){
    const host=context.querySelector('dialog[open]')||context;let region=host.querySelector(':scope > .uc-toast-region');if(!region){region=document.createElement('div');region.className='uc-toast-region';host.append(region);}
    const el=document.createElement('div');el.className='uc-toast';el.dataset.error=String(error);el.setAttribute('role',error?'alert':'status');
    const text=document.createElement('span');text.textContent=message;el.append(text);const origin=document.activeElement;let timer=null,remaining=life,started=0,working=false,closed=false;
    function stop(){if(timer){clearTimeout(timer);remaining=Math.max(0,remaining-(performance.now()-started));timer=null;}}
    function dismiss(){if(closed)return;closed=true;stop();active.get(el)?.cancel();const restore=el.contains(document.activeElement);el.remove();if(!region.children.length)region.remove();if(restore&&origin?.isConnected)origin.focus({preventScroll:true});}
    function resume(){if(!closed&&!error&&!working&&remaining>0&&!el.matches(':hover')&&!el.contains(document.activeElement)){started=performance.now();timer=setTimeout(dismiss,remaining);}}
    if(action){const b=document.createElement('button');b.type='button';b.textContent=action.label;b.addEventListener('click',async()=>{if(working)return;working=true;b.disabled=true;stop();try{await action.onClick();dismiss();}catch{error=true;text.textContent='操作失败，请重试';el.dataset.error='true';el.setAttribute('role','alert');}finally{working=false;b.disabled=false;}});el.append(b);}
    const close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label','关闭通知');close.dataset.toastClose='';close.addEventListener('click',dismiss);el.append(close);region.append(el);reveal(el);el.addEventListener('mouseenter',stop);el.addEventListener('mouseleave',resume);el.addEventListener('focusin',stop);el.addEventListener('focusout',()=>queueMicrotask(resume));resume();return{element:el,dismiss};
  }
  function selectTab(group,tab){
    const tabs=[...group.querySelectorAll('[role=tab]')].filter(el=>el.closest('[data-uc-tabs]')===group);if(tab.disabled||!tabs.includes(tab))return;
    for(const el of tabs){const selected=el===tab;el.setAttribute('aria-selected',String(selected));el.tabIndex=selected?0:-1;const panel=document.getElementById(el.getAttribute('aria-controls'));if(panel){panel.hidden=!selected;if(selected)reveal(panel);}}
    group.dispatchEvent(new CustomEvent('uc:tabchange',{bubbles:true,detail:{value:tab.dataset.value}}));
  }
  function init(root=document.querySelector('.uc-root')||document.body){
    if(roots.has(root))return;roots.add(root);syncMotion(root);
    const owns=e=>{for(const node of e.composedPath())if(roots.has(node))return node===root;return true;};
    root.querySelectorAll('[data-uc-tabs]').forEach(group=>{const tab=group.querySelector('[role=tab][aria-selected=true]:not(:disabled)')||group.querySelector('[role=tab]:not(:disabled)');if(tab)selectTab(group,tab);});
    root.addEventListener('click',e=>{
      if(!owns(e))return;
      const button=e.target.closest('button');if(!button||button.disabled)return;
      if(button.hasAttribute('data-uc-toggle')){button.setAttribute('aria-pressed',String(button.getAttribute('aria-pressed')!=='true'));feedback(button);}
      if(button.matches('[role=tab]'))selectTab(button.closest('[data-uc-tabs]'),button);
      const segment=button.closest('[data-uc-select]');if(segment){segment.querySelectorAll('button').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));segment.dispatchEvent(new CustomEvent('uc:change',{bubbles:true,detail:{value:button.dataset.value}}));}
      if(button.dataset.ucOpen)openDialog(document.getElementById(button.dataset.ucOpen),button);
      if(button.hasAttribute('data-uc-close'))closeDialog(button.closest('dialog'));
    });
    root.addEventListener('keydown',e=>{if(!owns(e))return;const tab=e.target.closest('[role=tab]');if(!tab||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;const group=tab.closest('[data-uc-tabs]');if(!group)return;const tabs=[...group.querySelectorAll('[role=tab]:not(:disabled)')].filter(el=>el.closest('[data-uc-tabs]')===group);let i=tabs.indexOf(tab);i=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;e.preventDefault();tabs[i].focus();selectTab(group,tabs[i]);});
    root.addEventListener('cancel',e=>{if(!owns(e))return;if(e.target.matches('dialog')){e.preventDefault();closeDialog(e.target);}},true);
    root.addEventListener('submit',e=>{if(!owns(e))return;const form=e.target;if(!form.matches('[data-uc-validate]'))return;e.preventDefault();let first=null;form.querySelectorAll('input,textarea,select').forEach(field=>{if(field.required&&field.type==='text')field.setCustomValidity(field.value.trim()?'':'请填写内容');const invalid=!field.checkValidity();field.setAttribute('aria-invalid',String(invalid));const error=form.querySelector(`[data-uc-error="${field.name}"]`);if(error)error.textContent=invalid?(field.validity.typeMismatch?'请输入有效的邮箱地址':'请填写完整内容'):'';if(invalid&&!first)first=field;});if(first){first.focus();feedback(first,'error');}else form.dispatchEvent(new CustomEvent('uc:validsubmit',{bubbles:true}));});
  }
  async function transition(element,update){const first=element.getBoundingClientRect();active.get(element)?.cancel();update();const last=element.getBoundingClientRect();if(!last.width||!last.height)return false;return animate(element,[{transformOrigin:'top left',transform:`translate(${first.left-last.left}px,${first.top-last.top}px) scale(${first.width/last.width},${first.height/last.height})`},{transformOrigin:'top left',transform:'none'}],{duration:duration(element,'shared',300)});}
  global.UICollection=Object.freeze({init,animate,reveal,feedback,setMotion,reduced,setLoading,openDialog,closeDialog,toast,transition});
})(window);
