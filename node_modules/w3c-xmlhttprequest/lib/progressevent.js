// The MIT License (MIT)
//
// Copyright (c) 2011-2013 Yamagishi Kazutoshi
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
(function(global) {
  'use strict';

  var Event = require('./event');

  function ProgressEvent(type, eventInitDict) {
    var eventFlag = this._flag;
    Event.call(this, '');
    eventFlag.initialized = true;
    if (eventFlag.dispatch) {
      return;
    }
    Object.defineProperty(this, 'type', {
      configurable: true,
      enumerable: true,
      value: type,
      writable: false
    });
    if (!eventInitDict) {
      return;
    }
    Object.keys(eventInitDict).forEach(function(key) {
      var value = eventInitDict[key];
      Object.defineProperty(this, key, {
        configurable: true,
        enumerable: true,
        value: +value,
        writable: false
      });
    }, this);
  }

  ProgressEvent.prototype = Object.create(Event.prototype);

  (function(proto) {
    Object.defineProperties(proto, {
      lengthComputable: {
        configurable: true,
        enumerable: true,
        value: 0,
        writable: false
      },
      loaded: {
        configurable: true,
        enumerable: true,
        value: 0,
        writable: false
      },
      total: {
        configurable: true,
        enumerable: true,
        value: 0,
        writable: false
      }
    });
  });

  module.exports = ProgressEvent;
})(this);
