#!/usr/bin/env node

// Provide a title to the process in `ps`
process.title = 'local-https-server';

require('../src/local-https-server');
