import Store from '../store.js';
import DOM from '../utils/domUtils.js';
import Format from '../utils/formatUtils.js';
import DateUtils from '../utils/dateUtils.js';
import { renderEssaySession } from '../components/essaySession.js';

export function render(container) {
  const essays = Store.getEssays();
  
  let html = `
    <div class="page page--essays">
      <header class="page-header">
        <h1>Essay History</h1>
        <button id="btn-new-essay" class="btn btn-primary">+ New Essay</button>
      </header>

      <div class="stats-grid">
        <div class="stat-card card">
          <div class="stat-value">${essays.length}</div>
          <div class="stat-label">Total Essays</div>
        </div>
        <div class="stat-card card">
          <div class="stat-value">${essays.filter(e => e.brainstorm).length}</div>
          <div class="stat-label">Brainstorms</div>
        </div>
        <div class="stat-card card">
          <div class="stat-value">${essays.filter(e => e.outline).length}</div>
          <div class="stat-label">Outlines</div>
        </div>
        <div class="stat-card card">
          <div class="stat-value">${essays.filter(e => e.fullEssay).length}</div>
          <div class="stat-label">Full Essays</div>
        </div>
      </div>

      <div class="essay-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-top:20px;">
  `;
  
  if (essays.length === 0) {
    html += `<div class="card" style="grid-column: 1/-1"><p class="empty-state">No essays yet.</p></div>`;
  } else {
    essays.sort((a,b) => new Date(b.date) - new Date(a.date)).forEach(essay => {
      html += `
        <div class="card essay-card">
          <h4>${essay.topic}</h4>
          <p class="text-muted">${DateUtils.formatDate(essay.date)} • ${essay.category}</p>
          <div class="essay-stages" style="display:flex; gap: 5px; margin-top:10px;">
            <span class="badge ${essay.brainstorm ? 'status-completed' : 'status-not-started'}">Brainstorm</span>
            <span class="badge ${essay.outline ? 'status-completed' : 'status-not-started'}">Outline</span>
            <span class="badge ${essay.fullEssay ? 'status-completed' : 'status-not-started'}">Full</span>
          </div>
        </div>
      `;
    });
  }
  
  html += `
      </div>
      <div id="essay-session-container"></div>
    </div>
  `;
  
  container.innerHTML = html;
  attachEventListeners();
}

function attachEventListeners() {
  DOM.on(document, 'click', '#btn-new-essay', () => {
    const content = `
      <form id="form-new-essay">
        <div class="form-group">
          <label>Topic</label>
          <input type="text" id="e-topic" class="input" required>
        </div>
        <div class="form-group">
          <label>Category</label>
          <select id="e-category" class="input">
            <option>Social</option>
            <option>Political</option>
            <option>Philosophical</option>
            <option>Science</option>
            <option>Pakistan</option>
            <option>International</option>
            <option>General</option>
          </select>
        </div>
        <div class="form-group">
          <label>Mode</label>
          <select id="e-mode" class="input">
            <option value="full">Full Essay</option>
            <option value="brainstorm">Brainstorm Only</option>
            <option value="outline">Outline Only</option>
          </select>
        </div>
      </form>
    `;
    
    DOM.modal(content, 'Start New Essay', `
      <button class="btn btn-outline" onclick="DOM.closeModal()">Cancel</button>
      <button class="btn btn-primary" id="btn-start-essay">Start</button>
    `);
    
    DOM.$('#btn-start-essay').onclick = () => {
      const essay = {
        topic: DOM.$('#e-topic').value,
        category: DOM.$('#e-category').value,
        mode: DOM.$('#e-mode').value,
        date: DateUtils.today()
      };
      if(essay.topic) {
        Store.saveEssay(essay);
        DOM.closeModal();
        render(DOM.$('#main-content'));
      }
    };
  });
}
