import Store from '../store.js';
import DOM from '../utils/domUtils.js';
import Format from '../utils/formatUtils.js';
import DateUtils from '../utils/dateUtils.js';

export function render(container) {
  const d = new Date();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  const stats = Store.getMonthlyStats(month, year);
  
  let html = `
    <div class="page page--monthly">
      <header class="page-header">
        <h1>Monthly Review - ${DateUtils.getMonthName(month)} ${year}</h1>
      </header>

      <div class="stats-grid" style="margin-top:20px;">
        <div class="stat-card card">
          <div class="stat-value">${stats.topicsCompleted}/${stats.topicsPlanned}</div>
          <div class="stat-label">Topics Completed</div>
        </div>
        <div class="stat-card card">
          <div class="stat-value">${stats.remainingTopics}</div>
          <div class="stat-label">Remaining Topics</div>
        </div>
        <div class="stat-card card">
          <div class="stat-value">${stats.questionsAttempted}</div>
          <div class="stat-label">Questions</div>
        </div>
        <div class="stat-card card">
          <div class="stat-value">${stats.studyHours.toFixed(1)}</div>
          <div class="stat-label">Study Hours</div>
        </div>
      </div>
      
      <div class="card" style="margin-top:20px;">
        <p class="text-muted" style="text-align:center;">Subject-wise chart and calendar heatmap will be integrated here.</p>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
}
