import Store from '../store.js';
import Scheduler from '../scheduler.js';
import DateUtils from '../utils/dateUtils.js';
import DOM from '../utils/domUtils.js';
import Format from '../utils/formatUtils.js';

let questionTimer = { running: false, elapsed: 0, intervalId: null };

export function renderDailyQuestion(dateStr) {
  const schedule = Store.getSchedule(dateStr);
  const studyBlocks = schedule ? schedule.blocks.filter(b => (b.type === 'study' || b.type === 'revision') && b.subjectId) : [];
  const question = Scheduler.getDailyQuestion(dateStr);
  
  if (!question) {
    return `<div class="card border-t-4 border-t-gray-400 shadow-md">
      <div class="card__header border-b pb-3 mb-4">
        <h3 class="card__title text-lg font-bold flex items-center"><span class="mr-2">📝</span> Daily CSS Question</h3>
      </div>
      <div class="empty-state text-center py-6">
        <div class="empty-state__icon text-4xl mb-3">❓</div>
        <div class="empty-state__title text-xl font-semibold mb-2">No Questions Available</div>
        <div class="empty-state__text text-gray-500 mb-4 max-w-md mx-auto">Add past paper questions to enable the daily question feature. Questions will be linked to your study topics.</div>
        <button class="btn btn--secondary" onclick="location.hash='pastPapers'">Add Past Papers</button>
      </div>
    </div>`;
  }
  
  const subject = Store.getSubject(question.subjectId);
  const relatedBlock = studyBlocks.find(b => b.subjectId === question.subjectId);
  const relatedTopic = relatedBlock ? relatedBlock.title : 'Today\'s study';
  
  return `<div class="card border-t-4 border-t-blue-500 shadow-md relative">
    <div class="card__header flex justify-between items-center border-b pb-3 mb-4">
      <h3 class="card__title text-lg font-bold flex items-center"><span class="mr-2">📝</span> Daily Question</h3>
      <span class="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded">Related to: ${subject ? subject.name : 'CSS'} → ${relatedTopic}</span>
    </div>
    
    <div class="question-content mb-6">
      <p class="text-lg text-gray-800 leading-relaxed font-serif">${question.text}</p>
    </div>
    
    <div class="flex items-center text-sm text-gray-500 mb-6 gap-4">
      ${question.year ? `<div><span class="font-semibold text-gray-700">Year:</span> ${question.year}</div>` : ''}
      ${question.marks ? `<div><span class="font-semibold text-gray-700">Marks:</span> ${question.marks}</div>` : ''}
      <div><span class="font-semibold text-gray-700">Recommended Time:</span> ${question.recommendedTime || 35} mins</div>
    </div>
    
    <div id="question-active-area" class="bg-gray-50 rounded-lg p-4 border border-gray-100">
      ${questionTimer.running ? `
        <div class="text-center mb-4">
          <div class="text-sm font-semibold text-gray-500 mb-1">Time Elapsed</div>
          <div id="question-timer-display" class="text-4xl font-mono font-bold text-blue-600 pulse">00:00</div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div class="text-sm font-semibold text-center col-span-3 mb-1">How did you do?</div>
          <button class="btn btn--outline border-green-500 text-green-700 hover:bg-green-50" onclick="window.completeQuestionAttempt('${question.id}', 'Strong')">Strong</button>
          <button class="btn btn--outline border-yellow-500 text-yellow-700 hover:bg-yellow-50" onclick="window.completeQuestionAttempt('${question.id}', 'Needs Improvement')">Needs Improvement</button>
          <button class="btn btn--outline border-red-500 text-red-700 hover:bg-red-50" onclick="window.completeQuestionAttempt('${question.id}', 'Weak')">Weak</button>
        </div>
      ` : `
        <button class="btn btn--primary w-full py-3 text-lg font-semibold shadow-sm" onclick="window.startQuestionAttempt('${question.id}')">START ATTEMPT</button>
      `}
    </div>
  </div>`;
}

export function startQuestionAttempt(questionId) {
  if (questionTimer.running) return;
  
  questionTimer.running = true;
  questionTimer.elapsed = 0;
  
  // Re-render part of UI without full page refresh to show timer
  const activeArea = document.getElementById('question-active-area');
  if (activeArea) {
    activeArea.innerHTML = `
      <div class="text-center mb-4">
        <div class="text-sm font-semibold text-gray-500 mb-1">Time Elapsed</div>
        <div id="question-timer-display" class="text-4xl font-mono font-bold text-blue-600 pulse">00:00</div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div class="text-sm font-semibold text-center col-span-3 mb-1 mt-2">How did you do?</div>
        <button class="btn btn--outline border-green-500 text-green-700 hover:bg-green-50" onclick="window.completeQuestionAttempt('${questionId}', 'Strong')">Strong</button>
        <button class="btn btn--outline border-yellow-500 text-yellow-700 hover:bg-yellow-50" onclick="window.completeQuestionAttempt('${questionId}', 'Needs Improvement')">Needs Improvement</button>
        <button class="btn btn--outline border-red-500 text-red-700 hover:bg-red-50" onclick="window.completeQuestionAttempt('${questionId}', 'Weak')">Weak</button>
      </div>
    `;
  }
  
  questionTimer.intervalId = setInterval(() => {
    questionTimer.elapsed++;
    const display = document.getElementById('question-timer-display');
    if (display) {
      const m = Math.floor(questionTimer.elapsed / 60);
      const s = questionTimer.elapsed % 60;
      display.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }
  }, 1000);
}

export function completeQuestionAttempt(questionId, status) {
  clearInterval(questionTimer.intervalId);
  questionTimer.running = false;
  
  // Update question status in store
  Store.updateQuestion(questionId, {
    status,
    attemptDate: DateUtils.today(),
    timeSpent: Math.round(questionTimer.elapsed / 60)
  });
  
  const today = DateUtils.today();
  const schedule = Store.getSchedule(today);
  if (schedule) {
    const questionBlock = schedule.blocks.find(b => b.type === 'question');
    if (questionBlock) {
      Store.updateBlockStatus(today, questionBlock.id, 'completed', Math.round(questionTimer.elapsed / 60));
    }
  }
  
  DOM.toast('Question attempt recorded!', 'success');
  
  // Re-render the daily question section
  const questionSection = document.querySelector('.home__daily-question') || document.querySelector('.today__question');
  if (questionSection) {
    questionSection.innerHTML = renderDailyQuestion(today);
  }
}

export function attachDailyQuestionListeners(dateStr) {
  window.startQuestionAttempt = startQuestionAttempt;
  window.completeQuestionAttempt = completeQuestionAttempt;
}
