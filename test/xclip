#!/usr/bin/env node

'use strict';

const fs = require('fs');


const cmd = process.argv.join(' ');
const PATH = __dirname + '/xclip.tmp';

if (cmd.indexOf('-o') !== -1) {
  fs.createReadStream(PATH).pipe(process.stdout);
} else {
  process.stdin.setEncoding('utf8');
  process.stdin.on('readable', () => {
    process.stdin.pipe(fs.createWriteStream(PATH));
  });
}