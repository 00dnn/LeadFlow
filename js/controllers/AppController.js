/**
 * LeadFlow - AppController
 * Master application controller coordinating user switching, lifecycle events,
 * and component synchronization.
 */

import { Sanitizer } from '../utils/Sanitizer.js';
import { Toast } from '../utils/Toast.js';
import { Events } from '../core/Constants.js';
import { initialSeedLeads } from '../data/seedData.js';

export class AppController {
  /**
   * @param {Object} options
   * @param {import('../services/LeadService.js').LeadService} options.leadService
   * @param {import('../services/UserService.js').UserService} options.userService
   * @param {import('../controllers/DashboardController.js').DashboardController} options.dashboardController
   * @param {import('../controllers/ModalController.js').ModalController} options.modalController
   * @param {import('../core/EventEmitter.js').EventEmitter} options.eventEmitter
   */
  constructor({ leadService, userService, dashboardController, modalController, eventEmitter }) {
    this.leadService = leadService;
    this.userService = userService;
    this.dashboardController = dashboardController;
    this.modalController = modalController;
    this.eventEmitter = eventEmitter;

    this._bindElements();
    this._attachEventListeners();
    this._subscribeToEvents();
  }

  _bindElements() {
    this.userSelect = document.getElementById('user-switcher-select');
    this.currentUserAvatar = document.getElementById('current-user-avatar');
    this.currentUserName = document.getElementById('current-user-name');
    this.currentUserRole = document.getElementById('current-user-role');
    this.newAppointmentBtn = document.getElementById('open-create-modal-btn');
    this.resetDataBtn = document.getElementById('reset-demo-data-btn');
  }

  _attachEventListeners() {
    // User Switcher select change
    if (this.userSelect) {
      this.userSelect.addEventListener('change', (e) => {
        const selectedId = e.target.value;
        try {
          const user = this.userService.setActiveUser(selectedId);
          Toast.info(`Switched view to ${user.name} (${user.role})`);
        } catch (error) {
          Toast.error(error.message);
        }
      });
    }

    // Reset Demo Data
    if (this.resetDataBtn) {
      this.resetDataBtn.addEventListener('click', () => {
        const confirmed = window.confirm(
          'Reset LeadFlow to original demo data?\nThis will restore the 8 initial appointments and seed histories.'
        );
        if (confirmed) {
          this.leadService.resetToSeedData(initialSeedLeads);
          this.dashboardController.render();
          Toast.success('Application data reset to clean demo state.');
        }
      });
    }
  }

  _subscribeToEvents() {
    this.eventEmitter.on(Events.USER_CHANGED, () => {
      this.renderHeaderUserInfo();
      this.dashboardController.resetFilters();
      this.dashboardController.render();
      this.modalController.populateCloserOptions();
    });

    this.eventEmitter.on(Events.LEAD_CREATED, () => {
      this.dashboardController.render();
    });

    this.eventEmitter.on(Events.LEAD_UPDATED, () => {
      this.dashboardController.render();
    });
  }

  /**
   * Initialize entire application UI.
   */
  init() {
    this.renderUserSwitcherOptions();
    this.renderHeaderUserInfo();
    this.dashboardController.render();
  }

  /**
   * Populate user switcher select options.
   */
  renderUserSwitcherOptions() {
    if (!this.userSelect) return;
    const allUsers = this.userService.getAllUsers();
    const active = this.userService.getActiveUser();

    this.userSelect.innerHTML = allUsers.map(user => {
      const selected = active && active.id === user.id ? 'selected' : '';
      return `
        <option value="${Sanitizer.escapeHTML(user.id)}" ${selected}>
          ${Sanitizer.escapeHTML(user.name)} — ${Sanitizer.escapeHTML(user.role)}
        </option>
      `;
    }).join('');
  }

  /**
   * Update header user pill & action button permissions.
   */
  renderHeaderUserInfo() {
    const user = this.userService.getActiveUser();
    if (!user) return;

    if (this.userSelect) {
      this.userSelect.value = user.id;
    }

    if (this.currentUserAvatar) {
      this.currentUserAvatar.textContent = user.avatar || user.name.slice(0, 2).toUpperCase();
    }

    if (this.currentUserName) {
      this.currentUserName.textContent = user.name;
    }

    if (this.currentUserRole) {
      this.currentUserRole.textContent = user.role;
      this.currentUserRole.className = `user-role-badge ${user.isSetter() ? 'role-setter' : 'role-closer'}`;
    }

    // Adjust "+ New Appointment" button visibility/state
    if (this.newAppointmentBtn) {
      if (user.isSetter()) {
        this.newAppointmentBtn.style.display = 'inline-flex';
        this.newAppointmentBtn.title = 'Create a qualified customer appointment';
      } else {
        // Closers do not set appointments; hide or disable with hint
        this.newAppointmentBtn.style.display = 'none';
      }
    }
  }
}
