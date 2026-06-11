/* ajimms96 — interactive features */
(function(){
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  /* ---- Theme ---- */
  const root = document.documentElement;
  const saved = localStorage.getItem('ajimms-theme');
  if (saved) root.setAttribute('data-theme', saved);
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-theme-toggle]');
    if (!t) return;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('ajimms-theme', next);
  });

  /* ---- Nav scroll & active link ---- */
  const nav = $('.nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 40);
    const btt = $('.to-top'); if (btt) btt.classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const path = location.pathname.split('/').pop() || 'index.html';
  $$('.nav__links a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  /* ---- Burger ---- */
  const burger = $('.burger');
  const links = $('.nav__links');
  if (burger && links) {
    burger.addEventListener('click', () => links.classList.toggle('open'));
    links.addEventListener('click', e => { if (e.target.tagName === 'A') links.classList.remove('open'); });
  }

  /* ---- Back to top ---- */
  document.addEventListener('click', e => {
    if (e.target.closest('.to-top')) window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---- Reveal on scroll ---- */
  const io = new IntersectionObserver(entries => {
    entries.forEach((en, i) => {
      if (en.isIntersecting) {
        setTimeout(() => en.target.classList.add('in'), (en.target.dataset.delay|0));
        io.unobserve(en.target);
        // animate skill bars
        en.target.querySelectorAll('.bar > i').forEach(b => {
          const v = b.dataset.value || 80; b.style.width = v + '%';
        });
      }
    });
  }, { threshold: 0.14 });
  $$('.reveal').forEach(el => io.observe(el));

  /* Stagger siblings within a .stagger container */
  $$('.stagger').forEach(group => {
    $$('.reveal', group).forEach((el, i) => el.dataset.delay = i * 110);
  });

  /* ---- Lightbox ---- */
  const lb = $('.lightbox');
  if (lb) {
    const imgEl = $('.lightbox img');
    const figs = $$('.gallery figure img');
    let idx = 0;
    const open = i => { idx = (i + figs.length) % figs.length; imgEl.src = figs[idx].dataset.full || figs[idx].src; lb.classList.add('open'); };
    figs.forEach((img, i) => img.parentElement.addEventListener('click', () => open(i)));
    $('.lightbox__close').addEventListener('click', () => lb.classList.remove('open'));
    $('.lightbox__prev').addEventListener('click', () => open(idx - 1));
    $('.lightbox__next').addEventListener('click', () => open(idx + 1));
    lb.addEventListener('click', e => { if (e.target === lb) lb.classList.remove('open'); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') lb.classList.remove('open');
      if (e.key === 'ArrowRight') open(idx + 1);
      if (e.key === 'ArrowLeft')  open(idx - 1);
    });
  }

  /* ---- Form (no backend, demo) ---- */
  const form = $('.form');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent; btn.textContent = 'Sent ✓'; btn.disabled = true;
    form.reset();
    setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 2400);
  });

  /* ---- Newsletter ---- */
  const nl = $('.newsletter');
  if (nl) nl.addEventListener('submit', e => {
    e.preventDefault();
    const b = nl.querySelector('button'); const o = b.textContent;
    b.textContent = '✓'; nl.querySelector('input').value = '';
    setTimeout(() => b.textContent = o, 1800);
  });

  /* ---- Year ---- */
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
