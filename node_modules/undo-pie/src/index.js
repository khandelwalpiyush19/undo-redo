const MessageUndo = require('./messageUndo');
const FileUndo = require('./fileUndo');
const ImageUndo = require('./imageUndo');

class Undo {
  constructor(options = {}) {
    this.messageUndo = new MessageUndo(options);
    this.fileUndo = new FileUndo(options);
    this.imageUndo = new ImageUndo(options);
    this.retentionPeriod = options.retentionPeriod || 24 * 60 * 60 * 1000; // Default 24 hours
  }

  async cleanup() {
    const now = Date.now();
    await this.messageUndo.cleanup(now - this.retentionPeriod);
    await this.fileUndo.cleanup(now - this.retentionPeriod);
    await this.imageUndo.cleanup(now - this.retentionPeriod);
  }
}

module.exports = Undo;