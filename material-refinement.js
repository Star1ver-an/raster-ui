/* Interactive material specimen; no external images or runtime dependencies. */
(function (global) {
  'use strict';
  function install(root, icon, soft) {
    const section = root.querySelector('#material-style');
    const specimen = document.createElement('div');
    specimen.className = 'material-specimen';
    specimen.innerHTML = `
      <div class="specimen-scene" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="specimen-surface">
        <header class="specimen-heading"><div><span class="specimen-eyebrow">${soft ? 'TACTILE SURFACE / 01' : 'LIGHT THROUGH GLASS / 02'}</span><h3>${soft ? '触感，恰到好处。' : '留住光，也留住层次。'}</h3></div><span class="specimen-mark" aria-hidden="true">${icon(soft ? 'gear' : 'grid')}</span></header>
        <div class="specimen-controls">
          <div class="specimen-dial-wrap"><div class="specimen-dial" aria-hidden="true"><div class="specimen-dial-face"><span class="specimen-dial-pointer"></span><span class="specimen-dial-value">64<small>%</small></span></div></div><span class="specimen-dial-caption">反馈强度</span></div>
          <div class="specimen-settings"><div class="specimen-modes" role="group" aria-label="反馈强度预设"><button type="button" data-specimen-level="32" aria-pressed="false">轻柔</button><button type="button" data-specimen-level="64" aria-pressed="true">适中</button><button type="button" data-specimen-level="88" aria-pressed="false">鲜明</button></div><label class="specimen-range-label"><span>精细调整 <output data-specimen-output>64%</output></span><input type="range" min="0" max="100" value="64" aria-label="反馈强度" data-specimen-range></label><div class="specimen-power-row"><div><span class="specimen-eyebrow">SURFACE FEEDBACK</span><span class="specimen-power-status" role="status"><i></i><span>等待操作</span></span></div><button type="button" class="specimen-power" aria-label="开启表面反馈" aria-pressed="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 3v8M7 5.5a8 8 0 1 0 10 0"/></svg></button></div></div>
        </div>
        <footer class="specimen-footer"><span><i></i>${soft ? '同色表面 · 连续光影' : '透光表面 · 柔化背景'}</span><span>INTERACTIVE SPECIMEN</span></footer>
      </div>
      <div class="specimen-material-notes"><span><b>01</b>${soft ? '凸起的边缘' : '细薄的高光'}<small>${soft ? 'Raised' : 'Highlight'}</small></span><span><b>02</b>${soft ? '内凹的触感' : '通透的表面'}<small>${soft ? 'Recessed' : 'Translucent'}</small></span><span><b>03</b>${soft ? '克制的强调' : '柔化的背景'}<small>${soft ? 'Accent' : 'Backdrop'}</small></span></div>`;
    const old = section.querySelector('.material-surface-study,.su-reference-stage');
    if (old) old.replaceWith(specimen);
    else section.insertBefore(specimen, section.querySelector('.example-code'));
    const range = specimen.querySelector('[data-specimen-range]');
    function level(value) {
      const number = Math.max(0, Math.min(100, Number(value)));
      range.value = number;
      specimen.style.setProperty('--specimen-angle', (-130 + number * 2.6) + 'deg');
      specimen.style.setProperty('--specimen-fill', number + '%');
      specimen.querySelector('[data-specimen-output]').value = number + '%';
      specimen.querySelector('.specimen-dial-value').innerHTML = number + '<small>%</small>';
      specimen.querySelectorAll('[data-specimen-level]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.specimenLevel) === number)));
    }
    range.addEventListener('input', () => level(range.value));
    specimen.querySelectorAll('[data-specimen-level]').forEach(b => b.addEventListener('click', () => level(b.dataset.specimenLevel)));
    specimen.querySelector('.specimen-power').addEventListener('click', event => {
      const button = event.currentTarget;
      const enabled = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(enabled));
      button.setAttribute('aria-label', enabled ? '关闭表面反馈' : '开启表面反馈');
      specimen.classList.toggle('is-enabled', enabled);
      specimen.querySelector('.specimen-power-status span').textContent = enabled ? '反馈已开启' : '等待操作';
    });
    level(64);
    section.querySelector('.section-header p').textContent = soft
      ? '让控件与背景来自同一块材质。左上受光、右下投影，凸起、按下与内凹各自形成清楚的触感。'
      : '让颜色透过表面，让背景在玻璃后柔化。高光勾勒边缘，透明度与模糊共同建立层次。';
    section.querySelector('code').textContent = soft
      ? '.raised {\n  background: #e4e8ec;\n  border-radius: 24px;\n  box-shadow: 8px 8px 18px #bec5cd, -8px -8px 18px #ffffff;\n}\n.recessed {\n  background: #e4e8ec;\n  box-shadow: inset 4px 4px 9px #bec5cd, inset -4px -4px 9px #ffffff;\n}\n/* 整个组件使用同一光源；文字、图标与焦点独立保持可读。 */'
      : '.glass {\n  background: linear-gradient(135deg, #ffffff88, #ffffff24);\n  backdrop-filter: blur(24px) saturate(135%);\n  border: 1px solid #ffffff88;\n  border-radius: 28px;\n  box-shadow: 0 18px 38px #29465324, inset 0 1px 0 #ffffffbb;\n}\n/* 放在有色背景前面；正文区域使用更稳定的表面透明度。 */';
    section.querySelector('.material-code-head>span').textContent='CSS';
    const foundation = root.querySelector('#material-foundations code');
    if (soft) foundation.textContent = ':root {\n  --material-canvas: #e4e8ec;\n  --material-surface: #e4e8ec;\n  --material-ink: #303c48;\n  --material-muted: #586574;\n  --material-accent: #a34f30;\n}\n/* 背景与控件同色；三档阴影区分底板、控件与内凹槽。 */';
    else foundation.textContent = ':root {\n  --material-surface: rgb(255 255 255 / 36%);\n  --material-ink: #273e39;\n  --material-muted: #4b635d;\n  --material-accent: #326f60;\n}\n/* 示例为柔雾磨砂；深色主题同步调整透明度和前景文字。 */';
    const usage=root.querySelector('#material-usage');
    usage.querySelector('.material-usage-item p').textContent='从当前库的 index.html 复制入口依赖，按顺序加载基础样式、文档格式与最终材质层。';
    usage.querySelector('.example-code code').textContent = `<!-- 在 ${soft ? 'soft-ui' : 'surface-ui'} 目录内使用；路径相对当前 HTML。 -->\n${soft ? '<link rel="stylesheet" href="soft-ui.css">' : '<link rel="stylesheet" href="base.css">\n<link rel="stylesheet" href="themes/glass.css">'}\n<link rel="stylesheet" href="../raster-ui/docs.css">\n<link rel="stylesheet" href="../material-ui.css">\n<link rel="stylesheet" href="../material-docs.css">\n<link rel="stylesheet" href="../material-refinement.css">\n<body ${soft ? 'class="soft-root" data-theme="light"' : 'data-theme="glass" data-glass-style="frosted"'}>\n<div class="material-library rg-root catalog-app" data-material-library data-library="${soft ? 'soft' : 'surface'}"></div>\n<script defer src="../raster-ui/catalog-navigation.js"></script>\n<script defer src="../material-docs.js"></script>\n<script defer src="../material-refinement.js"></script>\n<script defer src="../material-ui.js"></script>\n</body>`;
  }
  global.MaterialRefinement = Object.freeze({install});
})(window);
