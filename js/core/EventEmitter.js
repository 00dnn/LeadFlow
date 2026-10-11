/**
 * LeadFlow - EventEmitter
 * Implementation of the Observer / Publish-Subscribe Design Pattern.
 * Decouples system components and enables event-driven state updates.
 */

export class EventEmitter {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    this.events = new Map();
  }

  /**
   * Subscribe a listener to an event.
   * @param {string} event - The event name.
   * @param {Function} listener - The callback function.
   * @returns {Function} Unsubscribe function.
   */
  on(event, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError(`Listener for event "${event}" must be a function.`);
    }

    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    this.events.get(event).add(listener);

    // Return cleanup function for easy teardown
    return () => this.off(event, listener);
  }

  /**
   * Unsubscribe a listener from an event.
   * @param {string} event - The event name.
   * @param {Function} listener - The callback function.
   */
  off(event, listener) {
    if (!this.events.has(event)) return;
    const listeners = this.events.get(event);
    listeners.delete(listener);

    if (listeners.size === 0) {
      this.events.delete(event);
    }
  }

  /**
   * Publish an event to all subscribed listeners.
   * @param {string} event - The event name.
   * @param {any} [data] - The payload to pass to listeners.
   */
  emit(event, data) {
    if (!this.events.has(event)) return;
    const listeners = Array.from(this.events.get(event));
    listeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error(`[EventEmitter] Error executing listener for event "${event}":`, error);
      }
    });
  }

  /**
   * Clear all registered listeners.
   */
  clear() {
    this.events.clear();
  }
}
