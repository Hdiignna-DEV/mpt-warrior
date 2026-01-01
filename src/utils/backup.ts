// Backup & Restore Utilities

export const backup = {
  // Export all data as JSON
  exportAllData: () => {
    const data = {
      trades: JSON.parse(localStorage.getItem('trades') || '[]'),
      analytics: {
        views: JSON.parse(localStorage.getItem('mpt_analytics_views') || '{}'),
        actions: JSON.parse(localStorage.getItem('mpt_analytics_actions') || '[]'),
      },
      exportDate: new Date().toISOString(),
      version: '1.0',
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mpt_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  },

  // Import data from JSON
  importData: (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          
          // Validate data structure
          if (!data.trades || !Array.isArray(data.trades)) {
            throw new Error('Invalid backup file format');
          }

          // Restore data
          localStorage.setItem('trades', JSON.stringify(data.trades));
          
          if (data.analytics) {
            localStorage.setItem('mpt_analytics_views', JSON.stringify(data.analytics.views || {}));
            localStorage.setItem('mpt_analytics_actions', JSON.stringify(data.analytics.actions || []));
          }

          resolve({ success: true, tradesCount: data.trades.length });
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  },

  // Auto backup to localStorage with timestamp
  autoBackup: () => {
    const backupData = {
      trades: JSON.parse(localStorage.getItem('trades') || '[]'),
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('mpt_auto_backup', JSON.stringify(backupData));
  },

  // Restore from auto backup
  restoreAutoBackup: () => {
    const backup = localStorage.getItem('mpt_auto_backup');
    if (backup) {
      const data = JSON.parse(backup);
      localStorage.setItem('trades', JSON.stringify(data.trades));
      return data.timestamp;
    }
    return null;
  },
};

// Auto backup every 30 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    backup.autoBackup();
  }, 30 * 60 * 1000); // 30 minutes
}