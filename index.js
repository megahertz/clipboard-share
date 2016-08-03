#!/usr/bin/env node

'use strict';

const createClient = require('./lib/client');
const createServer = require('./lib/server');

//noinspection JSUnresolvedFunction
const args = require('yargs')
  .option('c', { alias: 'client', type: 'string'})
  .alias('h', 'help')
  .argv;


main();


function main() {
  if (args.help || args._[0] === 'help') {
    return help();
  }
  connect();
}

function connect() {
  if (args.client !== undefined) {
    createClient(parseHost());
  } else {
    createServer(parseHost());
  }
}

function parseHost() {
  let address = args._[0] || args.client || '';
  let [host, port = 1077] = address.toString().split(':');
  return {host, port};
}

function help() {
  console.log(`Usage clipboard-share [-c] [host:port|host]
If -c is specified, then connect to a server, otherwise start a server
  -c Connect to a server [host:port|host], default 10.0.2.2:1077
`);
}