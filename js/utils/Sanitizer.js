/**
 * LeadFlow - Sanitizer Utility
 * Provides defensive programming utilities against Cross-Site Scripting (XSS)
 * and assists in safe DOM manipulation.
 */

export class Sanitizer {
  /**
   * Escape an untrusted string to safe HTML entity representations.
   * Prevents injection attacks when strings are rendered.
   * @param {any} input - Raw user input.
   * @returns {string} Sanitized string.
   */
  static escapeHTML(input) {
    if (input === null || input === undefined) {
      return '';
    }
    const str = String(input);
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return str.replace(/[&<>"']/g, char => map[char]);
  }

  /**
   * Format phone number cleanly for presentation and safe display.
   * @param {string} phone - Raw phone input.
   * @returns {string} Formatted or sanitized phone string.
   */
  static formatPhone(phone) {
    if (!phone) return '';
    const cleaned = ('' + phone).replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return this.escapeHTML(phone);
  }

  /**
   * Safe text accessor with fallback default value.
   * @param {any} value
   * @param {string} [fallback='—']
   * @returns {string}
   */
  static safeText(value, fallback = '—') {
    if (value === null || value === undefined || String(value).trim() === '') {
      return fallback;
    }
    return this.escapeHTML(String(value).trim());
  }
}
