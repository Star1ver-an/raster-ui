/* Documentation-only interaction playground. No network requests. */
(function () {
  'use strict';
  const icon = name => `<svg class="rg-icon" aria-hidden="true"><use href="#rg-i-${name}"/></svg>`;
  const sections = [
    { id:'particles', group:'可选 · 动效实验室', title:'像素粒子探索', en:'PIXEL FIELD / 03', keys:'粒子 华丽 视觉 冲击 动画 迸发 拼合 归档 particles',
      desc:'更鲜明的一瞬，然后回到安静。方形颗粒、阶梯轨迹和局部框角，共用同一套像素语言。',
      content:`<div class="particle-lab"><div class="particle-toolbar"><div class="rg-segmented" data-rg-segmented id="particle-effects" aria-label="粒子效果"><button type="button" class="rg-segment" data-value="burst" aria-pressed="true">边缘迸发</button><button type="button" class="rg-segment" data-value="assemble" aria-pressed="false">颗粒归位</button><button type="button" class="rg-segment" data-value="transfer" aria-pressed="false">粒子归档</button></div><label class="particle-strength">粒子密度<select class="rg-select" id="particle-intensity"><option value="balanced">标准</option><option value="soft">轻量</option></select></label></div>
      <div class="particle-scene" id="particle-scene" data-effect="burst" data-rg-particle-boundary><div class="particle-scene-meta"><span class="rg-mono" id="particle-scene-name">01 / BURST</span><span class="particle-scene-indicator" aria-hidden="true"></span><span id="particle-scene-hint">点击方块，或播放动效</span></div><div class="particle-stage-objects"><button type="button" class="particle-subject" id="particle-origin" aria-label="播放边缘迸发">${icon('check')}<span>已收藏</span></button><span class="particle-route" aria-hidden="true"></span><div class="particle-destination" id="particle-destination" hidden>${icon('folder')}<span>稍后阅读</span></div></div><div class="particle-scene-footer"><span>灰绿三色 / 方形颗粒</span><span id="particle-time" class="rg-mono">720 ms</span><button type="button" class="rg-button rg-button--sm" id="particle-play" data-rg-particle-exclude>${icon('arrow')}播放动效</button></div></div>
      <div class="particle-console"><div><h3 id="particle-caption">让完成被看见</h3><p id="particle-description">像素从控件边缘向外迸发，框角随之展开，再一起收隐。</p></div></div><p class="particle-play-status" id="particle-play-status" role="status">按一次看完整效果；连续点击会重新播放。</p><div class="particle-boundaries"><span>局部发生</span><span>不到一秒</span><span>结束即清空</span><span>不遮挡操作</span></div><p class="particle-mode-note" id="particle-mode-note" hidden>当前为减少动态效果模式。交互仍然可用，粒子已停止；可在下方“动态效果”中调整。</p></div>`,
      code:`// 只在重要操作完成时调用；无需给每次点击都添加粒子。
const effect = RasterUI.particles(button, { effect: 'burst' });
await effect.finished; // 完整播放为 true；取消或减少动态效果为 false
effect.cancel();

RasterUI.particles(panel, { effect: 'assemble', intensity: 'soft' });
RasterUI.particles(saveButton, { effect: 'transfer', to: savedItem });
// 目标在视口外时自动改为原地迸发，不让用户追逐粒子。
// 可传 boundary: element，或使用 data-rg-particle-boundary 限定区域。` },
    { id:'experience', group:'可选 · 动效实验室', title:'收藏与撤销', en:'RASTER / IN ACTION', keys:'UX 动效 体验 收藏 撤销 失败 重试 motion',
      desc:'可选实验室：用本地收藏流程比较成功、失败、重试与撤销。先保证文字和状态清楚，再决定是否加入粒子。',
      content:`<div class="motion-preference"><span class="rg-status" id="motion-summary">像素动效 · 跟随系统</span><label for="motion-mode">动态效果</label><select class="rg-select" id="motion-mode"><option value="auto">跟随系统</option><option value="reduced">减少动态效果</option></select></div>
      <div class="experience-shell"><article class="reading-sample" id="reading-sample"><div class="reading-meta"><span class="rg-tag">设计随笔</span><span>阅读约 3 分钟</span></div><h3>为日常留一点空白</h3><p class="reading-lead">让重要的内容自然浮现，让每一次操作都有清楚的回应。</p><div class="reading-excerpt"><p>界面的留白不只是间距。它让相关的内容靠近，也给新的决定留出一点时间。</p><p>当一个动作完成时，一个准确的小标记，往往比大幅度的动画更有力量。</p></div><div class="reading-actions" data-rg-particle-exclude><button type="button" class="rg-button" id="save-reading" aria-pressed="false">${icon('plus')}<span>收藏这篇</span></button><button type="button" class="rg-button rg-button--quiet" data-rg-open="reading-dialog">阅读详情 ${icon('arrow')}</button></div><div class="reading-error rg-alert rg-alert--error" id="reading-error" role="alert" hidden>${icon('close')}<div><strong>这次未能收藏</strong><p>内容还在，点“重试收藏”即可继续。</p></div></div></article>
      <aside class="experience-aside" aria-label="体验状态"><div class="experience-aside-title"><span class="rg-mono">YOUR LIBRARY</span>${icon('folder')}</div><h4>稍后阅读</h4><div class="saved-item" id="saved-item" hidden>${icon('doc')}<span>为日常留一点空白<small>已加入收藏</small></span>${icon('check')}</div><div class="saved-empty" id="saved-empty"><span class="empty-pixels" aria-hidden="true"><i></i><i></i><i></i></span><p>把值得回看的内容<br>留在这里。</p></div><p class="experience-status" id="experience-status" role="status">准备好了，试试收藏。</p><div class="experience-test"><label class="rg-check"><input type="checkbox" id="simulate-failure"><span>下次收藏模拟失败</span></label><small>本地交互演示 · 不连接账户<br>刷新后恢复初始状态</small></div></aside></div>
      <div class="experience-principles"><span><b>01</b> 操作立即回应</span><span><b>02</b> 结果留在原位</span><span><b>03</b> 失误可以撤回</span></div>
      <dialog class="rg-dialog rg-root" id="reading-dialog" aria-labelledby="reading-title"><header class="rg-dialog__header"><h3 class="rg-dialog__title" id="reading-title">为日常留一点空白</h3><button type="button" class="rg-button rg-button--quiet rg-button--icon" data-rg-close aria-label="关闭阅读详情">${icon('close')}</button></header><div class="rg-dialog__body reading-dialog-body"><span class="rg-tag">设计随笔</span><p>好的界面不需要在每一处都提醒你它的存在。信息之间的距离、标题与正文的比例，以及一个安静的选中标记，共同构成了阅读的秩序。</p><p>像素也可以是一种精确的语言。边界按格点生长，状态以小方块确认，动作在短促的几帧里完成。内容始终是主角。</p><div class="rg-dialog__footer"><button type="button" class="rg-button rg-button--secondary" data-rg-close>回到资料</button></div></div></dialog>`,
      code:`// 忙碌时防止重复触发；失败保留内容；成功允许撤销。
RasterUI.setLoading(button, true, '正在收藏');
try {
  await saveYourData(); // 由业务提供真实请求
  updateSavedState(true);
  RasterUI.feedback(result, 'success');
  RasterUI.toast('已加入稍后阅读', {
    duration: 8000,
    action: { label: '撤销', onClick: async () => {
      await undoYourSave();
      updateSavedState(false);
    }}
  });
} catch {
  showInlineError('未能收藏，请重试。');
  RasterUI.feedback(button, 'error');
} finally {
  RasterUI.setLoading(button, false);
}` },
    { id:'motion', group:'可选 · 动效实验室', title:'像素动效规则', en:'MOTION GRAMMAR', keys:'动画 规则 时长 减少动态 像素 按下 焦点',
      desc:'位移只走整数格点。反馈短促，状态立即生效；同一位置的新操作会替换旧动画。',
      content:`<div class="motion-studies"><article class="motion-study"><div class="motion-study-label"><span>01 / 落格</span><code>80 ms</code></div><div class="motion-stage"><button type="button" class="rg-button" id="motion-press">按一下 ${icon('arrow')}</button></div><h3>有触感的按下</h3><p>下沉 2 px，分步归位。鼠标、触摸与键盘都能触发。</p></article><article class="motion-study"><div class="motion-study-label"><span>02 / 定位</span><code>160 ms</code></div><div class="motion-stage"><div class="rg-segmented" data-rg-segmented aria-label="动效选择示例"><button type="button" class="rg-segment" data-value="read" aria-pressed="true">浏览</button><button type="button" class="rg-segment" data-value="saved" aria-pressed="false">收藏</button></div></div><h3>边界确认选择</h3><p>先切换状态，再让底边收束。选中文字始终保持稳定。</p></article><article class="motion-study"><div class="motion-study-label"><span>03 / 入位</span><code>160–200 ms</code></div><div class="motion-stage motion-stage--reveal"><div class="motion-preview" id="motion-preview">${icon('doc')}<span>内容已经就位<small>8 → 4 → 0 px</small></span></div><button type="button" class="rg-button rg-button--quiet rg-button--sm" id="motion-replay">重播入场</button></div><h3>内容落在格点</h3><p>列表与面板轻步入位。弹窗多一帧，关闭只用 120 ms。</p></article><article class="motion-study"><div class="motion-study-label"><span>04 / 纠错</span><code>160 ms</code></div><div class="motion-stage"><button type="button" class="rg-button rg-button--secondary" id="motion-error">试试错误反馈</button></div><h3>提示，而不打断</h3><p>局部左右各 4 px，一次即止。错误原因仍通过文字说明。</p><p class="motion-error-text" id="motion-error-text" role="status"></p></article></div><p class="motion-footnote">减少动态效果时，位移与循环动画停止，文字、选中态和操作结果完整保留。没有声音、弹跳或整页转场。</p>`,
      code:`RasterUI.feedback(element, 'success'); // 'press' / 'select' / 'error'
await RasterUI.reveal(panel);
await RasterUI.reveal(list, { children: '.rg-list-item' });
RasterUI.setMotion('reduced'); // 或 'auto'，跟随系统
RasterUI.getMotion(); // { preference, reduced }
// 动态减少模式始终尊重系统设置。
// 弹窗关闭现在可等待退场完成：
await RasterUI.closeDialog('entry-dialog', 'saved');` }
  ];
  function init() {
    const $ = s => document.querySelector(s), button = $('#save-reading');
    let saved = false, busy = false, notice, revision = 0;
    let particleChoice = 'burst', particleRun, particleRevision = 0, collectionRun;
    const particleDetails = {
      burst:['01 / BURST','720 ms','让完成被看见','像素从控件边缘向外迸发，框角随之展开，再一起收隐。','check','已收藏','边缘迸发'],
      assemble:['02 / ASSEMBLE','820 ms','让内容有入场感','散落的方块吸附到内容边缘，组成短暂的像素轮廓。文字保持清楚。','doc','内容就位','颗粒归位'],
      transfer:['03 / TRANSFER','880 ms','让结果有去向','像素沿弧线逐格进入收藏区，抵达时框角亮起，让归档的去向看得见。','doc','当前文章','粒子归档']
    };
    function prepareParticles() {
      const d=particleDetails[particleChoice];
      $('#particle-scene').dataset.effect=particleChoice;
      $('#particle-scene-name').textContent=d[0]; $('#particle-time').textContent=d[1];
      $('#particle-caption').textContent=d[2]; $('#particle-description').textContent=d[3];
      $('#particle-origin').innerHTML=icon(d[4])+`<span>${d[5]}</span>`;
      $('#particle-origin').setAttribute('aria-label','播放'+d[6]);
      $('#particle-destination').hidden=particleChoice!=='transfer';
    }
    function playParticles() {
      particleRun?.cancel(); const current=++particleRevision;
      const reduced=RasterUI.getMotion().reduced;
      $('#particle-play-status').textContent=reduced?'已保留操作结果；减少动态效果模式不播放粒子。':'正在播放'+particleDetails[particleChoice][6]+'…';
      $('#particle-scene').dataset.playing=String(!reduced);
      particleRun=RasterUI.particles($('#particle-origin'),{
        effect:particleChoice, to:$('#particle-destination'),
        intensity:$('#particle-intensity').value, boundary:$('#particle-scene')
      });
      particleRun.finished.then(complete=>{
        if(current!==particleRevision)return;
        $('#particle-scene').dataset.playing='false';
        if(!RasterUI.getMotion().reduced) $('#particle-play-status').textContent=complete?'播放完成。再试试另一种效果，或切换轻量密度。':'播放已停止，可以重新播放。';
      });
    }
    $('#particle-effects').addEventListener('rg:change',e=>{particleChoice=e.detail.value;prepareParticles();playParticles();});
    $('#particle-play').addEventListener('click',playParticles);
    $('#particle-origin').addEventListener('click',playParticles);
    $('#particle-intensity').addEventListener('change',playParticles);
    const syncMotion = () => {
      const mode = RasterUI.getMotion(); $('#motion-mode').value = mode.preference;
      $('#motion-summary').textContent = mode.reduced ? '已减少动效 · 状态反馈保留' : '像素动效 · 跟随系统';
      $('#particle-mode-note').hidden=!mode.reduced;
      if(mode.reduced){$('#particle-scene').dataset.playing='false';$('#particle-play-status').textContent='已减少动态效果，粒子已停止。';}
      else if($('#particle-scene').dataset.playing!=='true') $('#particle-play-status').textContent='按一次看完整效果；连续点击会重新播放。';
    };
    syncMotion(); document.addEventListener('rg:motionchange', syncMotion);
    $('#motion-mode').addEventListener('change', e => RasterUI.setMotion(e.target.value));
    function render() {
      button.setAttribute('aria-pressed', String(saved));
      button.innerHTML = icon(saved ? 'check' : 'plus') + `<span>${saved ? '已收藏 · 点击移除' : '收藏这篇'}</span>`;
      $('#saved-item').hidden = !saved; $('#saved-empty').hidden = saved;
      $('#simulate-failure').disabled = saved || busy;
    }
    async function changeSaved(next) {
      if (busy) return;
      const before = saved, current = ++revision;
      busy = true; notice?.dismiss(); collectionRun?.cancel(); $('#reading-error').hidden = true;
      RasterUI.setLoading(button, true, next ? '正在收藏' : '正在移除');
      button.querySelector('span').textContent = next ? '正在收藏' : '正在移除';
      $('#simulate-failure').disabled = true;
      $('#experience-status').textContent = next ? '正在加入稍后阅读…' : '正在移除收藏…';
      // Deliberate simulated request latency, only in the demonstration.
      await new Promise(resolve => setTimeout(resolve, 720));
      const fail = next && $('#simulate-failure').checked;
      if (fail) {
        $('#simulate-failure').checked = false; $('#reading-error').hidden = false;
        $('#experience-status').textContent = '收藏未完成，原有内容已保留。';
      } else {
        saved = next;
        $('#experience-status').textContent = saved ? '已收藏，随时可以继续阅读。' : '已移除收藏，文章仍可阅读。';
      }
      busy = false; RasterUI.setLoading(button, false); render();
      if (fail) { button.querySelector('span').textContent = '重试收藏'; RasterUI.feedback(button, 'error'); return; }
      if(!saved) RasterUI.reveal($('#saved-empty'));
      RasterUI.feedback(button, 'success');
      if(saved) collectionRun=RasterUI.particles(button,{effect:'transfer',to:$('#saved-item')});
      notice = RasterUI.toast(saved ? '已加入稍后阅读' : '已移除收藏', {
        duration: 8000,
        action: { label: '撤销', onClick: () => {
          if (revision !== current || busy) return;
          ++revision; collectionRun?.cancel(); saved = before; render();
          $('#experience-status').textContent = '已撤销，恢复为' + (saved ? '已收藏。' : '未收藏。');
          RasterUI.reveal(saved ? $('#saved-item') : $('#saved-empty'));
          button.focus();
        }}
      });
    }
    button.addEventListener('click', () => changeSaved(!saved));
    $('#motion-replay').addEventListener('click', () => RasterUI.reveal($('#motion-preview')));
    $('#motion-error').addEventListener('click', () => {
      RasterUI.feedback($('#motion-error'), 'error');
      $('#motion-error-text').textContent = '这是错误反馈演示，当前内容不会丢失。';
    });
  }
  window.RasterMotionLab = { sections, init };
})();
