import Store from '../store.js';
import DOM from '../utils/domUtils.js';

export function render(container) {
  const settings = Store.getSettings();
  
  let html = `
    <div class="page page--settings">
      <header class="page-header">
        <h1>Settings</h1>
      </header>

      <div class="card form-section">
        <h3>Schedule Settings</h3>
        <div class="form-group">
          <label>Daily Study Hours Target</label>
          <input type="number" id="s-hours" class="input" value="${settings.dailyStudyHoursTarget || 6}">
        </div>
        <div class="form-group">
          <label>Study Start Time</label>
          <input type="time" id="s-start" class="input" value="${settings.studyStartTime || '06:00'}">
        </div>
        <div class="form-group">
          <label>Study End Time</label>
          <input type="time" id="s-end" class="input" value="${settings.studyEndTime || '22:00'}">
        </div>
      </div>
      
      <div class="card form-section" style="margin-top: 20px;">
        <h3>Data Management</h3>
        <div style="display:flex; gap:10px;">
          <button class="btn btn-outline" id="btn-export">Export Data</button>
          <button class="btn btn-danger" id="btn-reset">Reset All Data</button>
        </div>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
  attachEventListeners();
}

function attachEventListeners() {
  const inputs = ['s-hours', 's-start', 's-end'];
  inputs.forEach(id => {
    const el = DOM.$('#' + id);
    if(el) {
      el.addEventListener('change', () => {
        const settings = Store.getSettings();
        settings.dailyStudyHoursTarget = parseFloat(DOM.$('#s-hours').value);
        settings.studyStartTime = DOM.$('#s-start').value;
        settings.studyEndTime = DOM.$('#s-end').value;
        Store.updateSettings(settings);
        DOM.toast('Settings saved');
      });
    }
  });

  DOM.on(document, 'click', '#btn-reset', () => {
    if(confirm('Are you sure you want to delete all data? This cannot be undone.')) {
      Store.clearAllData();
      DOM.toast('All data reset');
      location.reload();
    }
  });
  
  DOM.on(document, 'click', '#btn-export', () => {
    const data = JSON.stringify(localStorage);
    const blob = new Blob([data], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'css_tracker_backup.json';
    a.click();
    DOM.toast('Data exported');
  });
}
