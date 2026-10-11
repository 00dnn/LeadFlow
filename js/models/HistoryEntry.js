/**
 * LeadFlow - HistoryEntry Domain Model
 * Represents an immutable chronological audit trail item for a lead.
 */

export class HistoryEntry {
  /**
   * @param {Object} params
   * @param {string} [params.id]
   * @param {string} [params.timestamp] - ISO string
   * @param {string} params.userId
   * @param {string} params.userName
   * @param {string} params.userRole
   * @param {string|null} [params.fromStatus]
   * @param {string} params.toStatus
   * @param {string} [params.note]
   * @param {'created'|'status_update'|'note_added'} [params.actionType='status_update']
   */
  constructor({
    id,
    timestamp,
    userId,
    userName,
    userRole,
    fromStatus = null,
    toStatus,
    note = '',
    actionType = 'status_update'
  }) {
    this.id = id || `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.timestamp = timestamp || new Date().toISOString();
    this.userId = userId || 'unknown';
    this.userName = userName || 'System User';
    this.userRole = userRole || 'Unknown Role';
    this.fromStatus = fromStatus;
    this.toStatus = toStatus;
    this.note = note ? String(note).trim() : '';
    this.actionType = actionType;
  }

  toJSON() {
    return {
      id: this.id,
      timestamp: this.timestamp,
      userId: this.userId,
      userName: this.userName,
      userRole: this.userRole,
      fromStatus: this.fromStatus,
      toStatus: this.toStatus,
      note: this.note,
      actionType: this.actionType
    };
  }

  static fromJSON(raw) {
    if (!raw) return null;
    return new HistoryEntry(raw);
  }
}
