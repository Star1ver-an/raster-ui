/* Open motion.html and run; uses native DOM and the public library API. */
document.getElementById('run').addEventListener('click', async event => {
  const run = event.currentTarget, $ = id => document.getElementById(id);
  const preference = RasterUI.getMotion().preference, assertions = [];
  const tick = () => new Promise(resolve => setTimeout(resolve, 0));
  const assert = (name, condition) => {
    assertions.push({name,pass:!!condition});
    const li = document.createElement('li'); li.textContent = (condition ? '通过 · ' : '失败 · ') + name;
    li.dataset.result = condition ? 'pass' : 'fail'; $('results').append(li);
  };
  run.disabled = true; $('results').replaceChildren(); $('summary').textContent = '正在验证';
  try {
    RasterUI.setMotion('auto');
    const panel = $('panel'), dialog = $('dialog'), origin = $('origin');
    const a = RasterUI.reveal(panel), b = RasterUI.feedback(panel, 'error');
    await Promise.all([a,b]);
    assert('快速新动作取消旧动画，结束后不残留位移', panel.getAnimations().length === 0 && getComputedStyle(panel).transform === 'none');
    let changes = 0; const count = () => changes++;
    $('segments').addEventListener('rg:change', count);
    $('segments').querySelector('[data-value="b"]').click();
    $('segments').querySelector('[data-value="a"]').click();
    $('segments').querySelector('[data-value="a"]').click();
    assert('连续筛选即时生效，重复选择不重复派发事件', changes === 2 && $('segments').querySelector('[aria-pressed="true"]').dataset.value === 'a');
    $('segments').removeEventListener('rg:change', count);
    origin.focus(); RasterUI.openDialog(dialog, origin);
    const closing = RasterUI.closeDialog(dialog, 'first'); RasterUI.openDialog(dialog, origin);
    assert('退场中重新打开，不被旧关闭任务误关', await closing === false && dialog.open);
    const closeEvent = new Promise(resolve => dialog.addEventListener('rg:dialogchange', e => { if(!e.detail.open) resolve(); }, {once:true}));
    await RasterUI.closeDialog(dialog, 'second'); await closeEvent;
    assert('弹窗关闭返回值与触发焦点恢复', !dialog.open && dialog.returnValue === 'second' && document.activeElement === origin);
    RasterUI.openDialog(dialog, origin);
    const formClosed = new Promise(resolve => dialog.addEventListener('rg:dialogchange', e => { if(!e.detail.open) resolve(); }, {once:true}));
    dialog.querySelector('form').requestSubmit(dialog.querySelector('button')); await formClosed;
    assert('原生 dialog 表单经过退场并保留提交值', !dialog.open && dialog.returnValue === 'submitted');
    const load = $('busy'); RasterUI.setLoading(load,true); RasterUI.setLoading(load,true); RasterUI.setLoading(load,false);
    assert('重复加载调用能恢复原标签和禁用状态', !load.disabled && !load.hasAttribute('aria-busy') && load.getAttribute('aria-label') === '原标签');
    let undoCount=0, done; const undone = new Promise(resolve => done=resolve);
    const notice=RasterUI.toast('撤销验证',{duration:0,action:{label:'撤销',onClick:()=>{undoCount++;done();}}});
    notice.element.querySelector('.rg-toast__action').click();notice.element.querySelector('.rg-toast__action').click();await undone;
    assert('撤销动作避免重复触发',undoCount===1);await notice.dismiss();
    const pending=RasterUI.reveal(panel);RasterUI.setMotion('reduced');await pending;
    await RasterUI.feedback(panel,'error');await RasterUI.reveal(panel);
    assert('切换减少动态模式立即停止正在运行的位移',RasterUI.getMotion().reduced && panel.getAnimations().length===0 && getComputedStyle(panel).transform==='none');
    RasterUI.setLoading(load,true);
    assert('减少动态模式停止加载循环，保留忙碌语义',getComputedStyle(load,'::after').animationName==='none' && load.getAttribute('aria-busy')==='true');
    RasterUI.setLoading(load,false);
    RasterUI.openDialog(dialog,origin);await RasterUI.closeDialog(dialog);await tick();
    assert('减少动态模式仍可正常打开和关闭弹窗',!dialog.open && document.activeElement===origin);
    RasterUI.setMotion('auto');
    assert('自动模式采用实际系统偏好',RasterUI.getMotion().reduced === matchMedia('(prefers-reduced-motion: reduce)').matches);
  } catch(error) { assert('未捕获错误：'+error.message,false); }
  finally {
    RasterUI.setMotion(preference);run.disabled=false;
    const failed=assertions.filter(x=>!x.pass).length;
    $('summary').textContent=`${assertions.length-failed} / ${assertions.length} 通过${failed?' · 存在失败':' · 全部通过'}`;
    $('summary').dataset.result=failed?'fail':'pass';
  }
});
