/* Shared material exploration layer for Soft UI and Surface UI. */
(function (global) {
  'use strict';
  if (global.MaterialUI) return;

  const ICONS = Object.freeze({
    grid: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
    folder: '<path d="M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>',
    design: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 16l2.8-3 2.1 2 2.8-4 2.3 5M8 8h.01"/>',
    web: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M4 9h16M8 6.8h.01M11 6.8h.01M14 6.8h.01"/>',
    phone: '<rect x="7" y="2.8" width="10" height="18.4" rx="2"/><path d="M10 5.5h4M11 18.5h2"/>',
    data: '<ellipse cx="12" cy="6" rx="7.5" ry="3"/><path d="M4.5 6v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6M4.5 12v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6"/>',
    gear: '<path d="M12 3.5l1.2 1.9 2.3.4.5 2.3 1.9 1.2-.9 2.2.9 2.2-1.9 1.2-.5 2.3-2.3.4L12 19.5l-1.2-1.9-2.3-.4-.5-2.3-1.9-1.2.9-2.2-.9-2.2 1.9-1.2.5-2.3 2.3-.4z"/><circle cx="12" cy="12" r="2.8"/>',
    search: '<circle cx="10.8" cy="10.8" r="5.8"/><path d="m15.2 15.2 4.5 4.5"/>',
    arrow: '<path d="M4 12h15M13 6l6 6-6 6"/>',
    check: '<path d="m5 12.5 4.2 4.2L19 7"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    add: '<circle cx="12" cy="12" r="8.5"/><path d="M12 8v8M8 12h8"/>',
    doc: '<rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>'
  });
  const iconNames = Object.keys(ICONS);
  const icon = (name, size = 24) => `<svg class="rg-icon rg-icon--${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
  const escapeHtmlText = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const codeBlock = (title, lines) => '<div class="material-code-block"><div class="material-code-head"><span>' + title + '</span><button type="button" class="rg-button rg-button--quiet rg-button--sm" data-material-copy-code>复制</button></div><pre tabindex="0"><code>' + escapeHtmlText(lines.join("\n")) + '</code></pre></div>';
  const template = `
    <header class="material-intro">
      <div>
        <span class="material-eyebrow">MATERIAL SYSTEM / MATERIAL EXPLORATION</span>
        <h2>同一套组件，换一层材质。</h2>
        <p>沿用同一套间距、状态、焦点和动效规则，只把表面换成当前页面的材质。每个示例都可以直接操作。</p>
      </div>
      <div class="material-intro-actions">
        <button type="button" class="rg-button" data-material-toast>${icon('check')}<span>测试反馈</span></button>
        <label class="material-motion-select"><span>动态效果</span><select class="rg-select" data-material-motion><option value="auto">跟随系统</option><option value="reduced">减少动态</option></select></label>
      </div>
    </header>
    <div class="material-catalog-shell">
      <label class="material-search"><span>查找组件</span><input class="rg-input" type="search" data-material-search placeholder="例如：开关、弹窗、骨架" aria-label="查找材质组件"></label>
      <div class="material-search-meta"><p class="material-search-status" data-material-search-status role="status" aria-live="polite">15 个章节全部显示</p><button type="button" class="rg-button rg-button--quiet rg-button--sm" data-material-search-reset hidden>显示全部</button></div>
      <nav class="material-catalog" aria-label="材质组件目录">
        <div class="material-catalog-group"><span>基础规则</span><a href="#material-foundations" data-material-catalog-link data-search="基础 tokens 颜色 按钮 状态 表单 foundations">基础规则 <small>01</small></a><a href="#material-icons" data-material-catalog-link data-search="icon 图标 svg 尺寸 icons">图标 <small>02</small></a></div>
        <div class="material-catalog-group"><span>基础控件</span><a href="#material-buttons" data-material-catalog-link data-search="按钮 loading 禁用 尺寸 buttons">按钮 <small>03</small></a><a href="#material-fields" data-material-catalog-link data-search="input 表单 输入 搜索 select textarea fields">表单 <small>04</small></a><a href="#material-selection" data-material-catalog-link data-search="checkbox radio switch 复选 单选 开关 selection">选择 <small>05</small></a></div>
        <div class="material-catalog-group"><span>导航结构</span><a href="#material-filters" data-material-catalog-link data-search="segmented 分段 筛选 filters">筛选 <small>06</small></a><a href="#material-tabs" data-material-catalog-link data-search="tabs 页签 面板 tabs">页签 <small>07</small></a><a href="#material-navigation" data-material-catalog-link data-search="nav 导航 侧栏 底部 navigation">导航 <small>08</small></a></div>
        <div class="material-catalog-group"><span>内容反馈</span><a href="#material-cards" data-material-catalog-link data-search="card list 卡片 列表 内容 cards">卡片 <small>09</small></a><a href="#material-status" data-material-catalog-link data-search="status tag alert 状态 标签 提示">状态 <small>10</small></a><a href="#material-empty-loading" data-material-catalog-link data-search="empty loading skeleton 空状态 加载 骨架">空状态 <small>11</small></a><a href="#material-feedback" data-material-catalog-link data-search="dialog toast modal 弹窗 通知 反馈">反馈 <small>12</small></a></div>
        <div class="material-catalog-group"><span>组合接入</span><a href="#material-composition" data-material-catalog-link data-search="composition 响应式 页面 组合 composition">组合 <small>13</small></a><a href="#material-usage" data-material-catalog-link data-search="usage api 安装 使用 接入 getting started">接入 <small>14</small></a><a href="#material-motion" data-material-catalog-link data-search="motion 动效 入场 光晕 弹窗 motion">动效 <small>15</small></a></div>
      </nav>
      <div class="material-empty-search rg-empty" data-material-search-empty hidden><h3>没有找到这个组件</h3><p>试试“按钮”“开关”“弹窗”或“骨架”。</p></div>
    </div>

    <section class="material-section" id="material-foundations" aria-labelledby="material-foundation-title">
      <div class="material-section-heading"><span class="material-section-number">01</span><div><h3 id="material-foundation-title">基础组件 <small>FOUNDATIONS</small></h3><p>按钮、分段选择、状态和输入控件共用同一套可访问语义。</p></div></div>
      <div class="material-demo material-demo--buttons">
        <p class="material-demo-label">按钮状态</p>
        <div class="material-row">
          <button type="button" class="rg-button material-button--primary" data-material-feedback>${icon('plus')}创建项目</button>
          <button type="button" class="rg-button rg-button--secondary" data-material-toast>预览</button>
          <button type="button" class="rg-button rg-button--quiet" data-material-feedback>安静操作</button>
          <button type="button" class="rg-button material-button--danger" data-material-feedback>删除</button>
          <button type="button" class="rg-button rg-button--secondary" disabled>暂不可用</button>
        </div>
        <div class="material-row material-row--split">
          <div class="rg-segmented" data-rg-segmented aria-label="视图切换"><button type="button" class="rg-segment" data-value="day" aria-pressed="true">日</button><button type="button" class="rg-segment" data-value="week" aria-pressed="false">周</button><button type="button" class="rg-segment" data-value="month" aria-pressed="false">月</button></div>
          <div class="material-statuses"><span class="material-status material-status--success">稳定</span><span class="material-status material-status--warning">待处理</span><span class="material-status material-status--danger">风险</span></div>
        </div>
      </div>
      <div class="material-grid material-grid--form">
        <div class="material-demo"><p class="material-demo-label">表单控件</p><div class="material-form-grid"><label class="rg-field"><span class="rg-label">项目名称</span><input class="rg-input" placeholder="例如：精确工作室"></label><label class="rg-field"><span class="rg-label">类型</span><select class="rg-select"><option>仪表盘</option><option>工具站</option><option>移动应用</option></select></label><label class="rg-field material-form-span"><span class="rg-label">设计说明</span><textarea class="rg-textarea" placeholder="描述这层表面的材质与光照"></textarea></label></div><div class="material-row material-row--split material-form-footer"><label class="rg-check"><input type="checkbox" checked><span>同步到云端</span></label><button type="button" class="material-switch" data-material-switch role="switch" aria-checked="true" aria-label="夜间模式"><i></i></button></div></div>
        <div class="material-demo material-demo--tokens"><p class="material-demo-label">材质 tokens</p><div class="material-token-list"><span><i class="material-swatch material-swatch--canvas"></i>Canvas</span><span><i class="material-swatch material-swatch--surface"></i>Surface</span><span><i class="material-swatch material-swatch--accent"></i>Accent</span><span><i class="material-swatch material-swatch--line"></i>Line</span></div><p class="material-token-note">颜色、边界、阴影和动效都由主题变量驱动，组件本身保持稳定。</p></div>
      </div>
          <div class="material-code-area"><div class="material-code-block"><div class="material-code-head"><span>HTML 用法</span><button type="button" class="rg-button rg-button--quiet rg-button--sm" data-material-copy-code>复制</button></div><pre tabindex="0"><code>&lt;button class=&quot;rg-button material-button--primary&quot; type=&quot;button&quot;&gt;创建项目&lt;/button&gt;
&lt;button class=&quot;rg-button rg-button--secondary&quot; type=&quot;button&quot;&gt;取消&lt;/button&gt;
&lt;div class=&quot;rg-segmented&quot; data-rg-segmented aria-label=&quot;视图切换&quot;&gt;
  &lt;button class=&quot;rg-segment&quot; aria-pressed=&quot;true&quot;&gt;日&lt;/button&gt;
&lt;/div&gt;</code></pre></div></div>
</section>

    <section class="material-section" id="material-icons" aria-labelledby="material-icons-title">
      <div class="material-section-heading"><span class="material-section-number">02</span><div><h3 id="material-icons-title">图标 <small>ICON SYSTEM</small></h3><p>线性图标保持统一的 24px 基准、留白和笔画，随 Soft UI 与 Glass 材质一起改变颜色。</p></div></div>
      <div class="material-grid material-grid--icons"><div class="material-demo"><p class="material-demo-label">图标集合</p><div class="material-icon-grid">${iconNames.map(name => `<button type="button" class="material-icon-cell" data-material-copy="${name}" aria-label="复制 ${name} 图标用法">${icon(name)}<span>${name}</span></button>`).join('')}</div></div><div class="material-demo material-icon-scale-demo"><p class="material-demo-label">尺寸比例</p><div class="material-icon-scale"><span>${icon('design', 24)}<small>24 × 24</small></span><span>${icon('design', 48)}<small>48 × 48</small></span><span>${icon('design', 72)}<small>72 × 72</small></span></div><p class="material-token-note">轮廓、留白与笔画一起放大，避免把小图标拉伸变形。</p></div></div>
          <div class="material-code-area"><div class="material-code-block"><div class="material-code-head"><span>HTML 用法</span><button type="button" class="rg-button rg-button--quiet rg-button--sm" data-material-copy-code>复制</button></div><pre tabindex="0"><code>&lt;svg class=&quot;rg-icon&quot; viewBox=&quot;0 0 24 24&quot; aria-hidden=&quot;true&quot;&gt;
  &lt;use href=&quot;#material-icon-design&quot;&gt;&lt;/use&gt;
&lt;/svg&gt;
&lt;svg class=&quot;rg-icon rg-icon--48&quot;&gt;…&lt;/svg&gt;</code></pre></div></div>
</section>

    <section class="material-section" id="material-buttons" aria-labelledby="material-buttons-title">
      <div class="material-section-heading"><span class="material-section-number">03</span><div><h3 id="material-buttons-title">按钮 <small>BUTTONS</small></h3><p>主操作、次要操作、安静操作、危险操作、禁用和加载状态都保留清晰的层级。</p></div></div>
      <div class="material-demo"><p class="material-demo-label">层级</p><div class="material-row"><button type="button" class="rg-button material-button--primary" data-material-feedback>${icon('add')}新建条目</button><button type="button" class="rg-button rg-button--secondary" data-material-feedback>取消</button><button type="button" class="rg-button rg-button--quiet" data-material-feedback>查看详情</button><button type="button" class="rg-button material-button--danger" data-material-feedback>删除条目</button></div></div>
      <div class="material-demo material-demo--states"><p class="material-demo-label">状态 · 固定示例与实际交互采用相同样式</p><div class="material-state-grid"><button type="button" class="rg-button rg-button--secondary">默认</button><button type="button" class="rg-button rg-button--secondary material-state-hover">悬停</button><button type="button" class="rg-button rg-button--secondary material-state-pressed">按下</button><button type="button" class="rg-button rg-button--secondary material-state-focus">焦点</button><button type="button" class="rg-button rg-button--secondary" disabled>禁用</button><button type="button" class="rg-button rg-button--secondary material-loading-button" data-material-loading>试试加载</button></div></div>
      <div class="material-demo"><p class="material-demo-label">尺寸与交互</p><div class="material-row"><button type="button" class="rg-button rg-button--secondary material-button--sm">小 / 40</button><button type="button" class="rg-button rg-button--secondary">默认 / 48</button><button type="button" class="rg-button rg-button--secondary material-button--lg">大 / 56</button><button type="button" class="rg-button rg-button--secondary rg-button--icon" aria-label="新增条目">${icon('plus')}</button></div><p class="material-token-note">触摸设备的小按钮仍保留足够的触控面积，加载期间会锁定重复触发。</p></div>
          <div class="material-code-area"><div class="material-code-block"><div class="material-code-head"><span>HTML 用法</span><button type="button" class="rg-button rg-button--quiet rg-button--sm" data-material-copy-code>复制</button></div><pre tabindex="0"><code>&lt;button class=&quot;rg-button material-button--primary&quot;&gt;主操作&lt;/button&gt;
&lt;button class=&quot;rg-button rg-button--secondary&quot;&gt;次要操作&lt;/button&gt;
&lt;button class=&quot;rg-button rg-button--quiet&quot;&gt;安静操作&lt;/button&gt;
&lt;button class=&quot;rg-button material-button--danger&quot;&gt;删除&lt;/button&gt;
&lt;button class=&quot;rg-button&quot; disabled&gt;禁用&lt;/button&gt;
&lt;button class=&quot;rg-button material-loading-button&quot; data-material-loading&gt;加载&lt;/button&gt;</code></pre></div></div>
</section>

    <section class="material-section" id="material-fields" aria-labelledby="material-fields-title">
      <div class="material-section-heading"><span class="material-section-number">04</span><div><h3 id="material-fields-title">输入与表单 <small>FORM FIELDS</small></h3><p>标签、帮助文案、错误、只读、禁用、搜索、选择和长文本保持完整的输入语义。</p></div></div>
      <div class="material-demo"><p class="material-demo-label">输入状态</p><div class="material-form-grid"><label class="rg-field"><span class="rg-label">名称 · 默认</span><input class="rg-input" placeholder="输入条目名称" aria-describedby="material-name-help"><span class="rg-help" id="material-name-help">给内容一个容易识别的名字。</span></label><label class="rg-field"><span class="rg-label">名称 · 错误</span><input class="rg-input" placeholder="输入条目名称" aria-invalid="true" aria-describedby="material-name-error"><span class="rg-help material-help--error" id="material-name-error">请输入名称后再继续。</span></label><label class="rg-field"><span class="rg-label">编号 · 只读</span><input class="rg-input" value="MT-001" readonly></label><label class="rg-field"><span class="rg-label">名称 · 禁用</span><input class="rg-input" value="当前不可编辑" disabled></label></div></div>
      <div class="material-demo"><p class="material-demo-label">搜索、选择与长文本</p><div class="material-grid material-grid--form"><div class="material-form-grid material-form-grid--stack"><label class="rg-field"><span class="rg-label">搜索资料</span><span class="material-search-field">${icon('search')}<input type="search" class="rg-input" placeholder="搜索资料" aria-label="搜索资料示例"></span></label><label class="rg-field"><span class="rg-label">内容类型</span><select class="rg-select"><option>文章</option><option>笔记</option><option>文档</option></select></label></div><label class="rg-field"><span class="rg-label">简短说明</span><textarea class="rg-textarea" placeholder="补充说明这份资料的用途。" maxlength="120"></textarea><span class="rg-help">最多 120 个字符。</span></label></div></div>
      <div class="material-demo"><p class="material-demo-label">验证演示</p><form class="material-validation" data-material-validation novalidate><label class="rg-field"><span class="rg-label">条目名称</span><input class="rg-input" name="entry" aria-describedby="material-validation-message" required><span class="rg-help" id="material-validation-message" aria-live="polite">可以留空提交，查看错误反馈。</span></label><button class="rg-button material-button--primary" type="submit">检查输入</button></form></div>
          <div class="material-code-area"><div class="material-code-block"><div class="material-code-head"><span>HTML 用法</span><button type="button" class="rg-button rg-button--quiet rg-button--sm" data-material-copy-code>复制</button></div><pre tabindex="0"><code>&lt;label class=&quot;rg-field&quot;&gt;
  &lt;span class=&quot;rg-label&quot;&gt;项目名称&lt;/span&gt;
  &lt;input class=&quot;rg-input&quot; aria-describedby=&quot;field-help&quot;&gt;
  &lt;span class=&quot;rg-help&quot; id=&quot;field-help&quot; aria-live=&quot;polite&quot;&gt;帮助文案&lt;/span&gt;
&lt;/label&gt;</code></pre></div></div>
</section>

    <section class="material-section" id="material-selection" aria-labelledby="material-selection-title">
      <div class="material-section-heading"><span class="material-section-number">05</span><div><h3 id="material-selection-title">选择控件 <small>CHECKBOX / RADIO / SWITCH</small></h3><p>原生输入保留真实语义，选中态同时使用表面、边界和文字表达。</p></div></div>
      <div class="material-grid material-grid--form"><div class="material-demo"><p class="material-demo-label">复选框</p><div class="material-choice-list"><label class="material-choice"><input type="checkbox" checked><span>已选</span></label><label class="material-choice"><input type="checkbox"><span>未选</span></label><label class="material-choice"><input type="checkbox" data-material-indeterminate><span>部分已选</span></label><label class="material-choice"><input type="checkbox" checked disabled><span>禁用</span></label></div></div><div class="material-demo"><p class="material-demo-label">单选与开关</p><fieldset class="material-fieldset"><legend>排列方式</legend><label class="material-choice"><input type="radio" name="material-layout" value="list" checked><span>列表</span></label><label class="material-choice"><input type="radio" name="material-layout" value="grid"><span>网格</span></label></fieldset><div class="material-switch-list"><label class="material-switch-label"><span>紧凑间距</span><button type="button" class="material-switch" data-material-switch role="switch" aria-checked="true" aria-label="紧凑间距"><i></i></button></label><label class="material-switch-label"><span>不可用</span><button type="button" class="material-switch" disabled role="switch" aria-checked="false" aria-label="不可用"><i></i></button></label></div></div></div>
          <div class="material-code-area"><div class="material-code-block"><div class="material-code-head"><span>HTML 用法</span><button type="button" class="rg-button rg-button--quiet rg-button--sm" data-material-copy-code>复制</button></div><pre tabindex="0"><code>&lt;label class=&quot;material-choice&quot;&gt;
  &lt;input type=&quot;checkbox&quot; checked&gt;
  &lt;span&gt;已选&lt;/span&gt;
&lt;/label&gt;
&lt;button class=&quot;material-switch&quot; role=&quot;switch&quot; aria-checked=&quot;true&quot; aria-label=&quot;夜间模式&quot;&gt;&lt;i&gt;&lt;/i&gt;&lt;/button&gt;</code></pre></div></div>
</section>

    <section class="material-section" id="material-filters" aria-labelledby="material-filters-title">
      <div class="material-section-heading"><span class="material-section-number">06</span><div><h3 id="material-filters-title">分段筛选 <small>SEGMENTED CONTROL</small></h3><p>同一组内容使用互斥筛选，当前值通过文字读出，方便键盘和辅助技术确认。</p></div></div>
      <div class="material-demo material-filter-demo"><div class="material-demo-label">试着切换筛选</div><div class="rg-segmented" data-material-filter role="group" aria-label="项目筛选"><button type="button" class="rg-segment" data-value="all" aria-pressed="true">全部</button><button type="button" class="rg-segment" data-value="active" aria-pressed="false">进行中</button><button type="button" class="rg-segment" data-value="archived" aria-pressed="false">已归档</button></div><p class="material-readout" data-material-filter-output aria-live="polite">当前筛选：全部 / all</p></div>
          <div class="material-code-area"><div class="material-code-block"><div class="material-code-head"><span>HTML 用法</span><button type="button" class="rg-button rg-button--quiet rg-button--sm" data-material-copy-code>复制</button></div><pre tabindex="0"><code>&lt;div class=&quot;rg-segmented&quot; data-material-filter role=&quot;group&quot; aria-label=&quot;项目筛选&quot;&gt;
  &lt;button class=&quot;rg-segment&quot; data-value=&quot;all&quot; aria-pressed=&quot;true&quot;&gt;全部&lt;/button&gt;
&lt;/div&gt;
&lt;p class=&quot;material-readout&quot; aria-live=&quot;polite&quot;&gt;当前筛选：全部&lt;/p&gt;</code></pre></div></div>
</section>

    <section class="material-section" id="material-tabs" aria-labelledby="material-tabs-title">
      <div class="material-section-heading"><span class="material-section-number">07</span><div><h3 id="material-tabs-title">内容页签 <small>TABS</small></h3><p>页签与面板通过唯一标识关联，支持键盘顺序和禁用项。</p></div></div>
      <div class="material-demo"><div class="material-tabs" data-material-tabs><div class="material-tablist" role="tablist" aria-label="资料详情"><button type="button" role="tab" aria-selected="true" aria-controls="material-panel-info" id="material-tab-info" data-material-tab="material-panel-info">基本信息</button><button type="button" role="tab" aria-selected="false" aria-controls="material-panel-notes" id="material-tab-notes" data-material-tab="material-panel-notes">备注</button><button type="button" role="tab" aria-selected="false" aria-controls="material-panel-history" id="material-tab-history" data-material-tab="material-panel-history" disabled>历史版本</button></div><div class="material-tabpanel" role="tabpanel" id="material-panel-info" aria-labelledby="material-tab-info">这里放置当前资料的标题、说明与属性。</div><div class="material-tabpanel" role="tabpanel" id="material-panel-notes" aria-labelledby="material-tab-notes" hidden>补充设计决策、交互备注和交接信息。</div><div class="material-tabpanel" role="tabpanel" id="material-panel-history" aria-labelledby="material-tab-history" hidden>历史版本暂时不可用。</div></div></div>
          <div class="material-code-area"><div class="material-code-block"><div class="material-code-head"><span>HTML 用法</span><button type="button" class="rg-button rg-button--quiet rg-button--sm" data-material-copy-code>复制</button></div><pre tabindex="0"><code>&lt;div class=&quot;material-tabs&quot; data-material-tabs&gt;
  &lt;div class=&quot;material-tablist&quot; role=&quot;tablist&quot; aria-label=&quot;资料详情&quot;&gt;
    &lt;button role=&quot;tab&quot; aria-selected=&quot;true&quot; data-material-tab=&quot;panel-id&quot;&gt;基本信息&lt;/button&gt;
  &lt;/div&gt;
  &lt;div role=&quot;tabpanel&quot; id=&quot;panel-id&quot;&gt;内容面板&lt;/div&gt;
&lt;/div&gt;</code></pre></div></div>
</section>

    <section class="material-section" id="material-navigation" aria-labelledby="material-navigation-title">
      <div class="material-section-heading"><span class="material-section-number">08</span><div><h3 id="material-navigation-title">侧栏与底部导航 <small>NAVIGATION</small></h3><p>桌面使用侧栏轨道，窄屏场景可以切换到横向底部导航，当前项始终有文字和表面提示。</p></div></div>
      <div class="material-demo"><p class="material-demo-label">同一视觉身份，不同空间组织</p><div class="material-nav-demo"><nav class="material-nav-rail" data-material-nav aria-label="主导航"><button type="button" aria-current="page">${icon('grid')}<span>概览</span></button><button type="button">${icon('folder')}<span>项目</span></button><button type="button">${icon('data')}<span>资源</span></button><button type="button">${icon('gear')}<span>设置</span></button></nav><div class="material-nav-mobile"><p>移动端导航 · 触摸区域至少 44 px</p><nav class="material-nav-bottom" data-material-nav aria-label="移动端导航"><button type="button">${icon('grid')}<span>概览</span></button><button type="button" aria-current="page">${icon('folder')}<span>项目</span></button><button type="button">${icon('data')}<span>资源</span></button><button type="button">${icon('gear')}<span>设置</span></button></nav></div></div><p class="material-readout" data-material-nav-output aria-live="polite">当前导航：概览</p></div>
          <div class="material-code-area"><div class="material-code-block"><div class="material-code-head"><span>HTML 用法</span><button type="button" class="rg-button rg-button--quiet rg-button--sm" data-material-copy-code>复制</button></div><pre tabindex="0"><code>&lt;nav class=&quot;material-nav-rail&quot; data-material-nav aria-label=&quot;主导航&quot;&gt;
  &lt;button aria-current=&quot;page&quot;&gt;&lt;svg class=&quot;rg-icon&quot;&gt;…&lt;/svg&gt;&lt;span&gt;概览&lt;/span&gt;&lt;/button&gt;
&lt;/nav&gt;</code></pre></div></div>
</section>

    <section class="material-section" id="material-cards" aria-labelledby="material-cards-title">
      <div class="material-section-heading"><span class="material-section-number">09</span><div><h3 id="material-cards-title">内容卡片与条目 <small>CARD / LIST ITEM</small></h3><p>卡片、列表和选中态共享同一套层次，普通条目保持安静，可点击条目提供明确反馈。</p></div></div>
      <div class="material-grid material-grid--cards"><article class="material-card material-card--featured"><div class="material-card-top"><span class="material-tag">进行中</span><span class="material-card-index">01</span></div><strong>设计系统</strong><p>统一产品的视觉与交互规范。</p><div class="material-card-meter"><i></i></div></article><article class="material-card material-card--interactive material-card--selected" tabindex="0" data-material-card><div class="material-card-top"><span class="material-tag">健康度</span><span class="material-status material-status--success">优</span></div><strong>8.8 / 10</strong><p>选中态使用边界、表面和文字。</p></article><article class="material-card material-card--interactive" tabindex="0" data-material-card><div class="material-card-top"><span class="material-tag">速度</span><span class="material-status material-status--warning">关注</span></div><strong>24.6 秒</strong><p>点击卡片显示当前条目的反馈。</p></article></div><div class="material-list" aria-label="轻量列表"><button type="button" class="material-list-item" data-material-card><span class="material-list-icon">${icon('doc')}</span><span><strong>组件文档</strong><small>使用说明与交互状态</small></span>${icon('arrow')}</button></div>
          <div class="material-code-area"><div class="material-code-block"><div class="material-code-head"><span>HTML 用法</span><button type="button" class="rg-button rg-button--quiet rg-button--sm" data-material-copy-code>复制</button></div><pre tabindex="0"><code>&lt;article class=&quot;material-card material-card--interactive&quot; tabindex=&quot;0&quot; data-material-card&gt;
  &lt;div class=&quot;material-card-top&quot;&gt;&lt;span class=&quot;material-tag&quot;&gt;进行中&lt;/span&gt;&lt;/div&gt;
  &lt;strong&gt;设计系统&lt;/strong&gt;
  &lt;p&gt;统一视觉与交互规范。&lt;/p&gt;
&lt;/article&gt;</code></pre></div></div>
</section>

    <section class="material-section" id="material-status" aria-labelledby="material-status-title">
      <div class="material-section-heading"><span class="material-section-number">10</span><div><h3 id="material-status-title">状态与提示 <small>STATUS / TAG / ALERT</small></h3><p>状态使用文字说明，颜色和小标记作为辅助；错误和警告保留可读的说明。</p></div></div>
      <div class="material-demo"><p class="material-demo-label">状态与标签</p><div class="material-row"><span class="material-status material-status--success">进行中</span><span class="material-status material-status--warning">待开始</span><span class="material-status material-status--success">已完成</span><span class="material-status material-status--danger">保存失败</span><span class="material-tag material-tag--solid">文章</span><span class="material-tag material-tag--solid">只读</span></div><div class="material-alert-stack"><div class="material-alert material-alert--success">${icon('check')}<div><strong>更改已保存</strong><p>可以继续编辑，当前内容已保留。</p></div></div><div class="material-alert material-alert--warning">${icon('doc')}<div><strong>尚有未保存内容</strong><p>离开之前，请先保存当前修改。</p></div></div><div class="material-alert material-alert--danger" role="alert">${icon('close')}<div><strong>暂时无法保存</strong><p>请保留当前内容，稍后重试。</p></div></div></div></div>
          <div class="material-code-area"><div class="material-code-block"><div class="material-code-head"><span>HTML 用法</span><button type="button" class="rg-button rg-button--quiet rg-button--sm" data-material-copy-code>复制</button></div><pre tabindex="0"><code>&lt;span class=&quot;material-status material-status--success&quot;&gt;稳定&lt;/span&gt;
&lt;span class=&quot;material-alert material-alert--warning&quot;&gt;尚有未保存内容&lt;/span&gt;</code></pre></div></div>
</section>

    <section class="material-section" id="material-empty-loading" aria-labelledby="material-empty-loading-title">
      <div class="material-section-heading"><span class="material-section-number">11</span><div><h3 id="material-empty-loading-title">空状态与加载 <small>EMPTY / LOADING</small></h3><p>空状态说明原因并给出出口，加载状态表达当前进度，骨架只表示内容位置。</p></div></div>
      <div class="material-grid material-grid--form"><div class="material-demo material-empty"><div class="material-empty-icon">${icon('folder', 48)}</div><h4>还没有收藏</h4><p>收藏感兴趣的内容，方便下次继续阅读。</p><button type="button" class="rg-button rg-button--secondary" data-material-toast>试试通知</button></div><div class="material-demo"><p class="material-demo-label">加载与骨架</p><div class="material-loader" role="status"><span class="material-loader-dot"></span><span class="material-loader-dot"></span><span class="material-loader-dot"></span><span>正在加载资料</span></div><div class="material-skeleton-list" aria-hidden="true"><i></i><i></i><i></i></div><p class="material-token-note">骨架只表明内容位置，不模拟随机数据。</p></div></div>
          <div class="material-code-area"><div class="material-code-block"><div class="material-code-head"><span>HTML 用法</span><button type="button" class="rg-button rg-button--quiet rg-button--sm" data-material-copy-code>复制</button></div><pre tabindex="0"><code>&lt;div class=&quot;material-empty&quot;&gt;
  &lt;div class=&quot;material-empty-icon&quot;&gt;…&lt;/div&gt;
  &lt;h4&gt;还没有收藏&lt;/h4&gt;
  &lt;button class=&quot;rg-button rg-button--secondary&quot;&gt;去浏览&lt;/button&gt;
&lt;/div&gt;
&lt;div class=&quot;material-skeleton-list&quot; aria-hidden=&quot;true&quot;&gt;&lt;i&gt;&lt;/i&gt;&lt;i&gt;&lt;/i&gt;&lt;i&gt;&lt;/i&gt;&lt;/div&gt;</code></pre></div></div>
</section>

    <section class="material-section" id="material-feedback" aria-labelledby="material-feedback-title">
      <div class="material-section-heading"><span class="material-section-number">12</span><div><h3 id="material-feedback-title">弹窗与轻提示 <small>DIALOG / TOAST</small></h3><p>弹窗管理焦点，Esc 可以关闭；通知提供成功和错误两种语义，并保留退出路径。</p></div></div>
      <div class="material-demo"><p class="material-demo-label">实际交互</p><div class="material-row"><button type="button" class="rg-button material-button--primary" data-material-entry-open>打开表单弹窗</button><button type="button" class="rg-button rg-button--secondary" data-material-toast>显示成功提示</button><button type="button" class="rg-button rg-button--secondary" data-material-toast-error>显示错误提示</button></div><p class="material-token-note">成功提示显示 4.5 秒，聚焦或悬停时暂停；错误提示保留到手动关闭。</p></div>
          <div class="material-code-area"><div class="material-code-block"><div class="material-code-head"><span>HTML 用法</span><button type="button" class="rg-button rg-button--quiet rg-button--sm" data-material-copy-code>复制</button></div><pre tabindex="0"><code>&lt;button data-material-entry-open&gt;打开表单弹窗&lt;/button&gt;
&lt;button data-material-toast&gt;成功提示&lt;/button&gt;
&lt;button data-material-toast-error&gt;错误提示&lt;/button&gt;</code></pre></div></div>
</section>

    <section class="material-section" id="material-composition" aria-labelledby="material-composition-title">
      <div class="material-section-heading"><span class="material-section-number">13</span><div><h3 id="material-composition-title">组合成页面 <small>COMPOSITION</small></h3><p>把卡片、列表、紧凑间距、筛选和错误状态组合成可以直接复用的页面片段。</p></div></div>
      <div class="material-grid material-grid--cards">
        <article class="material-card material-card--featured"><div class="material-card-top"><span class="material-tag">进行中</span><span class="material-card-index">01</span></div><strong>项目数量</strong><p>有 4 项将在今天到期。</p><div class="material-card-meter"><i></i></div></article>
        <article class="material-card"><div class="material-card-top"><span class="material-tag">健康度</span><span class="material-status material-status--success">优</span></div><strong>8.8 / 10</strong><p>选中态同时使用边界、表面和文字。</p></article>
        <article class="material-card material-card--interactive" tabindex="0" data-material-reveal><div class="material-card-top"><span class="material-tag">速度</span><span class="material-status material-status--warning">关注</span></div><strong>24.6 秒</strong><p>点击卡片触发一次短促的入场反馈。</p></article>
      </div>
      <div class="material-list" aria-label="最近活动"><article><span class="material-list-icon">${icon('doc')}</span><div><strong>设计规范评审</strong><small>今天 15:30 · 软质材料室</small></div><span class="material-status material-status--success">已确认</span></article><article><span class="material-list-icon">${icon('plus')}</span><div><strong>新增控件原型</strong><small>明天 09:00 · 可交互</small></div><span class="material-status material-status--warning">待同步</span></article></div><div class="material-demo material-composition-demo"><div class="material-composition-toolbar"><div class="rg-segmented" data-material-view role="group" aria-label="示例预览宽度"><button type="button" class="rg-segment" data-value="desktop" aria-pressed="true">桌面</button><button type="button" class="rg-segment" data-value="mobile" aria-pressed="false">窄屏 / 390</button></div><span class="material-readout">响应式组合示例</span></div><div class="material-example-shell" data-material-example><div class="material-example-header"><span>Workspace</span><span class="material-status material-status--success">已同步</span></div><div class="material-example-body"><div><strong>本周项目</strong><p>4 个项目正在推进。</p></div><button type="button" class="rg-button material-button--primary" data-material-dialog-open>查看材质说明</button></div><div class="material-example-list"><span>${icon('folder')}设计系统 <small>进行中</small></span><span>${icon('web')}产品网站 <small>待开始</small></span></div></div></div>
          <div class="material-code-area"><div class="material-code-block"><div class="material-code-head"><span>HTML 用法</span><button type="button" class="rg-button rg-button--quiet rg-button--sm" data-material-copy-code>复制</button></div><pre tabindex="0"><code>&lt;div class=&quot;material-example-shell&quot; data-material-example&gt;
  &lt;div class=&quot;material-example-header&quot;&gt;&lt;span&gt;Workspace&lt;/span&gt;&lt;span class=&quot;material-status&quot;&gt;已同步&lt;/span&gt;&lt;/div&gt;
&lt;/div&gt;</code></pre></div></div>
</section>

    <section class="material-section" id="material-usage" aria-labelledby="material-usage-title">
      <div class="material-section-heading"><span class="material-section-number">14</span><div><h3 id="material-usage-title">快速开始与 API <small>GETTING STARTED</small></h3><p>组件结构和材质变量分离，新增页面时只需复用语义结构并接入主题变量。</p></div></div>
      <div class="material-usage-grid"><article class="material-usage-item"><span>01</span><h4>引入后直接组合</h4><p>引入 <code>material-ui.css</code> 与 <code>material-ui.js</code>，给区域加上 <code>material-library</code>。</p></article><article class="material-usage-item"><span>02</span><h4>动态内容显式初始化</h4><p>动态插入组件后调用 <code>MaterialUI.mount(root)</code>，可重复调用。</p></article><article class="material-usage-item"><span>03</span><h4>按内容调整密度</h4><p>用 <code>data-material-density="compact"</code> 收紧局部间距，同时保留触控目标。</p></article><article class="material-usage-item"><span>04</span><h4>主题只负责材质</h4><p>Soft UI、Frosted Glass 和 Liquid Glass 只替换表面、边界、阴影与颜色。</p></article></div><div class="material-api-table" role="table" aria-label="材质组件接口"><div role="row"><b>接口</b><b>用途</b></div><div role="row"><code>MaterialUI.mount(root)</code><span>初始化共享组件库</span></div><div role="row"><code>data-material-motion</code><span>切换跟随系统或减少动态</span></div><div role="row"><code>data-material-toast</code><span>触发材质通知反馈</span></div><div role="row"><code>data-material-dialog-open</code><span>打开材质说明弹窗</span></div></div>
          <div class="material-code-area"><div class="material-code-block"><div class="material-code-head"><span>HTML 用法</span><button type="button" class="rg-button rg-button--quiet rg-button--sm" data-material-copy-code>复制</button></div><pre tabindex="0"><code>&lt;link rel=&quot;stylesheet&quot; href=&quot;../material-ui.css&quot;&gt;
&lt;section class=&quot;material-library&quot; data-material-library&gt;&lt;/section&gt;
&lt;script src=&quot;../material-ui.js&quot;&gt;&lt;/script&gt;
&lt;script&gt;MaterialUI.mount(document.querySelector(&quot;.material-library&quot;));&lt;/script&gt;</code></pre></div></div>
</section>

    <section class="material-section" id="material-motion" aria-labelledby="material-motion-title">
      <div class="material-section-heading"><span class="material-section-number">15</span><div><h3 id="material-motion-title">动效实验室 <small>MOTION LAB</small></h3><p>按下、选择、入场、反馈和完成状态都使用柔和的材质过渡，并支持一键减少动态。</p></div></div>
      <div class="material-motion-grid">
        <article class="material-motion-card"><div class="material-motion-label"><span>01 / REVEAL</span><code>160–200 ms</code></div><div class="material-motion-stage" data-material-reveal-stage><div class="material-reveal-sample">${icon('doc')}<span>内容已经就位<small>12 → 4 → 0 px</small></span></div></div><button type="button" class="rg-button rg-button--secondary" data-material-reveal>重播入场</button></article>
        <article class="material-motion-card"><div class="material-motion-label"><span>02 / SOFT BLOOM</span><code>560 ms</code></div><div class="material-motion-stage material-motion-stage--bloom"><button type="button" class="rg-button material-button--primary" data-material-bloom>${icon('check')}完成反馈</button></div><p class="material-motion-note">用柔和光晕、亮度和表面回弹表达完成状态。</p></article>
        <article class="material-motion-card"><div class="material-motion-label"><span>03 / DIALOG</span><code>320 ms</code></div><div class="material-motion-stage"><button type="button" class="rg-button rg-button--secondary" data-material-dialog-open>打开材质说明</button></div><p class="material-motion-note">弹窗、通知和错误反馈都保留顺滑的退出路径。</p></article>
      </div>
          <div class="material-code-area"><div class="material-code-block"><div class="material-code-head"><span>HTML 用法</span><button type="button" class="rg-button rg-button--quiet rg-button--sm" data-material-copy-code>复制</button></div><pre tabindex="0"><code>&lt;button class=&quot;rg-button material-button--primary&quot; data-material-bloom&gt;完成反馈&lt;/button&gt;
&lt;button class=&quot;rg-button rg-button--secondary&quot; data-material-reveal&gt;重播入场&lt;/button&gt;
&lt;button class=&quot;rg-button rg-button--secondary&quot; data-material-dialog-open&gt;打开弹窗&lt;/button&gt;</code></pre></div></div>
</section>

    <dialog class="rg-dialog material-dialog" id="material-dialog" aria-labelledby="material-dialog-title"><header class="rg-dialog__header"><h3 class="rg-dialog__title" id="material-dialog-title">材质说明</h3><button type="button" class="rg-button rg-button--quiet rg-button--icon" data-material-dialog-close aria-label="关闭">${icon('close')}</button></header><div class="rg-dialog__body"><p>这套页面共用组件语义、焦点顺序和动效节奏，主题只负责定义表面、边界、阴影与颜色。</p><div class="material-dialog-rule"><span>输入与按钮保持 44px 以上触控区域</span><span>减少动态效果会停止位移和光晕</span><span>反馈通过状态和文字同时表达</span></div><div class="rg-dialog__footer"><button type="button" class="rg-button rg-button--secondary" data-material-dialog-close>回到组件</button></div></div></dialog>
    <dialog class="rg-dialog material-dialog" id="material-entry-dialog" aria-labelledby="material-entry-title"><header class="rg-dialog__header"><h3 class="rg-dialog__title" id="material-entry-title">新建条目</h3><button type="button" class="rg-button rg-button--quiet rg-button--icon" data-material-entry-close aria-label="关闭弹窗">${icon('close')}</button></header><form class="rg-dialog__body" data-material-entry-form novalidate><label class="rg-field"><span class="rg-label">条目名称</span><input class="rg-input" name="name" required maxlength="30" autofocus placeholder="输入名称" aria-describedby="material-entry-message"><span class="rg-help" id="material-entry-message" aria-live="polite">必填，最多 30 个字符。</span></label><p class="material-token-note">这里演示表单弹窗，不会创建真实数据。</p><div class="rg-dialog__footer"><button type="button" class="rg-button rg-button--secondary" data-material-entry-close>取消</button><button class="rg-button material-button--primary" type="submit">完成演示</button></div></form></dialog>
  `;

  let motionPreference = 'auto';
  try { motionPreference = global.localStorage.getItem('material-ui.motion') === 'reduced' ? 'reduced' : 'auto'; } catch {}
  const systemMotion = global.matchMedia?.('(prefers-reduced-motion: reduce)');
  function prefersReducedMotion() { return motionPreference === 'reduced' || Boolean(systemMotion?.matches); }
  function setMotion(preference) {
    motionPreference = preference === 'reduced' ? 'reduced' : 'auto';
    try { global.localStorage.setItem('material-ui.motion', motionPreference); } catch {}
    document.documentElement.dataset.materialMotion = prefersReducedMotion() ? 'reduced' : 'full';
    return { preference: motionPreference, reduced: prefersReducedMotion() };
  }
  function materialAnimate(element, keyframes, options) {
    if (!element || prefersReducedMotion() || typeof element.animate !== 'function') return Promise.resolve();
    const animation = element.animate(keyframes, { fill: 'both', ...options });
    return animation.finished.catch(() => undefined);
  }
  function materialToast(root, message, variant = 'success') {
    let region = root.querySelector('.material-toast-region');
    if (!region) { region = document.createElement('div'); region.className = 'material-toast-region'; region.setAttribute('role', 'status'); region.setAttribute('aria-live', 'polite'); root.append(region); }
    // Repeated clicks should not fill the viewport with identical messages.
    const existing=[...region.children].find(item=>item.dataset.message===message && item.dataset.variant===variant && !item.dataset.closing);
    if(existing) return existing;
    const origin=document.activeElement;
    const toast=document.createElement('div');toast.className=`material-toast material-toast--${variant}`;toast.dataset.message=message;toast.dataset.variant=variant;
    const text=document.createElement('span');text.textContent=message;
    const close=document.createElement('button');close.type='button';close.className='material-toast-dismiss';close.setAttribute('aria-label','关闭提示');close.innerHTML=icon('close');
    toast.append(text,close);region.append(toast);
    let timer,remaining=4500,started=0;
    const stop=()=>{if(timer){clearTimeout(timer);remaining=Math.max(0,remaining-(performance.now()-started));timer=null;}};
    const dismiss=async()=>{
      if(toast.dataset.closing)return;
      toast.dataset.closing='true';stop();const restore=toast.contains(document.activeElement);
      toast.classList.remove('is-visible');
      await materialAnimate(toast,[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-5px)'}],{duration:180,easing:'ease-in'});
      toast.remove();if(!region.childElementCount)region.remove();
      if(restore && origin?.isConnected)origin.focus({preventScroll:true});
    };
    const resume=()=>{if(variant==='error'||toast.dataset.closing||toast.matches(':hover')||toast.contains(document.activeElement)||timer)return;started=performance.now();timer=setTimeout(dismiss,remaining);};
    close.addEventListener('click',dismiss);
    toast.addEventListener('mouseenter',stop);toast.addEventListener('mouseleave',resume);
    toast.addEventListener('focusin',stop);toast.addEventListener('focusout',()=>queueMicrotask(resume));
    requestAnimationFrame(()=>toast.classList.add('is-visible'));resume();return toast;
  }
  function materialFeedback(button) {
    if (!button || prefersReducedMotion()) return;
    materialAnimate(button, [{ transform: 'translateY(0)' }, { transform: 'translateY(1px)', offset: .35 }, { transform: 'translateY(0)' }], { duration: 170, easing: 'ease-out' });
  }
  function materialBloom(button) {
    if (!button) return;
    const stage = button.closest('.material-motion-stage') || button.parentElement;
    const bloom = document.createElement('span'); bloom.className = 'material-bloom'; stage.append(bloom);
    button.classList.remove('is-material-complete'); void button.offsetWidth; button.classList.add('is-material-complete');
    if (prefersReducedMotion()) { bloom.remove(); return; }
    materialAnimate(bloom, [{ opacity: 0, transform: 'translate(-50%,-50%) scale(.55)' }, { opacity: .62, transform: 'translate(-50%,-50%) scale(1)', offset: .42 }, { opacity: 0, transform: 'translate(-50%,-50%) scale(1.3)' }], { duration: 560, easing: 'cubic-bezier(.22,.8,.24,1)' }).then(() => bloom.remove());
  }
  const dialogOpeners=new WeakMap();
  function openMaterialDialog(dialog) { if (!dialog || dialog.open) return; dialogOpeners.set(dialog,document.activeElement); dialog.showModal(); requestAnimationFrame(() => dialog.classList.add('is-material-open')); }
  async function closeMaterialDialog(dialog) { if (!dialog?.open) return; dialog.classList.remove('is-material-open'); await materialAnimate(dialog, [{ opacity: 1, transform: 'translateY(0) scale(1)' }, { opacity: 0, transform: 'translateY(8px) scale(.985)' }], { duration: 220, easing: 'ease-in' }); dialog.close(); dialogOpeners.get(dialog)?.focus(); }

  function moveMaterialFocus(items, current, delta, wrap = true) {
    const enabled = items.filter(item => !item.disabled && !item.hidden);
    if (!enabled.length) return;
    const index = enabled.indexOf(current);
    let next = index + delta;
    if (wrap) next = (next + enabled.length) % enabled.length;
    else next = Math.min(enabled.length - 1, Math.max(0, next));
    const target = enabled[next]; target?.focus(); return target;
  }

  function mount(root) {
    if (!root || root.dataset.materialMounted === 'true') return root;
    root.innerHTML = template;
    global.MaterialDocs?.prepare(root, icon);
    root.dataset.materialMounted = 'true';
    root.insertAdjacentHTML('beforeend', '<dialog class="rg-dialog material-dialog" id="material-copy-dialog" aria-labelledby="material-copy-title"><header class="rg-dialog__header"><h2 class="rg-dialog__title" id="material-copy-title">复制用法</h2><button type="button" class="rg-button rg-button--quiet" data-material-copy-close aria-label="关闭复制窗口">关闭</button></header><div class="rg-dialog__body"><p>浏览器未允许自动复制。下方代码已选中，可按 Ctrl/Cmd + C 复制。</p><textarea class="rg-textarea" readonly aria-label="待复制的代码" spellcheck="false"></textarea></div></dialog>');
    const copyDialog=root.querySelector('#material-copy-dialog');
    async function copyMaterialText(text,message='代码已复制') { try { await navigator.clipboard.writeText(text);materialToast(root,message); } catch { copyDialog.querySelector('textarea').value=text;openMaterialDialog(copyDialog);copyDialog.querySelector('textarea').focus();copyDialog.querySelector('textarea').select(); } }
    root.querySelector('[data-material-copy-close]').addEventListener('click',()=>closeMaterialDialog(copyDialog));
    root.querySelectorAll('[data-material-toast]').forEach(button => button.addEventListener('click', () => { materialToast(root, '材质反馈已触发'); materialFeedback(button); }));
    root.querySelectorAll('[data-material-toast-error]').forEach(button => button.addEventListener('click', () => { materialToast(root, '暂时无法保存，请稍后重试。', 'error'); materialFeedback(button); }));
    root.querySelectorAll('[data-material-copy]').forEach(button => button.addEventListener('click', async () => { const usage = icon(button.dataset.materialCopy); await copyMaterialText(usage, `${button.dataset.materialCopy} 图标用法已复制`); materialFeedback(button); }));
    root.querySelectorAll('[data-material-loading]').forEach(button => button.addEventListener('click', () => { if (button.disabled) return; button.disabled = true; button.setAttribute('aria-busy','true'); button.classList.add('is-material-loading'); button.textContent = '处理中…'; window.setTimeout(() => { button.disabled = false; button.removeAttribute('aria-busy'); button.classList.remove('is-material-loading'); button.textContent = '试试加载'; materialToast(root, '加载完成'); }, 900); }));
    root.querySelectorAll('[data-material-feedback]').forEach(button => button.addEventListener('click', () => materialFeedback(button)));
    root.querySelectorAll('[data-material-switch]').forEach(button => button.addEventListener('click', event => { const next = event.currentTarget.getAttribute('aria-checked') !== 'true'; event.currentTarget.setAttribute('aria-checked', String(next)); materialFeedback(event.currentTarget); }));
    root.querySelectorAll('[data-material-indeterminate]').forEach(input => { input.indeterminate = true; });
    root.querySelectorAll('[data-rg-segmented],[data-material-filter]').forEach(group => group.querySelectorAll('.rg-segment').forEach(button => button.addEventListener('click', () => { group.querySelectorAll('.rg-segment').forEach(item => item.setAttribute('aria-pressed', String(item === button))); materialFeedback(button); })));
    root.querySelectorAll('[data-material-filter]').forEach(group => group.querySelectorAll('.rg-segment').forEach(button => button.addEventListener('click', () => { const output = root.querySelector('[data-material-filter-output]'); if (output) output.textContent = `当前筛选：${button.textContent.trim()} / ${button.dataset.value}`; })));
    root.querySelectorAll('.rg-segmented').forEach(group => group.addEventListener('keydown', event => {
      const button = event.target.closest('.rg-segment');
      if (!button) return;
      const buttons = [...group.querySelectorAll('.rg-segment')];
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); moveMaterialFocus(buttons, button, -1)?.click(); }
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); moveMaterialFocus(buttons, button, 1)?.click(); }
      if (event.key === 'Home') { event.preventDefault(); moveMaterialFocus(buttons, button, -buttons.length, false)?.click(); }
      if (event.key === 'End') { event.preventDefault(); moveMaterialFocus(buttons, button, buttons.length, false)?.click(); }
    }));
    root.querySelectorAll('[data-material-tabs]').forEach(tabs => tabs.querySelectorAll('[data-material-tab]').forEach(tab => tab.addEventListener('click', () => { if (tab.disabled) return; tabs.querySelectorAll('[data-material-tab]').forEach(item => {item.setAttribute('aria-selected', String(item === tab));item.tabIndex=item===tab?0:-1;}); tabs.querySelectorAll('[role="tabpanel"]').forEach(panel => { panel.hidden = panel.id !== tab.dataset.materialTab; }); materialFeedback(tab); })));
    root.querySelectorAll('[data-material-tab]').forEach(tab=>{tab.tabIndex=tab.getAttribute('aria-selected')==='true'?0:-1;});
    root.querySelectorAll('[data-material-tabs]').forEach(tabs => tabs.addEventListener('keydown', event => {
      const tab = event.target.closest('[data-material-tab]');
      if (!tab) return;
      const tabsAll = [...tabs.querySelectorAll('[data-material-tab]')];
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); moveMaterialFocus(tabsAll, tab, -1)?.click(); }
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); moveMaterialFocus(tabsAll, tab, 1)?.click(); }
      if (event.key === 'Home') { event.preventDefault(); moveMaterialFocus(tabsAll, tab, -tabsAll.length, false)?.click(); }
      if (event.key === 'End') { event.preventDefault(); moveMaterialFocus(tabsAll, tab, tabsAll.length, false)?.click(); }
    }));
    root.querySelectorAll('[data-material-nav]').forEach(nav => nav.addEventListener('click', event => { const button = event.target.closest('button'); if (!button) return; nav.querySelectorAll('button').forEach(item => item.removeAttribute('aria-current')); button.setAttribute('aria-current', 'page'); const output = root.querySelector('[data-material-nav-output]'); if (output) output.textContent = `当前导航：${button.textContent.trim()}`; materialFeedback(button); }));
    root.querySelectorAll('[data-material-card]').forEach(card => {
      card.setAttribute('role','button');card.setAttribute('aria-pressed',String(card.classList.contains('material-card--selected')));
      const select=()=>{root.querySelectorAll('[data-material-card]').forEach(item=>{item.classList.toggle('material-card--selected',item===card);item.setAttribute('aria-pressed',String(item===card));});materialFeedback(card);};
      card.addEventListener('click',select);
      card.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();select();}});
    });
    root.querySelectorAll('[data-material-reveal]:not(button)').forEach(trigger=>{
      trigger.setAttribute('role','button');trigger.tabIndex=0;
      trigger.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();trigger.click();}});
    });
    const validationForm=root.querySelector('[data-material-validation]');
    const validateInline=()=>{
      const input=validationForm.elements.entry,valid=Boolean(input.value.trim());
      input.setAttribute('aria-invalid',String(!valid));
      const message=validationForm.querySelector('[aria-live]');
      message.textContent=valid?'检查通过，可以继续。':'请输入名称，不能只填空格。';
      message.classList.toggle('material-help--error',!valid);
      return valid;
    };
    validationForm.addEventListener('submit',event=>{event.preventDefault();if(!validateInline())validationForm.elements.entry.focus();else materialToast(root,'条目名称检查通过');});
    validationForm.elements.entry.addEventListener('input',()=>{if(validationForm.elements.entry.hasAttribute('aria-invalid'))validateInline();});
    root.querySelectorAll('[data-material-view] .rg-segment').forEach(button => button.addEventListener('click', () => { const group = button.closest('[data-material-view]'); group.querySelectorAll('.rg-segment').forEach(item => item.setAttribute('aria-pressed', String(item === button))); root.querySelector('[data-material-example]')?.classList.toggle('is-material-mobile', button.dataset.value === 'mobile'); materialFeedback(button); }));
    root.querySelectorAll('[data-material-reveal]').forEach(trigger => trigger.addEventListener('click', () => { const target = root.querySelector('[data-material-reveal-stage]'); if (target) { target.classList.remove('is-material-revealing'); void target.offsetWidth; target.classList.add('is-material-revealing'); materialAnimate(target, [{ opacity: .62, transform: 'translateY(8px) scale(.985)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }], { duration: 320, easing: 'cubic-bezier(.22,.8,.24,1)' }); } }));
    root.querySelector('[data-material-bloom]')?.addEventListener('click', event => { materialBloom(event.currentTarget); materialFeedback(event.currentTarget); });
    root.querySelectorAll('[data-material-dialog-open]').forEach(button => button.addEventListener('click', () => openMaterialDialog(root.querySelector('#material-dialog'))));
    root.querySelectorAll('[data-material-dialog-close]').forEach(button => button.addEventListener('click', () => closeMaterialDialog(button.closest('dialog'))));
    root.querySelector('#material-dialog')?.addEventListener('click', event => { const dialog = event.currentTarget; if (event.target === dialog) closeMaterialDialog(dialog); });
    root.querySelector('[data-material-entry-open]')?.addEventListener('click', () => openMaterialDialog(root.querySelector('#material-entry-dialog')));
    root.querySelectorAll('[data-material-entry-close]').forEach(button => button.addEventListener('click', () => closeMaterialDialog(button.closest('dialog'))));
    root.querySelector('#material-entry-dialog')?.addEventListener('click', event => { const dialog = event.currentTarget; if (event.target === dialog) closeMaterialDialog(dialog); });
    const entryForm=root.querySelector('[data-material-entry-form]');
    let completingEntry=false;
    const validateEntry=()=>{const input=entryForm.elements.name;input.setCustomValidity(input.value.trim()?'':'请输入名称，不能只填空格。');const valid=input.validity.valid;input.setAttribute('aria-invalid',String(!valid));entryForm.querySelector('#material-entry-message').textContent=valid?'必填，最多 30 个字符。':input.validationMessage;return valid;};
    entryForm.addEventListener('invalid',event=>event.preventDefault(),true);
    entryForm.elements.name.addEventListener('input',()=>{if(entryForm.elements.name.hasAttribute('aria-invalid'))validateEntry();});
    entryForm.addEventListener('submit',async event=>{event.preventDefault();if(completingEntry)return;if(!validateEntry()){entryForm.elements.name.focus();return;}completingEntry=true;try{await closeMaterialDialog(entryForm.closest('dialog'));materialToast(root,'弹窗演示完成，没有创建真实数据。');entryForm.reset();entryForm.elements.name.removeAttribute('aria-invalid');entryForm.querySelector('#material-entry-message').textContent='必填，最多 30 个字符。';}finally{completingEntry=false;}});
    root.querySelector('[data-material-motion]')?.addEventListener('change', event => setMotion(event.target.value));
    root.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('cancel',event=>{event.preventDefault();closeMaterialDialog(dialog);}));
    const motion = setMotion(motionPreference); if (root.querySelector('[data-material-motion]')) root.querySelector('[data-material-motion]').value = motion.preference;
    global.CatalogNavigation?.install({
      links:root.querySelectorAll('[data-material-catalog-link]'),
      sections:root.querySelectorAll('.doc-section'),
      header:root.querySelector('.docs-header'),sidebar:root.querySelector('.docs-sidebar')
    });
    const searchInput = root.querySelector('[data-material-search]');
    const searchReset = root.querySelector('[data-material-search-reset]');
    const searchStatus = root.querySelector('[data-material-search-status]');
    const searchEmpty = root.querySelector('[data-material-search-empty]');
    const catalogLinks = [...root.querySelectorAll('[data-material-catalog-link]')];
    const catalogSections = catalogLinks.map(link => root.querySelector(link.getAttribute('href'))).filter(Boolean);
    const applyMaterialSearch = () => {
      const term = searchInput.value.trim().toLowerCase();
      let count = 0;
      catalogLinks.forEach(link => { const match = !term || `${link.textContent} ${link.dataset.search}`.toLowerCase().includes(term); link.hidden = !match; if (match) count++; });
      catalogSections.forEach(section => { const link = catalogLinks.find(item => item.getAttribute('href') === `#${section.id}`); section.hidden = term && (!link || link.hidden); });
      root.querySelectorAll('.material-catalog-group').forEach(group => { let next=group.nextElementSibling, visible=false; while(next && !next.classList.contains('material-catalog-group')){if(next.hasAttribute('data-material-catalog-link') && !next.hidden)visible=true;next=next.nextElementSibling;} group.hidden=global.MaterialDocs ? !visible : ![...group.querySelectorAll('[data-material-catalog-link]')].some(link => !link.hidden); });
      searchStatus.textContent = term ? `找到 ${count} 个章节` : `${catalogSections.length} 个章节全部显示`;
      searchReset.hidden = !term;
      searchEmpty.hidden = count !== 0;
    };
    searchInput.addEventListener('input', applyMaterialSearch);
    searchReset.addEventListener('click', () => { searchInput.value = ''; applyMaterialSearch(); searchInput.focus(); });
    root.querySelectorAll('[data-material-copy-code]').forEach(button => button.addEventListener('click', async () => {
      const code = button.closest('.material-code-block')?.querySelector('code')?.textContent || '';
      await copyMaterialText(code);
    }));
    applyMaterialSearch();
    const revealHash=()=>{const target=document.getElementById(location.hash.slice(1));if(target && root.contains(target)){searchInput.value='';applyMaterialSearch();requestAnimationFrame(()=>target.scrollIntoView());}};
    window.addEventListener('hashchange',revealHash);revealHash();
    return root;
  }

  global.MaterialUI = Object.freeze({ version: '0.4.0', mount });
  function boot() { document.querySelectorAll('[data-material-library]').forEach(mount); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true }); else boot();
})(window);
