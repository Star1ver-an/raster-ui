/* Shared scroll position and navigation for the three documentation catalogs. */
(function (global) {
  'use strict';
  function install({links, sections, header, sidebar}) {
    const list = [...links], content = [...sections];
    let frame = 0, current = null;
    function update() {
      frame = 0;
      const mobile = global.matchMedia('(max-width:760px)').matches;
      const headerStyle = getComputedStyle(header);
      const headerHeight = ['sticky','fixed'].includes(headerStyle.position) ? header.getBoundingClientRect().height : 0;
      const sidebarHeight = mobile ? sidebar.getBoundingClientRect().height : 0;
      const offset = headerHeight + sidebarHeight;
      const style = document.documentElement.style;
      style.setProperty('--catalog-header-height', headerHeight + 'px');
      style.setProperty('--catalog-sidebar-height', sidebarHeight + 'px');
      style.setProperty('--catalog-navigation-offset', offset + 'px');
      const visible = content.filter(section => !section.hidden && section.getClientRects().length);
      let active = visible[0];
      for (const section of visible) {
        if (section.getBoundingClientRect().top <= offset + 70) active = section;
        else break;
      }
      const next = active && list.find(link => link.getAttribute('href') === '#' + active.id);
      list.forEach(link => {
        if (link === next) link.setAttribute('aria-current','location');
        else link.removeAttribute('aria-current');
      });
      if (next && next !== current) {
        const box = next.getBoundingClientRect();
        const parent = (mobile ? next.parentElement : sidebar);
        const bounds = parent.getBoundingClientRect();
        if (mobile) {
          if (box.left < bounds.left) parent.scrollLeft += box.left - bounds.left - 8;
          else if (box.right > bounds.right) parent.scrollLeft += box.right - bounds.right + 8;
        } else {
          if (box.top < bounds.top + 12) parent.scrollTop += box.top - bounds.top - 12;
          else if (box.bottom > bounds.bottom - 12) parent.scrollTop += box.bottom - bounds.bottom + 12;
        }
      }
      current = next;
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    global.addEventListener('scroll', schedule, {passive:true});
    global.addEventListener('resize', schedule);
    global.addEventListener('hashchange', schedule);
    sidebar.addEventListener('input', schedule);
    sidebar.addEventListener('click', schedule);
    if ('ResizeObserver' in global) { const observer = new ResizeObserver(schedule); observer.observe(header); observer.observe(sidebar); }
    update();
  }
  global.CatalogNavigation = Object.freeze({install});
})(window);
