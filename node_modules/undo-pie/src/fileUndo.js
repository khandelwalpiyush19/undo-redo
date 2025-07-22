const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class FileUndo {
  constructor(options = {}) {
    this.storage = options.storage || new Map();
    this.maxSize = options.maxFiles || 50;
    this.storageDir = options.storageDir || './undo-file-storage';
    
    // Create storage directory if it doesn't exist
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
  }

  async add(file) {
    if (this.storage.size >= this.maxSize) {
      const oldestKey = this.storage.keys().next().value;
      await this.remove(oldestKey);
    }

    const id = uuidv4();
    const filePath = path.join(this.storageDir, id);
    const fileInfo = {
      id,
      timestamp: Date.now(),
      name: file.name || 'file',
      type: file.type || 'application/octet-stream',
      size: file.data.length,
      path: filePath
    };

    try {
      await fs.promises.writeFile(filePath, file.data);
      this.storage.set(id, fileInfo);
      return id;
    } catch (err) {
      console.error('Failed to save file:', err);
      throw err;
    }
  }

  async get(id) {
    const fileInfo = this.storage.get(id);
    if (!fileInfo) return null;

    try {
      const data = await fs.promises.readFile(fileInfo.path);
      return {
        ...fileInfo,
        data
      };
    } catch (err) {
      console.error('Failed to read file:', err);
      return null;
    }
  }

  getAll() {
    return Array.from(this.storage.values());
  }

  async remove(id) {
    const fileInfo = this.storage.get(id);
    if (!fileInfo) return false;

    try {
      await fs.promises.unlink(fileInfo.path);
      this.storage.delete(id);
      return true;
    } catch (err) {
      console.error('Failed to delete file:', err);
      return false;
    }
  }

  async cleanup(olderThan) {
    for (const [id, item] of this.storage.entries()) {
      if (item.timestamp < olderThan) {
        await this.remove(id);
      }
    }
  }
}

module.exports = FileUndo;