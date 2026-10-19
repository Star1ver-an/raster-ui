(function(){
  'use strict';
  const root=document.body,s=window.UC_STYLES[root.dataset.style],UI=window.UICollection,C=window.UCCatalog;
  if(!s||!UI||!C)return;
  const $=selector=>root.querySelector(selector),$$=selector=>[...root.querySelectorAll(selector)];
  $('#uc-catalog').innerHTML=C.render(s);
  const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
  const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}};
  const key='ui-collection.'+s.id;
  const themeParam=new URLSearchParams(location.search).get('theme');
  let theme=['light','dark'].includes(themeParam)?themeParam:read(key+'.theme',s.defaultTheme);
  if(!['light','dark'].includes(theme))theme=s.defaultTheme;
  root.dataset.theme=theme;$('[data-theme-choice]').value=theme;
  const preference=read(key+'.motion','auto');root.dataset.motion=preference==='reduced'?'reduced':'auto';$('[data-motion-choice]').value=root.dataset.motion;
  UI.init(root);
  $('[data-theme-choice]').addEventListener('change',e=>{root.dataset.theme=e.target.value;write(key+'.theme',e.target.value);});
  $('[data-motion-choice]').addEventListener('change',e=>{UI.setMotion(root,e.target.value);write(key+'.motion',e.target.value);});
  const sections=$$('.uc-section'),links=$$('.uc-directory a');
  window.CatalogNavigation?.install({links,sections,header:$('.uc-topbar'),sidebar:$('.uc-sidebar')});
  $('[data-catalog-search]').addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase();sections.forEach(section=>{section.hidden=q&&!`${section.dataset.search} ${section.querySelector('h2').textContent}`.toLowerCase().includes(q);});links.forEach(link=>{link.hidden=$('#'+link.hash.slice(1)).hidden;});$('[data-search-empty]').hidden=sections.some(section=>!section.hidden);window.dispatchEvent(new Event('scroll'));});
  const copyDialog=document.createElement('dialog');copyDialog.className='uc-dialog';copyDialog.setAttribute('aria-label','手动复制代码');copyDialog.innerHTML='<h2>复制代码</h2><p>选中下方内容后按 Ctrl/Cmd + C。</p><textarea class="uc-input" readonly aria-label="待复制代码"></textarea><button type="button" class="uc-button" data-uc-close>关闭</button>';root.append(copyDialog);
  root.addEventListener('click',async e=>{
    const b=e.target.closest('button');if(!b||b.disabled)return;
    if(b.hasAttribute('data-copy-code')){const value=b.closest('.uc-code').querySelector('code').textContent;try{await navigator.clipboard.writeText(value);UI.toast('代码已复制',{context:root});}catch{copyDialog.querySelector('textarea').value=value;UI.openDialog(copyDialog,b);copyDialog.querySelector('textarea').select();}}
    if(b.hasAttribute('data-demo-press')){UI.feedback(b);UI.toast('操作已响应',{context:root});}
    if(b.hasAttribute('data-demo-loading')){UI.setLoading(b,true,'正在演示加载');try{await new Promise(resolve=>setTimeout(resolve,650));UI.toast('加载演示完成',{context:root});}finally{UI.setLoading(b,false);}}
    if(b.hasAttribute('data-demo-toast'))UI.toast('操作已完成，结果已更新。',{context:root});
    if(b.hasAttribute('data-demo-error')){let tries=0;UI.toast('演示保存失败，可点击重试。',{context:root,error:true,action:{label:'重试',onClick:async()=>{tries++;if(tries===1)throw Error('Demo retry');UI.toast('重试成功',{context:root});}}});}
    if(b.dataset.demoNav){b.parentElement.querySelectorAll('button').forEach(item=>item.removeAttribute('aria-current'));b.setAttribute('aria-current','page');$('[data-nav-result]').textContent='当前位于'+b.dataset.demoNav;UI.feedback(b);}
    if(b.hasAttribute('data-replay-enter'))UI.reveal($('[data-reveal-sample]'));
    if(b.hasAttribute('data-replay-response')){UI.feedback($('[data-response-sample]'));$('[data-motion-result]').textContent='状态已更新，局部动效帮助辨认变化。';}
    if(b.hasAttribute('data-replay-error')){UI.feedback($('[data-error-sample]'),'error');$('[data-motion-result]').textContent='演示错误：操作未完成，内容保留，可再次尝试。';}
    if(b.hasAttribute('data-expand-preview')){const sample=$('[data-shared-sample]');const expanded=!sample.classList.contains('is-expanded');b.setAttribute('aria-expanded',String(expanded));b.textContent=expanded?'收起预览':'展开预览';UI.transition(sample,()=>sample.classList.toggle('is-expanded',expanded));}
  });
  root.addEventListener('uc:validsubmit',e=>{e.target.querySelector('[data-form-result]').textContent='验证通过，输入内容完整保留。';});
  $('#filters [data-uc-select]').addEventListener('uc:change',e=>{$('[data-filter-result]').textContent='当前：'+({all:'全部项目',active:'进行中',done:'已完成'}[e.detail.value]);});
  // Browser-local composition. Stored values are validated before entering the DOM.
  const initial=s.projects.map((title,i)=>({id:'seed-'+i,title,status:i===1?'done':'active',archived:false}));
  let projects=read(key+'.projects.v1',initial);
  if(!Array.isArray(projects))projects=initial;
  projects=projects.filter(p=>p&&typeof p.id==='string'&&/^[a-zA-Z0-9-]+$/.test(p.id)&&typeof p.title==='string'&&p.title.trim()&&['active','done'].includes(p.status)&&typeof p.archived==='boolean').map(p=>({id:p.id,title:p.title.slice(0,60),status:p.status,archived:p.archived}));
  let projectFilter='all',projectView='grid',search='';
  function saveProjects(){if(!write(key+'.projects.v1',projects))UI.toast('浏览器无法保存数据，本次更改仅留在当前页面。',{context:root,error:true});}
  function renderProjects(){
    const visible=projects.filter(p=>(projectFilter==='archived'?p.archived:!p.archived&&(projectFilter==='all'||p.status===projectFilter))&&p.title.toLowerCase().includes(search.toLowerCase()));
    $('[data-project-count]').textContent=`显示 ${visible.length} / 全部 ${projects.length} 个项目`;
    $('[data-projects]').dataset.view=projectView;
    $('[data-projects]').innerHTML=visible.map(p=>`<article class="uc-card" data-project-id="${C.esc(p.id)}"><div class="uc-card-art uc-art-mini" aria-hidden="true">${C.art(s,true)}</div><span class="uc-eyebrow">${s.work.toUpperCase()}</span><h4>${C.esc(p.title)}</h4><span class="uc-badge">${p.archived?'已归档':p.status==='done'?'已完成':'进行中'}</span><div class="uc-row"><button type="button" class="uc-button uc-button--secondary" data-change-status="${C.esc(p.id)}">${p.status==='done'?'设为进行中':'标记完成'}</button><button type="button" class="uc-button uc-button--quiet" data-archive="${C.esc(p.id)}">${p.archived?'移出归档':'归档'}</button></div></article>`).join('');
    $('[data-project-empty]').hidden=visible.length>0;
    $$('[data-project-status]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.projectStatus===projectFilter)));
    $$('[data-project-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.projectView===projectView)));
  }
  renderProjects();
  $('[data-project-search]').addEventListener('input',e=>{search=e.target.value;renderProjects();});
  root.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b||b.disabled)return;
    if(b.dataset.projectStatus){projectFilter=b.dataset.projectStatus;renderProjects();}
    if(b.dataset.projectView){projectView=b.dataset.projectView;renderProjects();}
    if(b.hasAttribute('data-new-project')){UI.openDialog($('#project-dialog'),b);}
    if(b.dataset.changeStatus){const project=projects.find(p=>p.id===b.dataset.changeStatus);if(!project)return;project.status=project.status==='done'?'active':'done';saveProjects();renderProjects();$(`[data-change-status="${project.id}"]`)?.focus({preventScroll:true});}
    if(b.dataset.archive){const project=projects.find(p=>p.id===b.dataset.archive);if(!project)return;project.archived=!project.archived;const next=project.archived;saveProjects();renderProjects();$('[data-new-project]').focus({preventScroll:true});UI.toast(next?'项目已归档':'项目已移出归档',{context:root,action:{label:'撤销',onClick:()=>{if(project.archived!==next)throw Error('Newer change');project.archived=!next;saveProjects();renderProjects();}}});}
  });
  $('[data-project-form]').addEventListener('submit',async e=>{
    e.preventDefault();const form=e.target,field=form.elements.title,title=field.value.trim();field.setCustomValidity(title?'':'请输入项目名称');
    if(!field.checkValidity()){$('#project-error').textContent=title?'项目名称不能超过60个字符':'请输入项目名称';field.setAttribute('aria-invalid','true');field.focus();UI.feedback(field,'error');return;}
    field.removeAttribute('aria-invalid');$('#project-error').textContent='';
    const project={id:'p-'+(globalThis.crypto?.randomUUID?.()||Date.now().toString(36)),title,status:form.elements.status.value,archived:false};
    projects.unshift(project);saveProjects();projectFilter='all';search='';$('[data-project-search]').value='';renderProjects();form.reset();await UI.closeDialog($('#project-dialog'));UI.toast('项目已创建',{context:root});
  });
  $('[data-project-form] input').addEventListener('input',e=>{e.target.setCustomValidity('');e.target.removeAttribute('aria-invalid');$('#project-error').textContent='';});
  // Save/undo exercise: result is synchronous, there is no fake network dependency.
  let saved=false;
  function renderSaved(){const b=$('[data-save-article]');b.setAttribute('aria-pressed',String(saved));b.innerHTML=C.icon(saved?'check':'star')+(saved?'已收藏':'收藏这篇');$('[data-save-result]').textContent=saved?'这篇内容已加入稍后阅读。':'还没有收藏。';$('[data-undo-article]').hidden=!saved;}
  $('[data-save-article]').addEventListener('click',()=>{const b=$('[data-save-article]');if(saved){$('[data-save-result]').textContent='已经收藏，可以使用撤销操作。';return;}if($('[data-save-fail]').checked){$('[data-save-fail]').checked=false;$('[data-save-result]').textContent='本次演示失败，内容保留，再次点击可重试。';UI.feedback(b,'error');return;}saved=true;renderSaved();UI.feedback(b);});
  $('[data-undo-article]').addEventListener('click',()=>{saved=false;renderSaved();$('[data-save-article]').focus({preventScroll:true});});
  // Reversible scroll scene; slider is an equivalent manual input.
  let manual=false,frame=0;
  const runway=$('[data-scrub-runway]'),object=$('.uc-scrub-object'),scene=object.querySelector('.uc-scene'),range=$('[data-scroll-progress]');
  function paint(progress){
    const p=Math.max(0,Math.min(1,progress));range.value=String(Math.round(p*100));$('[data-progress-output]').textContent=Math.round(p*100)+'%';
    if(UI.reduced(root)){object.style.transform='none';object.style.clipPath='none';object.style.opacity='1';if(scene)scene.style.transform='none';return;}
    if(s.id==='spatial'){scene.style.transform=`perspective(700px) rotateX(${-18+p*30}deg) rotateY(${-35+p*100}deg) translateZ(${p*45}px)`;}
    else if(s.id==='liquid'){object.style.clipPath=`inset(${12*(1-p)}% ${18*(1-p)}% round 24px)`;object.style.transform=`translateY(${18*(1-p)}px)`;}
    else if(s.id==='brutal'){object.style.clipPath=`inset(0 ${(1-p)*55}% 0 0)`;object.style.transform=`translateX(${(1-p)*-12}px)`;}
    else if(s.id==='expressive'){object.style.borderRadius=(50-28*p)+'px';object.style.transform=`scale(${.85+.15*p}) rotate(${(1-p)*-3}deg)`;}
    else{object.style.transform=`translateY(${24*(1-p)}px) scale(${.94+.06*p})`;object.style.opacity=String(.5+.5*p);}
  }
  function updateScroll(){frame=0;if(manual)return;const offset=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--catalog-navigation-offset'))||72;const rect=runway.getBoundingClientRect();paint((offset+20-rect.top)/Math.max(100,rect.height-240));}
  function schedule(){if(!frame)frame=requestAnimationFrame(updateScroll);}
  range.addEventListener('input',()=>{manual=true;paint(Number(range.value)/100);});
  $('[data-follow-scroll]').addEventListener('click',()=>{manual=false;updateScroll();});
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);root.addEventListener('uc:motionchange',()=>{if(manual)paint(Number(range.value)/100);else updateScroll();$('.uc-hero-art .uc-scene')?.style.removeProperty('transform');});
  updateScroll();
  const hero=$('[data-hero-scene]');
  if(s.id==='spatial'){
    hero.addEventListener('pointermove',e=>{if(UI.reduced(root)||e.pointerType==='touch')return;const box=hero.getBoundingClientRect();hero.querySelector('.uc-scene').style.transform=`rotateX(${-18+(e.clientY-box.top)/box.height*10}deg) rotateY(${-35+(e.clientX-box.left)/box.width*20}deg)`;});
    hero.addEventListener('pointerleave',()=>hero.querySelector('.uc-scene').style.removeProperty('transform'));
  }
  let revealObserver;
  if ('IntersectionObserver' in window) {
    revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){
        if(s.id==='expressive')UI.reveal(entry.target,{children:'.uc-card,.uc-lab-card'});
        else UI.reveal(entry.target);
        revealObserver.unobserve(entry.target);
      }
    }),{threshold:.15});
    $$('#cards > .uc-grid, .uc-lab-grid').forEach(el=>revealObserver.observe(el));
  }
  window.addEventListener('pagehide',()=>{revealObserver?.disconnect();if(frame)cancelAnimationFrame(frame);},{once:true});
  UI.reveal($('.uc-hero-copy'));
  if(location.hash){requestAnimationFrame(()=>{const target=document.getElementById(location.hash.slice(1));target?.scrollIntoView({behavior:'instant'});});}
})();
