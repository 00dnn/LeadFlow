/**
 * LeadFlow - ModalController
 * Handles Create Appointment modal, Lead Details & Activity modal, and Closer Update interactions.
 */

import { Sanitizer } from '../utils/Sanitizer.js';
import { DateFormatter } from '../utils/DateFormatter.js';
import { Toast } from '../utils/Toast.js';
import { LeadStatus, LeadStatusConfig, ServiceOptions } from '../core/Constants.js';

export class ModalController {
  /**
   * @param {Object} options
   * @param {import('../services/LeadService.js').LeadService} options.leadService
   * @param {import('../services/UserService.js').UserService} options.userService
   * @param {import('../core/EventEmitter.js').EventEmitter} options.eventEmitter
   */
  constructor({ leadService, userService, eventEmitter }) {
    this.leadService = leadService;
    this.userService = userService;
    this.eventEmitter = eventEmitter;

    this.currentLeadId = null;

    this._bindElements();
    this._attachEventListeners();
    this._populateFormStaticOptions();
  }

  _bindElements() {
    // Create Modal Elements
    this.createModal = document.getElementById('create-lead-modal');
    this.createForm = document.getElementById('create-lead-form');
    this.openCreateModalBtn = document.getElementById('open-create-modal-btn');
    this.closeCreateModalBtn = document.getElementById('close-create-modal-btn');
    this.cancelCreateModalBtn = document.getElementById('cancel-create-modal-btn');
    this.closerSelect = document.getElementById('lead-closer-select');
    this.serviceSelect = document.getElementById('lead-service-select');
    this.createFormError = document.getElementById('create-form-error');

    // Details Modal Elements
    this.detailsModal = document.getElementById('lead-details-modal');
    this.closeDetailsModalBtn = document.getElementById('close-details-modal-btn');
    this.detailsContent = document.getElementById('lead-details-content');
  }

