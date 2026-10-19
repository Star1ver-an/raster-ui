(function () {
  'use strict';
  const paths = {grid:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',star:'m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z',upload:'M12 16V3m-5 5 5-5 5 5M4 15v6h16v-6',code:'m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18',layers:'m12 3 10 6-10 6L2 9zm-9 11 9 5 9-5m-18 5 9 5 9-5',list:'M9 5h12M9 12h12M9 19h12M3 5h1M3 12h1M3 19h1',search:'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',arrow:'M5 12h14m-6-6 6 6-6 6',copy:'M8 8h13v13H8zM16 8V3H3v13h5',info:'M12 11v6m0-10v1M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0'};
  const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name] || paths.grid}"/></svg>`;
  document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));
  const libraries = [
    {id:'raster',name:'Raster UI',edition:'01 / PIXEL SYSTEM',tag:'像素风格',category:'pixel',version:'0.4.0',description:'灰绿基调、整数格点与克制的像素动效。把清楚的层级，变成可直接使用的组件。',keywords:'像素 pixel raster 灰绿 格点 按钮 表单 动效',path:'raster-ui/index.html',themes:[['default','灰绿点阵']],chapters:18},
    {id:'soft',name:'Soft UI',edition:'02 / SOFT SURFACES',tag:'新拟态',category:'material',version:'0.4.0',description:'同色的连续表面，统一的左上光源。用凸起、内凹与按压，呈现克制而清楚的触感。',keywords:'soft 新拟态 neumorphism 浅色 深色 按钮 表单 柔和',path:'soft-ui/index.html',themes:[['light','雾灰浅色'],['dark','石墨深色']],chapters:18},
    {id:'surface',name:'Surface UI',edition:'03 / GLASS STUDIES',tag:'玻璃材质',category:'material',version:'0.4.0',description:'从柔雾磨砂到液态彩光，用透光、边缘与折射，为同一套组件带来两种表情。',keywords:'surface 玻璃 glass 磨砂 液态 彩光 按钮 表单',path:'surface-ui/index.html',themes:[['frosted','柔雾磨砂'],['clear','液态彩光']],chapters:18}
  ];
  const $=s=>document.querySelector(s);
  let favorites=new Set(),layout='grid',filter='all',view='libraries',choices={};
  try { const saved=JSON.parse(localStorage.getItem('ui-collection.favorites') || '[]');if(Array.isArray(saved))favorites=new Set(saved.filter(id=>libraries.some(l=>l.id===id)));layout=localStorage.getItem('ui-collection.layout')==='list'?'list':'grid'; } catch {}
  const href = library => library.path + (library.id==='raster'?'':`?${library.id==='soft'?'theme':'style'}=${choices[library.id]||library.themes[0][0]}`);
  const preview = l => `<div class="library-preview preview-${l.id}" aria-hidden="true"><div class="mini-window"><div class="mini-bar"><i></i><i></i><i></i><span>${l.name.toUpperCase()}</span></div><div class="mini-layout"><div class="mini-rail"><b></b><i></i><i></i><i></i></div><div class="mini-content"><div class="mini-title">${l.id==='raster'?'项目':l.id==='soft'?'柔和，也有章法。':'Light, in motion.'}<span>04</span></div><div class="mini-search"></div><div class="mini-chips"><i></i><i></i><i></i></div><div class="mini-cards"><div><i>${icon('layers')}</i><b>Design System</b><small>IN PROGRESS</small></div><div><i>${icon('grid')}</i><b>Product Website</b><small>WORKSPACE / 02</small></div></div></div></div></div><span class="preview-caption">${l.id==='raster'?'INTEGER GRID · QUIET DETAILS':l.id==='soft'?'SOFT LIGHT · TACTILE SURFACES':'TRANSLUCENT · REFRACTIVE'}</span></div>`;
  const card = l => `<article class="library-card" data-library-id="${l.id}" data-preview-theme="${choices[l.id]||l.themes[0][0]}">${preview(l)}<div class="library-card-body"><div class="card-edition"><span>${l.edition}</span><button type="button" class="favorite-button" data-favorite="${l.id}" aria-pressed="${favorites.has(l.id)}" aria-label="${favorites.has(l.id)?'取消收藏':'收藏'} ${l.name}">${icon('star')}</button></div><div class="card-title"><h3>${l.name}</h3><span class="version-label">v${l.version}</span></div><p>${l.description}</p><div class="card-meta"><span>${l.tag}</span><span>${l.chapters} 个章节</span><span>${l.themes.length} 种主题</span></div><div class="card-bottom"><label class="theme-picker"><span class="sr-only">${l.name} 展示主题</span><select data-theme-for="${l.id}" aria-label="${l.name} 展示主题">${l.themes.map(([v,t])=>`<option value="${v}" ${v===(choices[l.id]||l.themes[0][0])?'selected':''}>${t}</option>`).join('')}</select></label><div><button type="button" class="copy-link" data-copy="${l.id}" aria-label="复制 ${l.name} 页面地址">${icon('copy')}</button><a class="open-library" data-open="${l.id}" href="${href(l)}">打开组件库 ${icon('arrow')}</a></div></div></div></article>`;
  function notify(text){$('#collection-toast').textContent=text;$('#collection-toast').hidden=false;clearTimeout(notify.timer);notify.timer=setTimeout(()=>$('#collection-toast').hidden=true,2500);}
  function persist(){try{localStorage.setItem('ui-collection.favorites',JSON.stringify([...favorites]));localStorage.setItem('ui-collection.layout',layout);}catch{notify('浏览器无法保存偏好，本次整理仅保留在当前页面。');}}
  function render(){
    const q=$('#library-search').value.trim().toLowerCase();
    const visible=libraries.filter(l=>(view!=='favorites'||favorites.has(l.id))&&(filter==='all'||l.category===filter)&&`${l.name} ${l.keywords}`.toLowerCase().includes(q));
    $('#library-grid').innerHTML=visible.map(card).join('');$('#library-grid').dataset.layout=layout;
    $('#favorite-count').textContent=favorites.size;$('#result-count').textContent=String(visible.length).padStart(2,'0');
    $('#collection-results').textContent=`显示 ${visible.length} 套组件库`;
    $('#collection-empty').hidden=visible.length!==0;
    $('#empty-message').textContent=view==='favorites'&&!favorites.size?'点击组件库卡片上的星标，把常用设计收在这里。':'试试其他关键词，或清除筛选。';
    document.querySelectorAll('[data-layout]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.layout===layout)));
    document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===filter)));
  }
  function route(){view=['favorites','publish'].includes(location.hash.slice(1))?location.hash.slice(1):'libraries';const title={libraries:'组件库总览',favorites:'我的收藏',publish:'静态展示指南'}[view];$('#current-page').textContent=title;$('#library-heading').firstChild.textContent=title+' ';$('#libraries').hidden=view==='publish';$('#publish').hidden=view!=='publish';document.querySelectorAll('[data-view]').forEach(a=>{if(a.dataset.view===view)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});render();}
  document.addEventListener('click',async e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.dataset.favorite){const id=b.dataset.favorite;if(favorites.has(id))favorites.delete(id);else favorites.add(id);persist();render();(document.querySelector(`[data-favorite="${id}"]`)||document.querySelector('[data-view="favorites"]')).focus({preventScroll:true});}
    if(b.dataset.layout){layout=b.dataset.layout;persist();render();}
    if(b.dataset.filter){filter=b.dataset.filter;render();}
    if(b.dataset.copy){const l=libraries.find(l=>l.id===b.dataset.copy),url=new URL(href(l),location.href).href;try{await navigator.clipboard.writeText(url);notify('组件库页面地址已复制');}catch{$('#copy-url').value=url;$('#link-dialog').showModal();$('#copy-url').select();}}
  });
  $('#library-grid').addEventListener('change',e=>{if(e.target.dataset.themeFor){const id=e.target.dataset.themeFor;choices[id]=e.target.value;document.querySelector(`[data-open="${id}"]`).href=href(libraries.find(l=>l.id===id));document.querySelector(`[data-library-id="${id}"]`).dataset.previewTheme=e.target.value;}});
  $('#library-search').addEventListener('input',render);
  $('#reset-collection').addEventListener('click',()=>{filter='all';$('#library-search').value='';if(view==='favorites')location.hash='libraries';else render();});
  $('#close-link-dialog').addEventListener('click',()=>$('#link-dialog').close());
  document.addEventListener('keydown',e=>{if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){e.preventDefault();if(view==='publish'){location.hash='libraries';route();}$('#library-search').focus();}});
  window.addEventListener('hashchange',route);route();
})();
