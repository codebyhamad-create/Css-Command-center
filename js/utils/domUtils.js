const DOM = {
  $(selector) { return document.querySelector(selector); },
  $$(selector) { return document.querySelectorAll(selector); },
  
  create(tag, className, content) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content) el.innerHTML = content;
    return el;
  },
  
  on(parentSelector, event, childSelector, handler) {
    // Event delegation
    const parent = typeof parentSelector === 'string' ? document.querySelector(parentSelector) : parentSelector;
    if (!parent) return;
    parent.addEventListener(event, (e) => {
      const target = e.target.closest(childSelector);
      if (target && parent.contains(target)) {
        handler(e, target);
      }
    });
  },
  
  show(selector) {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (el) el.style.display = '';
  },
  
  hide(selector) {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (el) el.style.display = 'none';
  },
  
  modal(content, title, footerHtml) {
    let overlay = document.getElementById('modal-container');
    overlay.innerHTML = `
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal">
          <div class="modal__header">
            <h3 class="modal__title">${title || ''}</h3>
            <button class="btn btn--ghost btn--icon modal__close" id="modal-close-btn">✕</button>
          </div>
          <div class="modal__body">${content}</div>
          ${footerHtml ? `<div class="modal__footer">${footerHtml}</div>` : ''}
        </div>
      </div>
    `;
    overlay.style.display = 'block';
    document.getElementById('modal-close-btn').addEventListener('click', () => DOM.closeModal());
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
      if (e.target.id === 'modal-overlay') DOM.closeModal();
    });
  },
  
  closeModal() {
    const overlay = document.getElementById('modal-container');
    overlay.innerHTML = '';
    overlay.style.display = 'none';
  },
  
  toast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `<span>${icons[type] || ''}</span> ${message}`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },
  
  confirm(message, title) {
    return new Promise((resolve) => {
      DOM.modal(
        `<p style="color: var(--text-secondary); font-size: 0.875rem;">${message}</p>`,
        title || 'Confirm',
        `<button class="btn btn--secondary" id="confirm-cancel">Cancel</button>
         <button class="btn btn--primary" id="confirm-ok">Confirm</button>`
      );
      document.getElementById('confirm-ok').addEventListener('click', () => { DOM.closeModal(); resolve(true); });
      document.getElementById('confirm-cancel').addEventListener('click', () => { DOM.closeModal(); resolve(false); });
    });
  }
};

export default DOM;
