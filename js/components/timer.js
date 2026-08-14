import Store from '../store.js';
import Format from '../utils/formatUtils.js';

let timerState = {
  running: false,
  paused: false,
  blockId: null,
  dateStr: null,
  startTimestamp: null,
  elapsed: 0, // seconds
  planned: 0, // seconds
  pauseStart: null,
  totalPaused: 0,
  intervalId: null
};

export function startTimer(blockId, dateStr, plannedMinutes) {
  if (timerState.running) completeTimer();
  
  timerState = {
    running: true,
    paused: false,
    blockId,
    dateStr,
    startTimestamp: Date.now(),
    elapsed: 0,
    planned: plannedMinutes * 60,
    pauseStart: null,
    totalPaused: 0,
    intervalId: setInterval(updateTimerDisplay, 1000)
  };
  
  updateTimerDisplay();
}

export function pauseTimer() {
  if (!timerState.running || timerState.paused) return;
  timerState.paused = true;
  timerState.pauseStart = Date.now();
  clearInterval(timerState.intervalId);
  updateTimerControlsDisplay();
}

export function resumeTimer() {
  if (!timerState.running || !timerState.paused) return;
  timerState.paused = false;
  timerState.totalPaused += (Date.now() - timerState.pauseStart);
  timerState.pauseStart = null;
  timerState.intervalId = setInterval(updateTimerDisplay, 1000);
  updateTimerControlsDisplay();
}

export function completeTimer() {
  if (!timerState.running) return;
  
  clearInterval(timerState.intervalId);
  
  const actualMinutes = Math.round(timerState.elapsed / 60);
  
  Store.saveStudySession({
    blockId: timerState.blockId,
    date: timerState.dateStr,
    duration: actualMinutes,
    completedAt: new Date().toISOString()
  });
  
  Store.updateBlockStatus(timerState.dateStr, timerState.blockId, 'completed', actualMinutes);
  
  timerState.running = false;
  updateTimerDisplay();
  updateTimerControlsDisplay();
}

export function getTimerState() {
  return timerState;
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
  if (timerState.running && !timerState.paused) {
    const now = Date.now();
    timerState.elapsed = Math.floor((now - timerState.startTimestamp - timerState.totalPaused) / 1000);
  }
  
  const display = document.getElementById('timer-display');
  if (display) {
    display.textContent = formatTime(timerState.elapsed);
    if (timerState.running && !timerState.paused) {
      display.classList.add('pulse');
    } else {
      display.classList.remove('pulse');
    }
  }
  
  const remaining = document.getElementById('timer-remaining');
  if (remaining && timerState.planned > 0) {
    const rem = Math.max(0, timerState.planned - timerState.elapsed);
    remaining.textContent = `${formatTime(rem)} remaining of ${formatTime(timerState.planned)}`;
  }
}

function updateTimerControlsDisplay() {
  const container = document.getElementById('timer-controls');
  if (container) {
    container.innerHTML = renderTimerControls();
  }
}

export function renderTimer() {
  const elapsedStr = formatTime(timerState.elapsed);
  const remainingStr = timerState.planned > 0 ? `${formatTime(Math.max(0, timerState.planned - timerState.elapsed))} remaining` : '';
  
  return `
    <div class="card card--timer text-center p-6 bg-gray-50 rounded-lg shadow-inner">
      <h3 class="card__title text-gray-500 text-sm font-semibold uppercase tracking-wide mb-4">Study Timer</h3>
      <div id="timer-display" class="text-5xl font-mono font-bold text-gray-800 mb-2 ${timerState.running && !timerState.paused ? 'pulse' : ''}">${elapsedStr}</div>
      <div id="timer-remaining" class="text-sm text-gray-500">${remainingStr}</div>
    </div>
  `;
}

export function renderTimerControls() {
  if (!timerState.running) {
    return `<button class="btn btn--outline w-full opacity-50 cursor-not-allowed" disabled>Timer not active</button>`;
  }
  
  if (timerState.paused) {
    return `
      <div class="flex gap-2">
        <button class="btn btn--primary flex-1" onclick="import('../components/timer.js').then(m => m.resumeTimer())">Resume</button>
        <button class="btn btn--secondary flex-1" onclick="import('../components/timer.js').then(m => m.completeTimer())">Complete</button>
      </div>
    `;
  }
  
  return `
    <div class="flex gap-2">
      <button class="btn btn--outline flex-1" onclick="import('../components/timer.js').then(m => m.pauseTimer())">Pause</button>
      <button class="btn btn--secondary flex-1" onclick="import('../components/timer.js').then(m => m.completeTimer())">Complete</button>
    </div>
  `;
}

// Global functions for onclick bindings
window.pauseTimer = pauseTimer;
window.resumeTimer = resumeTimer;
window.completeTimer = completeTimer;
