const DateUtils = {
  PREP_START: '2026-08-16',
  PREP_END: '2026-11-30',
  
  today() { return new Date().toISOString().split('T')[0]; },
  
  now() {
    const d = new Date();
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  },
  
  formatDate(dateStr) {
    // Returns 'Saturday, 16 August 2026'
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  },
  
  formatDateShort(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  },
  
  formatTime(timeStr) {
    // '09:30' -> '9:30 AM', '14:00' -> '2:00 PM'
    const [h, m] = timeStr.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2,'0')} ${ampm}`;
  },
  
  daysRemaining() {
    const today = new Date();
    today.setHours(0,0,0,0);
    const end = new Date(this.PREP_END + 'T00:00:00');
    const diff = end - today;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  },
  
  daysSinceStart() {
    const today = new Date();
    today.setHours(0,0,0,0);
    const start = new Date(this.PREP_START + 'T00:00:00');
    return Math.max(0, Math.floor((today - start) / (1000 * 60 * 60 * 24)));
  },
  
  totalPrepDays() {
    const start = new Date(this.PREP_START + 'T00:00:00');
    const end = new Date(this.PREP_END + 'T00:00:00');
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  },
  
  getCurrentPhase() {
    const today = this.today();
    if (today <= '2026-08-31') return 1;
    if (today <= '2026-10-31') return 2;
    return 3;
  },
  
  getPhaseLabel(phase) {
    const labels = { 1: 'Initial Coverage', 2: 'Main Completion', 3: 'Revision & Practice' };
    return labels[phase] || '';
  },
  
  getWeekStart(dateStr) {
    // Returns Monday of the week containing dateStr
    const d = new Date(dateStr + 'T00:00:00');
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d);
    monday.setDate(diff);
    return monday.toISOString().split('T')[0];
  },
  
  addDays(dateStr, n) {
    const d = new Date(dateStr + 'T00:00:00');
    d.setDate(d.getDate() + n);
    return d.toISOString().split('T')[0];
  },
  
  isToday(dateStr) { return dateStr === this.today(); },
  
  isSunday(dateStr) { return new Date(dateStr + 'T00:00:00').getDay() === 0; },
  
  getDayName(dateStr) {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long' });
  },
  
  getTimeMinutes(timeStr) {
    // '09:30' -> 570
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  },
  
  minutesToTime(mins) {
    // 570 -> '09:30'
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  },
  
  getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  },
  
  getMonthName(month) {
    return ['January','February','March','April','May','June','July','August','September','October','November','December'][month];
  },
  
  isWithinPrepWindow(dateStr) {
    return dateStr >= this.PREP_START && dateStr <= this.PREP_END;
  }
};

export default DateUtils;
