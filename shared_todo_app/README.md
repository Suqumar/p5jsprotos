# 📝 Shared Todo List - Claude Persistent Storage

A modern, feature-rich todo list application built with Claude Persistent Storage APIs for seamless data persistence and sharing.

## Features

### Core Functionality
- ✅ **Create, Read, Update, Delete** todos
- 🏷️ **Status Management**: Pending, In Progress, Completed
- 🔍 **Search & Filter**: Find todos quickly with real-time search
- 📊 **Statistics Dashboard**: Track your progress at a glance
- 💾 **Persistent Storage**: Automatic saving with localStorage
- 📥 **Import/Export**: Share todos across devices or backup your data
- ⌨️ **Keyboard Shortcuts**: Fast navigation and actions

### Storage Architecture

The app uses a **storage abstraction layer** that makes it extensible to different storage backends:

1. **LocalStorage** (Current): Browser-based persistence for offline-first experience
2. **MCP Resources** (Future): Can be extended to use Model Context Protocol for shared storage
3. **Cloud Storage** (Future): Extensible to cloud-based backends

```javascript
class TodoStorage {
  constructor() {
    this.storageType = 'localStorage'; // Extensible to 'mcp', 'cloud', etc.
  }

  load() { /* Load from storage */ }
  save(todos) { /* Save to storage */ }
}
```

## Usage

### Opening the App

Simply open `index.html` in a web browser. No server or dependencies required!

### Adding Todos

1. Type your todo in the input field
2. Select a status (Pending, In Progress, or Completed)
3. Click "Add Todo" or press Enter

### Managing Todos

- **Edit**: Click the ✏️ button to modify content
- **Delete**: Click the 🗑️ button to remove
- **Change Status**: Use the status buttons at the bottom of each todo
- **Search**: Type in the search box to filter todos
- **Filter**: Use the status dropdown to show specific statuses

### Keyboard Shortcuts

- `Ctrl/Cmd + K`: Focus search
- `Ctrl/Cmd + N`: Focus new todo input
- `Enter`: Add todo (when input is focused)

### Import/Export

**Export:**
1. Click "📥 Export" button
2. Save the JSON file to your device

**Import:**
1. Click "📤 Import" button
2. Select a previously exported JSON file
3. Choose to merge with or replace existing todos

## Data Structure

Todos are stored as JSON objects with the following structure:

```json
{
  "version": "1.0.0",
  "todos": [
    {
      "id": "todo_1234567890_abc123",
      "content": "Complete the project",
      "status": "in_progress",
      "createdAt": "2025-11-08T12:00:00.000Z",
      "updatedAt": "2025-11-08T12:30:00.000Z"
    }
  ],
  "lastSync": "2025-11-08T12:30:00.000Z"
}
```

## Technical Details

### Storage API

The app implements a persistent storage layer compatible with Claude's storage paradigm:

- **Auto-save**: Changes are immediately persisted
- **Sync status**: Shows when data was last saved
- **Version control**: Data structure versioning for future upgrades
- **Error handling**: Graceful fallbacks for storage failures

### Future Extensions

The architecture supports extending to MCP (Model Context Protocol) resources:

```javascript
// Future MCP integration
class MCPTodoStorage extends TodoStorage {
  constructor(mcpServer) {
    super();
    this.storageType = 'mcp';
    this.server = mcpServer;
  }

  async load() {
    // Fetch from MCP resource
    return await this.server.getResource('todos');
  }

  async save(todos) {
    // Save to MCP resource
    return await this.server.setResource('todos', todos);
  }
}
```

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Any modern browser with localStorage support

## Offline Support

The app works completely offline. All data is stored locally in the browser's localStorage. No internet connection required!

## Privacy & Security

- **Local-first**: All data stays in your browser
- **No tracking**: No analytics or external services
- **No server**: Completely client-side application
- **Your data, your control**: Export anytime

## File Structure

```
shared_todo_app/
├── index.html       # Single-file application (HTML + CSS + JS)
└── README.md        # This file
```

## Development

The app is built as a single-file HTML application for maximum portability and simplicity.

### Technologies Used

- HTML5
- CSS3 (with Tailwind CSS via CDN)
- Vanilla JavaScript (ES6+)
- LocalStorage API

### Extending the Storage Layer

To add a new storage backend:

1. Extend the `TodoStorage` class
2. Implement `load()` and `save()` methods
3. Update the constructor to set `storageType`
4. Initialize with your new storage class

## License

Open source - feel free to use and modify!

## Credits

Built with Claude AI using persistent storage APIs for modern web applications.
