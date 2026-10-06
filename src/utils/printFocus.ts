/**
 * Print only what matters.
 *
 * Any element carrying `data-print-area` (optionally with `data-print-title`) is the ONLY thing printed:
 * right before the browser opens its print dialog (button click OR Ctrl/Cmd+P) every other branch of the
 * page is switched to display:none, and restored afterwards. Pages without a marked area still lose the
 * header, navigation, footer, guides, FAQ and toasts through the print stylesheet in index.css.
 */
export function installPrintFocus(): void {
  if (typeof window === 'undefined') return;
  let hidden: HTMLElement[] = [];
  let active = false;

  const before = () => {
    if (active) return;
    active = true;
    const target = document.querySelector<HTMLElement>('[data-print-area]');
    if (!target) return;
    let node: HTMLElement | null = target;
    while (node && node !== document.body && node.parentElement) {
      for (const sib of Array.from(node.parentElement.children)) {
        if (sib !== node && sib instanceof HTMLElement && !/^(SCRIPT|STYLE|LINK|META)$/.test(sib.tagName)) {
          sib.setAttribute('data-print-hidden', '');
          hidden.push(sib);
        }
      }
      node = node.parentElement;
    }
  };

  const after = () => {
    hidden.forEach((el) => el.removeAttribute('data-print-hidden'));
    hidden = [];
    active = false;
  };

  window.addEventListener('beforeprint', before);
  window.addEventListener('afterprint', after);
  // Safari fires matchMedia('print') changes instead of beforeprint/afterprint in some versions
  const mql = window.matchMedia?.('print');
  mql?.addEventListener?.('change', (e) => (e.matches ? before() : after()));
}
