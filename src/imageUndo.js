const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp'); // For image processing

class ImageUndo {
  constructor(options = {}) {
    this.storage = options.storage || new Map();
    this.maxSize = options.maxImages || 30;
    this.storageDir = options.storageDir || './undo-image-storage';
    this.thumbnailSize = options.thumbnailSize || { width: 200, height: 200 };
    
    // Create storage directory if it doesn't exist
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
  }

  async add(image) {
    if (this.storage.size >= this.maxSize) {
      const oldestKey = this.storage.keys().next().value;
      await this.remove(oldestKey);
    }

    const id = uuidv4();
    const imagePath = path.join(this.storageDir, id);
    const thumbPath = path.join(this.storageDir, `${id}_thumb`);

    const imageInfo = {
      id,
      timestamp: Date.now(),
      name: image.name || 'image',
      type: image.type || 'image/jpeg',
      size: image.data.length,
      path: imagePath,
      thumbPath
    };

    try {
      // Save original image
      await fs.promises.writeFile(imagePath, image.data);
      
      // Create and save thumbnail
      await sharp(image.data)
        .resize(this.thumbnailSize.width, this.thumbnailSize.height)
        .toFile(thumbPath);

      this.storage.set(id, imageInfo);
      return id;
    } catch (err) {
      console.error('Failed to save image:', err);
      throw err;
    }
  }

  async get(id, thumbnail = false) {
    const imageInfo = this.storage.get(id);
    if (!imageInfo) return null;

    try {
      const path = thumbnail ? imageInfo.thumbPath : imageInfo.path;
      const data = await fs.promises.readFile(path);
      return {
        ...imageInfo,
        data,
        isThumbnail: thumbnail
      };
    } catch (err) {
      console.error('Failed to read image:', err);
      return null;
    }
  }

  getAll() {
    return Array.from(this.storage.values()).map(info => ({
      id: info.id,
      timestamp: info.timestamp,
      name: info.name,
      type: info.type,
      size: info.size
    }));
  }

  async remove(id) {
    const imageInfo = this.storage.get(id);
    if (!imageInfo) return false;

    try {
      await fs.promises.unlink(imageInfo.path);
      await fs.promises.unlink(imageInfo.thumbPath);
      this.storage.delete(id);
      return true;
    } catch (err) {
      console.error('Failed to delete image:', err);
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

module.exports = ImageUndo;