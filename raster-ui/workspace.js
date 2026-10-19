/* The component library's single workspace composition. */
(function (global) {
  'use strict';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon = name => `<svg class="rg-icon" aria-hidden="true"><use href="#rg-i-${name}"/></svg>`;
  const glyphs = {R:['11110','10001','10001','11110','10100','10010','10001'],A:['01110','10001','10001','11111','10001','10001','10001'],S:['01111','10000','10000','01110','00001','00001','11110'],T:['11111','00100','00100','00100','00100','00100','00100'],E:['11111','10000','10000','11110','10000','10000','11111'],G:['01111','10000','10000','10111','10001','10001','01110'],I:['111','010','010','010','010','010','111'],D:['11110','10001','10001','10001','10001','10001','11110'],' ':['000','000','000','000','000','000','000'],0:['01110','11011','11011','11011','11011','11011','01110'],1:['00100','01100','00100','00100','00100','00100','01110'],2:['11110','00011','00011','01110','11000','11000','11111'],3:['11110','00011','00011','01110','00011','00011','11110'],4:['11011','11011','11011','11111','00011','00011','00011'],5:['11111','11000','11000','11110','00011','00011','11110'],6:['01110','11000','11000','11110','11011','11011','01110'],7:['11111','00011','00110','00110','01100','01100','01100'],8:['01110','11011','11011','01110','11011','11011','01110'],9:['01110','11011','11011','01111','00011','00011','01110']};
  function bitmap(text, label = text, className = '') {
    let x = 0, rects = '';
    for (const char of String(text).toUpperCase()) {
      const rows = glyphs[char] || glyphs[' '];
      rows.forEach((row, y) => [...row].forEach((v, i) => { if (v === '1') rects += `<rect x="${x + i}" y="${y}" width="1" height="1"/>`; }));
      x += rows[0].length + 1;
    }
    return `<svg class="workspace-bitmap ${className}" viewBox="0 0 ${Math.max(1, x - 1)} 7" role="img" aria-label="${esc(label)}">${rects}</svg>`;
  }
  const statuses = {active:'进行中',todo:'待开始',done:'已完成'};
  const types = {design:'设计系统',web:'产品网站',phone:'移动应用',doc:'组件文档'};
  const views = [['overview','grid','概览'],['projects','folder','项目'],['resources','data','资源'],['settings','gear','设置']];
  const navigation = () => views.map(([id, i, title]) => `<button type="button" class="rg-nav__item" data-workspace-view="${id}" ${id === 'projects' ? 'aria-current="page"' : ''}>${icon(i)}<span>${title}</span></button>`).join('');
  const template = `
  <div class="workspace-demo" id="workspace-demo">
    <header class="workspace-brand">${bitmap('RASTER GRID')}<span class="rg-tag">交互工作台</span></header>
    <div class="workspace-layout">
      <aside class="workspace-aside"><nav class="rg-nav" aria-label="工作台主导航">${navigation()}</nav></aside>
      <div class="workspace-main">
        <header class="workspace-heading"><div><h3 id="workspace-title" tabindex="-1">项目</h3><p id="workspace-subtitle">把工作保持有序</p></div><div class="workspace-total"><span id="workspace-count"></span><small>未归档项目</small></div></header>
        <div id="workspace-projects">
          <div class="workspace-toolbar"><label class="rg-search">${icon('search')}<input type="search" id="workspace-search" placeholder="搜索名称或说明" aria-label="搜索工作台项目" autocomplete="off"></label><button type="button" class="rg-button" data-rg-open="workspace-create-dialog">${icon('add')}新建项目</button></div>
          <div class="workspace-controls"><div class="rg-segmented" data-rg-segmented id="workspace-filters" aria-label="工作台项目状态">${[['all','全部'],['active','进行中'],['done','已完成'],['archived','已归档']].map(([value, label]) => `<button type="button" class="rg-segment" data-value="${value}" aria-pressed="${value === 'all'}">${label}</button>`).join('')}</div>
          <div class="rg-segmented" data-rg-segmented id="workspace-display" aria-label="工作台显示方式"><button type="button" class="rg-segment" data-value="cards" aria-pressed="true">卡片</button><button type="button" class="rg-segment" data-value="list" aria-pressed="false">列表</button></div></div>
          <div class="workspace-results"><span id="workspace-results" role="status" aria-atomic="true"></span><span id="workspace-selected"></span></div>
          <div class="rg-card-grid" id="workspace-cards"></div>
        </div>
        <section id="workspace-secondary" aria-labelledby="workspace-title" hidden></section>
        <p class="workspace-note" id="workspace-storage-note">项目保存在当前浏览器中。</p>
      </div>
    </div>
    <nav class="rg-bottom-nav workspace-mobile-nav" aria-label="工作台移动导航">${navigation()}</nav>
    <dialog class="rg-dialog rg-root" id="workspace-create-dialog" aria-labelledby="workspace-create-title">
      <header class="rg-dialog__header"><h2 class="rg-dialog__title" id="workspace-create-title">新建项目</h2><button type="button" class="rg-button rg-button--quiet rg-button--icon" data-rg-close aria-label="关闭新建项目">${icon('close')}</button></header>
      <form class="rg-dialog__body workspace-form" id="workspace-create-form" novalidate>
        <label class="rg-field"><span class="rg-label">项目名称（必填）</span><input class="rg-input" name="name" required maxlength="30" autofocus aria-describedby="workspace-name-help workspace-name-error"><span class="rg-help" id="workspace-name-help">最多 30 个字符。</span><span class="rg-help rg-help--error" id="workspace-name-error" aria-live="polite"></span></label>
        <label class="rg-field"><span class="rg-label">项目类型</span><select class="rg-select" name="type">${Object.entries(types).map(([v, n]) => `<option value="${v}">${n}</option>`).join('')}</select></label>
        <label class="rg-field"><span class="rg-label">简短说明（选填）</span><textarea class="rg-textarea" name="description" maxlength="100" aria-describedby="workspace-description-help workspace-description-error"></textarea><span class="rg-help" id="workspace-description-help">最多 100 个字符。</span><span class="rg-help rg-help--error" id="workspace-description-error" aria-live="polite"></span></label>
        <div class="rg-dialog__footer"><button type="button" class="rg-button rg-button--secondary" data-rg-close>取消</button><button type="submit" class="rg-button">创建项目</button></div>
      </form>
    </dialog>
    <dialog class="rg-dialog rg-root" id="workspace-detail-dialog" aria-labelledby="workspace-detail-title">
      <header class="rg-dialog__header"><h2 class="rg-dialog__title" id="workspace-detail-title">项目详情</h2><button type="button" class="rg-button rg-button--quiet rg-button--icon" data-rg-close aria-label="关闭项目详情">${icon('close')}</button></header>
      <div class="rg-dialog__body workspace-form"><p id="workspace-detail-description"></p><p class="rg-help" id="workspace-detail-meta"></p><label class="rg-field"><span class="rg-label">项目状态</span><select class="rg-select" id="workspace-detail-status">${Object.entries(statuses).map(([v, n]) => `<option value="${v}">${n}</option>`).join('')}</select></label><p class="rg-help" id="workspace-archive-note" hidden>项目已归档，移出归档后可修改状态。</p><div class="rg-dialog__footer"><button type="button" class="rg-button rg-button--secondary" id="workspace-archive">归档项目</button><button type="button" class="rg-button" id="workspace-save-detail">保存并关闭</button></div></div>
    </dialog>
  </div>`;

  function mount(root) {
    if (!root || root.dataset.workspaceMounted) return;
    root.dataset.workspaceMounted = 'true';
    const $ = selector => root.querySelector(selector);
    const seed = [
      {id:'design-system',name:'设计系统',description:'统一产品的视觉与交互规范',english:'Design System',type:'design',status:'active',updated:'2026-10-08',archived:false},
      {id:'product-website',name:'产品网站',description:'官网重构与内容建设',english:'Product Website',type:'web',status:'todo',updated:'2026-10-07',archived:false},
      {id:'mobile-application',name:'移动应用',description:'iOS 与 Android 客户端',english:'Mobile Application',type:'phone',status:'active',updated:'2026-10-06',archived:false},
      {id:'component-docs',name:'组件文档',description:'组件使用说明与示例',english:'Component Docs',type:'doc',status:'done',updated:'2026-10-05',archived:false}
    ];
    let records = seed, view = 'projects', filter = 'all', selected = null, storageAvailable = true, creating = false, saving = false;
    const storageKey = 'raster-grid.projects.v1'; // Keep data created in the former prototype.
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (Array.isArray(saved) && saved.length && new Set(saved.map(p => p?.id)).size === saved.length && saved.every(p => p && typeof p.id === 'string' && typeof p.name === 'string' && typeof p.description === 'string' && Object.hasOwn(statuses, p.status) && Object.hasOwn(types, p.type) && /^\d{4}-\d{2}-\d{2}$/.test(p.updated) && typeof p.archived === 'boolean')) records = saved;
    } catch { storageAvailable = false; }
    const form = $('#workspace-create-form');
    const fields = [form.elements.name, form.elements.description];
    const today = () => { const d = new Date(); return [d.getFullYear(), String(d.getMonth() + 1).padStart(2,'0'), String(d.getDate()).padStart(2,'0')].join('-'); };
    const toast = text => RasterUI.toast(text, {context:root});
    function storageNote() { $('#workspace-storage-note').textContent = storageAvailable ? '项目自动保存在当前浏览器，可刷新后继续。' : '浏览器存储不可用，项目仅保留到本页关闭。'; }
    function save() { try { localStorage.setItem(storageKey, JSON.stringify(records)); } catch { storageAvailable = false; toast('浏览器暂时无法保存，项目仅保留在当前页面。'); } storageNote(); }
    const statusClass = p => p.archived || p.status === 'todo' ? 'rg-status--pending' : p.status === 'done' ? 'rg-status--done' : '';
    function renderCards() {
      const term = $('#workspace-search').value.trim().toLowerCase();
      const visible = records.filter(p => (filter === 'archived' ? p.archived : !p.archived && (filter === 'all' || p.status === filter)) && `${p.name} ${p.description} ${p.english || ''}`.toLowerCase().includes(term)).sort((a,b) => b.updated.localeCompare(a.updated));
      $('#workspace-cards').innerHTML = visible.map((p, i) => `<button type="button" class="rg-card ${p.id === selected ? 'rg-card--selected' : ''}" data-workspace-project="${esc(p.id)}" aria-haspopup="dialog" aria-controls="workspace-detail-dialog" ${p.id === selected ? 'aria-current="true"' : ''}><span class="rg-card__index">${String(i + 1).padStart(2,'0')}</span><span class="rg-card__main">${icon(p.type)}<span class="rg-card__content"><span class="rg-card__title">${esc(p.name)}</span><span class="rg-status ${statusClass(p)}">${p.archived ? '已归档' : statuses[p.status]}</span></span><span class="rg-card__arrow">${icon('arrow')}</span></span><span class="rg-card__footer"><span><span class="rg-card__description">${esc(p.description || '暂无说明')}</span><span class="rg-card__meta">${esc(p.english || types[p.type])}</span></span><time datetime="${p.updated}">${p.updated.slice(5).replace('-','.')}</time></span></button>`).join('') || `<div class="rg-empty"><h4>没有找到相关项目</h4><p>试试其他关键词或筛选条件。</p><button type="button" class="rg-button rg-button--secondary" data-workspace-reset>查看全部项目</button></div>`;
      $('#workspace-results').textContent = `显示 ${visible.length} 个项目 / 总计 ${records.length} 个`;
      const current = records.find(p => p.id === selected);
      $('#workspace-selected').textContent = current ? '当前项目：' + current.name : '';
      const count = records.filter(p => !p.archived).length;
      $('#workspace-count').innerHTML = bitmap(String(count).padStart(2,'0'), count + ' 个未归档项目');
    }
    function resourceRows(list) { return list.map(p => `<button type="button" class="rg-list-item" data-workspace-project="${esc(p.id)}" aria-haspopup="dialog" aria-controls="workspace-detail-dialog">${icon(p.type)}<span class="rg-list-item__body"><span class="rg-list-item__title">${esc(p.name)}</span><span class="rg-list-item__description">${esc(p.description || '暂无说明')}</span></span>${icon('arrow')}</button>`).join('') || '<p class="rg-help">暂无相关项目。</p>'; }
    function renderSecondary() {
      const active = records.filter(p => !p.archived);
      if (view === 'overview') $('#workspace-secondary').innerHTML = `<div class="workspace-stats">${Object.entries(statuses).map(([s,n]) => `<div><span>${n}</span><strong>${active.filter(p => p.status === s).length}</strong></div>`).join('')}</div><h4>最近更新</h4><div class="rg-list">${resourceRows([...active].sort((a,b) => b.updated.localeCompare(a.updated)).slice(0,4))}</div>`;
      if (view === 'resources') $('#workspace-secondary').innerHTML = `<h4>规范与文档</h4><div class="rg-list">${resourceRows(active.filter(p => ['design','doc'].includes(p.type)))}</div>`;
      if (view === 'settings') $('#workspace-secondary').innerHTML = `<label class="workspace-setting rg-switch"><span>紧凑间距<small>减少工作台条目和控件的留白</small></span><input type="checkbox" role="switch" id="workspace-compact" ${root.hasAttribute('data-rg-density') ? 'checked' : ''}><span class="rg-switch__track" aria-hidden="true"></span></label><p class="rg-help">灰度查看使用组件库顶部开关；动态效果偏好使用动效实验室设置。</p>`;
    }
    function setView(next) {
      view = next;
      const subtitles = {projects:'把工作保持有序',overview:'工作空间，一目了然',resources:'规范与文档，随时查阅',settings:'调整你的工作空间'};
      $('#workspace-title').textContent = views.find(v => v[0] === view)[2];
      $('#workspace-subtitle').textContent = subtitles[view];
      $('#workspace-projects').hidden = view !== 'projects';
      $('#workspace-secondary').hidden = view === 'projects';
      root.querySelectorAll('[data-workspace-view]').forEach(b => { if (b.dataset.workspaceView === view) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current'); });
      renderSecondary();
      $('#workspace-title').focus({preventScroll:true});
    }
    function resetFilters() {
      $('#workspace-search').value = '';
      const all = $('#workspace-filters [data-value="all"]');
      // Selecting an unchanged segment intentionally emits no rg:change.
      if (all.getAttribute('aria-pressed') === 'true') { filter = 'all'; renderCards(); }
      else all.click();
    }
    root.addEventListener('click', event => {
      const b = event.target.closest('button');
      if (!b) return;
      if (b.dataset.workspaceView) setView(b.dataset.workspaceView);
      if (b.hasAttribute('data-workspace-reset')) { resetFilters(); $('#workspace-search').focus(); }
      if (b.dataset.workspaceProject) {
        const p = records.find(p => p.id === b.dataset.workspaceProject);
        if (!p) return;
        selected = p.id;
        // Update selection without replacing the opener: focus returns to it after closing.
        root.querySelectorAll('#workspace-cards [data-workspace-project]').forEach(card => { const current = card.dataset.workspaceProject === selected; card.classList.toggle('rg-card--selected',current); if (current) card.setAttribute('aria-current','true'); else card.removeAttribute('aria-current'); });
        $('#workspace-selected').textContent = '当前项目：' + p.name;
        $('#workspace-detail-title').textContent = p.name;
        $('#workspace-detail-description').textContent = p.description || '暂无说明';
        $('#workspace-detail-meta').textContent = `${types[p.type]} · 最近更新 ${p.updated}`;
        $('#workspace-detail-status').value = p.status;
        $('#workspace-detail-status').disabled = p.archived;
        $('#workspace-archive-note').hidden = !p.archived;
        $('#workspace-archive').textContent = p.archived ? '移出归档' : '归档项目';
        RasterUI.openDialog('workspace-detail-dialog', b);
      }
    });
    $('#workspace-search').addEventListener('input', renderCards);
    $('#workspace-filters').addEventListener('rg:change', e => { filter = e.detail.value; renderCards(); });
    $('#workspace-display').addEventListener('rg:change', e => $('#workspace-cards').classList.toggle('rg-card-grid--list', e.detail.value === 'list'));
    root.addEventListener('change', e => { if (e.target.id === 'workspace-compact') { if (e.target.checked) root.dataset.rgDensity = 'compact'; else root.removeAttribute('data-rg-density'); } });
    function validate(field) {
      field.setCustomValidity(field.name === 'name' && !field.value.trim() ? '请输入项目名称，不能只填空格。' : '');
      if (field.value.length > field.maxLength) field.setCustomValidity(`最多 ${field.maxLength} 个字符。`);
      const valid = field.validity.valid;
      field.setAttribute('aria-invalid', String(!valid));
      $('#workspace-' + field.name + '-error').textContent = valid ? '' : field.validationMessage;
      return valid;
    }
    form.addEventListener('invalid', e => e.preventDefault(), true);
    fields.forEach(field => field.addEventListener('input', () => { if (field.hasAttribute('aria-invalid')) validate(field); else field.setCustomValidity(''); }));
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (creating) return;
      fields.forEach(validate);
      if (!form.checkValidity()) { fields.find(f => !f.validity.valid).focus(); return; }
      const record = {id:global.crypto?.randomUUID?.() || 'project-' + Date.now().toString(36),name:form.elements.name.value.trim(),description:form.elements.description.value.trim(),type:form.elements.type.value,status:'todo',english:'',updated:today(),archived:false};
      const submit = event.submitter || form.querySelector('[type="submit"]');
      creating = true; RasterUI.setLoading(submit, true, '正在创建');
      try {
        if (!await RasterUI.closeDialog('workspace-create-dialog','created')) return;
        records.unshift(record); selected = record.id; save(); resetFilters();
        form.reset(); fields.forEach(f => { f.setCustomValidity(''); f.removeAttribute('aria-invalid'); $('#workspace-' + f.name + '-error').textContent = ''; });
        toast('已创建项目。');
      } finally { creating = false; RasterUI.setLoading(submit,false); }
    });
    async function updateDetail(archive) {
      if (saving) return;
      const p = records.find(p => p.id === selected);
      if (!p) return;
      const state = $('#workspace-detail-status').value;
      saving = true;
      try {
        if (!await RasterUI.closeDialog('workspace-detail-dialog','saved')) return;
        const changed = archive || (!p.archived && p.status !== state);
        if (archive) p.archived = !p.archived;
        else if (!p.archived) p.status = state;
        if (changed) { p.updated = today(); save(); }
        renderCards(); renderSecondary();
        // The card may leave the current filter; restore focus to its replacement or view heading.
        const opener = [...root.querySelectorAll('[data-workspace-project]')].find(b => b.dataset.workspaceProject === p.id && b.getClientRects().length);
        (opener || $('#workspace-title')).focus({preventScroll:true});
        toast(archive ? (p.archived ? '项目已归档。' : '项目已移出归档。') : '项目状态已保存。');
      } finally { saving = false; }
    }
    $('#workspace-archive').addEventListener('click', () => updateDetail(true));
    $('#workspace-save-detail').addEventListener('click', () => updateDetail(false));
    renderCards(); storageNote();
  }
  global.RasterWorkspace = Object.freeze({template, bitmap, mount});
})(window);
