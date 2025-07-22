# Undo Pie Package

![npm](https://img.shields.io/npm/v/undo-recovery?color=green) ![license](https://img.shields.io/npm/l/undo-recovery) ![downloads](https://img.shields.io/npm/dt/undo-recovery)

A robust recovery system for messages, files, and images with temporary storage and easy retrieval capabilities.

## Installation

```bash
npm install undo-pie
# or
yarn add undo-pie
```

## Features

- 📝 Message recovery with configurable retention
- 📁 File storage and retrieval
- 🖼️ Image handling with automatic thumbnails
- ⏳ Time-based automatic cleanup
- 💾 Multiple storage backends (memory, filesystem)
- 🔒 Optional encryption support

## Basic Usage

### Initialization

```javascript
const Undo = require('undo-pie');

// Simple in-memory storage
const undo = new Undo();

// With custom configuration
const undoWithConfig = new Undo({
  retentionPeriod: 48 * 60 * 60 * 1000, // 48 hours
  maxMessages: 200,
  maxFiles: 100,
  maxImages: 50,
  storageDir: './undo-storage' // For file persistence
});
```

## API Reference

### Message Recovery

```javascript
// Add a message to recovery
const msgId = undo.messageUndo.add("Don't forget to buy milk!");

// Retrieve a message
const recoveredMsg = undo.messageUndo.get(msgId);
console.log(recoveredMsg.content); // "Don't forget to buy milk!"

// Get all recoverable messages
const allMessages = undo.messageUndo.getAll();

// Remove from recovery
undo.messageUndo.remove(msgId);
```

### File Recovery

```javascript
const fs = require('fs');

// Add a file
const fileData = fs.readFileSync('report.pdf');
const fileId = undo.fileUndo.add({
  name: 'Q3-Report.pdf',
  data: fileData,
  type: 'application/pdf'
});

// Retrieve a file
const recoveredFile = await undo.fileUndo.get(fileId);
fs.writeFileSync('recovered-report.pdf', recoveredFile.data);
```

### Image Recovery

```javascript
// Add an image
const imageData = fs.readFileSync('profile.jpg');
const imageId = undo.imageUndo.add({
  name: 'profile-pic.jpg',
  data: imageData,
  type: 'image/jpeg'
});

// Retrieve original image
const fullImage = await undo.imageUndo.get(imageId);

// Retrieve thumbnail version
const thumbnail = await undo.imageUndo.get(imageId, true);
```

## Advanced Usage

### Custom Storage Backend

```javascript
class CustomStorage {
  // Implement required methods (get, set, delete, etc.)
}

const undo = new Undo({
  storage: new CustomStorage()
});
```

### Automatic Cleanup

```javascript
// Manual cleanup
await undo.cleanup();

// Scheduled cleanup (every 6 hours)
setInterval(() => undo.cleanup(), 6 * 60 * 60 * 1000);
```

### With Encryption

```javascript
const Undo = require('undo-pie');
const { EncryptedFileStorage } = require('undo-recovery/storage');

const undo = new Undo({
  storage: new EncryptedFileStorage({
    dir: './secure-storage',
    encryptionKey: 'your-secret-key-here'
  })
});
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `retentionPeriod` | number | 86400000 (24h) | How long to keep items (ms) |
| `maxMessages` | number | 100 | Maximum messages to store |
| `maxFiles` | number | 50 | Maximum files to store |
| `maxImages` | number | 30 | Maximum images to store |
| `storageDir` | string | './undo-storage' | Directory for file storage |
| `storage` | object | MemoryStorage | Custom storage adapter |
| `thumbnailSize` | object | {width:200,height:200} | Thumbnail dimensions |

## Storage Adapters

The package comes with several built-in storage options:

1. **MemoryStorage** (default) - Volatile in-memory storage
2. **FileSystemStorage** - Persistent disk storage
3. **EncryptedFileStorage** - Encrypted disk storage

```javascript
const { FileSystemStorage } = require('undo-pie/storage');

const undo = new Undo({
  storage: new FileSystemStorage({
    dir: './undo-data',
    maxSize: 1024 * 1024 * 500 // 500MB limit
  })
});
```

## Performance Considerations

1. For high-volume applications, consider using a database-backed storage adapter
2. Large files will consume significant memory - use streaming where possible
3. Set appropriate retention periods to prevent storage bloat

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT © Piyush Khandelwal

## Support

For issues and feature requests, please [open an issue](https://github.com/khandelwalpiyush19/undo-redo/issues) on GitHub.

---

This README provides comprehensive documentation for your published package, including installation instructions, usage examples, API reference, and configuration options. You may want to:

1. Replace placeholder values (like GitHub links) with your actual package information
2. Add any additional features specific to your implementation
3. Include a code of conduct and contribution guidelines if your package is open source
4. Add badges for build status, test coverage, etc. if applicable

The markdown is structured to work well on both GitHub and npmjs.com when published.