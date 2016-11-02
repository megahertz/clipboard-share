'use strict';

const EventEmitter = require('events').EventEmitter;
const copyPaste    = require('copy-paste');


/**
 * Allows to set clipboard and emit changed when clipboard text is changed
 */
class Clipboard extends EventEmitter {
  constructor(refreshInterval = 200) {
    super();
    this._lastValue = null;
    setInterval(() => this._spyClipboard(), refreshInterval);
  }

  set(text) {
    if (!text) {
      return;
    }
    this._lastValue = text;
    copyPaste.copy(text);
  }

  get current() {
    return this._lastValue;
  }

  _spyClipboard() {
    copyPaste.paste((e, text) => {
      if (e) {
        console.error(e);
      }
      if (text === this._lastValue) {
        return;
      }
      this._lastValue = text;
      //noinspection JSUnresolvedFunction
      /**
       * @event changed
       * @param {string} text
       */
      this.emit('changed', text);
    });
  }
}

module.exports = Clipboard;