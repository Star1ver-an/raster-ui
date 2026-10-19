(function(){
  const names=['minimal','expressive','liquid','brutal','spatial'];
  const run=document.getElementById('run'),summary=document.getElementById('summary'),results=document.getElementById('results');
  run.addEventListener('click',async()=>{
    run.disabled=true;results.textContent='';summary.textContent='正在验证…';document.getElementById('frames').replaceChildren();let passed=0,failed=0;
    function check(condition,label){if(condition)passed++;else failed++;results.textContent+=(condition?'PASS ':'FAIL ')+label+'\n';}
    for(const name of names){
      const frame=document.createElement('iframe');frame.title=name+' 隔离验证';frame.src='../'+name+'-ui/index.html';
      try{
        await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Page load timeout')),15000);frame.onload=()=>{clearTimeout(timer);resolve();};document.getElementById('frames').append(frame);});
        const w=frame.contentWindow,d=w.document,api=w.UICollection,root=d.body,$=s=>d.querySelector(s),sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
        check(!!api&&root.dataset.style===name,name+' 核心与风格初始化');
        check(d.querySelectorAll('.uc-section').length===18,name+' 18章完整渲染');
        const ids=[...d.querySelectorAll('[id]')].map(el=>el.id);check(new Set(ids).size===ids.length,name+' ARIA / 面板 ID 唯一');
        const nested=d.createElement('div');nested.innerHTML='<button type="button" data-uc-toggle aria-pressed="false">嵌套验证</button>';root.append(nested);api.init(nested);nested.querySelector('button').click();check(nested.querySelector('button').getAttribute('aria-pressed')==='true',name+' 嵌套初始化不重复处理');nested.remove();
        const theme=$('[data-theme-choice]'),oldTheme=theme.value,themeKey='ui-collection.'+name+'.theme',oldThemeStore=localStorage.getItem(themeKey);theme.value=oldTheme==='dark'?'light':'dark';theme.dispatchEvent(new w.Event('change',{bubbles:true}));check(root.dataset.theme===theme.value,name+' 主题实际切换');theme.value=oldTheme;theme.dispatchEvent(new w.Event('change',{bubbles:true}));if(oldThemeStore===null)localStorage.removeItem(themeKey);else localStorage.setItem(themeKey,oldThemeStore);
        const tab=$('#tab-overview');tab.focus();tab.dispatchEvent(new w.KeyboardEvent('keydown',{key:'End',bubbles:true}));check($('#tab-assets').getAttribute('aria-selected')==='true'&&!$('#panel-assets').hidden&&$('#panel-overview').hidden,name+' End跳过禁用页签并更新面板');$('#tab-assets').dispatchEvent(new w.KeyboardEvent('keydown',{key:'Home',bubbles:true}));check(tab.getAttribute('aria-selected')==='true',name+' Home恢复首个页签');
        $('#filters [data-value=done]').click();check($('#filters [data-value=done]').getAttribute('aria-pressed')==='true'&&$('[data-filter-result]').textContent.includes('已完成'),name+' 筛选更新语义与结果');
        const form=$('[data-uc-validate]');form.elements.name.value='   ';form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));check(form.elements.name.getAttribute('aria-invalid')==='true'&&d.activeElement===form.elements.name,name+' 空白表单错误与焦点');form.elements.name.value='回归示例';form.elements.email.value='sample@example.com';form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));check($('[data-form-result]').textContent.includes('验证通过')&&form.elements.name.value==='回归示例',name+' 表单纠错成功且保留输入');
        const card=$('[data-uc-toggle]');card.click();check(card.getAttribute('aria-pressed')==='true',name+' 卡片选择可操作');card.click();
        const loading=$('[data-demo-loading]');loading.disabled=true;loading.setAttribute('aria-label','原标签');api.setLoading(loading,true);api.setLoading(loading,true);api.setLoading(loading,false);check(loading.disabled&&loading.getAttribute('aria-label')==='原标签'&&!loading.hasAttribute('aria-busy'),name+' 重复加载恢复原禁用与标签');loading.disabled=false;loading.removeAttribute('aria-label');
        const dialog=$('#demo-dialog'),opener=$('[data-uc-open="demo-dialog"]');api.openDialog(dialog,opener);const close=api.closeDialog(dialog);api.openDialog(dialog,opener);check(await close===false&&dialog.open,name+' 关闭后重开不会被旧动画关闭');await api.closeDialog(dialog);check(!dialog.open&&d.activeElement===opener,name+' 弹窗关闭与焦点恢复');
        const oldMotion=root.dataset.motion;api.setMotion(root,'reduced');check(await api.reveal($('[data-reveal-sample]'))===false&&root.dataset.reduced==='true',name+' 减少动态取消播放');check(getComputedStyle($('[data-reveal-sample]')).visibility!=='hidden',name+' 减少动态保留内容');api.setMotion(root,oldMotion);
        const expand=$('[data-expand-preview]');expand.click();check(expand.getAttribute('aria-expanded')==='true'&&$('[data-shared-sample]').classList.contains('is-expanded'),name+' 共享表面展开终态');expand.click();
        const range=$('[data-scroll-progress]');range.value=100;range.dispatchEvent(new w.Event('input',{bubbles:true}));check($('[data-progress-output]').textContent==='100%',name+' 滚动场景可由等价滑杆控制');range.value=0;range.dispatchEvent(new w.Event('input',{bubbles:true}));check($('[data-progress-output]').textContent==='0%',name+' 滚动进度可逆');
        api.setMotion(root,'reduced');check(getComputedStyle($('.uc-scrub-object')).opacity==='1',name+' 减少动态呈现完整滚动内容');api.setMotion(root,oldMotion);
        $('[data-save-fail]').checked=true;$('[data-save-article]').click();check($('[data-save-article]').getAttribute('aria-pressed')==='false'&&$('[data-save-result]').textContent.includes('失败'),name+' 收藏失败保留状态');$('[data-save-article]').click();check($('[data-save-article]').getAttribute('aria-pressed')==='true',name+' 收藏可重试');$('[data-undo-article]').click();check($('[data-save-article]').getAttribute('aria-pressed')==='false',name+' 收藏可撤销');
        const projectKey='ui-collection.'+name+'.projects.v1',backup=localStorage.getItem(projectKey);
        try{
          $('[data-new-project]').click();const pf=$('[data-project-form]');pf.elements.title.value='  ';pf.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));check($('#project-error').textContent.includes('请输入')&&$('#project-dialog').open,name+' 新建拒绝空白名称');
          pf.elements.title.value='测试资源 '+name;pf.elements.title.dispatchEvent(new w.Event('input',{bubbles:true}));pf.elements.status.value='done';pf.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await sleep(300);check(JSON.parse(localStorage.getItem(projectKey)).some(p=>p.title==='测试资源 '+name)&&$('[data-projects]').textContent.includes('测试资源 '+name),name+' 项目创建并保存独立存储');
          const archived=$('[data-archive]'),id=archived.dataset.archive;archived.click();check(!$(`[data-project-id="${id}"]`),name+' 归档移出活动列表');const notice=[...d.querySelectorAll('.uc-toast')].find(el=>el.textContent.includes('项目已归档'));[...notice.querySelectorAll('button')].find(b=>b.textContent==='撤销').click();await sleep(10);check(!!$(`[data-project-id="${id}"]`),name+' 归档可以撤销');
        }finally{if(backup===null)localStorage.removeItem(projectKey);else localStorage.setItem(projectKey,backup);}
        for(const width of [390,320]){frame.style.width=width+'px';await sleep(80);check(d.documentElement.scrollWidth<=d.documentElement.clientWidth+1,name+' '+width+'px 无页面横向溢出');}
        frame.style.width='100%';
      }catch(error){check(false,name+' '+error.message);}
    }
    summary.textContent=`验证完成：${passed} 项通过，${failed} 项失败`;summary.className=failed?'failure':'';run.disabled=false;document.body.dataset.testResult=failed?'failed':'passed';
  });
})();
