'use strict';

const expect       = require('chai').expect;
const socketIo     = require('socket.io-client');
const copyPaste    = require('copy-paste');
const createServer = require('../lib/server');


const testData = 'test data' + Math.random();
const testData2 = testData + 2;

describe('server', () => {
  beforeEach(done => {
    copyPaste.copy('uninitialized', done);
  });

  it('should send and receive clipboard content', done => {

    const server = createServer({host: 'localhost', port: 1079});
    const client = createClient();
    promiseSendClipboard(client, server)
      .then(text => {
        expect(text).to.equal(testData);
      })
      .then(() => {
        return promiseReceiveClipboard(client, server);
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

function createClient() {
  return socketIo('http://localhost:1079');
}

function promiseSendClipboard(client, server) {
  return new Promise((resolve) => {
    client.on('connect', () => {
      client.on('paste', text => {
        if (text) {
          resolve(text);
        }
      });
      server.emit('paste', testData);
    });
  });
}

function promiseReceiveClipboard(client, server) {
  return new Promise((resolve, reject) => {
    const socket = server.sockets.connected[client.id];

    setTimeout(() => {
      socket.on('paste', () => {
        copyPaste.paste((e, text) => {
          if (e) {
            return reject(e);
          }
          resolve(text);
        });
      });
      client.emit('paste', testData2);
    }, 100);
  });
}