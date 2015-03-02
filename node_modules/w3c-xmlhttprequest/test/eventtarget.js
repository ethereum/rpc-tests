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

  var assert = require('assert');
  var Event = require('../lib/event');
  var EventTarget = require('../lib/eventtarget');

  suite('EventTarget', function() {
    beforeEach(function(done) {
      this.Test = function Test() {
        EventTarget.call(this);
      };
      this.Test.prototype = Object.create(EventTarget.prototype);
      done();
    });

    test('can be inherited', function() {
      var test = new this.Test();
      assert.ok(test instanceof EventTarget);
      assert.strictEqual(typeof test.addEventListener, 'function');
    });

    test('.addEventListener()', function(done) {
      var test = new this.Test();
      var event = new Event('create');
      test.addEventListener('create', function() {
        assert.strictEqual(test, this);
        assert.strictEqual(event, arguments[0]);
        done();
      }, false);
      test.dispatchEvent(event);
    });

    test('.removeEventListener()', function() {
      var test = new this.Test();
      var event = new Event('create');
      var eventListener = function eventListener() {
        throw new TypeError('Event listener is not remove.');
      };
      test.addEventListener('create', eventListener, false);
      test.removeEventListener('create', eventListener, false);
      test.dispatchEvent(event);
    });
  });
})();
