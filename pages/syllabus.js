import Store from '../store.js';
import DOM from '../utils/domUtils.js';
import Format from '../utils/formatUtils.js';
import { DEFAULT_SUBJECTS, SYLLABUS_DATA } from '../data/subjects.js';

export function render(container) {
  const subjects = Store.getSubjects();
  const hasSyllabus = subjects.length > 0;

  let html = `
    <div class="page page--syllabus">
      <header class="page-header">
        <h1>Syllabus Manager</h1>
        <div class="header-actions">
          <button id="btn-import-syllabus" class="btn btn-primary">Import Default Syllabus</button>
          <input type="text" id="search-syllabus" class="input" placeholder="Search topics...">
        </div>
      </header>
  `;

  if (!hasSyllabus) {
    html += `
      <div class="card import-card" style="text-align: center; padding: 40px;">
        <h2>No Syllabus Data Found</h2>
        <p>Please import the official FPSC syllabus to generate the study plan.</p>
        <button id="btn-import-prominent" class="btn btn-primary" style="margin-top: 20px; font-size: 1.1em; padding: 10px 20px;">
          Import Default FPSC Syllabus
        </button>
      </div>
    `;
  } else {
    // Subject filter tabs
    html += `
      <div class="tabs">
        <button class="tab active" data-filter="all">All</button>
        <button class="tab" data-filter="compulsory">Compulsory</button>
        <button class="tab" data-filter="optional">Optional</button>
      </div>
      <div class="subjects-accordion" id="syllabus-content">
    `;
    
    subjects.forEach((subject, index) => {
      const areas = Store.getSyllabusAreas(subject.id);
      const color = Format.subjectColor(index);
      
      html += `
        <div class="accordion-item subject-item" data-type="${subject.type}" data-name="${subject.name.toLowerCase()}">
          <div class="accordion-header" style="border-left: 4px solid ${color}">
            <h3>${subject.name} <span class="badge">${subject.type}</span></h3>
            <button class="btn btn-sm btn-outline btn-add-area" data-subject="${subject.id}">+ Add Area</button>
          </div>
          <div class="accordion-body">
      `;
      
      if (areas.length === 0) {
        html += `<p class="empty-state">No syllabus areas added yet.</p>`;
      }
      
      areas.forEach(area => {
        const topics = Store.getTopics({ subjectId: subject.id, syllabusAreaId: area.id });
        
        html += `
            <div class="area-block">
              <div class="area-header">
                <h4>${area.name}</h4>
                <button class="btn btn-sm btn-icon btn-add-topic" data-area="${area.id}" data-subject="${subject.id}">+</button>
              </div>
              <ul class="topic-list">
        `;
        
        topics.forEach(topic => {
          html += `
                <li class="topic-item" data-id="${topic.id}">
                  <span class="topic-name" contenteditable="true">${topic.name}</span>
                  <div class="topic-meta">
                    ${Format.masterySteps(topic.studyStatus)}
                    <span class="badge status-${topic.studyStatus}">${Format.statusBadge(topic.studyStatus)}</span>
                  </div>
                </li>
          `;
        });
        
        html += `
              </ul>
            </div>
        `;
      });
      
      html += `
          </div>
        </div>
      `;
    });
    
    html += `</div>`;
  }

  html += `</div>`;
  container.innerHTML = html;
  attachEventListeners();
}

function attachEventListeners() {
  const importBtn = DOM.$('#btn-import-syllabus');
  const importProminentBtn = DOM.$('#btn-import-prominent');
  
  const doImport = () => {
    DEFAULT_SUBJECTS.forEach(subject => {
      if(!Store.getSubject(subject.id)) {
          Store.saveSubject(subject);
      }
    });
    Object.entries(SYLLABUS_DATA).forEach(([subjectId, areas]) => {
      Store.importSyllabusData(subjectId, areas);
    });
    DOM.toast('FPSC Syllabus imported successfully!', 'success');
    render(DOM.$('#main-content'));
  };

  if (importBtn) DOM.on(importBtn.parentElement, 'click', '#btn-import-syllabus', doImport);
  if (importProminentBtn) DOM.on(importProminentBtn.parentElement, 'click', '#btn-import-prominent', doImport);

  // Tabs
  const tabsContainer = DOM.$('.tabs');
  if (tabsContainer) {
    DOM.on(tabsContainer, 'click', '.tab', (e) => {
      DOM.$$('.tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      const filter = e.target.dataset.filter;
      
      DOM.$$('.subject-item').forEach(el => {
        if (filter === 'all' || el.dataset.type === filter) {
          el.style.display = 'block';
        } else {
          el.style.display = 'none';
        }
      });
    });
  }

  // Accordion
  const syllabusContent = DOM.$('#syllabus-content');
  if (syllabusContent) {
    DOM.on(syllabusContent, 'click', '.accordion-header h3', (e) => {
      const body = e.target.closest('.accordion-item').querySelector('.accordion-body');
      body.style.display = body.style.display === 'block' ? 'none' : 'block';
    });
    
    // Inline edit topic
    DOM.on(syllabusContent, 'blur', '.topic-name', (e) => {
      const topicId = e.target.closest('.topic-item').dataset.id;
      const newName = e.target.textContent.trim();
      const topic = Store.getTopics().find(t => t.id === topicId);
      if (topic && newName && topic.name !== newName) {
        topic.name = newName;
        Store.saveTopic(topic);
        DOM.toast('Topic updated');
      }
    });

    // Add area
    DOM.on(syllabusContent, 'click', '.btn-add-area', (e) => {
      e.stopPropagation();
      const subjectId = e.target.dataset.subject;
      const name = prompt('Enter Syllabus Area Name:');
      if (name) {
        Store.saveSyllabusArea({ subjectId, name, order: 999 });
        render(DOM.$('#main-content'));
      }
    });

    // Add topic
    DOM.on(syllabusContent, 'click', '.btn-add-topic', (e) => {
      const subjectId = e.target.dataset.subject;
      const areaId = e.target.dataset.area;
      const name = prompt('Enter Topic Name (or comma separated list):');
      if (name) {
        const topics = name.split(',').map(n => n.trim()).filter(n => n);
        topics.forEach(tName => {
          Store.saveTopic({ subjectId, syllabusAreaId: areaId, name: tName });
        });
        render(DOM.$('#main-content'));
      }
    });
  }

  // Search
  const searchInput = DOM.$('#search-syllabus');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      DOM.$$('.topic-item').forEach(el => {
        const text = el.querySelector('.topic-name').textContent.toLowerCase();
        el.style.display = text.includes(term) ? 'flex' : 'none';
      });
    });
  }
}
