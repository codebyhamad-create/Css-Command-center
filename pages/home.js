import Store from '../store.js';
import DateUtils from '../utils/dateUtils.js';
import Format from '../utils/formatUtils.js';
import DOM from '../utils/domUtils.js';
import Scheduler from '../scheduler.js';
import { renderStudyNow } from '../components/studyNow.js';
import { renderQuickActions, attachQuickActionListeners } from '../components/quickActions.js';
import { renderDailyQuestion, attachDailyQuestionListeners } from '../components/dailyQuestion.js';

let updateInterval;

export function render(container) {
  const dateStr = DateUtils.today();
  const schedule = Scheduler.ensureTodaySchedule(dateStr);
  
  if (!schedule) {
    container.innerHTML = `<div class="page page--home">
      <div class="empty-state">
        <h2>No Schedule Generated</h2>
        <p>Please import the syllabus to generate the study plan.</p>
        <button class="btn btn--primary" onclick="location.hash='syllabus'">Go to Syllabus</button>
      </div>
    </div>`;
    return;
  }

  const currentBlock = Scheduler.getCurrentBlock(dateStr);
  const nextBlock = Scheduler.getNextBlock(dateStr);
  const progress = Store.getOverallProgress();
  const daysRemaining = DateUtils.daysRemaining();
  const phase = DateUtils.getCurrentPhase();
  const greeting = DateUtils.getGreeting();
  const formattedDate = DateUtils.formatDate(dateStr);

  const syllabusImported = Store.getSubjects().length > 0;

  let heroContent = '';
  if (!syllabusImported) {
    heroContent = `
      <div class="card card--hero">
        <h2 class="hero__title">Welcome to CSS Command Center</h2>
        <p>Please import the official FPSC syllabus to generate the study plan.</p>
        <button class="btn btn--primary mt-4" id="btn-import-syllabus">Import Syllabus</button>
      </div>
    `;
  } else {
    heroContent = renderStudyNow(currentBlock, nextBlock, dateStr);
  }

  const html = `
    <div class="page page--home">
      <header class="home__header mb-6">
        <h1 class="text-2xl font-bold">${greeting}, &bull; ${formattedDate}</h1>
        <div class="badge badge--phase mt-2">PHASE ${phase} &bull; Initial Coverage &bull; ${daysRemaining} days remaining</div>
      </header>

      <section class="home__hero mb-6">
        ${heroContent}
      </section>

      <section class="home__stats grid grid-cols-4 gap-4 mb-6">
        <div class="card stat-card">
          <div class="stat-card__label">Study Hours</div>
          <div class="stat-card__value">${progress.totalStudyHours}h</div>
        </div>
        <div class="card stat-card">
          <div class="stat-card__label">Topics Completed</div>
          <div class="stat-card__value">${progress.coverage}%</div>
        </div>
        <div class="card stat-card">
          <div class="stat-card__label">Daily Question</div>
          <div class="stat-card__value">${Scheduler.getDailyQuestion(dateStr) ? 'Pending' : 'Done'}</div>
        </div>
        <div class="card stat-card">
          <div class="stat-card__label">Revision Sessions</div>
          <div class="stat-card__value">${progress.revisionSessions}</div>
        </div>
      </section>

      <section class="home__progress mb-6">
        <div class="card">
          <h3 class="card__title mb-4">Overall CSS Progress</h3>
          <div class="progress-stats grid grid-cols-2 gap-4">
            <div>
              <p>Coverage: ${progress.coverage}%</p>
              ${Format.progressBar(progress.coverage, 100, 'var(--accent-primary)')}
            </div>
            <div>
              <p>Mastery: ${progress.mastery}%</p>
              ${Format.progressBar(progress.mastery, 100, 'var(--accent-secondary)')}
            </div>
            <div>
              <p>Questions Attempted: ${progress.questionsAttempted}</p>
            </div>
            <div>
              <p>Essays Attempted: ${progress.essaysAttempted}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="home__daily-question mb-6">
        ${renderDailyQuestion(dateStr)}
      </section>

      <section class="home__quick-actions mb-6">
        ${renderQuickActions()}
      </section>
    </div>
  `;

  container.innerHTML = html;
  attachEventListeners(container, dateStr, currentBlock);
}

function attachEventListeners(container, dateStr, currentBlock) {
  if (updateInterval) clearInterval(updateInterval);
  updateInterval = setInterval(() => {
    // Re-render hero section to update time
    const current = Scheduler.getCurrentBlock(dateStr);
    const heroSection = container.querySelector('.home__hero');
    if (heroSection && Store.getSubjects().length > 0) {
      heroSection.innerHTML = renderStudyNow(current, Scheduler.getNextBlock(dateStr), dateStr);
      attachHeroListeners(container, current);
    }
  }, 60000);

  attachHeroListeners(container, currentBlock);
  attachQuickActionListeners();
  attachDailyQuestionListeners(dateStr);

  const importBtn = DOM.$('#btn-import-syllabus', container);
  if (importBtn) {
    DOM.on(container, 'click', '#btn-import-syllabus', () => {
      location.hash = 'syllabus';
    });
  }
}

function attachHeroListeners(container, currentBlock) {
  DOM.on(container, 'click', '#btn-start-study', () => {
    if (currentBlock) {
      location.hash = 'today?start=' + currentBlock.id;
    } else {
      location.hash = 'today';
    }
  });
}
