/* Light motion: typed headlines, counting stats, gentle fade-ins.
   Everything is skipped for visitors who ask for reduced motion. */
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('motion');

  /* ---------- Typed headlines ---------- */
  const TYPE_SEL = '.hero h1, main h2:not(#artifact-title), .case-top h2';
  function wrapChars(el) {
    if (el.dataset.typed === 'wrapped') return el.querySelectorAll('.tc');
    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', (el.innerText || el.textContent).replace(/\s+/g, ' ').trim());
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      if (!node.nodeValue.trim()) continue;
      const frag = document.createDocumentFragment();
      // Keep words together so lines never break mid-word while typing.
      for (const part of node.nodeValue.split(/(\s+)/)) {
        if (!part) continue;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); continue; }
        const word = document.createElement('span');
        word.className = 'tw';
        word.setAttribute('aria-hidden', 'true');
        for (const ch of part) {
          const s = document.createElement('span');
          s.className = 'tc';
          s.textContent = ch;
          word.appendChild(s);
        }
        frag.appendChild(word);
      }
      node.parentNode.replaceChild(frag, node);
    }
    el.dataset.typed = 'wrapped';
    return el.querySelectorAll('.tc');
  }
  function typeOut(el) {
    const chars = wrapChars(el);
    if (!chars.length) return;
    el.classList.add('typing');
    const total = Math.min(1100, Math.max(450, chars.length * 34));
    const step = total / chars.length;
    chars.forEach((c, i) => setTimeout(() => c.classList.add('on'), i * step));
    setTimeout(() => el.classList.remove('typing'), total + 400);
  }
  const typeObserver = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { typeObserver.unobserve(e.target); typeOut(e.target); }
  }, { threshold: 0.35 });

  function prepareTyping(root) {
    root.querySelectorAll(TYPE_SEL).forEach((el) => {
      if (el.closest('dialog') || el.dataset.typed) return;
      wrapChars(el);
      typeObserver.observe(el);
    });
  }

  /* ---------- Counting numbers ---------- */
  const COUNT_SEL = '.news-stats b, .hub-stats b, .nf-ui-count p';
  function countUp(el) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) if (/\d/.test(walker.currentNode.nodeValue)) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const original = node.nodeValue;
      const targets = original.match(/\d+/g).map(Number);
      const dur = 1200, start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        let i = 0;
        node.nodeValue = original.replace(/\d+/g, () => String(Math.round(targets[i++] * eased)));
        if (p < 1) requestAnimationFrame(tick); else node.nodeValue = original;
      };
      requestAnimationFrame(tick);
    }
  }
  const countObserver = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { countObserver.unobserve(e.target); countUp(e.target); }
  }, { threshold: 0.6 });

  /* ---------- Gentle fade-ins ---------- */
  const REVEAL_SEL = [
    '.news-grid > *', '.headaches button', '.pain-result', '.example-links > a', '.stuff-more',
    '.story > div', '.notebook', '.check-note', '.implementation-price', '.call-invite', '.conversation',
    '.stuff-card', '.press-list li', '.hub-stats > div', '.news-stats > p', '.news-outlets li',
    '.hub-list li', '.hub-timeline li', '.case-benefits article', '.hub-flow article', '.case-point',
    '.stuff-shot', '.case-details', '.section-intro > p', '.hero-bottom', '.hero-work-piece'
  ].join(',');
  const revealObserver = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { revealObserver.unobserve(e.target); e.target.classList.add('in'); }
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  function prepareReveal() {
    const seen = new Map();
    document.querySelectorAll(REVEAL_SEL).forEach((el) => {
      if (el.closest('dialog') || el.classList.contains('rv')) return;
      el.classList.add('rv');
      const parent = el.parentElement;
      const n = seen.get(parent) || 0;
      seen.set(parent, n + 1);
      el.style.setProperty('--d', Math.min(n, 6) * 80 + 'ms');
      revealObserver.observe(el);
    });
  }

  function start() {
    prepareReveal();
    document.querySelectorAll(COUNT_SEL).forEach((el) => countObserver.observe(el));
    const gate = document.getElementById('slop-gate');
    const hero = document.querySelector('.hero h1');
    // The homepage hero waits until the intro screen closes, so the typing is seen.
    if (hero && gate && gate.open) {
      hero.dataset.typed = 'waiting';
      prepareTyping(document);
      gate.addEventListener('close', () => { hero.dataset.typed = ''; prepareTyping(document.querySelector('.hero')); }, { once: true });
    } else {
      prepareTyping(document);
    }
    // Switching between the short and full versions rewrites the hero; type the new words.
    const sw = document.getElementById('version-switch');
    if (sw && hero) sw.addEventListener('click', () => setTimeout(() => { hero.dataset.typed = ''; hero.removeAttribute('aria-label'); typeOut(hero); }, 30));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
