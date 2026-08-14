import Store from '../store.js';
import DateUtils from '../utils/dateUtils.js';
import Format from '../utils/formatUtils.js';
import DOM from '../utils/domUtils.js';
import Scheduler from '../scheduler.js';
import { renderTimer, renderTimerControls, startTimer, completeTimer } from '../components/timer.js';
import { renderDailyQuestion, attachDailyQuestionListeners } from '../components/dailyQuestion.js';

export function render(container) {
  const dateStr = DateUtils.today();
  const schedule = Scheduler.ensureTodaySchedule(dateStr);

  if (!schedule) {
    container.innerHTML = '<div class="page page--today"><p>No schedule available.</p></div>';
    return;
  }

  const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
  const startBlockId = urlParams.get('start');

  let blocksHtml = '';
  schedule.blocks.forEach(block => {
    const isActive = block.id === startBlockId || block.status === 'in-progress';
    const isCompleted = block.status === 'completed';
    const subject = block.subjectId ? Store.getSubject(block.subjectId) : null;
    const color = subject ? subject.color : 'var(--text-muted)';
    const title = subject ? subject.name + ' - ' + block.title : block.title;
    
    blocksHtml += `
      <div class="study-block ${isActive ? 'study-block--active' : ''} ${isCompleted ? 'study-block--completed' : ''}" data-id="${block.id}">
        <div class="study-block__time">${DateUtils.formatTime(block.startTime)} - ${DateUtils.formatTime(block.endTime)}</div>
        <div class="study-block__content" style="border-left: 4px solid ${color}; padding-left: 12px;">
          <h4 class="font-bold">${title}</h4>
          ${block.description ? `<p class="text-sm">${block.description}</p>` : ''}
          <div class="mt-2">
            ${Format.statusBadge(block.status)}
          </div>
        </div>
        <div class="study-block__actions">
          ${!isCompleted ? `
            <button class="btn btn--primary btn-sm btn-start-block" data-id="${block.id}" data-planned="${block.plannedDuration}">Start</button>
            <button class="btn btn--secondary btn-sm btn-complete-block" data-id="${block.id}" data-topic="${block.topicId}">Complete</button>
            <button class="btn btn--outline btn-sm btn-skip-block" data-id="${block.id}">Skip</button>
            <button class="btn btn--outline btn-sm btn-carry-block" data-id="${block.id}">Carry Forward</button>
          ` : ''}
        </div>
      </div>
    `;
  });

  const isSunday = DateUtils.isSunday(dateStr);

  container.innerHTML = `
    <div class="page page--today">
      <header class="today__header mb-6 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold">Today's Schedule</h1>
          <p class="text-muted">${DateUtils.formatDate(dateStr)}</p>
        </div>
        <div class="academy-toggle flex items-center gap-2">
          <label for="academy-switch">Academy Day</label>
          <input type="checkbox" id="academy-switch" ${schedule.academyStatus ? 'checked' : ''}>
        </div>
      </header>

      <div class="grid grid-cols-3 gap-6">
        <div class="col-span-2">
          <section class="today__timeline mb-6">
            <h2 class="text-xl font-semibold mb-4">Timeline</h2>
            <div class="timeline-container space-y-4">
              ${blocksHtml}
            </div>
          </section>
        </div>
        
        <div class="col-span-1 space-y-6">
          <section class="today__timer" id="timer-container">
            ${renderTimer()}
            <div class="mt-4">
              ${renderTimerControls()}
            </div>
          </section>

          <section class="today__question">
            ${renderDailyQuestion(dateStr)}
          </section>

          ${isSunday ? `
            <section class="today__essay card">
              <h3 class="card__title">Sunday Essay Workflow</h3>
              <button class="btn btn--primary w-full mt-2">Start Essay</button>
            </section>
          ` : ''}

          <section class="today__reflection card">
            <h3 class="card__title">End of Day Reflection</h3>
            <textarea class="form-input w-full mt-2" rows="3" placeholder="How did today go?"></textarea>
            <button class="btn btn--secondary w-full mt-2">Save Reflection</button>
          </section>
        </div>
      </div>
    </div>
  `;

  attachEventListeners(container, dateStr);
  
  if (startBlockId) {
    const block = schedule.blocks.find(b => b.id === startBlockId);
    if (block) {
      startTimer(startBlockId, dateStr, block.plannedDuration);
      DOM.$('#timer-container').innerHTML = renderTimer() + '<div class="mt-4">' + renderTimerControls() + '</div>';
    }
  }
}

function attachEventListeners(container, dateStr) {
  DOM.on(container, 'change', '#academy-switch', (e) => {
    Store.setAcademy(dateStr, e.target.checked);
    render(container); // Re-render to update timeline based on academy blocks
  });

  DOM.on(container, 'click', '.btn-start-block', (e) => {
    const id = e.target.dataset.id;
    const planned = parseInt(e.target.dataset.planned, 10) || 60;
    startTimer(id, dateStr, planned);
    Store.updateBlockStatus(dateStr, id, 'in-progress');
    render(container); // Re-render to show timer and active block
  });

  DOM.on(container, 'click', '.btn-complete-block', (e) => {
    const id = e.target.dataset.id;
    const topicId = e.target.dataset.topic;
    
    if (topicId && topicId !== 'undefined') {
      showMasteryModal(topicId, id, dateStr, container);
    } else {
      Store.updateBlockStatus(dateStr, id, 'completed');
      render(container);
    }
  });

  DOM.on(container, 'click', '.btn-skip-block', (e) => {
    const id = e.target.dataset.id;
    Store.updateBlockStatus(dateStr, id, 'skipped');
    Store.addToBacklog({ blockId: id, date: dateStr, reason: 'skipped' });
    DOM.toast('Block skipped and added to backlog', 'info');
    render(container);
  });

  DOM.on(container, 'click', '.btn-carry-block', (e) => {
    const id = e.target.dataset.id;
    Store.updateBlockStatus(dateStr, id, 'carried-forward');
    Store.addToBacklog({ blockId: id, date: dateStr, reason: 'carry-forward' });
    DOM.toast('Block carried forward to backlog', 'info');
    render(container);
  });

  attachDailyQuestionListeners(dateStr);
}

function showMasteryModal(topicId, blockId, dateStr, container) {
  const content = `
    <div class="mastery-selector space-y-2">
      <p>How well do you understand this topic?</p>
      <button class="btn btn--outline w-full text-left" onclick="window.selectMastery('Studied')">1. Studied (Initial reading)</button>
      <button class="btn btn--outline w-full text-left" onclick="window.selectMastery('Understood')">2. Understood (Conceptually clear)</button>
      <button class="btn btn--outline w-full text-left" onclick="window.selectMastery('Recalled')">3. Recalled (Can remember details)</button>
      <button class="btn btn--outline w-full text-left" onclick="window.selectMastery('Practiced')">4. Practiced (Can apply in answers)</button>
    </div>
  `;
  
  DOM.modal(content, 'Topic Mastery', '<button class="btn btn--secondary" onclick="DOM.closeModal()">Cancel</button>');
  
  window.selectMastery = (level) => {
    Store.updateTopicStatus(topicId, level);
    Scheduler.scheduleRevision(topicId);
    Store.updateBlockStatus(dateStr, blockId, 'completed');
    DOM.closeModal();
    render(container);
    DOM.toast('Topic mastery updated!', 'success');
  };
}
