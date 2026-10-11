/**
 * LeadFlow - Lead Domain Model
 * Core entity representing a customer appointment and its progression.
 * Conforms to structural design specifications with encapsulated status and audit logic.
 */

import { LeadStatus } from '../core/Constants.js';
import { HistoryEntry } from './HistoryEntry.js';

export class Lead {
  /**
   * @param {Object} params
   * @param {string} [params.id]
   * @param {string} params.customerName
   * @param {string} params.phoneNumber
   * @param {string} [params.email]
   * @param {string} params.serviceInterest
   * @param {string} params.appointmentDate - YYYY-MM-DD
   * @param {string} params.appointmentTime - HH:mm
   * @param {string} params.setterId
   * @param {string} params.closerId
   * @param {string} [params.status=LeadStatus.PENDING]
   * @param {Array<string>} [params.notes=[]]
   * @param {Array<HistoryEntry|Object>} [params.history=[]]
   * @param {string} [params.createdAt]
   * @param {string} [params.updatedAt]
   */
  constructor({
    id,
    customerName,
    phoneNumber,
    email = '',
    serviceInterest,
    appointmentDate,
    appointmentTime,
    setterId,
    closerId,
    status = LeadStatus.PENDING,
    notes = [],
    history = [],
    createdAt,
    updatedAt
  }) {
    this.id = id || `LF-${Date.now().toString().slice(-6)}`;
    this.customerName = customerName;
    this.phoneNumber = phoneNumber;
    this.email = email || '';
    this.serviceInterest = serviceInterest;
    this.appointmentDate = appointmentDate;
    this.appointmentTime = appointmentTime;
    this.setterId = setterId;
    this.closerId = closerId;
    this.status = status || LeadStatus.PENDING;

    // Notes collection
    this.notes = Array.isArray(notes) ? [...notes] : [];

    // Chronological history audit trail
    this.history = Array.isArray(history)
      ? history.map(item => (item instanceof HistoryEntry ? item : HistoryEntry.fromJSON(item)))
      : [];

    const now = new Date().toISOString();
    this.createdAt = createdAt || now;
    this.updatedAt = updatedAt || now;
  }

  /**
   * Add a generic or outcome note to the lead.
   * @param {string} noteText
   * @param {import('./User.js').User} [user]
   */
  addNote(noteText, user) {
    const trimmed = String(noteText || '').trim();
    if (!trimmed) return;

    this.notes.push(trimmed);
    this.updatedAt = new Date().toISOString();

    const entry = new HistoryEntry({
      timestamp: this.updatedAt,
      userId: user ? user.id : 'unknown',
      userName: user ? user.name : 'System User',
      userRole: user ? user.role : 'System',
      fromStatus: this.status,
      toStatus: this.status,
      note: trimmed,
      actionType: 'note_added'
    });

    this.history.push(entry);
  }

  /**
   * Update lead status and record an immutable audit history entry.
   * @param {string} newStatus - Value from LeadStatus enum
   * @param {string} [note=''] - Outcome or progression note
   * @param {import('./User.js').User} [user] - Responsible closer or user
   */
  updateStatus(newStatus, note = '', user) {
    const validStatuses = Object.values(LeadStatus);
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status "${newStatus}". Must be one of: ${validStatuses.join(', ')}`);
    }

    const previousStatus = this.status;
    const trimmedNote = String(note || '').trim();

    this.status = newStatus;
    this.updatedAt = new Date().toISOString();

    if (trimmedNote) {
      this.notes.push(trimmedNote);
    }

    const entry = new HistoryEntry({
      timestamp: this.updatedAt,
      userId: user ? user.id : 'unknown',
      userName: user ? user.name : 'Closer',
      userRole: user ? user.role : 'Closer',
      fromStatus: previousStatus,
      toStatus: newStatus,
      note: trimmedNote,
      actionType: 'status_update'
    });

    this.history.push(entry);
  }

  /**
   * Convert domain model to a clean serializable object.
   */
  toJSON() {
    return {
      id: this.id,
      customerName: this.customerName,
      phoneNumber: this.phoneNumber,
      email: this.email,
      serviceInterest: this.serviceInterest,
      appointmentDate: this.appointmentDate,
      appointmentTime: this.appointmentTime,
      setterId: this.setterId,
      closerId: this.closerId,
      status: this.status,
      notes: this.notes,
      history: this.history.map(entry => entry.toJSON()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Factory method to recreate Lead domain entity from serialized object.
   */
  static fromJSON(raw) {
    if (!raw) return null;
    return new Lead(raw);
  }
}
