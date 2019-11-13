const Singleton = (function () {
  // Instance stores a reference to the EventManager
  let instance;

  return {
    // Get the Singleton instance if one exists
    // or create one if it doesn't
    getInstance() {
      if (!instance) {
        instance = new EventManager();
      }
      return instance;
    },
  };
})();

export default Singleton;

class EventManager {
  /** *
   * Event manager class responsible for transfer event between apps the naming convention for event type
   * are followed to avoid any duplicacy (path.unique_id.component_name)
   * @type {{}}
   */
  constructor() {
    this.eventsDirectory = {};
  }

  subscribe = (listener, ...eventTypes) => {
    /** *
     * Provide event type and listener for which event should be listen
     */
    eventTypes.map(eventType => {
      const eventDirectory = this.eventsDirectory[eventType] || [];
      if (eventDirectory.indexOf(listener) === -1) {
        eventDirectory.push(listener);
      }
      this.eventsDirectory[eventType] = eventDirectory;
    });
  };

  unsubscribe = (listener, ...eventTypes) => {
    /** *
     * Provide event type and listener for which event subscription need to remove
     */
    eventTypes.map(eventType => {
      const eventDirectory = this.eventsDirectory[eventType] || [];
      const listenerIndex = eventDirectory.indexOf(listener);
      if (listenerIndex >= 0) {
        eventDirectory.pop(listenerIndex);
      }
    });
  };

  notify = (eventType, ...params) => {
    /** *
     * Notify for event type with useful data in params
     */
    const eventDirectory = this.eventsDirectory[eventType];
    if (eventDirectory) {
      eventDirectory.map(listener => listener(eventType, ...params));
    }
  }
}

