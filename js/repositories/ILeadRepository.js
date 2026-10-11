/**
 * LeadFlow - ILeadRepository Interface
 * Abstract contract defining persistence operations for Lead entities.
 * Applies the Interface Segregation and Dependency Inversion Principles (SOLID).
 */

export class ILeadRepository {
  /**
   * Persist a new lead entity.
   * @param {import('../models/Lead.js').Lead} lead
   * @returns {void}
   */
  save(lead) {
    throw new Error('Method "save" must be implemented by concrete repository subclass.');
  }

  /**
   * Update an existing lead entity.
   * @param {import('../models/Lead.js').Lead} lead
   * @returns {void}
   */
  update(lead) {
    throw new Error('Method "update" must be implemented by concrete repository subclass.');
  }

  /**
   * Retrieve all stored leads.
   * @returns {Array<import('../models/Lead.js').Lead>}
   */
  getAll() {
    throw new Error('Method "getAll" must be implemented by concrete repository subclass.');
  }

  /**
   * Retrieve a single lead by its unique identifier.
   * @param {string} id
   * @returns {import('../models/Lead.js').Lead|null}
   */
  getById(id) {
    throw new Error('Method "getById" must be implemented by concrete repository subclass.');
  }

  /**
   * Retrieve all leads assigned to a specific closer.
   * @param {string} closerId
   * @returns {Array<import('../models/Lead.js').Lead>}
   */
  getByCloserId(closerId) {
    throw new Error('Method "getByCloserId" must be implemented by concrete repository subclass.');
  }

  /**
   * Retrieve all leads submitted by a specific setter.
   * @param {string} setterId
   * @returns {Array<import('../models/Lead.js').Lead>}
   */
  getBySetterId(setterId) {
    throw new Error('Method "getBySetterId" must be implemented by concrete repository subclass.');
  }

  /**
   * Clear all leads from the repository.
   * @returns {void}
   */
  clearAll() {
    throw new Error('Method "clearAll" must be implemented by concrete repository subclass.');
  }

  /**
   * Bulk save multiple leads.
   * @param {Array<import('../models/Lead.js').Lead>} leads
   * @returns {void}
   */
  saveAll(leads) {
    throw new Error('Method "saveAll" must be implemented by concrete repository subclass.');
  }
}
