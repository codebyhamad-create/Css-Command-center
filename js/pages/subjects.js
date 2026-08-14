import Store from '../store.js';
import DOM from '../utils/domUtils.js';
import Format from '../utils/formatUtils.js';

export function render(container) {
  const subjects = Store.getSubjects();
  const overall = Store.getOverallProgress();

  let html = `
    <div class="page page--subjects">
      <header class="page-header">
        <h1>Subject Progress</h1>
      </header>

      <div class="card overall-progress">
        <h2>Overall Preparation</h2>
        <div class="progress-stats">
          <div class="stat-box">
            <span class="label">Coverage</span>
            <span class="value">${Format.percentage(overall.coverage)}</span>
            ${Format.progressBar(overall.coverage, 100, 'var(--primary-color)')}
          </div>
          <div class="stat-box">
            <span class="label">Mastery</span>
            <span class="value">${Format.percentage(overall.mastery)}</span>
            ${Format.progressBar(overall.mastery, 100, 'var(--accent-color)')}
          </div>
        </div>
      </div>
  `;

  const comp = subjects.filter(s => s.type === 'compulsory');
  const opt = subjects.filter(s => s.type === 'optional');

  html += renderSection('Compulsory Subjects', comp, 0);
  html += renderSection('Optional Subjects', opt, comp.length);

  html += `</div>`;
  container.innerHTML = html;
  attachEventListeners();
}

function renderSection(title, subjectsList, colorOffset) {
  if (subjectsList.length === 0) return '';
  
  let html = `
    <section class="subject-section">
      <h3>${title}</h3>
      <div class="subject-grid">
  `;
  
  subjectsList.forEach((subject, idx) => {
    const progress = Store.getSubjectProgress(subject.id);
    const color = Format.subjectColor(idx + colorOffset);
    
    // Determine status color
    let statusColor = 'var(--success-color)';
    if (progress.coverage < 30) statusColor = 'var(--danger-color)';
    else if (progress.coverage < 70) statusColor = 'var(--warning-color)';

    html += `
      <div class="card subject-card" style="border-top: 4px solid ${color}">
        <div class="subject-card-header">
          <h4>${subject.name}</h4>
        </div>
        <div class="subject-stats">
          <div class="stat-row">
            <span>Coverage (${progress.completedTopics}/${progress.totalTopics})</span>
            <span>${Format.percentage(progress.coverage)}</span>
          </div>
          ${Format.progressBar(progress.coverage, 100, color)}
          
          <div class="stat-row" style="margin-top:10px;">
            <span>Mastery</span>
            <span>${Format.percentage(progress.mastery)}</span>
          </div>
          ${Format.progressBar(progress.mastery, 100, statusColor)}
        </div>
      </div>
    `;
  });
  
  html += `
      </div>
    </section>
  `;
  
  return html;
}

function attachEventListeners() {
  // Can add click events to drill down into a subject
}
