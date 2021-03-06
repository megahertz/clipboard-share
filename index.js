#!/usr/bin/env node

'use strict';

const minimist     = require('minimist');
const createClient = require('./lib/client');
const createServer = require('./lib/server');

const args = minimist(process.argv.slice(2), {
  alias: {
    client: 'c',
    interval: 'i',
    help: 'h'
  },
  string: ['client']
});

if (require.main === module) {
  main();
}

function main() {
  if (args.help || args._[0] === 'help') {
    return help();
  }
  connect();
}

function connect() {
  if (args.client !== undefined) {
    createClient(parseArgs(args));
  } else {
    createServer(parseArgs(args));
  }
}

function parseArgs(args) {
  const address = args._[0] || args.client || '';
  let [host, port = 1077] = address.toString().split(':');
  host = host || undefined;

  const interval = args.interval || 300;

  return {host, port, interval};
}

function help() {
  console.log(`Usage clipboard-share [-c] [host:port|host] [-i milliseconds]
If -c is specified, then connect to a server, otherwise start a server
  -c Connect to a server [host:port|host], default 10.0.2.2:1077
  -i Clipboard update interval, milliseconds
`);
}