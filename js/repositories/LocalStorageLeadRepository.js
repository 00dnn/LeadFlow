/**
 * LeadFlow - LocalStorageLeadRepository
 * Concrete implementation of ILeadRepository utilizing the browser's localStorage.
 * Realizes the Repository Pattern and encapsulates serialization and error handling.
 */

import { ILeadRepository } from './ILeadRepository.js';
import { Lead } from '../models/Lead.js';
import { StorageKeys } from '../core/Constants.js';

export class LocalStorageLeadRepository extends ILeadRepository {
  /**
   * @param {string} [storageKey=StorageKeys.LEADS]
   */
  constructor(storageKey = StorageKeys.LEADS) {
    super();
    this.storageKey = storageKey;
  }

  /**
   * Helper method to map raw JSON deserialized object into a domain Lead entity.
   * @private
   * @param {Object} rawJson
   * @returns {Lead}
   */
  _mapToDomain(rawJson) {
    return Lead.fromJSON(rawJson);
  }

  /**
   * Internal helper to read raw items from localStorage.
   * @private
   * @returns {Array<Object>}
   */
  _readRaw() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('[LocalStorageLeadRepository] Failed to parse leads from localStorage:', error);
      return [];
    }
  }

  /**
   * Internal helper to write raw array to localStorage.
   * @private
   * @param {Array<Object>} items
   */
  _writeRaw(items) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch (error) {
      console.error('[LocalStorageLeadRepository] Failed to write leads to localStorage:', error);
      if (error && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        throw new Error('Local storage capacity exceeded. Please clear old browser data.');
      }
      throw new Error('Storage write failed. Please check browser permissions.');
    }
  }

  /**
   * Persist a new lead entity.
   * @param {Lead} lead
   */
  save(lead) {
    if (!lead || !lead.id) {
      throw new Error('Cannot save lead without a valid id.');
    }

    const items = this._readRaw();
    const existingIndex = items.findIndex(item => item.id === lead.id);

    if (existingIndex >= 0) {
      items[existingIndex] = lead.toJSON();
    } else {
      items.unshift(lead.toJSON());
    }

    this._writeRaw(items);
  }

  /**
   * Update an existing lead entity.
   * @param {Lead} lead
   */
  update(lead) {
    if (!lead || !lead.id) {
      throw new Error('Cannot update lead without a valid id.');
    }

    const items = this._readRaw();
    const existingIndex = items.findIndex(item => item.id === lead.id);

    if (existingIndex === -1) {
      throw new Error(`Lead with id "${lead.id}" not found for update.`);
    }

    items[existingIndex] = lead.toJSON();
    this._writeRaw(items);
  }

  /**
   * Retrieve all stored leads mapped to domain entities.
   * @returns {Array<Lead>}
   */
  getAll() {
    const rawList = this._readRaw();
    return rawList.map(raw => this._mapToDomain(raw));
  }

  /**
   * Retrieve a single lead by its unique identifier.
   * @param {string} id
   * @returns {Lead|null}
   */
  getById(id) {
    const rawList = this._readRaw();
    const found = rawList.find(item => item.id === id);
    return found ? this._mapToDomain(found) : null;
  }

  /**
   * Retrieve all leads assigned to a specific closer.
   * @param {string} closerId
   * @returns {Array<Lead>}
   */
  getByCloserId(closerId) {
    const rawList = this._readRaw();
    return rawList
      .filter(item => item.closerId === closerId)
      .map(raw => this._mapToDomain(raw));
  }

  /**
   * Retrieve all leads submitted by a specific setter.
   * @param {string} setterId
   * @returns {Array<Lead>}
   */
  getBySetterId(setterId) {
    const rawList = this._readRaw();
    return rawList
      .filter(item => item.setterId === setterId)
      .map(raw => this._mapToDomain(raw));
  }

  /**
   * Bulk save multiple leads (e.g., seeding initial data).
   * @param {Array<Lead>} leads
   */
  saveAll(leads) {
    const serialized = leads.map(l => (l instanceof Lead ? l.toJSON() : l));
    this._writeRaw(serialized);
  }

  /**
   * Clear all leads from the repository.
   */
  clearAll() {
    localStorage.removeItem(this.storageKey);
  }
}
