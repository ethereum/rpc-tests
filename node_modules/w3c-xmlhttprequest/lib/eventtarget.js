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
(function() {
  'use strict';

  var DOMException = require('./domexception');
  var Event = require('./event');

  function EventTarget() {
  }

  (function(proto) {
    var _globalListenerList;
    var _globalTargetList;

    function _addEventListener(type, listener, capture) {
      var target = this;
      var listeners = _getEventListeners.call(this, type);
      var index;
      listener = _addEventListener.prepareListener(listener);
      if (typeof listener !== 'function') {
        return;
      }
      if (listeners.length < 1) {
        index = _globalTargetList.indexOf(target);
        if (index < 0) {
          index = _globalTargetList.push(target) - 1;
        }
        _globalListenerList[index] = _globalListenerList[index] || {};
        _globalListenerList[index][type] = listeners;
      }
      listeners.push(listener);
    }

    _addEventListener.prepareListener = function prepareListener(listener) {
      var object = listener;
      var handleEvent;
      if (typeof listener === 'function') {
        return listener;
      }
      handleEvent = listener && object.handleEvent;
      if (typeof handleEvent !== 'function') {
        return;
      }
      return function listener(event) {
        handleEvent.call(object, event);
      };
    };

    function _dispatch(event) {
      var eventFlag = event._flag;
      eventFlag.dispatch = true;
      Object.defineProperty(event, 'target', {
        configurable: true,
        enumerable: true,
        value: this,
        writable: false
      });
      // todo: If event's target attribute value is participating in a tree, let
      // event path be a static ordered list of all its ancestors in tree order,
      // or let event path be the empty list otherwise.
      Object.defineProperty(event, 'eventPhase', {
        configurable: true,
        enumerable: true,
        value: Event.CAPTURING_PHASE,
        writable: false,
      });
      // todo: For each object in the event path invoke its event listeners with
      // event event, as long as event's stop propagation flag is unset.
      Object.defineProperty(event, 'eventPhase', {
        configurable: true,
        enumerable: true,
        value: Event.AT_TARGET,
        writable: false,
      });
      if (!eventFlag.stopPropagation) {
        _dispatch.invoke.apply(this, arguments);
      }
      if (event.bubbles) {
        _dispatch.bubbling.apply(this, arguments);
      }
      eventFlag.dispatch = false;
      Object.defineProperty(event, 'eventPhase', {
        configurable: true,
        enumerable: true,
        value: Event.NONE,
        writable: false,
      });
      Object.defineProperty(event, 'currentTarget', {
        configurable: true,
        enumerable: true,
        value: null,
        writable: false,
      });
      if (eventFlag.canceled) {
        return false;
      }
      return true;
    }

    _dispatch.bubbling = function bubbling(event) {
      // todo: Reverse the order of event path.
      Object.defineProperty(event, 'eventPhase', {
        configurable: true,
        enumerable: true,
        value: Event.BUBBLING_PHASE,
        writable: false,
      });
      // todo: For each object in the event path invoke its event listeners,
      // with event event as long as event's stop propagation flag is unset.
    };

    _dispatch.invoke = function invoke(event) {
      var args = Array.prototype.slice.call(arguments);
      var target = event.target;
      var type = event.type;
      var listeners = _getEventListeners.call(target, type);
      var listener = this['on' + type];
      if (typeof listener === 'function') {
        listeners.unshift(listener);
      }
      return listeners.some(function handleListener(listener) {
        if (!event.cancelable) {
          return listener.apply(target, args);
        }
        return event.defaultPrevented || listener.apply(target, args) === false;
      });
    };

    function _getEventListeners(type) {
      var target = this;
      var listenerList = _globalListenerList = _globalListenerList || [];
      var targetList = _globalTargetList = _globalTargetList || [];
      var index = targetList.lastIndexOf(target);
      var eachTypeListeners = listenerList[index] || {};
      var listeners = eachTypeListeners[type] || [];
      return listeners;
    }

    function _removeEventListener(type, listener, capture) {
      var listeners = _getEventListeners.call(this, type);
      var index = listeners.lastIndexOf(listener);
      if (index < 0) {
        return;
      }
      listeners.splice(index, 1);
    }

    proto.addEventListener = function addEventListener(type, listener, capture) {
      if (listener === null) {
        return;
      }
      return _addEventListener.apply(this, arguments);
    };

    proto.dispatchEvent = function dispatchEvent(event) {
      var eventFlag = event instanceof Event && event._flag;
      if (!eventFlag || eventFlag.dispatch || !eventFlag.initialized) {
        throw new TypeError(/* InvalidStateError */);
      }
      return _dispatch.apply(this, arguments);
    };

    proto.removeEventListener = function removeEventListener(type, listener, capture) {
      return _removeEventListener.apply(this, arguments);
    };
  })(EventTarget.prototype);

  module.exports = EventTarget;
})();
