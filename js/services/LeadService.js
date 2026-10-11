/**
 * LeadFlow - LeadService
 * Encapsulates core business rules, validation, permission verification,
 * and coordinates between the repository and event bus.
 */

import { Lead } from '../models/Lead.js';
import { HistoryEntry } from '../models/HistoryEntry.js';
import { LeadStatus, UserRoles, Events, StorageKeys } from '../core/Constants.js';

export class LeadService {
  /**
   * @param {import('../repositories/ILeadRepository.js').ILeadRepository} repository
   * @param {import('./UserService.js').UserService} userService
   * @param {import('../core/EventEmitter.js').EventEmitter} eventEmitter
   */
  constructor(repository, userService, eventEmitter) {
    if (!repository) {
      throw new Error('LeadService requires a valid ILeadRepository instance.');
    }
    this.repository = repository;
    this.userService = userService;
    this.eventEmitter = eventEmitter;
  }

  /**
   * Initialize repository with seed data if currently empty.
   * Ensures data persistence after reload without overwriting user data.
   * @param {Array<Object>} seedItems
   */
  initSeedDataIfEmpty(seedItems) {
    const existing = this.repository.getAll();
    const hasInitializedFlag = localStorage.getItem(StorageKeys.INITIALIZED);

    if (existing.length === 0 && !hasInitializedFlag) {
      const leads = seedItems.map(item => Lead.fromJSON(item));
      this.repository.saveAll(leads);
      try {
        localStorage.setItem(StorageKeys.INITIALIZED, 'true');
      } catch (e) {
        console.warn('Could not set initialized flag:', e);
      }
    }
  }

  /**
   * Force reset localStorage back to initial seed data.
   * Helpful for grading, demonstrations, and test suites.
   * @param {Array<Object>} seedItems
   */
  resetToSeedData(seedItems) {
    this.repository.clearAll();
    const leads = seedItems.map(item => Lead.fromJSON(item));
    this.repository.saveAll(leads);
    localStorage.setItem(StorageKeys.INITIALIZED, 'true');
    if (this.eventEmitter) {
      this.eventEmitter.emit(Events.LEAD_UPDATED, null);
    }
  }

  /**
   * Validate appointment payload before creation.
   * @param {Object} data
   * @returns {{isValid: boolean, errors: Object<string, string>}}
   */
  validateAppointmentData(data) {
    const errors = {};

    if (!data.customerName || !String(data.customerName).trim()) {
      errors.customerName = 'Customer name is required.';
    } else if (String(data.customerName).trim().length < 2) {
      errors.customerName = 'Customer name must be at least 2 characters.';
    }

    if (!data.phoneNumber || !String(data.phoneNumber).trim()) {
      errors.phoneNumber = 'Phone number is required.';
    } else {
      const digits = String(data.phoneNumber).replace(/\D/g, '');
      if (digits.length < 7) {
        errors.phoneNumber = 'Phone number must have at least 7 digits.';
      }
    }

    if (data.email && String(data.email).trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(String(data.email).trim())) {
        errors.email = 'Please provide a valid email address.';
      }
    }

    if (!data.serviceInterest || !String(data.serviceInterest).trim()) {
      errors.serviceInterest = 'Please select a service interest.';
    }

    if (!data.appointmentDate) {
      errors.appointmentDate = 'Appointment date is required.';
    }

    if (!data.appointmentTime) {
      errors.appointmentTime = 'Appointment time is required.';
    }

