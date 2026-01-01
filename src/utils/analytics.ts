// Simple Analytics Tracker (localStorage-based)

export const analytics = {
  // Track page view
  trackPageView: (pageName: string) => {
    const views = JSON.parse(localStorage.getItem('mpt_analytics_views') || '{}');
    views[pageName] = (views[pageName] || 0) + 1;
    views.lastVisit = new Date().toISOString();
    localStorage.setItem('mpt_analytics_views', JSON.stringify(views));
  },

  // Track action
  trackAction: (action: string, metadata?: Record<string, unknown>) => {
    const actions = JSON.parse(localStorage.getItem('mpt_analytics_actions') || '[]');
    actions.push({
      action,
      metadata,
      timestamp: new Date().toISOString(),
    });
    // Keep only last 100 actions
    if (actions.length > 100) actions.shift();
    localStorage.setItem('mpt_analytics_actions', JSON.stringify(actions));
  },

  // Get stats
  getStats: () => {
    const views = JSON.parse(localStorage.getItem('mpt_analytics_views') || '{}');
    const actions = JSON.parse(localStorage.getItem('mpt_analytics_actions') || '[]');
    return { views, actions };
  },

  // Track session
  trackSession: () => {
    const sessions = JSON.parse(localStorage.getItem('mpt_sessions') || '[]');
    sessions.push({
      start: new Date().toISOString(),
    });
    localStorage.setItem('mpt_sessions', JSON.stringify(sessions));
  },
};

// Usage:
// analytics.trackPageView('Dashboard');
// analytics.trackAction('trade_added', { pair: 'XAUUSD', result: 'WIN' });
// analytics.trackAction('calculator_used', { balance: 10000, risk: 1 });