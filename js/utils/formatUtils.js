/* 
Note: The following CSS classes need to be defined in your stylesheets:
.mastery-step { ... }
.mastery-step--complete { ... }
.mastery-step--current { ... }
.mastery-step--pending { ... }
.mastery-arrow { ... }
*/

const Format = {
  duration(minutes) {
    if (!minutes && minutes !== 0) return '0m';
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  },
  
  percentage(value) {
    return `${Math.round(value)}%`;
  },
  
  progressBar(value, max, color, size) {
    const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
    const sizeClass = size === 'lg' ? 'progress--lg' : size === 'sm' ? 'progress--sm' : '';
    return `
      <div class="progress ${sizeClass}">
        <div class="progress__fill" style="width: ${pct}%; background: ${color || 'var(--accent-primary)'}"></div>
      </div>
    `;
  },
  
  progressBarWithLabel(label, value, max, color) {
    const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
    return `
      <div class="progress__label">
        <span>${label}</span>
        <span>${pct}%</span>
      </div>
      ${this.progressBar(value, max, color)}
    `;
  },
  
  statusBadge(status) {
    const map = {
      'not-started': { class: 'badge--neutral', label: 'Not Started' },
      'in-progress': { class: 'badge--info', label: 'In Progress' },
      'completed': { class: 'badge--success', label: 'Completed' },
      'skipped': { class: 'badge--warning', label: 'Skipped' },
      'carried-forward': { class: 'badge--danger', label: 'Carried Forward' },
      'studied': { class: 'badge--info', label: 'Studied' },
      'understood': { class: 'badge--info', label: 'Understood' },
      'recalled': { class: 'badge--purple', label: 'Recalled' },
      'practiced': { class: 'badge--warning', label: 'Practiced' },
      'revised': { class: 'badge--success', label: 'Revised' },
      'mastered': { class: 'badge--success', label: 'Mastered' },
      'not-attempted': { class: 'badge--neutral', label: 'Not Attempted' },
      'attempted': { class: 'badge--info', label: 'Attempted' },
      'strong': { class: 'badge--success', label: 'Strong' },
      'weak': { class: 'badge--danger', label: 'Weak' },
      'needs-improvement': { class: 'badge--warning', label: 'Needs Improvement' },
      'pending': { class: 'badge--warning', label: 'Pending' },
      'rescheduled': { class: 'badge--info', label: 'Rescheduled' }
    };
    const info = map[status] || { class: 'badge--neutral', label: status };
    return `<span class="badge ${info.class}">${info.label}</span>`;
  },
  
  truncate(str, maxLen) {
    if (!str) return '';
    return str.length > maxLen ? str.substring(0, maxLen) + '…' : str;
  },
  
  subjectColor(index) {
    return `var(--subject-${(index % 11) + 1})`;
  },
  
  masterySteps(currentStatus) {
    const steps = ['not-started', 'studied', 'understood', 'recalled', 'practiced', 'revised', 'mastered'];
    const labels = ['Not Started', 'Studied', 'Understood', 'Recalled', 'Practiced', 'Revised', 'Mastered'];
    const currentIdx = steps.indexOf(currentStatus);
    return steps.map((step, i) => {
      const state = i < currentIdx ? 'complete' : i === currentIdx ? 'current' : 'pending';
      return `<span class="mastery-step mastery-step--${state}" title="${labels[i]}">${labels[i]}</span>`;
    }).join('<span class="mastery-arrow">→</span>');
  }
};

export default Format;
