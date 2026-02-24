const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
app.use(cors());
app.use(express.json());

const TIMEOUT_MS = 7000;

// Language-specific compile/run commands
const LANGUAGE_CONFIG = {
  javascript: {
    ext: 'js',
    run: (codePath, inputPath) => `node ${codePath} < ${inputPath}`,
  },
  python: {
    ext: 'py',
    run: (codePath, inputPath) => `python3 ${codePath} < ${inputPath}`,
  },
  cpp: {
    ext: 'cpp',
    build: (codePath, workDir) => {
      const binPath = path.join(workDir, 'a.out');
      return { cmd: `g++ ${codePath} -O2 -std=c++17 -o ${binPath}`, binPath };
    },
    run: (binPath, inputPath) => `${binPath} < ${inputPath}`,
  },
  java: {
    ext: 'java',
    build: (codePath, workDir) => {
      return { cmd: `javac ${codePath}`, binPath: path.join(workDir, 'Main.class') };
    },
    run: (_binPath, inputPath, workDir) => `java -cp ${workDir} Main < ${inputPath}`,
  },
};

// Health / info
app.get('/', (_req, res) => {
  res.json({ status: 'ok', info: 'judge microservice', languages: Object.keys(LANGUAGE_CONFIG) });
});

app.get('/judge', (_req, res) => {
  res.json({ status: 'ok', message: 'Use POST /judge with code, language, testCases', languages: Object.keys(LANGUAGE_CONFIG) });
});

// POST /judge
app.post('/judge', async (req, res) => {
  const { code, language = 'javascript', testCases = [] } = req.body;
  const langCfg = LANGUAGE_CONFIG[language];

  if (!langCfg) {
    return res.status(400).json({ message: `Unsupported language: ${language}` });
  }

  const results = [];

  for (const testCase of testCases) {
    const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'judge-'));
    const codeFile = path.join(workDir, `Main.${langCfg.ext}`);
    const inputFile = path.join(workDir, `input.txt`);
    fs.writeFileSync(codeFile, code);
    fs.writeFileSync(inputFile, testCase.input ?? '');

    try {
      let runCmd;
      // Build step if required
      if (langCfg.build) {
        const { cmd: buildCmd, binPath } = langCfg.build(codeFile, workDir);
        await execPromise(buildCmd, workDir);
        runCmd = langCfg.run(binPath, inputFile, workDir);
      } else {
        runCmd = langCfg.run(codeFile, inputFile, workDir);
      }

      const { stdout } = await execPromise(runCmd, workDir);
      const actualRaw = stdout.trim();
      const expectedRaw = (testCase.expectedOutput || testCase.output || '').trim();
      const normalize = (s) => s.replace(/\s+/g, '');
      const pass = normalize(actualRaw) === normalize(expectedRaw);
      results.push({ output: actualRaw, expected: expectedRaw, pass });
    } catch (err) {
      const expected = (testCase.expectedOutput || testCase.output || '').trim();
      const msg = err.stderr?.trim?.() || err.message || 'Execution error';
      results.push({ output: msg, expected, pass: false });
    } finally {
      safeRm(workDir);
    }
  }

  res.json({ results });
});

function execPromise(cmd, cwd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { timeout: TIMEOUT_MS, cwd }, (err, stdout, stderr) => {
      if (err) return reject(err);
      resolve({ stdout, stderr });
    });
  });
}

function safeUnlink(file) {
  try {
    fs.unlinkSync(file);
  } catch (e) {
    // ignore
  }
}

function safeRm(dir) {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch (e) {
    // ignore
  }
}

const PORT = 8000;
app.listen(PORT, () => console.log(`Judge microservice running on port ${PORT}`));
