/**
 * LeadFlow - UserService
 * Manages demo user accounts, current active user state, and simulated authentication/roles.
 */

import { User } from '../models/User.js';
import { UserRoles, StorageKeys, Events } from '../core/Constants.js';

export class UserService {
  /**
   * @param {import('../core/EventEmitter.js').EventEmitter} eventEmitter
   */
  constructor(eventEmitter) {
    this.eventEmitter = eventEmitter;

    /** @type {Array<User>} */
    this.demoUsers = [
      new User({
        id: 'setter-1',
        name: 'Sarah Jenkins',
        role: UserRoles.SETTER,
        email: 'sarah.jenkins@leadflow.io',
        avatar: 'SJ',
        title: 'Senior Appointment Setter'
      }),
      new User({
        id: 'setter-2',
        name: 'Marcus Vance',
        role: UserRoles.SETTER,
        email: 'marcus.vance@leadflow.io',
        avatar: 'MV',
        title: 'Inbound Appointment Setter'
      }),
      new User({
        id: 'closer-1',
        name: 'Alex Rivera',
        role: UserRoles.CLOSER,
        email: 'alex.rivera@leadflow.io',
        avatar: 'AR',
        title: 'Account Executive / Closer'
      }),
      new User({
        id: 'closer-2',
        name: 'Elena Rostova',
        role: UserRoles.CLOSER,
        email: 'elena.rostova@leadflow.io',
        avatar: 'ER',
        title: 'Enterprise Closer'
      })
    ];

    this.activeUser = this._loadInitialUser();
  }

  /**
   * Load active user from localStorage or fallback to default first setter.
   * @private
   * @returns {User}
   */
  _loadInitialUser() {
    try {
      const storedId = localStorage.getItem(StorageKeys.ACTIVE_USER_ID);
      if (storedId) {
        const found = this.demoUsers.find(u => u.id === storedId);
        if (found) return found;
      }
    } catch {
      // Fallback
    }
    return this.demoUsers[0];
  }

  /**
   * Get all registered demo users.
   * @returns {Array<User>}
   */
  getAllUsers() {
    return [...this.demoUsers];
  }

  /**
   * Get all closers.
   * @returns {Array<User>}
   */
  getClosers() {
    return this.demoUsers.filter(u => u.role === UserRoles.CLOSER);
  }

  /**
   * Get all setters.
   * @returns {Array<User>}
   */
  getSetters() {
    return this.demoUsers.filter(u => u.role === UserRoles.SETTER);
  }

  /**
   * Find a user by id.
   * @param {string} id
   * @returns {User|null}
   */
  getUserById(id) {
    return this.demoUsers.find(u => u.id === id) || null;
  }

  /**
   * Get current active user.
   * @returns {User}
   */
  getActiveUser() {
    return this.activeUser;
  }

  /**
   * Switch the active user.
   * @param {string} userId
   * @returns {User}
   */
  setActiveUser(userId) {
    const user = this.getUserById(userId);
    if (!user) {
      throw new Error(`User with id "${userId}" does not exist.`);
    }

    this.activeUser = user;
    try {
      localStorage.setItem(StorageKeys.ACTIVE_USER_ID, user.id);
    } catch (e) {
      console.warn('Could not persist active user to localStorage:', e);
    }

    if (this.eventEmitter) {
      this.eventEmitter.emit(Events.USER_CHANGED, user);
    }

    return user;
  }
}
