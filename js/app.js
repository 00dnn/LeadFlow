/**
 * LeadFlow - Application Entry Point
 * Bootstraps the application, performs Dependency Injection,
 * and initializes architectural layers according to SOLID principles.
 */

import { EventEmitter } from './core/EventEmitter.js';
import { LocalStorageLeadRepository } from './repositories/LocalStorageLeadRepository.js';
import { UserService } from './services/UserService.js';
import { LeadService } from './services/LeadService.js';
import { DashboardController } from './controllers/DashboardController.js';
import { ModalController } from './controllers/ModalController.js';
import { AppController } from './controllers/AppController.js';
import { initialSeedLeads } from './data/seedData.js';

document.addEventListener('DOMContentLoaded', () => {
  try {
    // 1. Core Event Bus (Observer Pattern)
    const eventEmitter = new EventEmitter();

    // 2. Data Persistence Layer (Repository Pattern / Dependency Inversion)
    const leadRepository = new LocalStorageLeadRepository();

    // 3. Service Layer (Business Logic & Entities)
    const userService = new UserService(eventEmitter);
    const leadService = new LeadService(leadRepository, userService, eventEmitter);

    // 4. Populate realistic demo dataset if clean storage
    leadService.initSeedDataIfEmpty(initialSeedLeads);

    // 5. Modal Controller (Creation & Details Management)
    const modalController = new ModalController({
      leadService,
      userService,
      eventEmitter
    });

    // 6. Dashboard Controller (Views, Filters, Table Rendering)
    const dashboardController = new DashboardController({
      leadService,
      userService,
      eventEmitter,
      onViewLeadDetails: (leadId) => modalController.openLeadDetails(leadId)
    });

    // 7. Master App Controller (User Switching, Navigation, Orchestration)
    const appController = new AppController({
      leadService,
      userService,
      dashboardController,
      modalController,
      eventEmitter
    });

    // 8. Launch Application
    appController.init();

    console.info('🚀 LeadFlow successfully initialized with SOLID modular architecture.');
  } catch (error) {
    console.error('Fatal initialization error in LeadFlow:', error);
  }
});
