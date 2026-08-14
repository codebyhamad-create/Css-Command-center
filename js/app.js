/**
 * CSS Command Center — Main Application
 * Entry point that initializes the app, sets up routing, and manages global state.
 */

import Store from './store.js';
import Router from './router.js';
import Scheduler from './scheduler.js';
import DateUtils from './utils/dateUtils.js';
import DOM from './utils/domUtils.js';

// Import page renderers
import { render as renderHome } from './pages/home.js';
import { render as renderToday } from './pages/today.js';
import { render as renderSyllabus } from './pages/syllabus.js';
import { render as renderSubjects } from './pages/subjects.js';
import { render as renderPastPapers } from './pages/pastPapers.js';
import { render as renderEssays } from './pages/essays.js';
import { render as renderBacklog } from './pages/backlog.js';
import { render as renderWeekly } from './pages/weekly.js';
import { render as renderMonthly } from './pages/monthly.js';
import { render as renderRoadmap } from './pages/roadmap.js';
import { render as renderSettings } from './pages/settings.js';

/**
 * Application initialization
 */
class App {
  constructor() {
    this.updateInterval = null;
    this.initialized = false;
  }

  async init() {
    try {
      // Initialize the data store
      Store.init();

      // Set up the router with all page routes
      const mainContent = document.getElementById('main-content');
      Router.init(mainContent, {
        'home': renderHome,
        'today': renderToday,
        'syllabus': renderSyllabus,
        'subjects': renderSubjects,
        'pastPapers': renderPastPapers,
        'essays': renderEssays,
        'backlog': renderBacklog,
        'weekly': renderWeekly,
        'monthly': renderMonthly,
        'roadmap': renderRoadmap,
        'settings': renderSettings
      });

      // Set up sidebar navigation
      this.setupSidebar();

      // Set up mobile menu
      this.setupMobileMenu();

      // Ensure today's schedule exists
      this.ensureTodaySchedule();

      // Update sidebar progress
      this.updateSidebarProgress();

      // Set up periodic updates (every 60 seconds)
      this.updateInterval = setInterval(() => {
        this.periodicUpdate();
      }, 60000);

      // Listen for data changes to update sidebar
      Store.on('dataChanged', () => {
        this.updateSidebarProgress();
      });

      // Mark as initialized
      this.initialized = true;

      // Hide loader
      this.hideLoader();

      console.log('✅ CSS Command Center initialized successfully');
      console.log(`📅 Today: ${DateUtils.formatDate(DateUtils.today())}`);
      console.log(`📊 Phase: ${DateUtils.getCurrentPhase()} — ${DateUtils.getPhaseLabel(DateUtils.getCurrentPhase())}`);
      console.log(`⏳ Days remaining: ${DateUtils.daysRemaining()}`);

    } catch (error) {
      console.error('❌ Failed to initialize CSS Command Center:', error);
      this.showError(error);
    }
  }

