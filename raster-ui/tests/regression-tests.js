/* Open regression.html and click Run. No test dependencies or network requests. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const settle = async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); };
  const key = (el, value) => el.dispatchEvent(new KeyboardEvent('keydown', { key: value, bubbles: true, cancelable: true }));
  const own = (group, selector, owner) => [...group.querySelectorAll(selector)].filter(el => el.closest(owner) === group);
  function deferred() {
    let resolve, reject;
    const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
    return { promise, resolve, reject };
  }
  // Only the short toast timing section swaps timers, and always restores them.
  function clock() {
    const original = { setTimeout: window.setTimeout, clearTimeout: window.clearTimeout, now: Date.now };
    const jobs = new Map(); let now = 1, next = 0;
    window.setTimeout = (fn, ms = 0, ...args) => { const id = ++next; jobs.set(id, { due: now + Math.max(0, Number(ms) || 0), fn: () => fn(...args) }); return id; };
    window.clearTimeout = id => jobs.delete(id);
    Date.now = () => now;
    return {
      async advance(ms) {
        const end = now + ms;
        while (true) {
          await settle();
          const due = [...jobs].filter(([, job]) => job.due <= end).sort((a, b) => a[1].due - b[1].due)[0];
          if (!due) break;
          jobs.delete(due[0]); now = due[1].due; due[1].fn();
        }
        now = end; await settle();
      },
      restore() { window.setTimeout = original.setTimeout; window.clearTimeout = original.clearTimeout; Date.now = original.now; }
    };
  }
  $('run').addEventListener('click', async event => {
    const run = event.currentTarget, checks = [], notices = [];
    const preference = RasterUI.getMotion().preference;
    let timers;
    const assert = (name, value) => {
      const pass = !!value; checks.push(pass);
      const li = document.createElement('li'); li.textContent = (pass ? '通过 · ' : '失败 · ') + name;
      li.dataset.result = pass ? 'pass' : 'fail'; $('results').append(li);
    };
    const notify = (message, options) => { const item = RasterUI.toast(message, options); notices.push(item); return item; };
    run.disabled = true; $('results').replaceChildren(); $('diagnostics').textContent = ''; $('summary').textContent = '正在验证'; delete $('summary').dataset.result;
    $('fixture').innerHTML = `
      <form id="choices">
        <div data-rg-tabs id="outer-tabs">
          <div class="rg-tablist"><button role="tab" id="outer-a" aria-controls="outer-panel-a" aria-selected="true">Outer A</button><button role="tab" id="outer-b" aria-controls="outer-panel-b">Outer B</button></div>
          <div class="rg-tabpanel" id="outer-panel-a">
            <div data-rg-tabs id="inner-tabs">
              <div class="rg-tablist"><button role="tab" id="inner-a" aria-controls="inner-panel-a" aria-selected="true">Inner A</button><button role="tab" id="inner-b" aria-controls="inner-panel-b">Inner B</button></div>
              <div class="rg-tabpanel" id="inner-panel-a">Nested A</div><div class="rg-tabpanel" id="inner-panel-b">Nested B</div>
            </div>
          </div><div class="rg-tabpanel" id="outer-panel-b">Outer B</div>
        </div>
        <div data-rg-segmented id="segments">
          <button data-value="a" id="segment-a" aria-pressed="true">A</button><button data-value="b" id="segment-b" type="submit">B</button>
          <div data-rg-segmented id="inner-segments"><button data-value="c" id="segment-c" aria-pressed="true">C</button><button data-value="d" id="segment-d">D</button></div>
        </div>
        <button id="ordinary-submit" class="rg-button">Submit</button>
      </form>
      <button id="feedback-success" type="button" class="rg-button">Success</button><button id="feedback-error" type="button" class="rg-button">Error</button>
      <button id="feedback-plain" type="button" class="rg-button">Press</button>
      <section class="rg-root" id="local-theme" style="--rg-ink:rgb(25, 40, 55); --rg-surface-raised:rgb(240, 245, 250)">
        <div style="--rg-accent:rgb(66, 99, 55)"><button id="theme-origin" type="button">Theme origin</button></div>
      </section>
      <dialog class="rg-dialog rg-root" id="test-dialog" aria-label="Toast test" style="--rg-ink:rgb(81, 37, 53)">
        <div class="rg-dialog__body"><button id="dialog-origin" type="button">Modal origin</button></div>
      </dialog>`;
    try {
      RasterUI.setMotion('reduced'); RasterUI.init($('fixture'));
      const outer = $('outer-tabs'), inner = $('inner-tabs'), segments = $('segments');
      let tabEvents = 0, segmentEvents = 0, submits = 0;
      outer.addEventListener('rg:tabchange', e => { if (e.target === outer) tabEvents++; });
      segments.addEventListener('rg:change', e => { if (e.target === segments) segmentEvents++; });
      $('choices').addEventListener('submit', e => { e.preventDefault(); submits++; });
      const selected = group => own(group, '[role="tab"][aria-selected="true"]', '[data-rg-tabs]');
      assert('首次初始化只建立各自页签与面板关系', selected(outer)[0] === $('outer-a') && selected(inner)[0] === $('inner-a') && !$('inner-panel-a').hidden && $('inner-panel-b').hidden);
      $('inner-b').click(); $('outer-b').click(); $('outer-a').click();
      assert('切换外层页签不改写内层选择或面板隐藏状态', selected(inner)[0] === $('inner-b') && !$('inner-panel-b').hidden && $('inner-panel-a').hidden && tabEvents === 2);
      $('outer-b').focus(); key($('outer-b'), 'ArrowRight');
      assert('外层方向键循环不进入嵌套页签', document.activeElement === $('outer-a') && selected(inner)[0] === $('inner-b'));
      $('inner-b').focus(); key($('inner-b'), 'Home');
      assert('内层键盘选择不改变外层选择', document.activeElement === $('inner-a') && selected(outer)[0] === $('outer-a'));
      const newTab = document.createElement('button'); newTab.setAttribute('role', 'tab'); newTab.setAttribute('aria-controls', 'dynamic-panel'); newTab.textContent = 'Dynamic';
      const newPanel = document.createElement('div'); newPanel.id = 'dynamic-panel'; newPanel.className = 'rg-tabpanel'; newPanel.textContent = 'Dynamic panel';
      outer.querySelector('.rg-tablist').append(newTab); outer.append(newPanel);
      const beforeInit = tabEvents; RasterUI.init(newTab); RasterUI.init(outer);
      assert('对子节点重复初始化补齐 ID/type/ARIA，保持当前选择且不发事件', !!newTab.id && newTab.type === 'button' && newTab.tabIndex === -1 && newPanel.hidden && newPanel.getAttribute('aria-labelledby') === newTab.id && tabEvents === beforeInit);
      $('outer-a').disabled = true; RasterUI.init($('outer-a'));
      assert('当前页签禁用后回退到第一个可用项', selected(outer)[0] === $('outer-b') && $('outer-a').tabIndex === -1 && $('outer-panel-a').hidden && !$('outer-panel-b').hidden);
      $('outer-b').remove(); RasterUI.init(outer);
      assert('删除当前页签后修复选择并隐藏遗留面板', selected(outer)[0] === newTab && $('outer-panel-b').hidden && !newPanel.hidden);
      newTab.disabled = true; RasterUI.init(outer);
      assert('全部页签禁用时清空选择和 Tab 入口', selected(outer).length === 0 && own(outer, '[role="tab"]', '[data-rg-tabs]').every(t => t.tabIndex === -1) && newPanel.hidden);
      $('outer-a').disabled = false; RasterUI.init(outer); $('inner-a').disabled = true; RasterUI.init(inner); $('inner-b').focus(); key($('inner-b'), 'ArrowLeft');
      assert('嵌套键盘跳过禁用页签且外层重新启用可恢复', selected(outer)[0] === $('outer-a') && selected(inner)[0] === $('inner-b') && document.activeElement === $('inner-b'));
      $('segment-d').click(); $('segment-b').click();
      assert('嵌套分段选择互不改写，外层事件仅发一次', $('segment-d').getAttribute('aria-pressed') === 'true' && $('segment-c').getAttribute('aria-pressed') === 'false' && $('segment-b').getAttribute('aria-pressed') === 'true' && segmentEvents === 1);
      $('segment-b').focus(); key($('segment-b'), 'ArrowRight');
      assert('分段方向键只在所属组中循环', document.activeElement === $('segment-a') && $('segment-d').getAttribute('aria-pressed') === 'true');
      $('segment-a').disabled = true; RasterUI.init($('segment-a'));
      assert('分段禁用当前选择后补齐选择状态', $('segment-b').getAttribute('aria-pressed') === 'true' && $('segment-a').tabIndex === -1);
      $('segment-b').remove(); const newSegment = document.createElement('button'); newSegment.dataset.value = 'new'; newSegment.textContent = 'New'; segments.prepend(newSegment); RasterUI.init(newSegment);
      assert('分段删除和新增后重复初始化选中可用项', newSegment.getAttribute('aria-pressed') === 'true' && newSegment.tabIndex === 0 && newSegment.type === 'button');
      newSegment.disabled = true; RasterUI.init(segments);
      assert('全部外层分段禁用不会借用内层选项', own(segments, '[aria-pressed="true"]', '[data-rg-segmented]').length === 0 && $('segment-d').getAttribute('aria-pressed') === 'true');
      assert('页签和分段点击没有提交外层表单', submits === 0 && $('outer-a').type === 'button' && $('segment-a').type === 'button');
      $('ordinary-submit').click();
      assert('普通按钮仍保留原生 submit 默认行为', submits === 1 && $('ordinary-submit').type === 'submit');
      const late = document.createElement('button'); late.dataset.value = 'late'; late.textContent = 'Uninitialized'; segments.append(late); late.click();
      assert('尚未显式初始化的分段点击也不会误提交表单', submits === 1 && late.getAttribute('aria-pressed') === 'true' && late.type === 'button');
      const blocked = document.createElement('button'); blocked.dataset.value = 'blocked'; blocked.type = 'submit'; blocked.setAttribute('aria-disabled', 'true'); segments.append(blocked); blocked.click();
      assert('aria-disabled 的分段既不选中也不提交', submits === 1 && blocked.getAttribute('aria-pressed') !== 'true');
      $('feedback-success').addEventListener('click', e => RasterUI.feedback(e.currentTarget, 'success'));
      $('feedback-error').addEventListener('click', e => RasterUI.feedback(e.currentTarget, 'error'));
      RasterUI.setMotion('auto'); $('feedback-success').click(); $('feedback-error').click(); $('feedback-plain').click();
      assert('同步业务成功与错误反馈不被自动按压反馈覆盖', $('feedback-success').dataset.rgFeedback === 'success' && $('feedback-error').dataset.rgFeedback === 'error');
      assert('普通按钮仍收到自动按压反馈', $('feedback-plain').dataset.rgFeedback === 'press');
      if (!RasterUI.getMotion().reduced) {
        const frames = $('feedback-success').getAnimations().flatMap(a => a.effect.getKeyframes());
        assert('成功反馈的实际动画仍是确认效果', frames.some(frame => frame.boxShadow) && !frames.some(frame => frame.transform));
      }
      RasterUI.setMotion('reduced');
      $('theme-origin').focus(); const local = notify('<b>plain text</b>', { duration: 0 });
      assert('通知继承局部主题与深层 token 覆盖', getComputedStyle(local.element).backgroundColor === 'rgb(25, 40, 55)' && getComputedStyle(local.element).getPropertyValue('--rg-accent').trim() === 'rgb(66, 99, 55)');
      assert('通知只写纯文本并归属局部 root', !local.element.querySelector('b') && local.element.textContent.includes('<b>plain text</b>') && $('local-theme').contains(local.element));
      const rect = local.element.parentElement.getBoundingClientRect(), inset = innerWidth <= 640 ? 16 : 24;
      const placement = getComputedStyle(local.element.parentElement);
      window.rasterRegressionGeometry = { rect: rect.toJSON(), innerWidth, innerHeight, clientWidth: document.documentElement.clientWidth, clientHeight: document.documentElement.clientHeight, right: placement.right, bottom: placement.bottom, width: placement.width };
      const viewportWidth = document.documentElement.clientWidth, viewportHeight = document.documentElement.clientHeight;
      const placed = rect.width > 0 && rect.width <= Math.min(400, viewportWidth - 32) + 1 && Math.abs(viewportWidth - rect.right - inset) <= 1 && viewportHeight - rect.bottom >= inset - 1 && viewportHeight - rect.bottom < inset + 48;
      if (!placed) $('diagnostics').textContent = '通知定位测量：' + JSON.stringify(window.rasterRegressionGeometry);
      assert('通知容器保留窄屏宽度与右下定位', placed);
      local.element.querySelector('.rg-toast__close').focus(); await local.dismiss();
      assert('关闭通知恢复来源焦点并回收空容器', document.activeElement === $('theme-origin') && !$('local-theme').querySelector('.rg-toaster'));
      $('feedback-plain').focus();
      const explicit = notify('Async context', { duration: 0, context: $('theme-origin') });
      assert('异步通知可显式指定局部主题来源且无需移动焦点', $('local-theme').contains(explicit.element) && getComputedStyle(explicit.element).backgroundColor === 'rgb(25, 40, 55)' && document.activeElement === $('feedback-plain'));
      await explicit.dismiss();
      let invalidContext = false;
      try { RasterUI.toast('Invalid context', { context: '#local-theme' }); } catch (error) { invalidContext = error instanceof TypeError; }
      assert('无效通知 context 抛出明确类型错误且不创建宿主', invalidContext && !document.querySelector('.rg-toaster'));
      const dialog = $('test-dialog'); RasterUI.openDialog(dialog, $('theme-origin')); $('dialog-origin').focus();
      let modalCalls = 0; const modalNotice = notify('Modal action', { duration: 0, action: { label: 'Action', onClick: () => { modalCalls++; } } });
      const modalAction = modalNotice.element.querySelector('.rg-toast__action'), region = modalNotice.element.parentElement;
      modalAction.focus(); const actionRect = modalAction.getBoundingClientRect();
      assert('弹窗内通知操作可聚焦且仍位于原生模态范围', dialog.contains(region) && document.activeElement === modalAction && modalAction.tabIndex === 0);
      assert('弹窗内通知在屏幕可见且可被真实指针命中', actionRect.width > 0 && actionRect.top >= 0 && actionRect.bottom <= innerHeight && modalAction.contains(document.elementFromPoint(actionRect.left + actionRect.width / 2, actionRect.top + actionRect.height / 2)));
      assert('弹窗通知采用弹窗局部主题', getComputedStyle(modalNotice.element).backgroundColor === 'rgb(81, 37, 53)');
      if (typeof region.showPopover === 'function') assert('支持 Popover 时通知进入顶层而不改变 DOM 归属', region.matches(':popover-open') && region.closest('dialog') === dialog);
      modalAction.click(); await settle();
      assert('弹窗内操作执行一次，成功后关闭通知', modalCalls === 1 && !modalNotice.element.isConnected);
      $('dialog-origin').focus(); const externalContext = notify('Modal with outside context', { duration: 0, context: $('theme-origin'), action: { onClick() {} } });
      externalContext.element.querySelector('.rg-toast__action').focus();
      assert('显式外部主题不能使通知操作脱离当前模态范围', dialog.contains(externalContext.element) && externalContext.element.contains(document.activeElement) && getComputedStyle(externalContext.element).backgroundColor === 'rgb(25, 40, 55)');
      await externalContext.dismiss();
      $('dialog-origin').focus(); const closingNotice = notify('Close with dialog', { duration: 0 });
      const closed = new Promise(resolve => dialog.addEventListener('close', resolve, { once: true }));
      await RasterUI.closeDialog(dialog); await closed; await settle();
      assert('关闭弹窗同时清理所属通知与空顶层容器', !closingNotice.element.isConnected && !dialog.querySelector('.rg-toaster'));
      assert('弹窗关闭仍恢复外部来源焦点', document.activeElement === $('theme-origin'));
      // Keep pointer hover out of timer tests. Programmatic clicks do not focus.
      timers = clock();
      const timed = (message, options) => { const notice = notify(message, options); notice.element.style.pointerEvents = 'none'; notice.element.dispatchEvent(new Event('mouseleave')); return notice; };
      const expires = timed('Expiry', { duration: 100 });
      await timers.advance(99); assert('计时结束前通知仍可见', expires.element.isConnected);
      await timers.advance(1); assert('计时到期后通知正常关闭', !expires.element.isConnected);
      const hovered = timed('Hover pause', { duration: 100 }); await timers.advance(30);
      hovered.element.dispatchEvent(new Event('mouseenter')); await timers.advance(1000);
      assert('悬停暂停通知剩余计时', hovered.element.isConnected);
      hovered.element.dispatchEvent(new Event('mouseleave')); await timers.advance(69);
      assert('恢复后使用剩余时长', hovered.element.isConnected); await timers.advance(1);
      assert('剩余时长耗尽后关闭', !hovered.element.isConnected);
      const first = deferred(); let calls = 0;
      const asyncNotice = timed('Retry original action', { duration: 100, action: { label: 'Retry', onClick: () => { calls++; return calls === 1 ? first.promise : Promise.resolve(); } } });
      const retryButton = asyncNotice.element.querySelector('.rg-toast__action');
      await timers.advance(20); retryButton.click(); retryButton.click(); await timers.advance(1000);
      assert('异步操作进行中暂停到期并阻止重复触发', asyncNotice.element.isConnected && calls === 1 && retryButton.disabled && retryButton.getAttribute('aria-busy') === 'true');
      first.reject(new Error('Expected test failure')); await settle(); await timers.advance(1000);
      assert('失败保留原通知与可重试按钮，不生成重复通知', asyncNotice.element.isConnected && !retryButton.disabled && !retryButton.hasAttribute('aria-busy') && asyncNotice.element.getAttribute('role') === 'alert' && document.querySelectorAll('.rg-toast').length === 1);
      retryButton.click(); await settle();
      assert('重试成功后关闭原通知', calls === 2 && !asyncNotice.element.isConnected);
      const abandoned = deferred(); const dismissed = timed('Manual dismiss pending', { duration: 100, action: { label: 'Pending', onClick: () => abandoned.promise } });
      dismissed.element.querySelector('.rg-toast__action').click(); await dismissed.dismiss(); abandoned.reject(new Error('Expected late failure')); await settle();
      assert('进行中手动关闭后，晚到失败不会复活通知', !dismissed.element.isConnected && document.querySelectorAll('.rg-toast').length === 0);
      timers.restore(); timers = null;
      assert('所有通知完成后不留下空通知宿主', document.querySelectorAll('.rg-toaster').length === 0);
    } catch (error) { assert('未捕获错误：' + error.message, false); console.error(error); }
    finally {
      timers?.restore(); RasterUI.setMotion('reduced');
      for (const notice of notices) await notice.dismiss();
      const dialog = $('test-dialog'); if (dialog?.open) { const closed = new Promise(resolve => dialog.addEventListener('close', resolve, { once: true })); await RasterUI.closeDialog(dialog); await closed; }
      $('fixture').replaceChildren(); RasterUI.setMotion(preference); run.disabled = false;
      $('summary').textContent = `${checks.filter(Boolean).length} / ${checks.length} 通过${checks.every(Boolean) ? ' · 全部通过' : ' · 存在失败'}`;
      $('summary').dataset.result = checks.every(Boolean) ? 'pass' : 'fail';
      window.rasterRegressionResults = { passed: checks.filter(Boolean).length, total: checks.length, failed: checks.filter(pass => !pass).length };
    }
  });
})();
