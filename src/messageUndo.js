class MessageUndo {
  constructor(options = {}) {
    this.storage = options.storage || new Map();
    this.maxSize = options.maxSize || 100; // Max messages to store
  }

  add(message) {
    if (this.storage.size >= this.maxSize) {
      const oldestKey = this.storage.keys().next().value;
      this.storage.delete(oldestKey);
    }
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    this.storage.set(id, {
      id,
      timestamp: Date.now(),
      content: message
    });
    return id;
  }

  get(id) {
    return this.storage.get(id);
  }

  getAll() {
    return Array.from(this.storage.values());
  }

  remove(id) {
    this.storage.delete(id);
  }

  cleanup(olderThan) {
    for (const [id, item] of this.storage.entries()) {
      if (item.timestamp < olderThan) {
        this.storage.delete(id);
      }
    }
  }
}

module.exports = MessageUndo;