  /**
   * Hide the loading screen
   */
  hideLoader() {
    const loader = document.getElementById('app-loader');
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 400);
    }
  }

  /**
   * Show error state
   */
  showError(error) {
    const loader = document.getElementById('app-loader');
    if (loader) {
      loader.innerHTML = `
        <div style="color: var(--text-danger, #ef4444); font-size: 2rem; margin-bottom: 16px;">⚠️</div>
        <div style="color: var(--text-primary, #f1f5f9); font-size: 1.125rem; font-weight: 600; margin-bottom: 8px;">
          Failed to Initialize
        </div>
        <div style="color: var(--text-secondary, #94a3b8); font-size: 0.875rem; max-width: 400px; text-align: center;">
          ${error.message || 'An unexpected error occurred. Please refresh the page.'}
        </div>
        <button onclick="location.reload()" style="margin-top: 16px; padding: 10px 24px; background: var(--accent-primary, #10b981); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
          Refresh
        </button>
      `;
    }
  }

  /**
   * Set up sidebar navigation click handling
   */
  setupSidebar() {
    const sidebar = document.getElementById('sidebar-nav');
    if (!sidebar) return;

    sidebar.addEventListener('click', (e) => {
      const navItem = e.target.closest('.sidebar__nav-item');
      if (navItem) {
        e.preventDefault();
        const route = navItem.dataset.route;
        if (route) {
          Router.navigate(route);
          // Close mobile sidebar if open
          document.body.classList.remove('sidebar-open');
          const overlay = document.getElementById('sidebar-overlay');
          if (overlay) overlay.style.display = 'none';
        }
      }
    });
  }

  /**
   * Set up mobile hamburger menu
   */
  setupMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const overlay = document.getElementById('sidebar-overlay');

    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        document.body.classList.toggle('sidebar-open');
        if (overlay) {
          overlay.style.display = document.body.classList.contains('sidebar-open') ? 'block' : 'none';
        }
      });
    }

    if (overlay) {
      overlay.addEventListener('click', () => {
        document.body.classList.remove('sidebar-open');
        overlay.style.display = 'none';
      });
    }
  }

  /**
   * Ensure today's schedule is generated
   */
  ensureTodaySchedule() {
    const topics = Store.getTopics();
    if (topics.length > 0) {
      Scheduler.ensureTodaySchedule();
    }
  }

  /**
   * Update sidebar progress indicators
   */
  updateSidebarProgress() {
    const progress = Store.getOverallProgress();

    const coverageEl = document.getElementById('sidebar-coverage');
    const coverageBar = document.getElementById('sidebar-coverage-bar');
    const masteryEl = document.getElementById('sidebar-mastery');
    const masteryBar = document.getElementById('sidebar-mastery-bar');
    const daysEl = document.getElementById('sidebar-days-remaining');

    if (coverageEl) coverageEl.textContent = `${progress.coverage}%`;
    if (coverageBar) coverageBar.style.width = `${progress.coverage}%`;
    if (masteryEl) masteryEl.textContent = `${progress.mastery}%`;
    if (masteryBar) masteryBar.style.width = `${progress.mastery}%`;

    if (daysEl) {
      const days = DateUtils.daysRemaining();
      const phase = DateUtils.getCurrentPhase();
      daysEl.innerHTML = `
        <span style="color: var(--accent-primary); font-weight: 700;">${days}</span> days remaining
        <br>
        <span class="phase-badge phase-badge--${phase}" style="margin-top: 6px; display: inline-flex;">
          Phase ${phase}
        </span>
      `;
    }
  }

  /**
   * Periodic updates (called every 60 seconds)
   */
  periodicUpdate() {
    // Update sidebar
    this.updateSidebarProgress();

    // If on home page, trigger a re-render to update time displays
    if (Router.getCurrentRoute() === 'home') {
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        // Update just the time-sensitive elements instead of full re-render
        const remainingEl = mainContent.querySelector('.hero__remaining');
        if (remainingEl) {
          const currentBlock = Scheduler.getCurrentBlock();
          if (currentBlock) {
            const now = DateUtils.getTimeMinutes(DateUtils.now());
            const end = DateUtils.getTimeMinutes(currentBlock.endTime);
            const remaining = Math.max(0, end - now);
            remainingEl.textContent = `${remaining} minutes remaining`;
          }
        }
      }
    }

    // Check for end of day (after 9 PM)
    const nowHour = new Date().getHours();
    if (nowHour >= 21) {
      this.checkEndOfDay();
    }
  }

  /**
   * Check if it's end of day and prompt for reflection
   */
  checkEndOfDay() {
    const today = DateUtils.today();
    const reflection = Store.getReflection(today);
    const schedule = Store.getSchedule(today);

    // Only prompt once per day
    if (!reflection && schedule && !this._endOfDayPrompted) {
      this._endOfDayPrompted = true;

      // Check if there are incomplete tasks
      const incomplete = schedule.blocks.filter(
        b => b.type === 'study' && (b.status === 'not-started' || b.status === 'in-progress')
      );

      if (incomplete.length > 0) {
        DOM.toast(
          `You have ${incomplete.length} incomplete task(s). Open Today's view to complete your daily reflection.`,
          'warning'
        );
      }
    }
  }

  /**
   * Clean up on app destroy
   */
  destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}

// Initialize the application when DOM is ready
const app = new App();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

// Make app accessible for debugging
window.__cssCommandCenter = app;

// Handle visibility change (update when tab becomes active)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && app.initialized) {
    app.updateSidebarProgress();
    app.ensureTodaySchedule();
  }
});

export default app;
