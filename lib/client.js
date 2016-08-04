'use strict';

const socketIo  = require('socket.io-client');
const Clipboard = require('./clipboard');


module.exports = function createClient({host, port, interval}) {
  host = host || '10.0.2.2';
  const url = `http://${host}:${port}`;

  const clipboard = new Clipboard(interval);
  const socket = connect(url);

  socket.on('paste', text => {
    clipboard.set(text);
    console.info(`Received clipboard: ${text}`);
  });
  //noinspection JSUnresolvedFunction
  clipboard.on('changed', text => socket.emit('paste', text));

  return socket;
};

function connect(url) {
  console.log(`Connecting to a server ${url}`);
  const socket = socketIo(url, { reconnect: true });

  socket.on('connect', () => {
    console.log(`Connected to a server ${url}`);
  });
  socket.on('disconnect', () => {
    console.log(`Disconnected from a server ${url}`);
  });

  return socket;
}