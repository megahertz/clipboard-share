'use strict';

const expect       = require('chai').expect;
const socketIo     = require('socket.io');
const copyPaste    = require('copy-paste');
const createClient = require('../lib/client');


const testData = 'test data' + Math.random();
const testData2 = testData + 2;

describe('client', () => {
  beforeEach(done => {
    copyPaste.copy('', done);
  });

  it('should send and receive clipboard content', done => {

    const server = createServer();
    const client = createClient({host: 'localhost', port: 1078});
    promiseConnectAndGetClipboard(client)
      .then(text => {
        expect(text).to.equal(testData);
      })
      .then(() => {
        return promiseSetClipboardOnServer(client, server);
      })
      .then(text => {
        expect(text).to.equal(testData2);
      })
      .then(() => {
        server.close();
        client.disconnect();
        done();
      })
      .catch(e => done(e));
  });
});

function createServer() {
  const io = socketIo();
  io.on('connection', socket => socket.emit('paste', testData));
  io.listen(1078);
  return io;
}

function promiseConnectAndGetClipboard(client) {
  return new Promise((resolve, reject) => {
    client.on('paste', () => {
      setTimeout(() => {
        copyPaste.paste((e, text) => {
          if (e) {
            return reject(e);
          }
          resolve(text);
        });
      }, 100);
    });
  });
}

function promiseSetClipboardOnServer(client, server) {
  return new Promise((resolve, reject) => {
    const socket = server.sockets.connected[client.id];
    socket.on('paste', text => {
      resolve(text);
    });
    client.emit('paste', testData2);
  });
}