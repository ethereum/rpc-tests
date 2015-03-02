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

  function Event(type, eventInitDict) {
    if (arguments.length < 1) {
      throw new TypeError('Not enough arguments');
    }
    Object.defineProperty(this, 'timeStamp', {
      configurable: true,
      enumerable: true,
      value: (new Date()).getTime(),
      writable: false
    });
    if (type) {
      this.initEvent(type);
    }
  }

  (function(proto) {
    (function() {
      var constants = {
        NONE: {
          configurable: false,
          enumerable: true,
          value: 0,
          writable: false,
        },
        CAPTURING_PHASE: {
          configurable: false,
          enumerable: true,
          value: 1,
          writable: false,
        },
        AT_TARGET: {
          configurable: false,
          enumerable: true,
          value: 2,
          writable: false,
        },
        BUBBLING_PHASE: {
          configurable: false,
          enumerable: true,
          value: 3,
          writable: false,
        }
      };

      Object.defineProperties(Event, constants);
      Object.defineProperties(proto, constants);
    })();

    Object.defineProperties(proto, {
      _flag: {
        configurable: false,
        enumerable: false,
        get: function getter() {
          var flag = Object.create(Object.prototype, {
            canceled: {
              configurable: false,
              enumerable: true,
              value: false,
              writable: true
            },
            dispatch: {
              configurable: false,
              enumerable: true,
              value: false,
              writable: true
            },
            initialized: {
              configurable: false,
              enumerable: true,
              value: false,
              writable: true
            },
            stopImmediatePropagation: {
              configurable: false,
              enumerable: true,
              value: false,
              writable: true
            },
            stopPropagation: {
              configurable: false,
              enumerable: true,
              value: false,
              writable: true
            }
          });
          Object.defineProperty(this, '_flag', {
            configurable: false,
            enumerable: false,
            value: flag,
            writable: false
          });
          return flag;
        }
      },
      bubbles: {
        configurable: true,
        enumerable: true,
        value: false,
        writable: false
      },
      cancelable: {
        configurable: true,
        enumerable: true,
        value: false,
        writable: false
      },
      currentTarget: {
        configurable: true,
        enumerable: true,
        value: null,
        writable: false
      },
      defaultPrevented: {
        configurable: false,
        enumerable: true,
        get: function getter() {
          var eventFlag = this._flag;
          return !eventFlag.canceled;
        },
      },
      eventPhase: {
        configurable: true,
        enumerable: true,
        value: Event.NONE,
        writable: false
      },
      isTrusted: {
        configurable: true,
        enumerable: true,
        value: false,
        writable: false
      },
      target: {
        configurable: true,
        enumerable: true,
        value: null,
        writable: false
      },
      timeStamp: {
        configurable: true,
        enumerable: true,
        value: 0,
        writable: false
      },
      type: {
        configurable: true,
        enumerable: true,
        value: undefined,
        writable: false
      },
    });

    proto.initEvent = function initEvent(type, cancelable, bubbles) {
      var eventFlag = this._flag;
      eventFlag.initialized = true;
      if (eventFlag.dispatch) {
        return;
      }
      Object.defineProperties(this, {
        bubbles: {
          configurable: true,
          enumerable: true,
          value: !!bubbles,
          writable: false
        },
        cancelable: {
          configurable: true,
          enumerable: true,
          value: !!cancelable,
          writable: false,
        },
        type: {
          configurable: true,
          enumerable: true,
          value: '' + type,
          writable: false,
        }
      });
    };

    proto.preventDefault = function preventDefault() {
      var eventFlag = this._flag;
      if (!this.cancelable || eventFlag.canceled) {
        return;
      }
      eventFlag.canceled = true;
    };

    proto.stopImmediatePropagation = function stopImmediatePropagation() {
      this._flag.stopImmediatePropagation = true;
    };

    proto.stopPropagation = function stopPropagation() {
      this._flag.stopPropagation = true;
    };
  })(Event.prototype);

  module.exports = Event;
})(this);
