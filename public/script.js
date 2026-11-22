/**
 * Text Utility Playground - Frontend Client Logic
 * 
 * Demonstrates real-world usage of the npm package:
 * "priyanshu-tiny-text-kit"
 * 
 * Interacts with the Express backend via fetch API.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ========================================================================
  // 1. DOM Element References
  // ========================================================================
  const inputText = document.getElementById('input-text');
  const inputValidationMsg = document.getElementById('input-validation-msg');
  const btnPaste = document.getElementById('btn-paste');
  const btnClear = document.getElementById('btn-clear');
  const sampleChips = document.querySelectorAll('.chip');

  // Input Statistics
  const statCharCount = document.getElementById('stat-char-count');
  const statWordCount = document.getElementById('stat-word-count');
  const statLineCount = document.getElementById('stat-line-count');

  // Operation Buttons
  const opButtons = document.querySelectorAll('.op-button');

  // Result Section Elements
  const emptyState = document.getElementById('empty-state');
  const resultContentContainer = document.getElementById('result-content-container');
  const loadingOverlay = document.getElementById('loading-overlay');
  const textResultDisplay = document.getElementById('text-result-display');
  const resultTextBox = document.getElementById('result-text-box');
  const numberResultDisplay = document.getElementById('number-result-display');
  const numberStatValue = document.getElementById('number-stat-value');
  const badgeActiveOp = document.getElementById('badge-active-op');
  const badgeTime = document.getElementById('badge-time');
  const resultCharCount = document.getElementById('result-char-count');

  // Result Action Buttons
  const btnCopy = document.getElementById('btn-copy');
  const copyBtnText = document.getElementById('copy-btn-text');
  const iconCopyDefault = document.getElementById('icon-copy-default');
  const iconCopySuccess = document.getElementById('icon-copy-success');
  const btnUseAsInput = document.getElementById('btn-use-as-input');

  // Code Snippet Preview & Install Tag
  const codeSnippetPreview = document.getElementById('code-snippet-preview');
  const btnCopyInstall = document.getElementById('btn-copy-install');
  const serverStatus = document.getElementById('server-status');
  const toastContainer = document.getElementById('toast-container');

  // State Management
  let currentResult = null;
  let currentOperation = null;
  let isProcessing = false;

  // ========================================================================
  // 2. Input Counter & Live Stats
  // ========================================================================
  function updateInputStats() {
    const text = inputText.value;
    const chars = text.length;
    const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
    
    // Quick frontend estimate for input counter
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

    statCharCount.textContent = chars.toLocaleString();
    statWordCount.textContent = words.toLocaleString();
    statLineCount.textContent = lines.toLocaleString();

    if (text.trim().length > 0) {
      hideInputValidation();
    }
  }

  inputText.addEventListener('input', updateInputStats);

  // ========================================================================
  // 3. Validation Helpers
  // ========================================================================
  function showInputValidation(msg = 'Please enter some text first to run an operation.') {
    inputValidationMsg.querySelector('span').textContent = msg;
    inputValidationMsg.classList.remove('hidden');
    inputText.focus();
  }

  function hideInputValidation() {
    inputValidationMsg.classList.add('hidden');
  }

  // ========================================================================
  // 4. Quick Actions: Paste, Clear, Sample Chips
  // ========================================================================
  btnPaste.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          inputText.value = text;
          updateInputStats();
          showToast('Text pasted from clipboard', 'info');
          return;
        }
      }
      showToast('Clipboard access unavailable or empty. Please use Ctrl/Cmd+V to paste.', 'info');
    } catch (err) {
      console.warn('Clipboard read error:', err);
      showToast('Unable to read clipboard automatically. Use Ctrl/Cmd+V instead.', 'info');
    }
  });

  btnClear.addEventListener('click', () => {
    inputText.value = '';
    updateInputStats();
    hideInputValidation();
    inputText.focus();
    showToast('Input text cleared', 'info');
  });

  sampleChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const sample = chip.getAttribute('data-sample');
      if (sample) {
        inputText.value = sample;
        updateInputStats();
        hideInputValidation();
        showToast('Sample text loaded', 'info');
      }
    });
  });

  // ========================================================================
  // 5. Code Snippet Dynamic Updater
  // ========================================================================
  function updateCodePreview(operationKey) {
    const snippets = {
      capitalize: `// Direct call to priyanshu-tiny-text-kit
const { capitalize } = require('priyanshu-tiny-text-kit');

const text = ${JSON.stringify(inputText.value.slice(0, 40) + (inputText.value.length > 40 ? '...' : ''))};
const result = capitalize(text);
// Result: "${currentResult !== null ? String(currentResult).slice(0, 40) : '...'}"`,

      reverseString: `// Direct call to priyanshu-tiny-text-kit
const { reverseString } = require('priyanshu-tiny-text-kit');

const text = ${JSON.stringify(inputText.value.slice(0, 40) + (inputText.value.length > 40 ? '...' : ''))};
const result = reverseString(text);
// Result: "${currentResult !== null ? String(currentResult).slice(0, 40) : '...'}"`,

      wordCount: `// Direct call to priyanshu-tiny-text-kit
const { wordCount } = require('priyanshu-tiny-text-kit');

const text = ${JSON.stringify(inputText.value.slice(0, 40) + (inputText.value.length > 40 ? '...' : ''))};
const count = wordCount(text);
// Count: ${currentResult !== null ? currentResult : 0}`,

      titleCase: `// Direct call to priyanshu-tiny-text-kit
const { titleCase } = require('priyanshu-tiny-text-kit');

const text = ${JSON.stringify(inputText.value.slice(0, 40) + (inputText.value.length > 40 ? '...' : ''))};
const result = titleCase(text);
// Result: "${currentResult !== null ? String(currentResult).slice(0, 40) : '...'}"`,

      removeExtraSpaces: `// Direct call to priyanshu-tiny-text-kit
const { removeExtraSpaces } = require('priyanshu-tiny-text-kit');

const text = ${JSON.stringify(inputText.value.slice(0, 40) + (inputText.value.length > 40 ? '...' : ''))};
const result = removeExtraSpaces(text);
// Result: "${currentResult !== null ? String(currentResult).slice(0, 40) : '...'}"`,
    };

    if (snippets[operationKey]) {
      codeSnippetPreview.textContent = snippets[operationKey];
    }
  }

  // ========================================================================
  // 6. Main Process Handler (Express API Call)
  // ========================================================================
  async function runOperation(operationKey) {
    if (isProcessing) return;

    const rawText = inputText.value;

    // Validate empty input
    if (!rawText || rawText.trim() === '') {
      showInputValidation('Please enter some text first to run this operation.');
      showToast('Input cannot be empty. Please enter text.', 'error');
      return;
    }

    hideInputValidation();
    isProcessing = true;
    currentOperation = operationKey;

    // Visual button state
    opButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-operation') === operationKey);
    });

    // Show loading state
    loadingOverlay.classList.remove('hidden');

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: rawText,
          operation: operationKey,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to process text on server.');
      }

      // Success: render processed result
      renderResult(data);
      showToast(`Processed with ${data.npmFunction}() in ${data.stats.executionTimeMs}ms`, 'success');
    } catch (error) {
      console.error('Operation Error:', error);
      showToast(error.message || 'Error communicating with server.', 'error');
    } finally {
      isProcessing = false;
      loadingOverlay.classList.add('hidden');
    }
  }

  // ========================================================================
  // 7. Render Processed Result
  // ========================================================================
  function renderResult(data) {
    currentResult = data.result;

    // Hide empty state and show content container
    emptyState.classList.add('hidden');
    resultContentContainer.classList.remove('hidden');

    // Update Meta Badges
    badgeActiveOp.textContent = `${data.npmFunction}()`;
    badgeActiveOp.classList.remove('hidden');

    badgeTime.textContent = `${data.stats.executionTimeMs} ms`;
    badgeTime.classList.remove('hidden');

    // Enable Result Action Buttons
    btnCopy.disabled = false;
    btnUseAsInput.disabled = false;

    // Handle display depending on result type (Number for wordCount, String for others)
    if (data.operation === 'wordCount') {
      textResultDisplay.classList.add('hidden');
      numberResultDisplay.classList.remove('hidden');
      numberStatValue.textContent = data.result.toLocaleString();
      resultCharCount.textContent = `Word Count: ${data.result}`;
    } else {
      numberResultDisplay.classList.add('hidden');
      textResultDisplay.classList.remove('hidden');
      resultTextBox.textContent = data.result;
      resultCharCount.textContent = `${String(data.result).length.toLocaleString()} characters`;
    }

    // Update dynamic backend code preview snippet
    updateCodePreview(data.operation);
  }

  // Attach click listeners to operation buttons
  opButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const operation = btn.getAttribute('data-operation');
      if (operation) {
        runOperation(operation);
      }
    });
  });

  // ========================================================================
  // 8. Result Actions: Copy to Clipboard & Use as Input
  // ========================================================================
  btnCopy.addEventListener('click', async () => {
    if (currentResult === null) return;

    const textToCopy = String(currentResult);

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for older browsers
        const tempTextarea = document.createElement('textarea');
        tempTextarea.value = textToCopy;
        document.body.appendChild(tempTextarea);
        tempTextarea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextarea);
      }

      // Visual feedback on button
      iconCopyDefault.classList.add('hidden');
      iconCopySuccess.classList.remove('hidden');
      copyBtnText.textContent = 'Copied!';
      btnCopy.classList.add('btn-copied');

      showToast('Copied result to clipboard!', 'success');

      setTimeout(() => {
        iconCopyDefault.classList.remove('hidden');
        iconCopySuccess.classList.add('hidden');
        copyBtnText.textContent = 'Copy Result';
        btnCopy.classList.remove('btn-copied');
      }, 2000);
    } catch (err) {
      console.error('Clipboard copy error:', err);
      showToast('Failed to copy to clipboard automatically.', 'error');
    }
  });

  btnUseAsInput.addEventListener('click', () => {
    if (currentResult === null) return;

    inputText.value = String(currentResult);
    updateInputStats();
    hideInputValidation();
    inputText.focus();
    showToast('Result set as input text (ready for chaining operations)', 'info');
  });

  // Copy npm install command
  btnCopyInstall.addEventListener('click', async () => {
    const installCmd = 'npm i priyanshu-tiny-text-kit';
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(installCmd);
      }
      showToast('Copied: "npm i priyanshu-tiny-text-kit"', 'success');
    } catch (err) {
      showToast('Command: npm i priyanshu-tiny-text-kit', 'info');
    }
  });

  // ========================================================================
  // 9. Toast Notification Utility
  // ========================================================================
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else {
      iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    toastContainer.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto remove after 3.2 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toastContainer.contains(toast)) {
          toastContainer.removeChild(toast);
        }
      }, 300);
    }, 3200);
  }

  // ========================================================================
  // 10. Keyboard Shortcut: Ctrl/Cmd + Enter to Run Active Operation
  // ========================================================================
  inputText.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      const targetOp = currentOperation || 'capitalize';
      runOperation(targetOp);
    }
  });

  // ========================================================================
  // 11. Server Health Check on Page Load
  // ========================================================================
  async function checkServerConnection() {
    try {
      const res = await fetch('/api/operations');
      if (res.ok) {
        const data = await res.json();
        serverStatus.querySelector('.status-text').textContent = `${data.package} active`;
      }
    } catch (err) {
      console.warn('Backend connection notice:', err);
      serverStatus.querySelector('.status-text').textContent = 'Connecting...';
    }
  }

  checkServerConnection();
  updateInputStats();
});

