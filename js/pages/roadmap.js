import Store from '../store.js';
import DOM from '../utils/domUtils.js';
import Format from '../utils/formatUtils.js';
import DateUtils from '../utils/dateUtils.js';

export function render(container) {
  const daysRemaining = DateUtils.daysRemaining();
  const daysElapsed = DateUtils.daysSinceStart();
  const totalDays = DateUtils.totalPrepDays();
  const phase = DateUtils.getCurrentPhase();
  const phaseLabel = DateUtils.getPhaseLabel(phase);
  
  const overall = Store.getOverallProgress();
  
  let html = `
    <div class="page page--roadmap">
      <header class="page-header">
        <h1>Preparation Roadmap</h1>
        <div class="badge status-in-progress" style="font-size: 1.2em; padding: 10px;">
          ${daysRemaining} Days Remaining
        </div>
      </header>
      
      <div class="card" style="text-align:center;">
        <h2>Current Phase: ${phaseLabel}</h2>
        <div style="margin: 20px 0;">
          <div class="progress" style="height: 20px;">
            <div class="progress-bar" style="width: ${(daysElapsed / totalDays) * 100}%; background-color: var(--primary-color);"></div>
          </div>
          <div style="display:flex; justify-content:space-between; margin-top:5px; font-size:0.9em; color:var(--text-muted);">
            <span>Start (16 Aug)</span>
            <span>Day ${daysElapsed} of ${totalDays}</span>
            <span>End (30 Nov)</span>
          </div>
        </div>
      </div>
      
      <div class="stats-grid" style="margin-top:20px;">
        <div class="stat-card card">
          <div class="stat-label">Coverage</div>
          <div class="stat-value">${overall.coverage.toFixed(1)}%</div>
        </div>
        <div class="stat-card card">
          <div class="stat-label">Mastery</div>
          <div class="stat-value">${overall.mastery.toFixed(1)}%</div>
        </div>
      </div>
      
      <div class="card" style="margin-top:20px;">
        <h3>Milestones</h3>
        <ul class="list">
          <li class="list-item"><strong>Aug 31:</strong> Phase 1 Complete (Initial Coverage)</li>
          <li class="list-item"><strong>Oct 31:</strong> Phase 2 Complete (Main Syllabus Completion)</li>
          <li class="list-item"><strong>Nov 30:</strong> Phase 3 Complete (Revision & Practice)</li>
        </ul>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
}
