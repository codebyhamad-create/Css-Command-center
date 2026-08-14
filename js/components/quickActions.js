import { getTimerState } from './timer.js';
import DOM from '../utils/domUtils.js';

export function renderQuickActions() {
  const timerState = getTimerState();
  const actions = [
    { label: 'Start Current Task', icon: '▶', route: 'today', id: 'qa-start' },
    { label: 'Mark Complete', icon: '✓', id: 'qa-complete' },
    { label: 'Daily Question', icon: '❓', route: 'today', id: 'qa-question' },
    { label: 'Start Timer', icon: '⏱', id: 'qa-timer' },
    { label: 'View Today', icon: '📅', route: 'today', id: 'qa-today' },
    { label: 'Syllabus', icon: '📚', route: 'syllabus', id: 'qa-syllabus' },
    { label: 'Backlog', icon: '📋', route: 'backlog', id: 'qa-backlog' },
    { label: 'Progress', icon: '📊', route: 'subjects', id: 'qa-progress' },
    { label: 'This Week', icon: '📆', route: 'weekly', id: 'qa-week' },
    { label: 'This Month', icon: '📈', route: 'monthly', id: 'qa-month' },
    { label: 'Review Week', icon: '🔍', route: 'weekly', id: 'qa-review' }
  ];
  
  return `
    <div class="card p-4">
      <h3 class="card__title mb-4">Quick Actions</h3>
      <div class="quick-actions grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        ${actions.map(a => `
          <button class="btn btn--outline quick-action flex flex-col items-center justify-center p-3 h-20 hover:bg-gray-50 transition-colors" data-route="${a.route || ''}" data-action="${a.id}" id="${a.id}">
            <span class="text-2xl mb-1">${a.icon}</span>
            <span class="text-xs font-medium text-center leading-tight">${a.label}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

export function attachQuickActionListeners() {
  document.querySelectorAll('.quick-action').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget;
      const route = target.dataset.route;
      const action = target.dataset.action;
      
      if (route) {
        location.hash = route;
      } else if (action === 'qa-complete') {
        const timerState = getTimerState();
        if (timerState.running) {
          import('./timer.js').then(m => m.completeTimer());
          DOM.toast('Task completed!', 'success');
        } else {
          DOM.toast('No active task to complete', 'info');
        }
      } else if (action === 'qa-timer') {
        location.hash = 'today';
      }
    });
  });
}
