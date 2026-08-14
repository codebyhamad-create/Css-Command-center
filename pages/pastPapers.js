import Store from '../store.js';
import DOM from '../utils/domUtils.js';
import Format from '../utils/formatUtils.js';

export function render(container) {
  const subjects = Store.getSubjects();
  
  let html = `
    <div class="page page--pastpapers">
      <header class="page-header">
        <h1>Past Papers</h1>
        <button id="btn-add-question" class="btn btn-primary">+ Add Question</button>
      </header>

      <div class="filters card">
        <select id="filter-subject" class="input">
          <option value="">All Subjects</option>
          ${subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
        </select>
        <select id="filter-year" class="input">
          <option value="">All Years</option>
          ${[2023,2022,2021,2020,2019,2018,2017,2016].map(y => `<option value="${y}">${y}</option>`).join('')}
        </select>
        <input type="text" id="filter-search" class="input" placeholder="Search questions...">
      </div>

      <div id="questions-list"></div>
    </div>
  `;
  
  container.innerHTML = html;
  renderQuestions();
  attachEventListeners();
}

function renderQuestions() {
  const container = DOM.$('#questions-list');
  if(!container) return;
  
  const subjectId = DOM.$('#filter-subject').value;
  const year = DOM.$('#filter-year').value;
  const search = DOM.$('#filter-search').value.toLowerCase();
  
  const allQuestions = Store.getQuestions();
  const filtered = allQuestions.filter(q => {
    if (subjectId && q.subjectId !== subjectId) return false;
    if (year && q.year.toString() !== year) return false;
    if (search && !q.questionText.toLowerCase().includes(search)) return false;
    return true;
  });
  
  if (filtered.length === 0) {
    container.innerHTML = `<div class="card"><p class="empty-state">No questions found matching the filters.</p></div>`;
    return;
  }
  
  let html = `
    <table class="table card">
      <thead>
        <tr>
          <th>Subject</th>
          <th>Year</th>
          <th>Question</th>
          <th>Marks</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  filtered.forEach(q => {
    const subject = Store.getSubject(q.subjectId);
    html += `
      <tr>
        <td>${subject ? subject.name : 'Unknown'}</td>
        <td>${q.year}</td>
        <td><div class="truncate" title="${q.questionText}">${Format.truncate(q.questionText, 60)}</div></td>
        <td>${q.marks}</td>
        <td><span class="badge cursor-pointer status-toggle" data-id="${q.id}" data-status="${q.status}">${Format.statusBadge(q.status)}</span></td>
        <td>
          <button class="btn btn-sm btn-icon btn-delete" data-id="${q.id}">🗑️</button>
        </td>
      </tr>
    `;
  });
  
  html += `</tbody></table>`;
  container.innerHTML = html;
}

function attachEventListeners() {
  DOM.on(document, 'click', '#btn-add-question', () => {
    const subjects = Store.getSubjects();
    const content = `
      <form id="form-add-question">
        <div class="form-group">
          <label>Subject</label>
          <select id="q-subject" class="input" required>
            ${subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Year</label>
          <input type="number" id="q-year" class="input" required value="2023">
        </div>
        <div class="form-group">
          <label>Question Text</label>
          <textarea id="q-text" class="input" required></textarea>
        </div>
        <div class="form-group">
          <label>Marks</label>
          <input type="number" id="q-marks" class="input" value="20">
        </div>
      </form>
    `;
    
    DOM.modal(content, 'Add Past Paper Question', `
      <button class="btn btn-outline" onclick="DOM.closeModal()">Cancel</button>
      <button class="btn btn-primary" id="btn-save-question">Save</button>
    `);
    
    DOM.$('#btn-save-question').onclick = () => {
      const q = {
        subjectId: DOM.$('#q-subject').value,
        year: parseInt(DOM.$('#q-year').value),
        questionText: DOM.$('#q-text').value,
        marks: parseInt(DOM.$('#q-marks').value),
        questionType: 'descriptive',
        status: 'not-attempted'
      };
      if(q.subjectId && q.questionText) {
        Store.saveQuestion(q);
        DOM.closeModal();
        renderQuestions();
        DOM.toast('Question added');
      }
    };
  });
  
  DOM.on(document, 'change', '#filter-subject', renderQuestions);
  DOM.on(document, 'change', '#filter-year', renderQuestions);
  DOM.on(document, 'input', '#filter-search', renderQuestions);
  
  DOM.on(document, 'click', '.status-toggle', (e) => {
    const id = e.target.closest('.status-toggle').dataset.id;
    const currentStatus = e.target.closest('.status-toggle').dataset.status;
    const nextStatus = currentStatus === 'not-attempted' ? 'attempted' : 
                       currentStatus === 'attempted' ? 'strong' : 
                       currentStatus === 'strong' ? 'weak' : 'not-attempted';
    Store.updateQuestion(id, { status: nextStatus });
    renderQuestions();
  });
  
  DOM.on(document, 'click', '.btn-delete', (e) => {
    const id = e.target.closest('.btn-delete').dataset.id;
    if(confirm('Delete this question?')) {
      const questions = Store.getQuestions().filter(q => q.id !== id);
      localStorage.setItem('questions', JSON.stringify(questions)); // manual delete
      renderQuestions();
    }
  });
}
