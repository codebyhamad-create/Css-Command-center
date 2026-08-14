import Store from '../store.js';
import DOM from '../utils/domUtils.js';

export function renderReflection(dateStr) {
  const existing = Store.getReflection(dateStr);
  
  if (existing) {
    return `
      <div class="card reflection-card">
        <h3>Daily Reflection Saved</h3>
        <p>Rating: ${existing.rating}/10</p>
        <p class="text-muted">Great job wrapping up the day!</p>
      </div>
    `;
  }
  
  return `
    <div class="card reflection-card" style="background-color: var(--card-alt-bg);">
      <h3>End of Day Reflection</h3>
      <div class="form-group mt-2">
        <label>How productive was today?</label>
        <input type="range" id="ref-rating" min="1" max="10" value="5" class="input" style="width:100%">
        <div style="display:flex; justify-content:space-between;" class="text-sm">
          <span>1 (Poor)</span><span>10 (Excellent)</span>
        </div>
      </div>
      <div class="form-group mt-2">
        <label>Any blockers or thoughts?</label>
        <textarea id="ref-reason" class="input" rows="2"></textarea>
      </div>
      <button class="btn btn-primary" id="btn-save-reflection" data-date="${dateStr}">Save Reflection</button>
    </div>
  `;
}

export function attachReflectionListeners(dateStr) {
  DOM.on(document, 'click', '#btn-save-reflection', (e) => {
    const rating = DOM.$('#ref-rating').value;
    const reason = DOM.$('#ref-reason').value;
    Store.saveReflection(dateStr, { rating, reason, completed: [], failed: [], carryForward: [] });
    DOM.toast('Reflection saved');
    // Ideally re-render the section, simpler to reload or dispatch event
    location.reload(); 
  });
}
