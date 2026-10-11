/**
 * LeadFlow - DashboardController
 * Manages the dashboard view, metrics cards, table rendering, search, and filtering.
 */

import { Sanitizer } from '../utils/Sanitizer.js';
import { DateFormatter } from '../utils/DateFormatter.js';
import { LeadStatusConfig, LeadStatus } from '../core/Constants.js';

export class DashboardController {
  /**
   * @param {Object} options
   * @param {import('../services/LeadService.js').LeadService} options.leadService
   * @param {import('../services/UserService.js').UserService} options.userService
   * @param {import('../core/EventEmitter.js').EventEmitter} options.eventEmitter
   * @param {Function} options.onViewLeadDetails - Callback when user clicks to inspect a lead
   */
  constructor({ leadService, userService, eventEmitter, onViewLeadDetails }) {
    this.leadService = leadService;
    this.userService = userService;
    this.eventEmitter = eventEmitter;
    this.onViewLeadDetails = onViewLeadDetails;

    this.searchTerm = '';
    this.statusFilter = 'ALL';

    this._bindElements();
    this._attachEventListeners();
  }

  _bindElements() {
    this.statsContainer = document.getElementById('stats-grid');
    this.tableBody = document.getElementById('appointments-table-body');
    this.mobileCardContainer = document.getElementById('appointments-mobile-cards');
    this.emptyState = document.getElementById('appointments-empty-state');
    this.searchInput = document.getElementById('search-input');
    this.statusSelect = document.getElementById('status-filter-select');
    this.clearFiltersBtn = document.getElementById('clear-filters-btn');
    this.resultsCountBadge = document.getElementById('results-count-badge');
    this.roleBanner = document.getElementById('role-banner');
    this.roleBannerTitle = document.getElementById('role-banner-title');
    this.roleBannerSubtitle = document.getElementById('role-banner-subtitle');
  }

