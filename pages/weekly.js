import Store from '../store.js';
import DOM from '../utils/domUtils.js';
import Format from '../utils/formatUtils.js';
import DateUtils from '../utils/dateUtils.js';

export function render(container) {
  const weekStart = DateUtils.getWeekStart(DateUtils.today());
  const stats = Store.getWeeklyStats(weekStart);
  
  let html = `
    <div class="page page--weekly">
      <header class="page-header">
        <h1>Weekly Review</h1>
        <div class="week-selector text-muted">
          Week starting: ${DateUtils.formatDateShort(weekStart)}
        </div>
      </header>

      <div class="card execution-score" style="text-align:center; padding: 30px;">
        <h2>Weekly Execution Score</h2>
        <div style="font-size: 3em; font-weight:bold; color: var(--primary-color); margin: 20px 0;">
          ${stats.scores.overall}%
        </div>
        <div style="display:flex; justify-content:center; gap: 20px;">
          <span>Syllabus: ${stats.scores.syllabus}%</span>
          <span>Questions: ${stats.scores.questions}%</span>
          <span>Revision: ${stats.scores.revision}%</span>
          <span>Study Hours: ${stats.scores.studyHours}%</span>
        </div>
      </div>

      <div class="stats-grid" style="margin-top:20px;">
        <div class="stat-card card">
          <div class="stat-value">${stats.topicsCompleted}/${stats.topicsPlanned}</div>
          <div class="stat-label">Topics</div>
        </div>
        <div class="stat-card card">
          <div class="stat-value">${stats.questionsAttempted}</div>
          <div class="stat-label">Questions</div>
        </div>
        <div class="stat-card card">
          <div class="stat-value">${stats.essaysAttempted}</div>
          <div class="stat-label">Essays</div>
        </div>
        <div class="stat-card card">
          <div class="stat-value">${stats.studyHours.toFixed(1)}</div>
          <div class="stat-label">Study Hours</div>
        </div>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
}
