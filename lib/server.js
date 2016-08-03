'use strict';

const http      = require('http');
const socketIo  = require('socket.io');
const Clipboard = require('./clipboard');


module.exports = function createServer({host = '10.0.2.2', port = 1077}) {
  const clipboard = new Clipboard();
  return connect(host, port, socket => {
    socket.on('paste', text => {
      clipboard.set(text);
      console.info(`Received clipboard: ${text}`);
    });
    clipboard.on('changed', text => socket.emit('paste', text));

    socket.emit('paste', clipboard.current);
  });
};

function connect(host, port, socketCallback) {
  console.log(`Starting server ${host}:${port}`);
  var server = http.createServer();
  var io = socketIo(server);
  io.on('connection', socket => {
    console.log(`Client ${socket.conn.remoteAddress} is connected`);
    socket.on('disconnect', () => {
      console.log(`Client ${socket.conn.remoteAddress} is disconnected`);
    });
    socketCallback(socket);
  });
  server.listen(port, host);
  return io;
}