const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();

// Security: Limit request body size
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Configuration
const TIMEOUT_MS = parseInt(process.env.TIMEOUT_MS, 10) || 7000;
const MAX_CODE_LENGTH = 50000; // 50KB max code size
const MAX_TEST_CASES = 20;
const MAX_OUTPUT_LENGTH = 10000;

// Language-specific compile/run commands
const LANGUAGE_CONFIG = {
  javascript: {
    ext: 'js',
    run: (codePath, inputPath) => `node --max-old-space-size=128 "${codePath}" < "${inputPath}"`,
  },
  python: {
    ext: 'py',
    run: (codePath, inputPath) => `python3 "${codePath}" < "${inputPath}"`,
  },
  cpp: {
    ext: 'cpp',
    build: (codePath, workDir) => {
      const binPath = path.join(workDir, 'a.out');
      return { cmd: `g++ "${codePath}" -O2 -std=c++17 -o "${binPath}"`, binPath };
    },
    run: (binPath, inputPath) => `"${binPath}" < "${inputPath}"`,
  },
  java: {
    ext: 'java',
    build: (codePath, workDir) => {
      return { cmd: `javac "${codePath}"`, binPath: path.join(workDir, 'Main.class') };
    },
    run: (_binPath, inputPath, workDir) => `java -Xmx128m -cp "${workDir}" Main < "${inputPath}"`,
  },
};

// Health / info endpoints
app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    info: 'Judge microservice for code execution',
    languages: Object.keys(LANGUAGE_CONFIG),
    limits: {
      timeout: TIMEOUT_MS,
      maxCodeLength: MAX_CODE_LENGTH,
      maxTestCases: MAX_TEST_CASES,
    },
  });
});

app.get('/judge', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'POST /judge with { code, language, testCases: [{ input, expectedOutput }] }',
    languages: Object.keys(LANGUAGE_CONFIG),
  });
});

// POST /judge - Main code execution endpoint
app.post('/judge', async (req, res) => {
  const startTime = Date.now();

  try {
    const { code, language = 'javascript', testCases = [] } = req.body;

    // Validate code
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ message: 'Code is required and must be a string' });
    }

    if (code.length > MAX_CODE_LENGTH) {
      return res.status(400).json({ message: `Code exceeds maximum length of ${MAX_CODE_LENGTH} characters` });
    }

    // Validate language
    const langCfg = LANGUAGE_CONFIG[language];
    if (!langCfg) {
      return res.status(400).json({
        message: `Unsupported language: ${language}`,
        supported: Object.keys(LANGUAGE_CONFIG),
      });
    }

    // Validate test cases
    if (!Array.isArray(testCases)) {
      return res.status(400).json({ message: 'testCases must be an array' });
    }

    if (testCases.length > MAX_TEST_CASES) {
      return res.status(400).json({ message: `Maximum ${MAX_TEST_CASES} test cases allowed` });
    }

    const results = [];

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      const tcStart = Date.now();
      const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'judge-'));
      const codeFile = path.join(workDir, `Main.${langCfg.ext}`);
      const inputFile = path.join(workDir, 'input.txt');

      try {
        fs.writeFileSync(codeFile, code);
        fs.writeFileSync(inputFile, testCase.input ?? '');

        let runCmd;

        // Build step if required (C++, Java)
        if (langCfg.build) {
          const { cmd: buildCmd, binPath } = langCfg.build(codeFile, workDir);
          try {
            await execPromise(buildCmd, workDir);
          } catch (buildErr) {
            const errorMsg = buildErr.stderr?.trim() || buildErr.message || 'Compilation error';
            results.push({
              testCase: i + 1,
              output: errorMsg.slice(0, MAX_OUTPUT_LENGTH),
              expected: (testCase.expectedOutput || '').trim(),
              pass: false,
              error: 'compilation_error',
              time: Date.now() - tcStart,
            });
            continue;
          }
          runCmd = langCfg.run(binPath, inputFile, workDir);
        } else {
          runCmd = langCfg.run(codeFile, inputFile, workDir);
        }

        const { stdout, stderr } = await execPromise(runCmd, workDir);
        const actualRaw = stdout.trim().slice(0, MAX_OUTPUT_LENGTH);
        const expectedRaw = (testCase.expectedOutput || testCase.output || '').trim();

        // Normalize whitespace for comparison
        const normalize = (s) => s.replace(/\\s+/g, '').toLowerCase();
        const pass = normalize(actualRaw) === normalize(expectedRaw);

        results.push({
          testCase: i + 1,
          output: actualRaw,
          expected: expectedRaw,
          pass,
          time: Date.now() - tcStart,
          ...(stderr && { stderr: stderr.trim().slice(0, 500) }),
        });
      } catch (err) {
        const expected = (testCase.expectedOutput || testCase.output || '').trim();
        let errorType = 'runtime_error';
        let errorMsg = err.message || 'Execution error';

        if (err.killed) {
          errorType = 'timeout';
          errorMsg = `Execution timed out (>${TIMEOUT_MS}ms)`;
        } else if (err.stderr) {
          errorMsg = err.stderr.trim().slice(0, MAX_OUTPUT_LENGTH);
        }

        results.push({
          testCase: i + 1,
          output: errorMsg,
          expected,
          pass: false,
          error: errorType,
          time: Date.now() - tcStart,
        });
      } finally {
        safeRm(workDir);
      }
    }

    const totalTime = Date.now() - startTime;
    const passCount = results.filter((r) => r.pass).length;

    res.json({
      results,
      summary: {
        total: testCases.length,
        passed: passCount,
        failed: testCases.length - passCount,
        allPass: passCount === testCases.length,
        totalTime,
      },
    });
  } catch (err) {
    console.error('Judge error:', err);
    res.status(500).json({ message: 'Internal judge error', error: err.message });
  }
});

function execPromise(cmd, cwd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { timeout: TIMEOUT_MS, cwd, maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) {
        err.stderr = stderr;
        return reject(err);
      }
      resolve({ stdout, stderr });
    });
  });
}

function safeRm(dir) {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch (e) {
    // Ignore cleanup errors
  }
}

const PORT = 8000;
app.listen(PORT, () => console.log(`Judge microservice running on port ${PORT}`));
