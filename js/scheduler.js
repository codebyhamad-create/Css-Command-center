import Store from './store.js';
import DateUtils from './utils/dateUtils.js';

const Scheduler = {
  // Main entry: generate schedule for a specific date
  generateDaySchedule(dateStr) {
    // 1. Check if schedule already exists for this date
    // 2. If not, generate a new one
    // 3. Return the schedule
    
    const existing = Store.getSchedule(dateStr);
    if (existing && existing.blocks && existing.blocks.length > 0) return existing;
    
    const isSunday = DateUtils.isSunday(dateStr);
    const academyStatus = this.getDefaultAcademyStatus(dateStr);
    const blocks = [];
    const blockId = () => Store._generateId();
    
    // Get subjects with topics to study
    const assignments = this.selectDailyTopics(dateStr, isSunday);
    // assignments = [{subjectId, topicId, subjectName, topicName, type:'study'|'revision', reason, objectives, duration}]
    
    // Build time blocks based on default structure
    // 9:00-11:00 Deep Study Block 1
    // 11:00-11:30 Break
    // 11:30-1:30 Deep Study Block 2
    // 1:30-2:30 Lunch
    // 2:30-4:00 Study/Revision Block
    // 4:00-5:00 Daily CSS Question
    // If Sunday: adjust to fit essay session (e.g., 3:00-5:00)
    // 5:00-9:00 Academy
    
    if (isSunday) {
      // Sunday schedule: study + revision + essay + question
      if (assignments[0]) {
        blocks.push({
          id: blockId(), startTime: '09:00', endTime: '11:00',
          type: 'study', subjectId: assignments[0].subjectId, topicId: assignments[0].topicId,
          title: assignments[0].topicName, description: assignments[0].subjectName,
          reason: assignments[0].reason, status: 'not-started',
          plannedDuration: 120, actualDuration: 0,
          objectives: assignments[0].objectives || []
        });
      }
      blocks.push({ id: blockId(), startTime: '11:00', endTime: '11:30', type: 'break', title: 'Break', description: 'Rest & refresh', reason: '', status: 'not-started', plannedDuration: 30, actualDuration: 0, objectives: [] });
      if (assignments[1]) {
        blocks.push({
          id: blockId(), startTime: '11:30', endTime: '13:00',
          type: assignments[1].type || 'study', subjectId: assignments[1].subjectId, topicId: assignments[1].topicId,
          title: assignments[1].topicName, description: assignments[1].subjectName,
          reason: assignments[1].reason, status: 'not-started',
          plannedDuration: 90, actualDuration: 0,
          objectives: assignments[1].objectives || []
        });
      }
      blocks.push({ id: blockId(), startTime: '13:00', endTime: '14:00', type: 'break', title: 'Lunch / Rest', description: '', reason: '', status: 'not-started', plannedDuration: 60, actualDuration: 0, objectives: [] });
      // Revision
      if (assignments[2]) {
        blocks.push({
          id: blockId(), startTime: '14:00', endTime: '15:00',
          type: 'revision', subjectId: assignments[2].subjectId, topicId: assignments[2].topicId,
          title: 'Revision: ' + assignments[2].topicName, description: assignments[2].subjectName,
          reason: assignments[2].reason || 'Scheduled revision', status: 'not-started',
          plannedDuration: 60, actualDuration: 0,
          objectives: assignments[2].objectives || []
        });
      }
      // Essay session
      blocks.push({
        id: blockId(), startTime: '15:00', endTime: '17:00',
        type: 'essay', title: 'Essay Session', description: 'Weekly essay practice',
        reason: 'Sunday essay requirement', status: 'not-started',
        plannedDuration: 120, actualDuration: 0,
        objectives: ['Brainstorm topic', 'Create outline', 'Write full essay']
      });
      // Daily question (must appear even on Sundays)
      blocks.push({
        id: blockId(), startTime: '13:00', endTime: '13:30',
        type: 'question', title: 'Daily CSS Question', description: 'Related to today\'s study topics',
        reason: 'Daily question requirement', status: 'not-started',
        plannedDuration: 30, actualDuration: 0,
        objectives: ['Attempt one CSS question from today\'s studied topics']
      });
    } else {
      // Regular weekday schedule
      if (assignments[0]) {
        blocks.push({
          id: blockId(), startTime: '09:00', endTime: '11:00',
          type: 'study', subjectId: assignments[0].subjectId, topicId: assignments[0].topicId,
          title: assignments[0].topicName, description: assignments[0].subjectName,
          reason: assignments[0].reason, status: 'not-started',
          plannedDuration: 120, actualDuration: 0,
          objectives: assignments[0].objectives || []
        });
      }
      blocks.push({ id: blockId(), startTime: '11:00', endTime: '11:30', type: 'break', title: 'Break', description: 'Rest & refresh', reason: '', status: 'not-started', plannedDuration: 30, actualDuration: 0, objectives: [] });
      if (assignments[1]) {
        blocks.push({
          id: blockId(), startTime: '11:30', endTime: '13:30',
          type: 'study', subjectId: assignments[1].subjectId, topicId: assignments[1].topicId,
          title: assignments[1].topicName, description: assignments[1].subjectName,
          reason: assignments[1].reason, status: 'not-started',
          plannedDuration: 120, actualDuration: 0,
          objectives: assignments[1].objectives || []
        });
      }
      blocks.push({ id: blockId(), startTime: '13:30', endTime: '14:30', type: 'break', title: 'Lunch / Rest', description: '', reason: '', status: 'not-started', plannedDuration: 60, actualDuration: 0, objectives: [] });
      // Revision block
      if (assignments[2]) {
        blocks.push({
          id: blockId(), startTime: '14:30', endTime: '16:00',
          type: assignments[2].type || 'revision', subjectId: assignments[2].subjectId, topicId: assignments[2].topicId,
          title: (assignments[2].type === 'revision' ? 'Revision: ' : '') + assignments[2].topicName,
          description: assignments[2].subjectName,
          reason: assignments[2].reason || 'Scheduled study/revision', status: 'not-started',
          plannedDuration: 90, actualDuration: 0,
          objectives: assignments[2].objectives || []
        });
      }
      // Daily question
      blocks.push({
        id: blockId(), startTime: '16:00', endTime: '17:00',
        type: 'question', title: 'Daily CSS Question', description: 'Related to today\'s study topics',
        reason: 'Daily question requirement', status: 'not-started',
        plannedDuration: 60, actualDuration: 0,
        objectives: ['Attempt one CSS question from today\'s studied topics']
      });
    }
    
    // Academy block
    blocks.push({
      id: blockId(), startTime: '17:00', endTime: '21:00',
      type: 'academy', title: 'CSS Academy', description: academyStatus === 'on' ? 'Academy session' : 'Academy OFF — Optional study time',
      reason: '', status: 'not-started',
      plannedDuration: 240, actualDuration: 0,
      objectives: []
    });
    
    const schedule = { date: dateStr, academyStatus, blocks };
    Store.saveSchedule(dateStr, schedule);
    return schedule;
  },
  
  getDefaultAcademyStatus(dateStr) {
    // Default: on for weekdays, off for Sunday
    return DateUtils.isSunday(dateStr) ? 'off' : 'on';
  },
  
  // Core intelligence: select which topics to study today
  selectDailyTopics(dateStr, isSunday) {
    const subjects = Store.getSubjects();
    const allTopics = Store.getTopics();
    
    if (subjects.length === 0 || allTopics.length === 0) {
      return []; // No syllabus imported yet
    }
    
    // Calculate subject scores for prioritization
    const subjectScores = subjects.map(subject => {
      const topics = allTopics.filter(t => t.subjectId === subject.id);
      const total = topics.length;
      const remaining = topics.filter(t => t.studyStatus === 'not-started').length;
      const progress = total > 0 ? (total - remaining) / total : 1;
      const daysLeft = DateUtils.daysRemaining();
      const topicsPerDay = daysLeft > 0 ? remaining / daysLeft : remaining;
      
      // Score components
      const volumeScore = total / Math.max(1, allTopics.length) * 10; // Larger syllabus = higher weight
      const behindScore = (1 - progress) * 15; // Further behind = higher priority
      const urgencyScore = topicsPerDay * 5; // More topics per day needed = higher urgency
      const difficultyScore = (subject.difficulty || 3) * 2;
      const pastPaperScore = (subject.pastPaperImportance || 3) * 2;
      const exposureDiscount = (subject.previousExposure || 3) * -1;
      
      return {
        subject,
        topics,
        remaining,
        total,
        progress,
        score: volumeScore + behindScore + urgencyScore + difficultyScore + pastPaperScore + exposureDiscount
      };
    });
    
    // Sort by score (highest first)
    subjectScores.sort((a, b) => b.score - a.score);
    
    // Get topics that need revision today
    const revisionDueTopics = allTopics.filter(t => {
      return t.nextRevisionDate && t.nextRevisionDate <= dateStr && t.studyStatus !== 'not-started';
    });
    
    // Get previously scheduled subjects for this week to ensure variety
    const weekStart = DateUtils.getWeekStart(dateStr);
    const recentSubjects = [];
    // Check last 2 days to avoid consecutive same subjects
    for (let i = 1; i <= 2; i++) {
      const prevDate = DateUtils.addDays(dateStr, -i);
      const prevSchedule = Store.getSchedule(prevDate);
      if (prevSchedule) {
        prevSchedule.blocks.filter(b => b.type === 'study' && b.subjectId).forEach(b => {
          recentSubjects.push(b.subjectId);
        });
      }
    }
    
    // Select 2-3 different subjects for today (avoid recent repeats)
    const selectedAssignments = [];
    const usedSubjects = new Set();
    
    // Assignment 1: Highest priority subject (avoiding yesterday's subjects if possible)
    for (const ss of subjectScores) {
      if (ss.remaining === 0) continue;
      if (recentSubjects.includes(ss.subject.id) && subjectScores.filter(s => s.remaining > 0 && !recentSubjects.includes(s.subject.id)).length > 0) continue;
      
      const nextTopic = ss.topics.find(t => t.studyStatus === 'not-started');
      if (nextTopic) {
        selectedAssignments.push({
          subjectId: ss.subject.id, topicId: nextTopic.id,
          subjectName: ss.subject.name, topicName: nextTopic.name,
          type: 'study',
          reason: ss.progress < 0.3 ? 'Syllabus priority — low coverage' : ss.remaining > 20 ? 'Large syllabus volume' : 'Scheduled coverage',
          objectives: generateObjectives(nextTopic.name, ss.subject.name),
          duration: 120
        });
        usedSubjects.add(ss.subject.id);
        break;
      }
    }
    
    // Assignment 2: Second priority subject (different from first)
    for (const ss of subjectScores) {
      if (usedSubjects.has(ss.subject.id)) continue;
      if (ss.remaining === 0) continue;
      
      const nextTopic = ss.topics.find(t => t.studyStatus === 'not-started');
      if (nextTopic) {
        selectedAssignments.push({
          subjectId: ss.subject.id, topicId: nextTopic.id,
          subjectName: ss.subject.name, topicName: nextTopic.name,
          type: 'study',
          reason: ss.progress < 0.5 ? 'Subject falling behind' : 'Daily rotation — balanced coverage',
          objectives: generateObjectives(nextTopic.name, ss.subject.name),
          duration: 120
        });
        usedSubjects.add(ss.subject.id);
        break;
      }
    }
    
    // Assignment 3: Revision OR third subject
    if (revisionDueTopics.length > 0) {
      const revTopic = revisionDueTopics[0];
      const subject = Store.getSubject(revTopic.subjectId);
      selectedAssignments.push({
        subjectId: revTopic.subjectId, topicId: revTopic.id,
        subjectName: subject ? subject.name : 'Unknown',
        topicName: revTopic.name,
        type: 'revision',
        reason: 'Spaced revision due',
        objectives: ['Recall key concepts', 'Test self on main points', 'Identify weak areas'],
        duration: 90
      });
    } else {
      // Third different subject
      for (const ss of subjectScores) {
        if (usedSubjects.has(ss.subject.id)) continue;
        if (ss.remaining === 0) continue;
        const nextTopic = ss.topics.find(t => t.studyStatus === 'not-started');
        if (nextTopic) {
          selectedAssignments.push({
            subjectId: ss.subject.id, topicId: nextTopic.id,
            subjectName: ss.subject.name, topicName: nextTopic.name,
            type: 'study',
            reason: 'Subject rotation for variety',
            objectives: generateObjectives(nextTopic.name, ss.subject.name),
            duration: 90
          });
          break;
        }
      }
    }
    
    return selectedAssignments;
  },
  
  // Schedule revision for a completed topic
  scheduleRevision(topicId) {
    const topic = Store.getTopic(topicId);
    if (!topic || !topic.completedDate) return;
    
    const settings = Store.getSettings();
    const intervals = settings.revisionIntervals || [3, 7, 21];
    const revisionNumber = (topic.revisionDates || []).length;
    
    if (revisionNumber < intervals.length) {
      const nextDate = DateUtils.addDays(topic.completedDate, intervals[revisionNumber]);
      Store.saveTopic({ ...topic, nextRevisionDate: nextDate });
    }
  },
  
  // Get the daily question based on today's studied topics
  getDailyQuestion(dateStr) {
    const schedule = Store.getSchedule(dateStr);
    if (!schedule) return null;
    
    // Get study topic IDs from today
    const studyTopicIds = schedule.blocks
      .filter(b => (b.type === 'study' || b.type === 'revision') && b.topicId)
      .map(b => b.topicId);
    
    const studySubjectIds = schedule.blocks
      .filter(b => (b.type === 'study' || b.type === 'revision') && b.subjectId)
      .map(b => b.subjectId);
    
    // Search questions database for matching topics
    const allQuestions = Store.getQuestions();
    
    // Priority 1: Questions directly linked to today's topics
    let candidates = allQuestions.filter(q => 
      q.topicIds && q.topicIds.some(tid => studyTopicIds.includes(tid)) &&
      q.status === 'not-attempted'
    );
    
    // Priority 2: Questions from today's subjects
    if (candidates.length === 0) {
      candidates = allQuestions.filter(q => 
        studySubjectIds.includes(q.subjectId) &&
        q.status === 'not-attempted'
      );
    }
    
    // Priority 3: Any unattempted question
    if (candidates.length === 0) {
      candidates = allQuestions.filter(q => q.status === 'not-attempted');
    }
    
    if (candidates.length === 0) return null;
    
    // Select randomly from top candidates
    return candidates[Math.floor(Math.random() * Math.min(3, candidates.length))];
  },
  
  // Handle end of day: move incomplete tasks to backlog
  processEndOfDay(dateStr) {
    const schedule = Store.getSchedule(dateStr);
    if (!schedule) return;
    
    schedule.blocks.forEach(block => {
      if (block.type === 'study' && block.status === 'not-started') {
        block.status = 'carried-forward';
        Store.addToBacklog({
          originalDate: dateStr,
          subjectId: block.subjectId,
          topicId: block.topicId,
          title: block.title,
          duration: block.plannedDuration,
          priority: 'high',
          reason: 'Not completed on scheduled day',
          status: 'pending'
        });
      }
    });
    Store.saveSchedule(dateStr, schedule);
  },
  
  // Reschedule backlog item
  rescheduleBacklogItem(backlogId, targetDate) {
    const item = Store.getAllBacklog().find(b => b.id === backlogId);
    if (!item) return;
    
    // Add to target date's schedule
    let schedule = Store.getSchedule(targetDate) || this.generateDaySchedule(targetDate);
    // Find a revision/buffer slot or add at end of study time
    schedule.blocks.push({
      id: Store._generateId(),
      startTime: '14:30', endTime: '16:00',
      type: 'study', subjectId: item.subjectId, topicId: item.topicId,
      title: '[Rescheduled] ' + item.title,
      description: 'From backlog (originally ' + item.originalDate + ')',
      reason: 'Rescheduled from backlog',
      status: 'not-started',
      plannedDuration: item.duration || 90,
      actualDuration: 0,
      objectives: []
    });
    Store.saveSchedule(targetDate, schedule);
    Store.updateBacklogItem(backlogId, { status: 'rescheduled', rescheduledTo: targetDate });
  },
  
  // Ensure today's schedule exists
  ensureTodaySchedule() {
    const today = DateUtils.today();
    if (!Store.getSchedule(today)) {
      this.generateDaySchedule(today);
    }
    return Store.getSchedule(today);
  },
  
  // Get current active block based on time
  getCurrentBlock(dateStr) {
    const schedule = Store.getSchedule(dateStr || DateUtils.today());
    if (!schedule || !schedule.blocks) return null;
    
    const now = DateUtils.getTimeMinutes(DateUtils.now());
    
    // Find the block that contains the current time
    for (const block of schedule.blocks) {
      const start = DateUtils.getTimeMinutes(block.startTime);
      const end = DateUtils.getTimeMinutes(block.endTime);
      if (now >= start && now < end) return block;
    }
    return null;
  },
  
  // Get next upcoming block
  getNextBlock(dateStr) {
    const schedule = Store.getSchedule(dateStr || DateUtils.today());
    if (!schedule || !schedule.blocks) return null;
    
    const now = DateUtils.getTimeMinutes(DateUtils.now());
    
    for (const block of schedule.blocks) {
      const start = DateUtils.getTimeMinutes(block.startTime);
      if (start > now && block.type !== 'break' && block.type !== 'academy') return block;
    }
    return null;
  }
};

// Helper: Generate study objectives for a topic
function generateObjectives(topicName, subjectName) {
  return [
    `Understand the key concepts of ${topicName}`,
    `Take notes on important points`,
    `Identify connections with related topics`,
    `Prepare the concept for CSS answer writing`
  ];
}

export default Scheduler;