  _attachEventListeners() {
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value.toLowerCase().trim();
        this.renderTable();
      });
    }

    if (this.statusSelect) {
      this.statusSelect.addEventListener('change', (e) => {
        this.statusFilter = e.target.value;
        this.renderTable();
      });
    }

    if (this.clearFiltersBtn) {
      this.clearFiltersBtn.addEventListener('click', () => {
        this.resetFilters();
      });
    }
  }

  resetFilters() {
    this.searchTerm = '';
    this.statusFilter = 'ALL';
    if (this.searchInput) this.searchInput.value = '';
    if (this.statusSelect) this.statusSelect.value = 'ALL';
    this.renderTable();
  }

  /**
   * Main render trigger for dashboard view.
   */
  render() {
    this.renderRoleBanner();
    this.renderStats();
    this.renderTable();
  }

  /**
   * Render role awareness banner informing the user of the current perspective.
   */
  renderRoleBanner() {
    const user = this.userService.getActiveUser();
    if (!this.roleBanner || !user) return;

    if (user.isSetter()) {
      this.roleBanner.className = 'role-banner banner-setter';
      this.roleBannerTitle.textContent = `Setter Workspace: ${user.name}`;
      this.roleBannerSubtitle.textContent = 'Showing qualified leads submitted by you. Create new appointments and monitor closer outcomes.';
    } else {
      this.roleBanner.className = 'role-banner banner-closer';
      this.roleBannerTitle.textContent = `Closer Workspace: ${user.name}`;
      this.roleBannerSubtitle.textContent = 'Showing appointments assigned to you. Review client profiles, record outcomes, and advance deal statuses.';
    }
  }

  /**
   * Render KPI summary metrics cards.
   */
  renderStats() {
    if (!this.statsContainer) return;
    const user = this.userService.getActiveUser();
    const stats = this.leadService.getStatistics(user);

    const isSetter = user.isSetter();

    this.statsContainer.innerHTML = `
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">${isSetter ? 'Total Submitted' : 'Assigned Leads'}</span>
          <div class="stat-icon icon-primary">
            <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
        <div class="stat-value">${stats.total}</div>
        <div class="stat-footer text-muted">${isSetter ? 'Your booked consultations' : 'Active pipeline appointments'}</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">Pending Outreach</span>
          <div class="stat-icon icon-warning">
            <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
        <div class="stat-value">${stats.pending}</div>
        <div class="stat-footer text-muted">${isSetter ? 'Awaiting closer first call' : 'Needs initial call'}</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">Follow-ups Required</span>
          <div class="stat-icon icon-info">
            <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
              <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
        <div class="stat-value">${stats.followUps}</div>
        <div class="stat-footer text-muted">Customer requested callback</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">Deals Won</span>
          <div class="stat-icon icon-success">
            <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
        <div class="stat-value">${stats.won}</div>
        <div class="stat-footer text-success font-medium">${stats.conversionRate} Win Rate</div>
      </div>
    `;
  }

  /**
   * Filter leads according to active user role, search query, and status selector.
   * @returns {Array<import('../models/Lead.js').Lead>}
   */
  getFilteredLeads() {
    const user = this.userService.getActiveUser();
    if (!user) return [];

    let leads = user.isSetter()
      ? this.leadService.getLeadsBySetter(user.id)
      : this.leadService.getLeadsForCloser(user.id);

    // Apply status filter
    if (this.statusFilter !== 'ALL') {
      leads = leads.filter(lead => lead.status === this.statusFilter);
    }

    // Apply search filter (customerName, phoneNumber, serviceInterest)
    if (this.searchTerm) {
      leads = leads.filter(lead => {
        const nameMatch = lead.customerName.toLowerCase().includes(this.searchTerm);
        const phoneMatch = lead.phoneNumber.replace(/\D/g, '').includes(this.searchTerm.replace(/\D/g, ''));
        const serviceMatch = lead.serviceInterest.toLowerCase().includes(this.searchTerm);
        const emailMatch = (lead.email || '').toLowerCase().includes(this.searchTerm);
        const idMatch = lead.id.toLowerCase().includes(this.searchTerm);

        return nameMatch || phoneMatch || serviceMatch || emailMatch || idMatch;
      });
    }

    // Sort by appointment date descending / recent first
    return leads.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
  }

  /**
   * Render appointments in both table (desktop) and card list (mobile).
   */
  renderTable() {
    const leads = this.getFilteredLeads();
    const activeUser = this.userService.getActiveUser();

    if (this.resultsCountBadge) {
      this.resultsCountBadge.textContent = `${leads.length} lead${leads.length === 1 ? '' : 's'}`;
    }

    if (leads.length === 0) {
      if (this.tableBody) this.tableBody.innerHTML = '';
      if (this.mobileCardContainer) this.mobileCardContainer.innerHTML = '';
      if (this.emptyState) this.emptyState.classList.remove('hidden');
      return;
    }

    if (this.emptyState) this.emptyState.classList.add('hidden');

    // Desktop Table Rendering
    if (this.tableBody) {
      this.tableBody.innerHTML = leads.map(lead => this._renderTableRow(lead, activeUser)).join('');
    }

    // Mobile Cards Rendering
    if (this.mobileCardContainer) {
      this.mobileCardContainer.innerHTML = leads.map(lead => this._renderMobileCard(lead, activeUser)).join('');
    }

    // Bind action buttons safely
    this._bindLeadActionButtons();
  }

  _renderTableRow(lead, activeUser) {
    const statusCfg = LeadStatusConfig[lead.status] || { badgeClass: 'badge-pending', label: lead.status };
    const setter = this.userService.getUserById(lead.setterId);
    const closer = this.userService.getUserById(lead.closerId);

    const actionText = activeUser && activeUser.isCloser() ? 'Update & History' : 'View Details';
    const actionBtnClass = activeUser && activeUser.isCloser() ? 'btn-primary-sm' : 'btn-outline-sm';

    return `
      <tr class="table-row-item" data-lead-id="${Sanitizer.escapeHTML(lead.id)}">
        <td class="font-medium text-main">
          <div class="customer-info-cell">
            <span class="customer-name">${Sanitizer.escapeHTML(lead.customerName)}</span>
            <span class="customer-id">${Sanitizer.escapeHTML(lead.id)}</span>
          </div>
        </td>
        <td>
          <div class="contact-info-cell">
            <span class="contact-phone">${Sanitizer.formatPhone(lead.phoneNumber)}</span>
            <span class="contact-email text-muted">${Sanitizer.safeText(lead.email, '')}</span>
          </div>
        </td>
        <td>
          <span class="service-pill">${Sanitizer.escapeHTML(lead.serviceInterest)}</span>
        </td>
        <td>
          <div class="date-cell">
            <span class="date-text">${DateFormatter.formatDate(lead.appointmentDate)}</span>
            <span class="time-text text-muted">${DateFormatter.formatTime(lead.appointmentTime)}</span>
          </div>
        </td>
        <td>
          <div class="assignee-cell">
            <span class="assignee-name font-medium">${Sanitizer.escapeHTML(closer ? closer.name : 'Unassigned')}</span>
            <span class="setter-sub text-muted">Set by: ${Sanitizer.escapeHTML(setter ? setter.name : 'Unknown')}</span>
          </div>
        </td>
        <td>
          <span class="badge ${statusCfg.badgeClass}">
            <span class="badge-dot"></span>
            ${Sanitizer.escapeHTML(statusCfg.label)}
          </span>
        </td>
        <td class="text-right">
          <button type="button" class="btn ${actionBtnClass} view-lead-btn" data-lead-id="${Sanitizer.escapeHTML(lead.id)}" aria-label="View details for ${Sanitizer.escapeHTML(lead.customerName)}">
            ${actionText}
          </button>
        </td>
      </tr>
    `;
  }

  _renderMobileCard(lead, activeUser) {
    const statusCfg = LeadStatusConfig[lead.status] || { badgeClass: 'badge-pending', label: lead.status };
    const closer = this.userService.getUserById(lead.closerId);
    const actionText = activeUser && activeUser.isCloser() ? 'Update & History' : 'View Details';

    return `
      <div class="mobile-lead-card" data-lead-id="${Sanitizer.escapeHTML(lead.id)}">
        <div class="mobile-card-header">
          <div>
            <div class="mobile-customer-name">${Sanitizer.escapeHTML(lead.customerName)}</div>
            <div class="mobile-lead-id">${Sanitizer.escapeHTML(lead.id)}</div>
          </div>
          <span class="badge ${statusCfg.badgeClass}">
            <span class="badge-dot"></span>
            ${Sanitizer.escapeHTML(statusCfg.label)}
          </span>
        </div>
        <div class="mobile-card-body">
          <div class="mobile-info-row">
            <span class="mobile-label">Service:</span>
            <span class="mobile-value font-medium">${Sanitizer.escapeHTML(lead.serviceInterest)}</span>
          </div>
          <div class="mobile-info-row">
            <span class="mobile-label">Schedule:</span>
            <span class="mobile-value">${DateFormatter.formatDate(lead.appointmentDate)} at ${DateFormatter.formatTime(lead.appointmentTime)}</span>
          </div>
          <div class="mobile-info-row">
            <span class="mobile-label">Phone:</span>
            <span class="mobile-value">${Sanitizer.formatPhone(lead.phoneNumber)}</span>
          </div>
          <div class="mobile-info-row">
            <span class="mobile-label">Closer:</span>
            <span class="mobile-value font-medium">${Sanitizer.escapeHTML(closer ? closer.name : '—')}</span>
          </div>
        </div>
        <div class="mobile-card-footer">
          <button type="button" class="btn btn-outline-sm btn-block view-lead-btn" data-lead-id="${Sanitizer.escapeHTML(lead.id)}">
            ${actionText}
          </button>
        </div>
      </div>
    `;
  }

  _bindLeadActionButtons() {
    const buttons = document.querySelectorAll('.view-lead-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const leadId = e.currentTarget.getAttribute('data-lead-id');
        if (leadId && this.onViewLeadDetails) {
          this.onViewLeadDetails(leadId);
        }
      });
    });
  }
}
