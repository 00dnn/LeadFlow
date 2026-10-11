/**
 * LeadFlow - User Domain Model
 * Represents an authenticated or simulated user (Appointment Setter or Closer).
 */

import { UserRoles } from '../core/Constants.js';

export class User {
  /**
   * @param {Object} params
   * @param {string} params.id
   * @param {string} params.name
   * @param {string} params.role
   * @param {string} [params.email]
   * @param {string} [params.avatar]
   * @param {string} [params.title]
   */
  constructor({ id, name, role, email = '', avatar = '', title = '' }) {
    if (!id || !name || !role) {
      throw new Error('User requires id, name, and role.');
    }
    this.id = id;
    this.name = name;
    this.role = role;
    this.email = email;
    this.avatar = avatar;
    this.title = title || role;
  }

  isSetter() {
    return this.role === UserRoles.SETTER;
  }

  isCloser() {
    return this.role === UserRoles.CLOSER;
  }

  /**
   * Serialize to plain JSON object
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      role: this.role,
      email: this.email,
      avatar: this.avatar,
      title: this.title
    };
  }

  /**
   * Factory method to instantiate User from JSON/raw object
   */
  static fromJSON(raw) {
    if (!raw) return null;
    return new User({
      id: raw.id,
      name: raw.name,
      role: raw.role,
      email: raw.email,
      avatar: raw.avatar,
      title: raw.title
    });
  }
}
