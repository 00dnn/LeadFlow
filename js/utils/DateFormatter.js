/**
 * LeadFlow - DateFormatter Utility
 * Standardized date and time formatting across the UI.
 */

export class DateFormatter {
  /**
   * Format ISO date string into readable date (e.g., "Oct 14, 2026").
   * @param {string|Date} dateValue
   * @returns {string}
   */
  static formatDate(dateValue) {
    if (!dateValue) return '—';
    try {
      const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
      if (isNaN(date.getTime())) return String(dateValue);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return String(dateValue);
    }
  }

  /**
   * Format a time string (e.g. "14:30") into a friendly 12-hour format ("2:30 PM").
   * @param {string} timeString
   * @returns {string}
   */
  static formatTime(timeString) {
    if (!timeString) return '—';
    const parts = timeString.split(':');
    if (parts.length < 2) return timeString;

    let hours = parseInt(parts[0], 10);
    const minutes = parts[1].padStart(2, '0');
    if (isNaN(hours)) return timeString;

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  /**
   * Format an ISO timestamp into a complete date and time (e.g. "Oct 14, 2026, 2:30 PM").
   * @param {string|Date} isoString
   * @returns {string}
   */
  static formatDateTime(isoString) {
    if (!isoString) return '—';
    try {
      const date = typeof isoString === 'string' ? new Date(isoString) : isoString;
      if (isNaN(date.getTime())) return String(isoString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return String(isoString);
    }
  }

  /**
   * Format an ISO timestamp as a relative time string (e.g. "5m ago", "2h ago", "Yesterday").
   * @param {string|Date} isoString
   * @returns {string}
   */
  static formatRelativeTime(isoString) {
    if (!isoString) return '—';
    try {
      const date = typeof isoString === 'string' ? new Date(isoString) : isoString;
      if (isNaN(date.getTime())) return String(isoString);

      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHours = Math.floor(diffMin / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSec < 45) return 'Just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return this.formatDate(date);
    } catch {
      return String(isoString);
    }
  }
}
