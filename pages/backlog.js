import Store from '../store.js';
import DOM from '../utils/domUtils.js';
import Format from '../utils/formatUtils.js';
import DateUtils from '../utils/dateUtils.js';
import Scheduler from '../scheduler.js';

export function render(container) {
  const backlog = Store.getAllBacklog();
  const pending = backlog.filter(b => b.status === 'pending');
  
  let html = `
    <div class="page page--backlog">
      <header class="page-header">
        <h1>Backlog Manager</h1>
      </header>
  `;
  
  if (pending.length > 5) {
    html += `
      <div class="alert alert-warning" style="margin-bottom: 20px;">
        <strong>Warning:</strong> Your backlog is increasing (${pending.length} items). Do not overload tomorrow. Use the next available buffer block.
      </div>
    `;
  }
  
  html += `<div class="card"><ul class="list">`;
  
  if (pending.length === 0) {
    html += `<li class="list-item"><p class="empty-state">No pending backlog items. Great work!</p></li>`;
  } else {
    pending.forEach(item => {
      html += `
        <li class="list-item" style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding:10px 0;">
          <div>
            <strong>${item.title}</strong>
            <div class="text-muted text-sm">Original Date: ${DateUtils.formatDate(item.originalDate)} | Priority: <span class="badge status-${item.priority}">${item.priority}</span></div>
          </div>
          <div class="actions" style="display:flex; gap:10px;">
            <button class="btn btn-sm btn-outline btn-reschedule" data-id="${item.id}">Reschedule</button>
            <button class="btn btn-sm btn-success btn-complete" data-id="${item.id}">Mark Complete</button>
          </div>
        </li>
      `;
    });
  }
  
  html += `</ul></div></div>`;
  container.innerHTML = html;
  attachEventListeners();
}

function attachEventListeners() {
  DOM.on(document, 'click', '.btn-complete', (e) => {
    const id = e.target.dataset.id;
    Store.updateBacklogItem(id, { status: 'completed' });
    render(DOM.$('#main-content'));
  });
  
  DOM.on(document, 'click', '.btn-reschedule', (e) => {
    const id = e.target.dataset.id;
    const content = `
      <div class="form-group">
        <label>Target Date</label>
        <input type="date" id="reschedule-date" class="input" value="${DateUtils.today()}">
      </div>
    `;
    DOM.modal(content, 'Reschedule Task', `
      <button class="btn btn-outline" onclick="DOM.closeModal()">Cancel</button>
      <button class="btn btn-primary" id="btn-confirm-reschedule">Confirm</button>
    `);
    
    DOM.$('#btn-confirm-reschedule').onclick = () => {
      const targetDate = DOM.$('#reschedule-date').value;
      Scheduler.rescheduleBacklogItem(id, targetDate);
      DOM.closeModal();
      DOM.toast('Task rescheduled');
      render(DOM.$('#main-content'));
    };
  });
}
