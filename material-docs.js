/* The same documentation frame as Raster UI, with material-specific controls. */
(function (global) {
  'use strict';
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const meta = [
    ['foundations','基础规则','设计基础','FOUNDATIONS','颜色 字体 间距 tokens'],
    ['style','基础规则','材质与视觉','MATERIAL IDENTITY','光影 玻璃 新拟态 风格'],
    ['icons','基础规则','线性图标','LINE ICONS','svg icon 尺寸'],
    ['buttons','基础控件','按钮','BUTTON','button 加载 禁用'],
    ['fields','基础控件','输入与表单','FORM FIELD','input search select textarea 验证 搜索'],
    ['selection','基础控件','选择控件','CHECKBOX / RADIO / SWITCH','复选 单选 开关'],
    ['filters','导航与结构','分段筛选','SEGMENTED CONTROL','segmented filter'],
    ['tabs','导航与结构','内容页签','TABS','tab 面板 标签'],
    ['navigation','导航与结构','侧栏与底部导航','NAVIGATION','nav mobile'],
    ['cards','内容与反馈','内容卡片与条目','CARD / LIST ITEM','card list 项目'],
    ['status','内容与反馈','状态与提示','STATUS / TAG / ALERT','status alert 标签'],
    ['empty-loading','内容与反馈','空状态与加载','EMPTY / LOADING','skeleton 骨架'],
    ['feedback','内容与反馈','弹窗与轻提示','DIALOG / TOAST','dialog toast 通知'],
    ['composition','组合与接入','组合成页面','COMPOSITION','responsive desktop mobile 窄屏 示例'],
    ['usage','组合与接入','快速开始与 API','GETTING STARTED','安装 接入 使用'],
    ['experience','可选 · 动效实验室','收藏与撤销','MATERIAL / IN ACTION','收藏 失败 重试 撤销'],
    ['motion','可选 · 动效实验室','材质动效规则','MOTION GRAMMAR','入场 按压 弹窗 减少动态'],
    ['bloom','可选 · 动效实验室','柔光完成反馈','SOFT BLOOM','泛光 完成 反馈 动画']
  ];
  function prepare(root, icon) {
    const soft = root.dataset.library === 'soft';
    const name = soft ? 'Soft UI' : 'Surface UI';
    const intro = root.querySelector('.material-intro');
    const motionControl = root.querySelector('.material-motion-select');
    motionControl.querySelector('select').setAttribute('aria-label','动态效果');
    const oldCatalog = root.querySelector('.material-catalog-shell');
    const search = oldCatalog.querySelector('.material-search');
    search.querySelector('span').textContent = '查找组件';
    const searchMeta = oldCatalog.querySelector('.material-search-meta');
    const empty = root.querySelector('[data-material-search-empty]');
    const sections = [...root.querySelectorAll('.material-section')];
    const dialogs = [...root.querySelectorAll('dialog')];
    const section = (id, description, content, code) => {
      const el = document.createElement('section');
      el.id = 'material-' + id; el.className = 'material-section';
      el.innerHTML = `<div class="material-section-heading"><span></span><div><h3></h3><p>${description}</p></div></div>${content}<div class="material-code-area"><div class="material-code-block"><div class="material-code-head"><span>HTML / JAVASCRIPT</span><button type="button" class="rg-button rg-button--quiet rg-button--sm" data-material-copy-code>复制代码</button></div><pre tabindex="0"><code>${esc(code)}</code></pre></div></div>`;
      return el;
    };
    const study = document.querySelector('#material-study');
    const style = section('style',soft ? '微弱高光、柔和投影与清楚的内凹状态，共同构成细腻的表面。' : '同一套组件，两种玻璃材质。用顶部开关对比柔雾磨砂与液态彩光。',soft ? '<div class="material-surface-study"><div>凸起表面<small>Raised surface</small></div><div>内凹表面<small>Inset surface</small></div><div>强调表面<small>Accent surface</small></div></div>' : '',soft ? '--material-shadow-card: 6px 9px 17px #8e99ac2e, -7px -7px 16px #ffffffdb;\n--material-shadow-inset: inset 3px 4px 9px #8e99ac3b, inset -3px -3px 8px #ffffffdb;' : '<body data-theme="glass" data-glass-style="frosted">\n<!-- 切换为 clear 使用液态彩光材质。 -->');
    if (study && !global.MaterialRefinement) style.insertBefore(study.content.cloneNode(true), style.querySelector('.material-code-area'));
    style.querySelector('.su-reference-intro')?.remove();
    sections.push(style);
    const experience = section('experience','即时回应、明确结果与可撤销操作。收藏只在本页演示，刷新后恢复。',`<div class="material-experience"><article><span class="material-eyebrow">DESIGN NOTES / 01</span><h3>把值得回看的内容，留在这里。</h3><p>柔和的材质变化，让一次小小的操作有清楚的回应。</p><button type="button" class="rg-button material-button--primary" data-material-save aria-pressed="false">${icon('plus')}收藏这篇</button></article><aside><span class="material-eyebrow">YOUR LIBRARY</span><h3>稍后阅读</h3><p data-material-save-status role="status">还没有收藏，试试左侧按钮。</p><label class="rg-check"><input type="checkbox" data-material-save-fail>下次收藏模拟失败</label><button type="button" class="rg-button rg-button--secondary" data-material-undo hidden>撤销收藏</button></aside></div>`,'<button type="button" aria-pressed="false">收藏这篇</button>\n<p role="status">收藏结果留在原位。</p>\n<!-- 业务操作应提供失败重试与撤销入口。 -->');
    sections.push(experience);
    const bloomCard = root.querySelector('.material-motion-stage--bloom').closest('article');
    const bloom = section('bloom','完成状态用局部柔光和表面变化表达，支持减少动态效果。', '<div class="material-motion-grid material-bloom-grid"></div>','<button class="rg-button material-button--primary" data-material-bloom>完成反馈</button>\n<!-- 减少动态时保留完成状态，停止光晕与缩放。 -->');
    bloom.querySelector('.material-motion-grid').append(bloomCard);
    sections.push(bloom);
    const foundation = sections.find(s => s.id === 'material-foundations');
    [...foundation.children].filter(el => !el.matches('.material-section-heading,.material-code-area')).forEach(el => el.remove());
    const foundationDemo = document.createElement('div');
    foundationDemo.innerHTML = `<div class="token-grid">${[['画布','canvas'],['内容表面','surface'],['主文字','ink'],['次要文字','muted'],['强调','accent'],['分隔线','line'],['错误','danger'],['成功','success']].map(([label,key]) => `<div class="token"><span class="token-color" style="background:var(--material-${key})"></span><span class="token-name">${label}</span><span class="token-value">--material-${key}</span></div>`).join('')}</div><div class="foundation-split"><div class="type-demo"><strong>细腻，且清楚。</strong><p>正文 16 px / 中文使用现代字形</p><small>标题 24–36 px · 标签 14 px · 元信息 12 px</small></div><div class="spacing-scale">${[4,8,12,16,24,32,48].map(n => `<span class="spacing-item"><i style="height:${n}px"></i>${n}</span>`).join('')}</div></div>`;
    foundation.insertBefore(foundationDemo,foundation.querySelector('.material-code-area'));
    foundation.querySelector('code').textContent = ':root {\n  --material-surface: #f3f5f8;\n  --material-ink: #252a33;\n  --material-accent: #5f68ad;\n}\n/* 示例为浅色材质；切换主题时替换这些变量。 */';
    foundation.querySelector('.material-section-heading p').textContent = '颜色、字体与间距各有清楚的角色。控件共享状态与语义，表面由当前材质定义。';
    const ordered = meta.map(([id,group,title,en,keys],i) => {
      const el = sections.find(s => s.id === 'material-' + id);
      el.classList.add('doc-section'); el.setAttribute('aria-labelledby',el.id + '-heading');
      const heading = el.querySelector('.material-section-heading');
      const description = heading.querySelector('p').textContent;
      heading.className = 'section-header';
      heading.innerHTML = `<span class="section-number">${String(i+1).padStart(2,'0')}</span><div><h2 id="${el.id}-heading">${title}<span class="section-title-en">${en}</span></h2><p>${description}</p></div>`;
      const area = el.querySelector('.material-code-area');
      const details = document.createElement('details');details.className = 'example-code';
      details.innerHTML = '<summary>查看用法与代码</summary>';
      details.append(...area.childNodes);area.replaceWith(details);
      details.querySelector('.material-code-head').classList.add('code-toolbar');
      if(id==='foundations'||id==='style')details.querySelector('.material-code-head>span').textContent=id==='style'&&!soft?'HTML':'CSS';
      if(id==='icons')details.querySelector('code').textContent=icon('design')+'\n<!-- 图标使用完整 SVG 路径，无需外部图标库。 -->';
      el.querySelectorAll('h4').forEach(old=>{const h=document.createElement('h3');h.className=old.className;h.innerHTML=old.innerHTML;old.replaceWith(h);});
      if (id === 'experience') el.insertAdjacentHTML('afterbegin','<div class="lab-intro"><strong>可选 · 动效实验室</strong>先保证操作结果清楚，再按需使用柔和的材质动效。</div>');
      return el;
    });
    let lastGroup = '', links = '';
    meta.forEach(([id,group,title,en,keys],i) => { if(group !== lastGroup){links += `<div class="material-catalog-group nav-group-label">${group}</div>`;lastGroup=group;} links += `<a class="catalog-link" href="#material-${id}" data-material-catalog-link data-search="${title} ${en} ${keys}"><span>${title}</span><span>${String(i+1).padStart(2,'0')}</span></a>`; });
    const nav = document.createElement('nav');nav.className='material-catalog';nav.setAttribute('aria-label','组件目录');nav.innerHTML=links;
    const shell = document.createElement('div');shell.className='docs-layout';shell.id='top';
    const sidebar = document.createElement('aside');sidebar.className='docs-sidebar';sidebar.append(search,searchMeta,nav);
    sidebar.insertAdjacentHTML('beforeend',`<p class="sidebar-note">${soft ? '细腻光影 / 柔和表面' : '玻璃材质 / 清楚的层次'}<br>统一目录 / 完整交互</p>`);
    const main = document.createElement('main');main.className='docs-main';main.id='library-main';
    main.innerHTML = `<header class="docs-intro"><div class="intro-eyebrow">${name.toUpperCase()} / COMPONENT LIBRARY</div><div class="intro-title-row"><h1>${soft ? '柔和，也有章法。' : '让光，成为界面的一部分。'}</h1><span class="rg-tag">Web 组件基础库</span></div><p>从设计基础到可用页面：统一的组件目录、清楚的状态，以及属于${soft ? '新拟态' : '玻璃'}材质的柔和动效。</p><div class="intro-facts"><span><b>18</b> 组件章节</span><span><b>24</b> 图标基准网格</span><span><b>48</b> 默认控件高度</span><span>支持键盘与减少动态</span></div><nav class="docs-quick-nav" aria-label="快速开始"><a class="rg-button material-button--primary" href="#material-usage">快速开始</a><a class="rg-button rg-button--secondary" href="#material-buttons">浏览基础组件</a><a class="rg-button rg-button--secondary" href="#material-composition">体验页面组合</a><a href="#material-experience">可选动效实验室 →</a></nav></header>`;
    main.append(empty,...ordered);
    main.insertAdjacentHTML('beforeend',`<footer class="docs-footer"><strong>${name.toUpperCase()}</strong><span>v0.4.0 · 统一格式，独立材质</span><a href="../index.html">返回管理页</a></footer>`);
    shell.append(sidebar,main);
    const header = document.createElement('header');header.className='docs-header';
    header.innerHTML = `<a class="docs-brand" href="../index.html">${icon('grid')}<strong>${soft ? 'SOFT <span>UI</span>' : 'SURFACE <span>UI</span>'}</strong><span class="version">v0.3</span></a><div class="docs-header-actions"><div class="catalog-theme-controls" role="group" aria-label="${soft ? '界面主题' : '玻璃材质'}">${(soft ? [['light','浅色'],['dark','深色']] : [['frosted','柔雾磨砂'],['clear','液态彩光']]).map(([v,t]) => `<button type="button" class="catalog-theme" data-docs-theme="${v}" aria-pressed="false">${t}</button>`).join('')}</div><a class="catalog-home" href="../index.html">组件库管理 ↗</a></div>`;
    header.querySelector('.docs-header-actions').insertBefore(motionControl,header.querySelector('.catalog-home'));
    root.replaceChildren(header,shell,...dialogs);
    header.querySelector('.version').textContent='v0.4';
    global.MaterialRefinement?.install(root,icon,soft);
    root.insertAdjacentHTML('afterbegin','<a class="skip-link" href="#library-main">跳至组件内容</a>');
    const params = new URLSearchParams(location.search);
    const setTheme = (value,write=false) => {
      if(soft){document.body.dataset.theme=value;document.documentElement.style.colorScheme=value;}
      else{document.body.dataset.theme='glass';document.body.dataset.glassStyle=value;}
      root.querySelectorAll('[data-docs-theme]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.docsTheme===value)));
      if(write){const url=new URL(location.href);url.searchParams.set(soft?'theme':'style',value);history.replaceState(null,'',url);}
    };
    setTheme(soft ? (params.get('theme')==='dark'?'dark':'light') : (params.get('style')==='clear'?'clear':'frosted'));
    root.querySelectorAll('[data-docs-theme]').forEach(b=>b.addEventListener('click',()=>setTheme(b.dataset.docsTheme,true)));
    root.querySelectorAll('.su-segmented,.su-tab-strip,.su-option-strip').forEach(group=>group.addEventListener('click',e=>{const b=e.target.closest('button');if(b)group.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));}));
    root.querySelectorAll('.su-pill-switch,.su-liquid-switch').forEach(b=>b.addEventListener('click',()=>b.setAttribute('aria-checked',String(b.getAttribute('aria-checked')!=='true'))));
    let saved=false;
    const saveButton=root.querySelector('[data-material-save]'),status=root.querySelector('[data-material-save-status]'),undo=root.querySelector('[data-material-undo]'),fail=root.querySelector('[data-material-save-fail]');
    const updateSave=()=>{saveButton.setAttribute('aria-pressed',String(saved));saveButton.textContent=saved?'已收藏':'收藏这篇';undo.hidden=!saved;};
    saveButton.addEventListener('click',()=>{if(!saved&&fail.checked){fail.checked=false;status.textContent='收藏失败，点击“重试收藏”再试一次。';saveButton.textContent='重试收藏';return;}saved=!saved;updateSave();status.textContent=saved?'已加入稍后阅读，可以随时撤销。':'已取消收藏。';});
    undo.addEventListener('click',()=>{saved=false;updateSave();status.textContent='已撤销收藏。';saveButton.focus();});
    // Clear a search before following a deep link to a hidden section.
    root.addEventListener('click',e=>{if(e.target.closest('a[href^="#"]')){const input=root.querySelector('[data-material-search]');input.value='';input.dispatchEvent(new Event('input'));}});
  }
  global.MaterialDocs=Object.freeze({prepare,sections:meta});
})(window);