  _attachEventListeners() {
    // Create Modal triggers
    if (this.openCreateModalBtn) {
      this.openCreateModalBtn.addEventListener('click', () => this.openCreateModal());
    }
    if (this.closeCreateModalBtn) {
      this.closeCreateModalBtn.addEventListener('click', () => this.closeCreateModal());
    }
    if (this.cancelCreateModalBtn) {
      this.cancelCreateModalBtn.addEventListener('click', () => this.closeCreateModal());
    }

    if (this.createForm) {
      this.createForm.addEventListener('submit', (e) => this._handleCreateSubmit(e));
    }

    // Details Modal close trigger
    if (this.closeDetailsModalBtn) {
      this.closeDetailsModalBtn.addEventListener('click', () => this.closeDetailsModal());
    }

    // Close on backdrop click or ESC key
    [this.createModal, this.detailsModal].forEach(modal => {
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            this.closeAllModals();
          }
        });
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
  }

  _populateFormStaticOptions() {
    // Service options
    if (this.serviceSelect) {
      this.serviceSelect.innerHTML = `
        <option value="" disabled selected>Select service interest...</option>
        ${ServiceOptions.map(srv => `<option value="${Sanitizer.escapeHTML(srv)}">${Sanitizer.escapeHTML(srv)}</option>`).join('')}
      `;
    }
  }

  /**
   * Populate closer options dropdown based on active closers.
   */
  populateCloserOptions() {
    if (!this.closerSelect) return;
    const closers = this.userService.getClosers();
    this.closerSelect.innerHTML = `
      <option value="" disabled selected>Assign closer...</option>
      ${closers.map(c => `<option value="${Sanitizer.escapeHTML(c.id)}">${Sanitizer.escapeHTML(c.name)} (${Sanitizer.escapeHTML(c.title)})</option>`).join('')}
    `;
  }

  openCreateModal() {
    const activeUser = this.userService.getActiveUser();
    if (!activeUser || !activeUser.isSetter()) {
      Toast.warning('Only Appointment Setters can schedule new appointments. Switch to a Setter role to test this feature.');
      return;
    }

    this.populateCloserOptions();
    if (this.createForm) {
      this.createForm.reset();
      // Set default appointment date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateInput = document.getElementById('lead-date');
      if (dateInput) {
        dateInput.value = tomorrow.toISOString().split('T')[0];
      }
      const timeInput = document.getElementById('lead-time');
      if (timeInput) {
        timeInput.value = '10:00';
      }
    }
    if (this.createFormError) {
      this.createFormError.classList.add('hidden');
      this.createFormError.textContent = '';
    }

    if (this.createModal) {
      this.createModal.classList.remove('hidden');
      document.body.classList.add('modal-open');
    }
  }

  closeCreateModal() {
    if (this.createModal) {
      this.createModal.classList.add('hidden');
    }
    document.body.classList.remove('modal-open');
  }

  closeDetailsModal() {
    if (this.detailsModal) {
      this.detailsModal.classList.add('hidden');
    }
    this.currentLeadId = null;
    document.body.classList.remove('modal-open');
  }

  closeAllModals() {
    this.closeCreateModal();
    this.closeDetailsModal();
  }

  _handleCreateSubmit(e) {
    e.preventDefault();
    const activeUser = this.userService.getActiveUser();

    if (!activeUser || !activeUser.isSetter()) {
      Toast.error('Only Appointment Setters can create appointments.');
      return;
    }

    const formData = new FormData(this.createForm);
    const payload = {
      customerName: formData.get('customerName'),
      phoneNumber: formData.get('phoneNumber'),
      email: formData.get('email'),
      serviceInterest: formData.get('serviceInterest'),
      appointmentDate: formData.get('appointmentDate'),
      appointmentTime: formData.get('appointmentTime'),
      closerId: formData.get('closerId'),
      notes: formData.get('notes')
    };

    try {
      const createdLead = this.leadService.createAppointment(payload, activeUser);
      this.closeCreateModal();
      Toast.success(`Appointment scheduled successfully for ${createdLead.customerName} (${createdLead.id})!`);
    } catch (error) {
      if (this.createFormError) {
        this.createFormError.textContent = error.message;
        this.createFormError.classList.remove('hidden');
      } else {
        Toast.error(error.message);
      }
    }
  }

  /**
   * Open comprehensive Lead Details & Audit History modal.
   * @param {string} leadId
   */
  openLeadDetails(leadId) {
    this.currentLeadId = leadId;
    const lead = this.leadService.getLeadById(leadId);
    if (!lead) {
      Toast.error('Lead not found.');
      return;
    }

    this._renderDetailsModalContent(lead);

    if (this.detailsModal) {
      this.detailsModal.classList.remove('hidden');
      document.body.classList.add('modal-open');
    }
  }

  /**
   * Re-render current details modal after an update.
   */
  refreshCurrentDetails() {
    if (!this.currentLeadId) return;
    const lead = this.leadService.getLeadById(this.currentLeadId);
    if (lead) {
      this._renderDetailsModalContent(lead);
    }
  }

  _renderDetailsModalContent(lead) {
    if (!this.detailsContent) return;

    const activeUser = this.userService.getActiveUser();
    const setter = this.userService.getUserById(lead.setterId);
    const closer = this.userService.getUserById(lead.closerId);
    const statusCfg = LeadStatusConfig[lead.status] || { badgeClass: 'badge-pending', label: lead.status };

    const canUpdate = activeUser && activeUser.isCloser() && activeUser.id === lead.closerId;
    const isSetterView = activeUser && activeUser.isSetter();

    const historyItems = [...lead.history].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    this.detailsContent.innerHTML = `
      <div class="lead-modal-header-card">
        <div class="header-main">
          <div class="header-meta">
            <span class="lead-id-tag">${Sanitizer.escapeHTML(lead.id)}</span>
            <span class="badge ${statusCfg.badgeClass}">
              <span class="badge-dot"></span>
              ${Sanitizer.escapeHTML(statusCfg.label)}
            </span>
          </div>
          <h2 class="lead-modal-title">${Sanitizer.escapeHTML(lead.customerName)}</h2>
          <div class="lead-service-highlight">${Sanitizer.escapeHTML(lead.serviceInterest)}</div>
        </div>
      </div>

      <!-- Overview Information Grid -->
      <div class="details-grid">
        <div class="detail-box">
          <span class="detail-box-label">Phone Number</span>
          <span class="detail-box-value">${Sanitizer.formatPhone(lead.phoneNumber)}</span>
        </div>
        <div class="detail-box">
          <span class="detail-box-label">Email Address</span>
          <span class="detail-box-value">${Sanitizer.safeText(lead.email, 'Not provided')}</span>
        </div>
        <div class="detail-box">
          <span class="detail-box-label">Appointment Time</span>
          <span class="detail-box-value">${DateFormatter.formatDate(lead.appointmentDate)} at ${DateFormatter.formatTime(lead.appointmentTime)}</span>
        </div>
        <div class="detail-box">
          <span class="detail-box-label">Assigned Closer</span>
          <span class="detail-box-value font-medium">${Sanitizer.escapeHTML(closer ? closer.name : 'Unassigned')}</span>
        </div>
        <div class="detail-box">
          <span class="detail-box-label">Created By Setter</span>
          <span class="detail-box-value font-medium">${Sanitizer.escapeHTML(setter ? setter.name : 'Unknown')}</span>
        </div>
        <div class="detail-box">
          <span class="detail-box-label">Created At</span>
          <span class="detail-box-value">${DateFormatter.formatDateTime(lead.createdAt)}</span>
        </div>
      </div>

      <!-- Closer Action Panel / Role Notice -->
      <div class="closer-action-section">
        ${this._renderUpdatePanelHTML(lead, activeUser, canUpdate, isSetterView, closer)}
      </div>

      <!-- Chronological History Audit Timeline -->
      <div class="lead-history-section">
        <div class="section-heading-row">
          <h3 class="section-title">Audit History & Timeline</h3>
          <span class="history-count-tag">${lead.history.length} event${lead.history.length === 1 ? '' : 's'}</span>
        </div>
        <p class="section-subtitle">Chronological record of status advancements, notes, and user actions.</p>

        <div class="timeline-container">
          ${historyItems.map(entry => this._renderTimelineEntry(entry)).join('')}
        </div>
      </div>
    `;

    // Bind closer update form if interactive
    if (canUpdate) {
      const updateForm = document.getElementById('closer-update-form');
      if (updateForm) {
        updateForm.addEventListener('submit', (e) => this._handleCloserUpdateSubmit(e, lead.id));
      }
    }
  }

  _renderUpdatePanelHTML(lead, activeUser, canUpdate, isSetterView, closer) {
    if (canUpdate) {
      const statusOptions = Object.values(LeadStatus).map(st => {
        const selected = st === lead.status ? 'selected' : '';
        return `<option value="${Sanitizer.escapeHTML(st)}" ${selected}>${Sanitizer.escapeHTML(st)}</option>`;
      }).join('');

      return `
        <div class="update-card active-closer-card">
          <div class="update-card-header">
            <div>
              <h4 class="update-card-title">Update Lead Outcome</h4>
              <p class="update-card-desc">As the assigned closer, update status and record consultation notes.</p>
            </div>
            <span class="role-pill-badge pill-closer">Assigned Closer</span>
          </div>

          <form id="closer-update-form" class="update-form">
            <div class="form-row-2">
              <div class="form-group">
                <label for="update-lead-status" class="form-label">New Status <span class="required">*</span></label>
                <select id="update-lead-status" name="status" class="form-select" required>
                  ${statusOptions}
                </select>
              </div>
              <div class="form-group">
                <label for="update-lead-note" class="form-label">Outcome Notes <span class="required">*</span></label>
                <textarea id="update-lead-note" name="note" class="form-textarea" rows="2" placeholder="Record call outcome, customer feedback, next steps..." required></textarea>
              </div>
            </div>
            <div class="form-actions-row">
              <button type="submit" class="btn btn-primary">
                Save Status Update
              </button>
            </div>
          </form>
        </div>
      `;
    }

    if (isSetterView) {
      return `
        <div class="update-card notice-card">
          <div class="notice-icon">
            <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div>
            <div class="notice-title">Appointment Setter View (Read-Only)</div>
            <div class="notice-body">
              You submitted this lead. Status updates and outcome notes are managed by the assigned closer (<strong>${Sanitizer.escapeHTML(closer ? closer.name : 'Assigned Closer')}</strong>). Switch accounts in the header to simulate the Closer experience.
            </div>
          </div>
        </div>
      `;
    }

    // Active user is another closer
    return `
      <div class="update-card notice-card warning-notice">
        <div class="notice-icon text-warning">
          <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
        </div>
        <div>
          <div class="notice-title">Assigned to ${Sanitizer.escapeHTML(closer ? closer.name : 'Another Closer')}</div>
          <div class="notice-body">
            You are currently signed in as <strong>${Sanitizer.escapeHTML(activeUser ? activeUser.name : 'User')}</strong>. Role security restricts status updates to the assigned closer. Switch to ${Sanitizer.escapeHTML(closer ? closer.name : 'the assigned closer')} to update this lead.
          </div>
        </div>
      </div>
    `;
  }

  _renderTimelineEntry(entry) {
    const isCreation = entry.actionType === 'created';
    const statusCfg = LeadStatusConfig[entry.toStatus] || { badgeClass: 'badge-pending', label: entry.toStatus };

    const statusTransition = entry.fromStatus && entry.fromStatus !== entry.toStatus
      ? `<span class="transition-pill">${Sanitizer.escapeHTML(entry.fromStatus)} &rarr; ${Sanitizer.escapeHTML(entry.toStatus)}</span>`
      : `<span class="badge ${statusCfg.badgeClass}"><span class="badge-dot"></span>${Sanitizer.escapeHTML(entry.toStatus)}</span>`;

    return `
      <div class="timeline-item">
        <div class="timeline-indicator ${isCreation ? 'indicator-created' : 'indicator-update'}">
          ${isCreation ? '&plus;' : '&bull;'}
        </div>
        <div class="timeline-content">
          <div class="timeline-meta-row">
            <div class="timeline-user-info">
              <span class="timeline-user-name font-medium">${Sanitizer.escapeHTML(entry.userName)}</span>
              <span class="timeline-role-badge">${Sanitizer.escapeHTML(entry.userRole)}</span>
            </div>
            <div class="timeline-time-info">
              <span class="timeline-time" title="${Sanitizer.escapeHTML(entry.timestamp)}">${DateFormatter.formatDateTime(entry.timestamp)}</span>
              <span class="timeline-rel-time text-muted">(${DateFormatter.formatRelativeTime(entry.timestamp)})</span>
            </div>
          </div>

          <div class="timeline-status-row">
            ${statusTransition}
          </div>

          ${entry.note ? `<div class="timeline-note-bubble">${Sanitizer.escapeHTML(entry.note)}</div>` : ''}
        </div>
      </div>
    `;
  }

  _handleCloserUpdateSubmit(e, leadId) {
    e.preventDefault();
    const activeUser = this.userService.getActiveUser();
    const form = e.target;
    const newStatus = form.status.value;
    const note = form.note.value;

    try {
      this.leadService.updateLeadOutcome(leadId, newStatus, note, activeUser);
      Toast.success(`Lead status successfully updated to "${newStatus}"!`);
      this.refreshCurrentDetails();
    } catch (error) {
      Toast.error(error.message);
    }
  }
}
