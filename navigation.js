(() => {
  const header = document.querySelector('.masthead');
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#government-menu');
  const sectionToggle = document.querySelector('.section-toggle');
  const sectionMenu = document.querySelector('#section-menu');
  const mobile = window.matchMedia('(max-width: 767px)');

  function setSectionOpen(open, restoreFocus = false) {
    sectionMenu.hidden = !open;
    sectionToggle.setAttribute('aria-expanded', String(open));
    sectionToggle.setAttribute('aria-label', open
      ? 'Cerrar menú de factura electrónica' : 'Abrir menú de factura electrónica');
    if (restoreFocus) sectionToggle.focus();
  }
  sectionToggle.addEventListener('click', () => {
    const open = sectionMenu.hidden;
    setOpen(false);
    setSectionOpen(open);
  });
  sectionMenu.addEventListener('click', event => {
    if (event.target.closest('a')) setSectionOpen(false, true);
  });

  function setOpen(open, restoreFocus = false) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.classList.toggle('is-open', open);
    if (restoreFocus) toggle.focus();
  }

  toggle.addEventListener('click', () => {
    setSectionOpen(false);
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !sectionMenu.hidden) setSectionOpen(false, true);
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false, true);
    }
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) {
      setOpen(false);
      setSectionOpen(false);
    }
  });
  menu.addEventListener('click', event => {
    if (event.target.closest('a') && mobile.matches) setOpen(false, true);
  });
  mobile.addEventListener('change', () => {
    const sectionHadFocus = sectionMenu.contains(document.activeElement)
      || document.activeElement === sectionToggle;
    setSectionOpen(false);
    if (sectionHadFocus) {
      if (mobile.matches) sectionToggle.focus();
      else menu.querySelector('a').focus();
    }
    const active = document.activeElement;
    const focusWillHide = mobile.matches ? menu.contains(active) : active === toggle;
    setOpen(false, mobile.matches && focusWillHide);
    if (!mobile.matches && focusWillHide) menu.querySelector('a').focus();
  });
  // Keep anchor targets and the result below the actual sticky header height.
  const observer = new ResizeObserver(() => {
    document.documentElement.style.setProperty('--header-offset', `${header.offsetHeight + 16}px`);
  });
  observer.observe(header);
})();
