const Store = {
  // Internal
  _listeners: {},
  _get(key) { return JSON.parse(localStorage.getItem(key) || 'null'); },
  _set(key, val) { 
    localStorage.setItem(key, JSON.stringify(val)); 
    this.emit('dataChanged'); 
  },
  _generateId() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 9); },

  // Events
  on(event, callback) {
    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }
    this._listeners[event].push(callback);
  },
  off(event, callback) {
    if (!this._listeners[event]) return;
    this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);
  },
  emit(event, data) {
    if (!this._listeners[event]) return;
    this._listeners[event].forEach(cb => cb(data));
  },

  // ============ INITIALIZATION ============
  init() {
    // Check if first run, if so initialize with default subjects
    if (this.isFirstRun()) {
      this.markInitialized();
      // Import default subjects logic can go here if needed
    }
  },
  
  isFirstRun() { return !localStorage.getItem('css_initialized'); },
  markInitialized() { localStorage.setItem('css_initialized', 'true'); },
  
  // ============ SUBJECTS ============
  getSubjects() { return this._get('css_subjects') || []; },
  getSubject(id) { return this.getSubjects().find(s => s.id === id) || null; },
  saveSubject(subject) {
    const subjects = this.getSubjects();
    if (subject.id) {
      const idx = subjects.findIndex(s => s.id === subject.id);
      if (idx >= 0) subjects[idx] = { ...subjects[idx], ...subject };
      else subjects.push(subject);
    } else {
      subject.id = this._generateId();
      subjects.push(subject);
    }
    this._set('css_subjects', subjects);
    return subject;
  },
  deleteSubject(id) {
    this._set('css_subjects', this.getSubjects().filter(s => s.id !== id));
  },
  
  // ============ SYLLABUS AREAS ============
  getSyllabusAreas(subjectId) {
    const areas = this._get('css_syllabusAreas') || [];
    return subjectId ? areas.filter(a => a.subjectId === subjectId) : areas;
  },
  saveSyllabusArea(area) {
    const areas = this._get('css_syllabusAreas') || [];
    if (area.id) {
      const idx = areas.findIndex(a => a.id === area.id);
      if (idx >= 0) areas[idx] = { ...areas[idx], ...area };
      else areas.push(area);
    } else {
      area.id = this._generateId();
      areas.push(area);
    }
    this._set('css_syllabusAreas', areas);
    return area;
  },
  deleteSyllabusArea(id) {
    this._set('css_syllabusAreas', (this._get('css_syllabusAreas') || []).filter(a => a.id !== id));
  },
  
  // ============ MASTERY TOPICS ============
  getTopics(filters) {
    let topics = this._get('css_topics') || [];
    if (filters) {
      if (filters.subjectId) topics = topics.filter(t => t.subjectId === filters.subjectId);
      if (filters.syllabusAreaId) topics = topics.filter(t => t.syllabusAreaId === filters.syllabusAreaId);
      if (filters.studyStatus) topics = topics.filter(t => t.studyStatus === filters.studyStatus);
    }
    return topics;
  },
  getTopic(id) { return (this._get('css_topics') || []).find(t => t.id === id) || null; },
  saveTopic(topic) {
    const topics = this._get('css_topics') || [];
    if (topic.id) {
      const idx = topics.findIndex(t => t.id === topic.id);
      if (idx >= 0) topics[idx] = { ...topics[idx], ...topic };
      else topics.push(topic);
    } else {
      topic.id = this._generateId();
      topic.studyStatus = topic.studyStatus || 'not-started';
      topic.masteryLevel = topic.masteryLevel || 0;
      topic.revisionDates = topic.revisionDates || [];
      topic.completedDate = topic.completedDate || null;
      topic.nextRevisionDate = topic.nextRevisionDate || null;
      topics.push(topic);
    }
    this._set('css_topics', topics);
    return topic;
  },
  updateTopicStatus(id, studyStatus) {
    const topics = this._get('css_topics') || [];
    const idx = topics.findIndex(t => t.id === id);
    if (idx >= 0) {
      topics[idx].studyStatus = studyStatus;
      // Set mastery level based on status
      const levels = { 'not-started': 0, 'studied': 17, 'understood': 33, 'recalled': 50, 'practiced': 67, 'revised': 83, 'mastered': 100 };
      topics[idx].masteryLevel = levels[studyStatus] || topics[idx].masteryLevel;
      if (studyStatus === 'studied' && !topics[idx].completedDate) {
        topics[idx].completedDate = new Date().toISOString().split('T')[0];
      }
      this._set('css_topics', topics);
      this.emit('topicUpdated', { id, studyStatus });
    }
  },
  updateTopicMastery(id, masteryLevel) {
    const topics = this._get('css_topics') || [];
    const idx = topics.findIndex(t => t.id === id);
    if (idx >= 0) {
      topics[idx].masteryLevel = masteryLevel;
      this._set('css_topics', topics);
    }
  },
  deleteTopic(id) {
    this._set('css_topics', (this._get('css_topics') || []).filter(t => t.id !== id));
  },
  
  // ============ SCHEDULE ============
  getSchedule(dateStr) {
    const schedules = this._get('css_schedules') || {};
    return schedules[dateStr] || null;
  },
  saveSchedule(dateStr, schedule) {
    const schedules = this._get('css_schedules') || {};
    schedules[dateStr] = schedule;
    this._set('css_schedules', schedules);
    this.emit('scheduleUpdated', { date: dateStr });
  },
  updateBlockStatus(dateStr, blockId, status, actualDuration) {
    const schedules = this._get('css_schedules') || {};
    if (schedules[dateStr]) {
      const block = schedules[dateStr].blocks.find(b => b.id === blockId);
      if (block) {
        block.status = status;
        if (actualDuration !== undefined) block.actualDuration = actualDuration;
        this._set('css_schedules', schedules);
        this.emit('scheduleUpdated', { date: dateStr });
      }
    }
  },
  setAcademy(dateStr, status) {
    const schedules = this._get('css_schedules') || {};
    if (!schedules[dateStr]) {
      schedules[dateStr] = { date: dateStr, academyStatus: status, blocks: [] };
    } else {
      schedules[dateStr].academyStatus = status;
    }
    this._set('css_schedules', schedules);
  },
  getTodaySchedule() {
    const today = new Date().toISOString().split('T')[0];
    return this.getSchedule(today);
  },
  
  // ============ QUESTIONS ============
  getQuestions(filters) {
    let questions = this._get('css_questions') || [];
    if (filters) {
      if (filters.subjectId) questions = questions.filter(q => q.subjectId === filters.subjectId);
      if (filters.topicId) questions = questions.filter(q => (q.topicIds || []).includes(filters.topicId));
      if (filters.year) questions = questions.filter(q => q.year === filters.year);
      if (filters.status) questions = questions.filter(q => q.status === filters.status);
    }
    return questions;
  },
  saveQuestion(question) {
    const questions = this._get('css_questions') || [];
    if (!question.id) {
      question.id = this._generateId();
      question.status = question.status || 'not-attempted';
    }
    questions.push(question);
    this._set('css_questions', questions);
    return question;
  },
  updateQuestion(id, updates) {
    const questions = this._get('css_questions') || [];
    const idx = questions.findIndex(q => q.id === id);
    if (idx >= 0) {
      questions[idx] = { ...questions[idx], ...updates };
      this._set('css_questions', questions);
    }
  },
  
  // ============ ESSAYS ============
  getEssays() { return this._get('css_essays') || []; },
  saveEssay(essay) {
    const essays = this._get('css_essays') || [];
    if (!essay.id) {
      essay.id = this._generateId();
      essay.date = essay.date || new Date().toISOString().split('T')[0];
    }
    essays.push(essay);
    this._set('css_essays', essays);
    return essay;
  },
  updateEssay(id, updates) {
    const essays = this._get('css_essays') || [];
    const idx = essays.findIndex(e => e.id === id);
    if (idx >= 0) {
      essays[idx] = { ...essays[idx], ...updates };
      this._set('css_essays', essays);
    }
  },
  
  // ============ STUDY SESSIONS ============
  getStudySessions(dateStr) {
    let sessions = this._get('css_studySessions') || [];
    if (dateStr) sessions = sessions.filter(s => s.date === dateStr);
    return sessions;
  },
  saveStudySession(session) {
    const sessions = this._get('css_studySessions') || [];
    if (!session.id) session.id = this._generateId();
    sessions.push(session);
    this._set('css_studySessions', sessions);
    return session;
  },
  
  // ============ BACKLOG ============
  getBacklog() {
    return (this._get('css_backlog') || []).filter(b => b.status === 'pending');
  },
  getAllBacklog() { return this._get('css_backlog') || []; },
  addToBacklog(item) {
    const backlog = this._get('css_backlog') || [];
    if (!item.id) item.id = this._generateId();
    item.status = item.status || 'pending';
    backlog.push(item);
    this._set('css_backlog', backlog);
    return item;
  },
  updateBacklogItem(id, updates) {
    const backlog = this._get('css_backlog') || [];
    const idx = backlog.findIndex(b => b.id === id);
    if (idx >= 0) {
      backlog[idx] = { ...backlog[idx], ...updates };
      this._set('css_backlog', backlog);
    }
  },
  removeFromBacklog(id) {
    this._set('css_backlog', (this._get('css_backlog') || []).filter(b => b.id !== id));
  },
  
  // ============ REFLECTIONS ============
  getReflection(dateStr) {
    const reflections = this._get('css_reflections') || {};
    return reflections[dateStr] || null;
  },
  saveReflection(dateStr, reflection) {
    const reflections = this._get('css_reflections') || {};
    reflections[dateStr] = reflection;
    this._set('css_reflections', reflections);
  },
  
  // ============ SETTINGS ============
  getSettings() {
    return this._get('css_settings') || {
      revisionIntervals: [3, 7, 21],
      studyStartTime: '09:00',
      studyEndTime: '17:00',
      academyStartTime: '17:00',
      academyEndTime: '21:00',
      prepStartDate: '2026-08-16',
      prepEndDate: '2026-11-30',
      dailyStudyHoursTarget: 6,
      theme: 'dark'
    };
  },
  updateSettings(settings) {
    const current = this.getSettings();
    this._set('css_settings', { ...current, ...settings });
  },
  
  // ============ COMPUTED / AGGREGATE ============
  getSubjectProgress(subjectId) {
    const topics = this.getTopics({ subjectId });
    const total = topics.length;
    if (total === 0) return { totalTopics: 0, completedTopics: 0, coverage: 0, mastery: 0 };
    const studied = topics.filter(t => t.studyStatus !== 'not-started').length;
    const avgMastery = topics.reduce((sum, t) => sum + (t.masteryLevel || 0), 0) / total;
    return {
      totalTopics: total,
      completedTopics: studied,
      coverage: Math.round((studied / total) * 100),
      mastery: Math.round(avgMastery)
    };
  },
  
  getOverallProgress() {
    const topics = this.getTopics();
    const total = topics.length;
    const studied = topics.filter(t => t.studyStatus !== 'not-started').length;
    const avgMastery = total > 0 ? topics.reduce((sum, t) => sum + (t.masteryLevel || 0), 0) / total : 0;
    const questions = this.getQuestions();
    const attempted = questions.filter(q => q.status !== 'not-attempted').length;
    const essays = this.getEssays();
    const sessions = this._get('css_studySessions') || [];
    const totalMinutes = sessions.reduce((sum, s) => sum + (s.actualDuration || 0), 0);
    // Count revision sessions
    const schedules = this._get('css_schedules') || {};
    let revisionCount = 0;
    Object.values(schedules).forEach(s => {
      (s.blocks || []).forEach(b => {
        if (b.type === 'revision' && b.status === 'completed') revisionCount++;
      });
    });
    return {
      totalTopics: total,
      studiedTopics: studied,
      coverage: total > 0 ? Math.round((studied / total) * 100) : 0,
      mastery: Math.round(avgMastery),
      questionsAttempted: attempted,
      totalQuestions: questions.length,
      essaysAttempted: essays.length,
      revisionSessions: revisionCount,
      totalStudyHours: Math.round(totalMinutes / 60 * 10) / 10
    };
  },
  
  getWeeklyStats(weekStartDateStr) {
    // weekStartDateStr is a Monday 'YYYY-MM-DD'
    const schedules = this._get('css_schedules') || {};
    const sessions = this._get('css_studySessions') || [];
    let topicsPlanned = 0, topicsCompleted = 0, questionsAttempted = 0, questionsMissed = 0;
    let essaysAttempted = 0, revisionSessions = 0, studyMinutes = 0, missedTasks = 0;
    
    // Get 7 days starting from weekStartDateStr
    const startDate = new Date(weekStartDateStr + 'T00:00:00');
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const schedule = schedules[dateStr];
      if (schedule && schedule.blocks) {
        schedule.blocks.forEach(b => {
          if (b.type === 'study') {
            topicsPlanned++;
            if (b.status === 'completed') topicsCompleted++;
            if (b.status === 'skipped' || b.status === 'carried-forward') missedTasks++;
          }
          if (b.type === 'question') {
            if (b.status === 'completed') questionsAttempted++;
            else questionsMissed++;
          }
          if (b.type === 'revision' && b.status === 'completed') revisionSessions++;
          if (b.type === 'essay' && b.status === 'completed') essaysAttempted++;
        });
      }
      // Sum study sessions for this date
      sessions.filter(s => s.date === dateStr).forEach(s => {
        studyMinutes += s.actualDuration || 0;
      });
    }
    
    const syllabusScore = topicsPlanned > 0 ? Math.round((topicsCompleted / topicsPlanned) * 100) : 100;
    const questionScore = (questionsAttempted + questionsMissed) > 0 ? Math.round((questionsAttempted / (questionsAttempted + questionsMissed)) * 100) : 100;
    const revisionTarget = 7; // assume 1 revision per day target
    const revisionScore = Math.min(100, Math.round((revisionSessions / revisionTarget) * 100));
    const studyHoursTarget = 42; // 6h * 7 days
    const studyHoursScore = Math.min(100, Math.round(((studyMinutes / 60) / studyHoursTarget) * 100));
    const overallScore = Math.round((syllabusScore * 0.35 + questionScore * 0.2 + revisionScore * 0.2 + studyHoursScore * 0.25));
    
    return {
      topicsPlanned, topicsCompleted, questionsAttempted, questionsMissed,
      essaysAttempted, revisionSessions, studyHours: Math.round(studyMinutes / 60 * 10) / 10,
      missedTasks,
      scores: { syllabus: syllabusScore, questions: questionScore, revision: revisionScore, studyHours: studyHoursScore, overall: overallScore }
    };
  },
  
  getMonthlyStats(month, year) {
    // Similar to weekly but for entire month
    const schedules = this._get('css_schedules') || {};
    const sessions = this._get('css_studySessions') || [];
    let topicsPlanned = 0, topicsCompleted = 0, remainingTopics = 0;
    let questionsAttempted = 0, essaysAttempted = 0, revisionSessions = 0, studyMinutes = 0;
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const schedule = schedules[dateStr];
      if (schedule && schedule.blocks) {
        schedule.blocks.forEach(b => {
          if (b.type === 'study') {
            topicsPlanned++;
            if (b.status === 'completed') topicsCompleted++;
            else if (b.status !== 'completed') remainingTopics++;
          }
          if (b.type === 'question' && b.status === 'completed') questionsAttempted++;
          if (b.type === 'revision' && b.status === 'completed') revisionSessions++;
          if (b.type === 'essay' && b.status === 'completed') essaysAttempted++;
        });
      }
      sessions.filter(s => s.date === dateStr).forEach(s => {
        studyMinutes += s.actualDuration || 0;
      });
    }
    
    return {
      topicsPlanned, topicsCompleted, remainingTopics,
      questionsAttempted, essaysAttempted, revisionSessions,
      studyHours: Math.round(studyMinutes / 60 * 10) / 10
    };
  },

  // ============ BULK OPERATIONS ============
  importSyllabusData(subjectId, areas) {
    // areas = [{name, topics: [{name, difficulty}]}]
    areas.forEach((area, aIdx) => {
      const savedArea = this.saveSyllabusArea({
        subjectId,
        name: area.name,
        order: aIdx
      });
      (area.topics || []).forEach((topic, tIdx) => {
        this.saveTopic({
          subjectId,
          syllabusAreaId: savedArea.id,
          name: topic.name || topic,
          order: tIdx,
          difficulty: topic.difficulty || 3,
          studyStatus: 'not-started',
          masteryLevel: 0,
          revisionDates: [],
          completedDate: null,
          nextRevisionDate: null,
          notes: ''
        });
      });
    });
  },
  
  clearAllData() {
    const keys = ['css_subjects', 'css_syllabusAreas', 'css_topics', 'css_schedules',
                  'css_questions', 'css_essays', 'css_studySessions', 'css_backlog',
                  'css_reflections', 'css_settings', 'css_initialized'];
    keys.forEach(k => localStorage.removeItem(k));
  }
};

export default Store;
