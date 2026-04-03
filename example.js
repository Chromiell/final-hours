/**
 * example.js — Minimal JS core boilerplate
 *
 * Features:
 * - `Core` class with `init()`, `run()`, `stop()`
 * - `parseConfig()` utility to read JSON config
 * - `createLogger()` simple console logger
 * - CLI when invoked directly: `node example.js [run|init] [config.json]`
 */

'use strict';

const fs = require('fs');
const path = require('path');

class Core {
  constructor(options = {}) {
    this.options = options;
    this.running = false;
  }

  init() {
    this.logger = this.options.logger || createLogger('Core:');
    this.logger.info('Initializing with options', this.options);
    this.running = true;
    return this;
  }

  async run() {
    if (!this.running) this.init();
    this.logger.info('Running core...');
    if (this.options.config) {
      const cfg = parseConfig(this.options.config);
      this.logger.info('Loaded config', cfg);
    }
    await new Promise(resolve => setTimeout(resolve, 100));
    this.logger.info('Done.');
  }

  stop() {
    this.logger.info('Stopping core...');
    this.running = false;
  }
}

function parseConfig(filePath) {
  try {
    const p = path.resolve(process.cwd(), filePath);
    const raw = fs.readFileSync(p, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return {};
  }
}

function createLogger(prefix = '') {
  return {
    info: (...args) => console.log(prefix, ...args),
    warn: (...args) => console.warn(prefix, ...args),
    error: (...args) => console.error(prefix, ...args),
  };
}

module.exports = {
  Core,
  parseConfig,
  createLogger,
};

if (require.main === module) {
  const [,, cmd='run', config] = process.argv;
  const logger = createLogger('CLI:');
  const core = new Core({ config, logger });
  if (cmd === 'run') {
    core.run().catch(err => {
      logger.error('Error:', err);
      process.exit(1);
    });
  } else if (cmd === 'init') {
    core.init();
    logger.info('Initialized');
  } else {
    console.log('Usage: node example.js [run|init] [config.json]');
  }
}