    if (!data.closerId) {
      errors.closerId = 'An assigned closer must be selected.';
    } else if (this.userService && !this.userService.getUserById(data.closerId)) {
      errors.closerId = 'Selected closer does not exist in the system.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Create a new qualified customer appointment.
   * @param {Object} data
   * @param {string|import('../models/User.js').User} setter
   * @returns {Lead}
   */
  createAppointment(data, setter) {
    const setterUser = typeof setter === 'object' && setter !== null
      ? setter
      : this.userService.getUserById(setter);

    if (!setterUser) {
      throw new Error('Valid appointment setter is required to create a lead.');
    }

    if (setterUser.role !== UserRoles.SETTER) {
      throw new Error('Permission denied: Only Appointment Setters can create appointments.');
    }

    const validation = this.validateAppointmentData(data);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      throw new Error(`Validation Error: ${firstError}`);
    }

    const uniqueId = `LF-${Math.floor(100000 + Math.random() * 900000)}`;
    const nowIso = new Date().toISOString();

    const initialNotes = [];
    if (data.notes && String(data.notes).trim()) {
      initialNotes.push(String(data.notes).trim());
    }

    const creationHistory = new HistoryEntry({
      timestamp: nowIso,
      userId: setterUser.id,
      userName: setterUser.name,
      userRole: setterUser.role,
      fromStatus: null,
      toStatus: LeadStatus.PENDING,
      note: data.notes ? String(data.notes).trim() : 'Appointment scheduled and assigned to closer.',
      actionType: 'created'
    });

    const lead = new Lead({
      id: uniqueId,
      customerName: String(data.customerName).trim(),
      phoneNumber: String(data.phoneNumber).trim(),
      email: data.email ? String(data.email).trim() : '',
      serviceInterest: String(data.serviceInterest).trim(),
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime,
      setterId: setterUser.id,
      closerId: data.closerId,
      status: LeadStatus.PENDING,
      notes: initialNotes,
      history: [creationHistory],
      createdAt: nowIso,
      updatedAt: nowIso
    });

    this.repository.save(lead);

    if (this.eventEmitter) {
      this.eventEmitter.emit(Events.LEAD_CREATED, lead);
    }

    return lead;
  }

  /**
   * Update outcome status and notes for a lead.
   * @param {string} leadId
   * @param {string} newStatus
   * @param {string} note
   * @param {import('../models/User.js').User} closerUser
   * @returns {Lead}
   */
  updateLeadOutcome(leadId, newStatus, note, closerUser) {
    if (!leadId) {
      throw new Error('Lead ID is required.');
    }

    const lead = this.repository.getById(leadId);
    if (!lead) {
      throw new Error(`Appointment lead "${leadId}" was not found.`);
    }

    if (!closerUser) {
      throw new Error('User context is required to update lead outcome.');
    }

    // Role permission verification
    if (closerUser.role !== UserRoles.CLOSER) {
      throw new Error('Permission denied: Only Closers can update lead outcomes.');
    }

    // Verify closer assignment
    if (lead.closerId !== closerUser.id) {
      throw new Error(`Permission denied: You can only update appointments assigned to you (${closerUser.name}).`);
    }

    // Validate new status
    const validStatuses = Object.values(LeadStatus);
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status "${newStatus}". Must be one of: ${validStatuses.join(', ')}`);
    }

    lead.updateStatus(newStatus, note, closerUser);
    this.repository.update(lead);

    if (this.eventEmitter) {
      this.eventEmitter.emit(Events.LEAD_UPDATED, lead);
    }

    return lead;
  }

  /**
   * Retrieve all appointments assigned to a closer.
   * @param {string} closerId
   * @returns {Array<Lead>}
   */
  getLeadsForCloser(closerId) {
    return this.repository.getByCloserId(closerId);
  }

  /**
   * Retrieve all appointments submitted by a setter.
   * @param {string} setterId
   * @returns {Array<Lead>}
   */
  getLeadsBySetter(setterId) {
    return this.repository.getBySetterId(setterId);
  }

  /**
   * Get lead by ID.
   * @param {string} id
   * @returns {Lead|null}
   */
  getLeadById(id) {
    return this.repository.getById(id);
  }

  /**
   * Retrieve all leads in storage.
   * @returns {Array<Lead>}
   */
  getAllLeads() {
    return this.repository.getAll();
  }

  /**
   * Calculate summary metrics tailored for the currently viewing user.
   * @param {import('../models/User.js').User} user
   * @returns {Object}
   */
  getStatistics(user) {
    if (!user) {
      return { total: 0, pending: 0, followUps: 0, won: 0, lost: 0, conversionRate: '0%' };
    }

    const leads = user.isSetter()
      ? this.getLeadsBySetter(user.id)
      : this.getLeadsForCloser(user.id);

    const total = leads.length;
    const pending = leads.filter(l => l.status === LeadStatus.PENDING).length;
    const followUps = leads.filter(l => l.status === LeadStatus.FOLLOW_UP_REQUIRED).length;
    const won = leads.filter(l => l.status === LeadStatus.WON).length;
    const contacted = leads.filter(l => l.status === LeadStatus.CONTACTED).length;
    const interested = leads.filter(l => l.status === LeadStatus.INTERESTED).length;
    const lost = leads.filter(l => l.status === LeadStatus.LOST).length;

    const rate = total > 0 ? Math.round((won / total) * 100) : 0;

    return {
      total,
      pending,
      followUps,
      won,
      contacted,
      interested,
      lost,
      conversionRate: `${rate}%`
    };
  }
}
