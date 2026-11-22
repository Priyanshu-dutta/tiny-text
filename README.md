# Text Utility Playground 🚀

A modern, responsive, developer-tool web application built to demonstrate the real-world usage of the published npm package: [**`priyanshu-tiny-text-kit`**](https://www.npmjs.com/package/priyanshu-tiny-text-kit).

---

## 📦 Demonstrating `priyanshu-tiny-text-kit`

This application directly imports and demonstrates the published npm package **[`priyanshu-tiny-text-kit`](https://www.npmjs.com/package/priyanshu-tiny-text-kit)** authored by Priyanshu Dutta.

> **Important**: This project does **not** reimplement or copy string manipulation functions locally. All text processing is executed through the actual functions imported from `priyanshu-tiny-text-kit` on the Express.js backend.

### Package Installation
```bash
npm install priyanshu-tiny-text-kit
```

### Imported Functions Used in this Project
```javascript
const {
  capitalize,
  reverseString,
  wordCount,
  titleCase,
  removeExtraSpaces,
} = require('priyanshu-tiny-text-kit');
```

---

## ✨ Features & Operations

The playground provides an interactive, dark-themed developer dashboard supporting five distinct text operations powered by `priyanshu-tiny-text-kit`:

| # | Operation | Package Function | Description | Example Input ➔ Output |
|---|---|---|---|---|
| 1 | **Capitalize** | `capitalize(text)` | Capitalizes the first letter of the entered text. | `"hello world"` ➔ `"Hello world"` |
| 2 | **Reverse String** | `reverseString(text)` | Reverses the sequence of characters completely. | `"hello world"` ➔ `"dlrow olleh"` |
| 3 | **Word Count** | `wordCount(text)` | Calculates the total count of words in the text. | `"The quick brown fox"` ➔ `4` |
| 4 | **Title Case** | `titleCase(text)` | Converts the text into Title Case format. | `"priyanshu tiny text kit"` ➔ `"Priyanshu Tiny Text Kit"` |
| 5 | **Remove Extra Spaces** | `removeExtraSpaces(text)` | Trims and condenses multiple consecutive whitespace characters down to single spaces. | `"  clean   up   spaces  "` ➔ `"clean up spaces"` |

---

## 🛠️ Technology Stack

- **Frontend**: Vanilla HTML5, CSS3 (Modern dark-mode glassmorphic theme with neon purple & blue gradients), Vanilla JavaScript (ES6+).
- **Backend**: Node.js, Express.js.
- **npm Package**: `priyanshu-tiny-text-kit` (installed directly from npm registry).
- **Communication**: Asynchronous Fetch API between Client and Server.

---

## 📁 Project Structure

```
text-utility-playground/
├── public/
│   ├── index.html       # Modern responsive UI dashboard
│   ├── style.css        # Dark navy/black theme, CSS custom properties, responsive grid
│   └── script.js        # Client-side logic, API calls, live counters, toast system
├── server.js            # Express server importing and executing priyanshu-tiny-text-kit
├── package.json         # Project configuration & npm dependencies
└── README.md            # Documentation and setup instructions
```

---

## 🚀 Getting Started & Execution

### 1. Prerequisites
Ensure you have Node.js (v18+ recommended) and npm installed:
```bash
node -v
npm -v
```

### 2. Install Dependencies
Install all required dependencies, including `express` and `priyanshu-tiny-text-kit`:
```bash
npm install
```

### 3. Run the Application
Start the Express server:
```bash
npm start
```
*For development with auto-reload on file changes:*
```bash
npm run dev
```

### 4. Open in Browser
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🔌 Backend API Reference

### `POST /api/process`
Accepts text and an operation identifier, runs it through the corresponding function from `priyanshu-tiny-text-kit`, and returns the processed result.

**Request Body:**
```json
{
  "text": "hello   world",
  "operation": "removeExtraSpaces"
}
```

**Supported Operations:**
- `"capitalize"`
- `"reverseString"`
- `"wordCount"`
- `"titleCase"`
- `"removeExtraSpaces"`

**Response (200 OK):**
```json
{
  "success": true,
  "operation": "removeExtraSpaces",
  "operationName": "Remove Extra Spaces",
  "npmFunction": "removeExtraSpaces",
  "result": "hello world",
  "stats": {
    "inputType": "string",
    "outputType": "string",
    "inputLength": 14,
    "outputLength": 11,
    "executionTimeMs": 0.041
  },
  "package": "priyanshu-tiny-text-kit",
  "timestamp": "2026-11-22T13:30:00.000Z"
}
```

### `GET /api/operations`
Returns metadata and details about all available operations and the loaded npm package.

---

## 🎨 User Interface Highlights

- **Developer-Focused UI**: Dark theme with high-contrast typography (Plus Jakarta Sans & JetBrains Mono).
- **Live Statistics**: Real-time character, word, and line counters while typing.
- **Preset Quick-Chips**: One-click sample text loads to easily test each function.
- **Copy to Clipboard**: Quick copy button with animated feedback and toast notifications.
- **Operation Chaining**: Click **Use as Input** to feed the processed output back into the input box to chain multiple transformations (e.g. Remove Extra Spaces ➔ Title Case).
- **Keyboard Shortcut**: Press `Ctrl + Enter` (or `Cmd + Enter`) inside the textarea to rapidly run the selected operation.
- **Empty State & Error Handling**: Graceful validation and inline notifications for empty inputs or unexpected errors.

---

## 📄 License

This project is licensed under the MIT License.

