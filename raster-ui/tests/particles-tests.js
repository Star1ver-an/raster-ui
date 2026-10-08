document.getElementById('run').addEventListener('click',async event=>{
  const $=id=>document.getElementById(id),run=event.currentTarget;
  const preference=RasterUI.getMotion().preference,checks=[];
  const assert=(name,condition)=>{checks.push(!!condition);const li=document.createElement('li');li.textContent=(condition?'通过 · ':'失败 · ')+name;$('results').append(li);};
  const frame=()=>new Promise(requestAnimationFrame);
  const bench=document.createElement('div');
  bench.style.cssText='position:fixed;bottom:24px;right:24px;width:264px;height:176px;background:#e8ede1;border:1px solid #75846e;z-index:5';
  bench.innerHTML='<div data-rg-particle-exclude style="position:absolute;top:0;left:0;right:0;height:40px;background:#f2f4ed">受保护区域</div><button id="pixel-a" style="position:absolute;left:40px;top:60px;width:48px;height:48px">A</button><button id="pixel-b" style="position:absolute;right:40px;top:60px;width:48px;height:48px">B</button>';
  document.body.append(bench);run.disabled=true;$('results').replaceChildren();$('summary').textContent='正在验证';delete $('summary').dataset.result;
  try{
    RasterUI.setMotion('auto');const a=$('pixel-a'),b=$('pixel-b');a.focus();
    if(RasterUI.getMotion().reduced){
      const skip=RasterUI.particles(a);assert('系统减少动态效果时不创建粒子层',!(await skip.finished)&&!document.querySelector('.rg-particles'));
    } else {
      const first=RasterUI.particles(a,{boundary:bench});
      await frame();await frame();await frame();
      const canvas=document.querySelector('.rg-particles'),r=a.getBoundingClientRect();
      assert('粒子层不截获指针或焦点',canvas && getComputedStyle(canvas).pointerEvents==='none' && document.activeElement===a && document.elementFromPoint(r.left+24,r.top+24)===a);
      const rect=bench.getBoundingClientRect(),data=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height),scale=canvas.width/innerWidth;
      let colored=0,outside=0,protectedPixels=0;
      for(let y=0;y<data.height;y++)for(let x=0;x<data.width;x++)if(data.data[(y*data.width+x)*4+3]>0){colored++;const px=x/scale,py=y/scale;if(px<rect.left-1||px>rect.right+1||py<rect.top-1||py>rect.bottom+1)outside++;if(px>rect.left+1&&px<rect.right-1&&py>rect.top+1&&py<rect.top+39)protectedPixels++;}
      assert('实际绘制方块，且不越过指定边界',colored>0&&outside===0);
      assert('受保护导航区域保持无颗粒',protectedPixels===0);
      first.cancel();assert('主动取消返回 false 并回收图层',await first.finished===false&&!document.querySelector('.rg-particles'));
      const old=RasterUI.particles(a),latest=RasterUI.particles(a);
      assert('同一来源连点替换旧效果',await old.finished===false&&document.querySelectorAll('.rg-particles').length===1);
      const other=RasterUI.particles(b);assert('多来源共享一张画布并限制粒子预算',Number(document.querySelector('.rg-particles').dataset.rgParticleCount)<=48&&document.querySelectorAll('.rg-particles').length===1);
      latest.cancel();other.cancel();
      const completed=RasterUI.particles(a,{effect:'assemble',boundary:bench});
      assert('完整播放后返回 true 且移除画布',await completed.finished===true&&!document.querySelector('.rg-particles'));
      const transfer=RasterUI.particles(a,{effect:'transfer',to:b});
      assert('可见目标使用归档流向',document.querySelector('.rg-particles').dataset.rgParticleEffects==='transfer');transfer.cancel();
      b.hidden=true;const fallback=RasterUI.particles(a,{effect:'transfer',to:b});
      assert('不可见目标退回原地反馈',document.querySelector('.rg-particles').dataset.rgParticleEffects==='burst');fallback.cancel();b.hidden=false;
      const scroll=RasterUI.particles(a);window.dispatchEvent(new Event('scroll'));
      assert('滚动立即清除，避免错位',await scroll.finished===false&&!document.querySelector('.rg-particles'));
      const pending=RasterUI.particles(a);RasterUI.setMotion('reduced');
      assert('减少动态效果即时取消正在播放的粒子',await pending.finished===false&&!document.querySelector('.rg-particles'));
    }
    RasterUI.setMotion('reduced');const reduced=RasterUI.particles($('pixel-a'));
    assert('减少动态模式不创建画布，不影响内容',await reduced.finished===false&&!document.querySelector('.rg-particles')&&$('pixel-a').isConnected);
  }catch(error){assert('未捕获错误：'+error.message,false);}
  finally{RasterUI.setMotion(preference);bench.remove();run.disabled=false;$('summary').textContent=`${checks.filter(Boolean).length} / ${checks.length} 通过`;$('summary').dataset.result=checks.every(Boolean)?'pass':'fail';}
});
