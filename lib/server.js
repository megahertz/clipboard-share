'use strict';

const http      = require('http');
const socketIo  = require('socket.io');
const Clipboard = require('./clipboard');


module.exports = function createServer({host, port, interval}) {
  host = host || '0.0.0.0';
  const clipboard = new Clipboard(interval);
  return connect(host, port, socket => {
    socket.on('paste', text => {
      clipboard.set(text);
      console.info(`Received clipboard: ${text}`);
    });
    //noinspection JSUnresolvedFunction
    clipboard.on('changed', text => socket.emit('paste', text));

    socket.emit('paste', clipboard.current);
  });
};

function connect(host, port, socketCallback) {
  console.log(`Starting server ${host}:${port}`);
  const server = http.createServer();
  //noinspection JSCheckFunctionSignatures
  const io = socketIo(server);
  //noinspection JSUnresolvedFunction
  io.on('connection', socket => {
    //noinspection JSUnresolvedVariable
    const remoteAddress = socket.conn.remoteAddress;
    console.log(`Client ${remoteAddress} is connected`);
    socket.on('disconnect', () => {
      console.log(`Client ${remoteAddress} is disconnected`);
    });
    socketCallback(socket);
  });
  server.listen(port, host);
  return io;
}