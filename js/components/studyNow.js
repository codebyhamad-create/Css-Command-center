import Store from '../store.js';
import DateUtils from '../utils/dateUtils.js';
import { getRelevantQuote } from '../data/quotes.js';
import Format from '../utils/formatUtils.js';

export function renderStudyNow(block, nextBlock, dateStr) {
  if (!block) {
    return `<div class="card card--hero">
      <div class="hero__label">YOUR NEXT SESSION</div>
      <p class="hero__topic" style="font-size: 1.25rem; color: var(--text-secondary);">No active study block right now</p>
      ${nextBlock ? renderUpNext(nextBlock) : '<p style="color: var(--text-muted); margin-top: 16px;">Your study schedule starts at 9:00 AM.</p>'}
    </div>`;
  }

  const subject = Store.getSubject(block.subjectId);
  const subjectColor = subject ? subject.color : 'var(--accent-primary)';
  const subjectName = subject ? subject.name : block.description || 'Study';
  const topicName = block.title || 'General Study';

  const now = DateUtils.getTimeMinutes(DateUtils.now());
  const end = DateUtils.getTimeMinutes(block.endTime);
  const remaining = Math.max(0, end - now);

  let quote = { text: 'Focus on the journey, not the destination.', author: 'Unknown' };
  try {
    if (typeof getRelevantQuote === 'function') {
      quote = getRelevantQuote(block.subjectId, topicName) || quote;
    }
  } catch (e) {
    console.warn('Quote fetch failed', e);
  }

  const objectivesHtml = block.objectives && block.objectives.length > 0
    ? `<ul class="hero__objectives">
        ${block.objectives.map(obj => `<li>${obj}</li>`).join('')}
       </ul>`
    : '';

  return `
    <div class="card card--hero">
      <div class="hero__label">WHAT SHOULD I STUDY NOW?</div>

      <div class="hero__subject" style="color: ${subjectColor};">${subjectName}</div>
      <h2 class="hero__topic">${topicName}</h2>

      <div class="hero__time-range">
        ⏱️ ${DateUtils.formatTime(block.startTime)} — ${DateUtils.formatTime(block.endTime)}
        <span style="margin-left: 8px; color: var(--text-muted);">(${Format.duration(block.plannedDuration)})</span>
      </div>

      <div class="hero__remaining">
        <span>⏳</span> ${remaining} minutes remaining
      </div>

      ${block.reason ? `<div class="hero__reason">📌 ${block.reason}</div>` : ''}

      ${objectivesHtml}

      <div class="hero__quote">
        "${quote.text}"
        <span class="hero__quote-source">— ${quote.author}</span>
      </div>

      <div style="margin-top: 24px;">
        <button class="btn btn--primary btn--lg btn--glow" id="btn-start-study">
          ▶ START STUDY
        </button>
      </div>
    </div>

    ${nextBlock ? renderUpNext(nextBlock) : ''}
  `;
}

function renderUpNext(nextBlock) {
  const subject = nextBlock.subjectId ? Store.getSubject(nextBlock.subjectId) : null;
  const color = subject ? subject.color : 'var(--text-muted)';
  const subjectName = subject ? subject.name : 'Break / General';

  return `
    <div class="card up-next" style="border-left: 3px solid ${color}; margin-top: 16px;">
      <div>
        <div class="up-next__time">Up Next</div>
        <div class="up-next__subject" style="color: ${color};">${subjectName}</div>
        <div class="up-next__topic">${nextBlock.title || 'Study Block'}</div>
      </div>
      <div style="text-align: right;">
        <div style="font-weight: 600; color: var(--text-primary);">${DateUtils.formatTime(nextBlock.startTime)}</div>
        <div style="font-size: 0.8125rem; color: var(--text-muted);">${Format.duration(nextBlock.plannedDuration)}</div>
      </div>
    </div>
  `;
}
