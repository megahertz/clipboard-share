'use strict';

const expect = require('chai').expect;
const rewire = require('rewire');

const parseArgs = rewire('../index').__get__('parseArgs');


describe('index', () => {
  it('parseArgs should extract host, port and interval from yargs', () => {
    expect(parseArgs({_:[]})).to.deep.equal({
      host: undefined,
      port: 1077,
      interval: 300
    });

    expect(parseArgs({_:['localhost:2000']})).to.deep.equal({
      host: 'localhost',
      port: '2000',
      interval: 300
    });

    expect(parseArgs({_:[], client: 'localhost:2000'})).to.deep.equal({
      host: 'localhost',
      port: '2000',
      interval: 300
    });

    expect(parseArgs({_:[], client: 'localhost', interval: 100})).to.deep.equal({
      host: 'localhost',
      port: 1077,
      interval: 100
    });
  })
});