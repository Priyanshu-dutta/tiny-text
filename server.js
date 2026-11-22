/**
 * Text Utility Playground - Express Backend Server
 * 
 * Demonstrates real-world usage of the published npm package:
 * "priyanshu-tiny-text-kit"
 * 
 * Functions imported and used directly from the npm package:
 * - capitalize
 * - reverseString
 * - wordCount
 * - titleCase
 * - removeExtraSpaces
 */

const express = require('express');
const path = require('path');

// ========================================================================
// 1. Direct Import of Functions from the Published npm Package
// ========================================================================
const {
  capitalize,
  reverseString,
  wordCount,
  titleCase,
  removeExtraSpaces,
} = require('priyanshu-tiny-text-kit');

const app = express();
const PORT = process.env.PORT || 3000;

// ========================================================================
// 2. Middleware Configuration
// ========================================================================
// Parse JSON and URL-encoded request bodies
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Serve frontend static assets from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// ========================================================================
// 3. Operation Handlers Map
// ========================================================================
// Maps operation keys to the corresponding npm package functions and metadata
const OPERATIONS = {
  capitalize: {
    key: 'capitalize',
    name: 'Capitalize',
    description: 'Capitalizes the first letter of the entered text.',
    npmFunction: 'capitalize',
    sampleInput: 'welcome to the text utility playground',
    fn: capitalize,
  },
  reverseString: {
    key: 'reverseString',
    name: 'Reverse String',
    description: 'Reverses the entered text completely.',
    npmFunction: 'reverseString',
    sampleInput: 'Hello World! 🚀',
    fn: reverseString,
  },
  wordCount: {
    key: 'wordCount',
    name: 'Word Count',
    description: 'Counts the number of words in the text.',
    npmFunction: 'wordCount',
    sampleInput: 'The quick brown fox jumps over the lazy dog.',
    fn: wordCount,
  },
  titleCase: {
    key: 'titleCase',
    name: 'Title Case',
    description: 'Converts text into title case.',
    npmFunction: 'titleCase',
    sampleInput: 'demonstration of priyanshu-tiny-text-kit package',
    fn: titleCase,
  },
  removeExtraSpaces: {
    key: 'removeExtraSpaces',
    name: 'Remove Extra Spaces',
    description: 'Removes unnecessary and consecutive spaces between words.',
    npmFunction: 'removeExtraSpaces',
    sampleInput: '   Clean    up   unnecessary    spaces     effortlessly.   ',
    fn: removeExtraSpaces,
  },
};

// ========================================================================
// 4. API Endpoints
// ========================================================================

/**
 * GET /api/operations
 * Returns metadata about supported operations and npm package info.
 */
app.get('/api/operations', (req, res) => {
  const operationsList = Object.values(OPERATIONS).map(({ key, name, description, npmFunction, sampleInput }) => ({
    key,
    name,
    description,
    npmFunction,
    sampleInput,
  }));

  res.json({
    package: 'priyanshu-tiny-text-kit',
    version: '1.0.0',
    operations: operationsList,
  });
});

/**
 * POST /api/process
 * Main processing endpoint:
 * Accepts { text: string, operation: string } in JSON body.
 * Invokes the corresponding function from priyanshu-tiny-text-kit.
 */
app.post('/api/process', (req, res) => {
  try {
    const { text, operation } = req.body;

    // Validate that operation is provided and recognized
    if (!operation || typeof operation !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid "operation" field. Please provide a valid operation name.',
        validOperations: Object.keys(OPERATIONS),
      });
    }

    const opConfig = OPERATIONS[operation];
    if (!opConfig) {
      return res.status(400).json({
        success: false,
        error: `Unknown operation "${operation}". Supported operations are: ${Object.keys(OPERATIONS).join(', ')}`,
        validOperations: Object.keys(OPERATIONS),
      });
    }

    // Validate that text is provided as a string
    if (text === undefined || text === null || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Input "text" must be provided as a string.',
      });
    }

    // Measure execution performance using high-resolution timer
    const startTime = process.hrtime.bigint();

    // Call the corresponding function directly from the published npm package
    const result = opConfig.fn(text);

    const endTime = process.hrtime.bigint();
    const executionTimeMs = Number(endTime - startTime) / 1e6; // Convert nanoseconds to milliseconds

    // Return structured JSON response
    return res.json({
      success: true,
      operation: opConfig.key,
      operationName: opConfig.name,
      npmFunction: opConfig.npmFunction,
      result: result,
      stats: {
        inputType: typeof text,
        outputType: typeof result,
        inputLength: text.length,
        outputLength: typeof result === 'string' ? result.length : String(result).length,
        executionTimeMs: Number(executionTimeMs.toFixed(3)),
      },
      package: 'priyanshu-tiny-text-kit',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error processing text:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred while processing the text.',
      details: error.message,
    });
  }
});

// ========================================================================
// 5. Catch-all / Fallback Route & Error Handler
// ========================================================================
// Catch-all route to serve index.html for client-side routing if requested
app.use((req, res, next) => {
  // If request is not for /api, serve index.html
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
  next();
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message,
  });
});

// ========================================================================
// 6. Start the Server
// ========================================================================
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  🚀 Text Utility Playground is running!`);
  console.log(`  🔗 Local URL: http://localhost:${PORT}`);
  console.log(`  📦 Demonstrating npm package: priyanshu-tiny-text-kit`);
  console.log(`=======================================================`);
});
