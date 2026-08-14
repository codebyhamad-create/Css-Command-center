import Store from '../store.js';
import DOM from '../utils/domUtils.js';

export function renderEssaySession(dateStr) {
  let html = `
    <div class="card essay-session" style="margin-top: 20px; border-top: 4px solid var(--accent-color);">
      <h3>Sunday Essay Session</h3>
      <p class="text-muted">Dedicate time to essay practice today.</p>
      
      <div id="essay-stages" style="display:none; margin-top:15px;">
        <div class="stage" id="stage-brainstorm">
          <h4>1. Brainstorm (15m)</h4>
          <textarea class="input" rows="4" placeholder="Jot down ideas..."></textarea>
          <button class="btn btn-sm btn-primary mt-2">Complete Brainstorm</button>
        </div>
      </div>
      
      <button class="btn btn-primary" id="btn-start-sunday-essay">Start Session</button>
    </div>
  `;
  return html;
}

export function attachEssayListeners() {
  DOM.on(document, 'click', '#btn-start-sunday-essay', (e) => {
    e.target.style.display = 'none';
    const stages = document.getElementById('essay-stages');
    if (stages) stages.style.display = 'block';
  });
}
