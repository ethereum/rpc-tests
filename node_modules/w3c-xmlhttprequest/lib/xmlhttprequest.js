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

  var HTTP_STATUS_CODES = require('http').STATUS_CODES;

  var forbiddenRequestHeaders = new RegExp('^(' + ["Accept-Charset", "Accept-Encoding", "Access-Control-Request-Headers", "Access-Control-Request-Method", "Connection", "Content-Length", "Cookie", "Cookie2", "Date", "DNT", "Expect", "Host", "Keep-Alive", "Origin", "Referer", "TE", "Trailer", "Transfer-Encoding", "Upgrade", "User-Agent", "Via", "Sec-.*", "Proxy-.*"].join('|') + ')$');

  var Event = require('./event');
  var ProgressEvent = require('./progressevent');
  var XMLHttpRequestEventTarget = require('./xmlhttprequesteventtarget');
  var XMLHttpRequestUpload = require('./xmlhttprequestupload');
  var utils = require('./utils');

  function XMLHttpRequest(options) {
    if (!(this instanceof XMLHttpRequest)) {
      throw new TypeError('DOM object constructor cannot be called as a function.');
    }
    XMLHttpRequestEventTarget.call(this);
    options = options || {};
    this._flag.anonymous = !!options.anon;
    Object.defineProperties(this, {
      upload: {
        configurable: true,
        enumerable: true,
        value: new XMLHttpRequestUpload(),
        writable: false
      },
      _properties: {
        configurable: false,
        enumerable: false,
        value: Object.create(Object.prototype, {
          auth: {
            configurable: false,
            enumerable: true,
            value: '',
            writable: true
          },
          client: {
            configurable: false,
            enumerable: true,
            value: null,
            writable: true,
          },
          method: {
            configurable: false,
            enumerable: true,
            value: undefined,
            writable: true
          },
          responseHeaders: {
            configurable: false,
            enumerable: true,
            value: {},
            writable: true,
          },
          responseBuffer: {
            configurable: false,
            enumerable: true,
            value: null,
            writable: true,
          },
          responseType: {
            configurable: false,
            enumerable: true,
            value: '',
            writable: true,
          },
          requestHeaders: {
            configurable: false,
            enumerable: true,
            value: {},
            writable: true,
          },
          uri: {
            configurable: true,
            enumerable: true,
            value: '',
            writable: true
          }
        }),
        writable: false
      }
    });
  }

  XMLHttpRequest.prototype = Object.create(XMLHttpRequestEventTarget.prototype);

  var XMLHttpRequestResponseType = [
    '',
    'arraybuffer',
    'blob',
    'document',
    'json',
    'text'
  ];

  (function(proto) {
    (function() {
      var constants = {
        UNSENT: {
          configurable: false,
          enumerable: true,
          value: 0,
          writable: false
        },
        OPENED: {
          configurable: false,
          enumerable: true,
          value: 1,
          writable: false
        },
        HEADERS_RECEIVED: {
          configurable: false,
          enumerable: true,
          value: 2,
          writable: false
        },
        LOADING: {
          configurable: false,
          enumerable: true,
          value: 3,
          writable: false
        },
        DONE: {
          configurable: false,
          enumerable: true,
          value: 4,
          writable: false
        }
      };

      Object.defineProperties(XMLHttpRequest, constants);
      Object.defineProperties(proto, constants);
    })();

    Object.defineProperties(proto, {
      _flag: {
        configurable: false,
        enumerable: false,
        get: function getter() {
          var flag = Object.create(Object.prototype, {
            anonymous: {
              configurable: false,
              enumerable: true,
              value: false,
              writable: true
            },
            synchronous: {
              configurable: false,
              enumerable: true,
              value: false,
              writable: true
            },
            uploadComplete: {
              configurable: false,
              enumerable: true,
              value: false,
              writable: true
            },
            uploadEvents: {
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
      readyState: {
        configurable: true,
        enumerable: true,
        value: XMLHttpRequest.UNSENT,
        writable: false
      },
      responseType: {
        configurable: false,
        enumerable: true,
        get: function getter() {
          var responseType = this._properties.responseType;
          if (XMLHttpRequestResponseType.indexOf(responseType) < 0) {
            return '';
          }
          return responseType;
        },
        set: function setter(responseType) {
          if (XMLHttpRequestResponseType.indexOf(responseType) < 0) {
            throw new Error(''); // todo
          }
          return this._properties.responseType = responseType;
        }
      },
      response: {
        configurable: false,
        enumerable: true,
        get: function getter() {
          var responseBuffer = this._properties.responseBuffer;
          if (!(responseBuffer instanceof Buffer)) {
            return '';
          }
          switch (this.responseType) {
            case '':
              return this.responseText;
            case 'arraybuffer':
            case 'blob':
              return (new Uint8Array(responseBuffer)).buffer;
            case 'document':
              return null; // todo
            case 'json':
              return JSON.parse(this.responseText);
            case 'text':
              return this.responseText;
            default:
              return '';
          }
        }
      },
      responseText: {
        configurable: false,
        enumerable: true,
        get: function getter() {
          var responseBuffer = this._properties.responseBuffer;
          if (!(responseBuffer instanceof Buffer)) {
            return '';
          }
          return responseBuffer.toString();
        }
      },
      responseXML: {
        configurable: false,
        enumerable: true,
        value: null, // todo
        writable: false
      },
      status: {
        configurable: true,
        enumerable: true,
        value: 0,
        writable: false
      },
      statusText: {
        configurable: true,
        enumerable: true,
        value: '',
        writable: false
      },
      timeout: {
        configurable: true,
        enumerable: true,
        value: 0,
        writable: false
      },
      upload: {
        configurable: true,
        enumerable: true,
        value: null,
        writable: false
      },
      withCredentials: {
        configurable: true,
        enumerable: true,
        value: false,
        writable: false
      }
    });

    function _readyStateChange(readyState) {
      var readyStateChangeEvent = new Event('');
      readyStateChangeEvent.initEvent('readystatechange', false, false);
      Object.defineProperty(this, 'readyState', {
        configurable: true,
        enumerable: true,
        value: readyState,
        writable: false
      });
      this.dispatchEvent(readyStateChangeEvent);
    }

    function _receiveResponse(response) {
      var _properties = this._properties;
      var contentLength = '0';
      var bufferLength = 0;
      var byteOffset = 0;
      var statusCode = response.statusCode;
      Object.defineProperties(this, {
        status: {
          configurable: true,
          enumerable: true,
          value: statusCode,
          writable: false
        },
        statusText: {
          configurable: true,
          enumerable: true,
          value: HTTP_STATUS_CODES[statusCode],
          writable: false
        }
      });
      _properties.responseHeaders = response.headers;
      contentLength = response.headers['content-length'] || contentLength;
      bufferLength = parseInt(contentLength, 10);
      this.lengthComputable = false;
      if(bufferLength !== 0){
        this.total = bufferLength;
        this.loaded = 0;
        this.lengthComputable = true;
      }
      _properties.responseBuffer = new Buffer(bufferLength);
      _readyStateChange.call(this, XMLHttpRequest.LOADING);
      var that = this;
      response.addListener('data', function(chunk) {
        var buffer;
        if (bufferLength === 0) {
          buffer = this._properties.responseBuffer;
          this._properties.responseBuffer = new Buffer(buffer.length + chunk.length);
          buffer.copy(this._properties.responseBuffer);
        }
        chunk.copy(this._properties.responseBuffer, byteOffset);
        byteOffset += chunk.length;
        that.loaded = byteOffset;
        _readyStateChange.call(this, XMLHttpRequest.LOADING);
      }.bind(this));
      response.addListener('end', function() {
        _readyStateChange.call(this, XMLHttpRequest.DONE);
        _properties.client = null;
      }.bind(this));
    }

    function _setDispatchProgressEvents(stream) {
      var loadStartEvent = new ProgressEvent('loadstart');
      this.dispatchEvent(loadStartEvent);
      stream.on('data', function() {
        var progress = {lengthComputable: this.lengthComputable, total: this.total, loaded: this.loaded};
        var progressEvent = new ProgressEvent('progress', progress);
        this.dispatchEvent(progressEvent);
      }.bind(this));
      stream.on('end', function() {
        var loadEvent = new ProgressEvent('load');
        var loadEndEvent = new ProgressEvent('loadend')
        this.dispatchEvent(loadEvent);
        this.dispatchEvent(loadEndEvent);
      }.bind(this));
    }

    proto.abort = function abort() {
      var client = this._properties.client
      if (client && typeof client.abort === 'function') {
        client.abort();
      }
      this.dispatchEvent(new ProgressEvent('abort'));
      this.upload.dispatchEvent(new ProgressEvent('abort'));
    };

    proto.getAllResponseHeaders = function getAllResponseHeaders() {
      var readyState = this.readyState;
      if ([XMLHttpRequest.UNSENT, XMLHttpRequest.OPENED].indexOf(readyState) >= 0) {
        throw new Error(''); // todo
      }
      return Object.keys(this._properties.responseHeaders).map(function(key) {
        return [key, this._properties.responseHeaders[key]].join(': ');
      }, this).join('\n');
    };

    proto.getResponseHeader = function getResponseHeader(header) {
      var readyState = this.readyState;
      var key;
      var value;
      if ([XMLHttpRequest.UNSENT, XMLHttpRequest.OPENED].indexOf(readyState) >= 0) {
        throw new Error(''); // todo;
      }
      key = header.toLowerCase();
      value = this._properties.responseHeaders[key];
      return typeof value !== 'undefined' ? '' + value : null;
    };

    proto.open = function open(method, uri, async, user, password) {
      var argumentCount = arguments.length;
      if (argumentCount < 2) {
        throw new TypeError('Not enought arguments');
      }
      this._properties.method = method;
      this._properties.uri = uri;
      this._flag.synchronous = !!async;
      if (argumentCount >= 4) {
        this._properties.auth = [
          user || '',
          password || ''
        ].join(':');
      }
      _readyStateChange.call(this, XMLHttpRequest.OPENED);
    };

    proto.overrideMimeType = function overrideMimeType(mime) {
      // todo
    };

    proto.send = function send(body) {
      var _properties = this._properties;
      var client;
      var async;
      if (this.readyState !== XMLHttpRequest.OPENED) {
        throw new Error(); // todo
      }
      async = this._flag.synchronous;
      client = utils.createClient(this._properties, async, function() {
        _setDispatchProgressEvents.apply(this, arguments);
        _receiveResponse.apply(this, arguments);
      }.bind(this));
      _properties.client = client;
      Object.keys(_properties.requestHeaders).forEach(function(key) {
        var value = _properties.requestHeaders[key];
        client.setHeader(key, value);
      });
      _readyStateChange.call(this, XMLHttpRequest.HEADERS_RECEIVED);
      if (body) {
        client.on('socket', _setDispatchProgressEvents.bind(this.upload));
        client.write(body);
      }
      client.end();
    };

    proto.setRequestHeader = function setRequestHeader(header, value) {
      if (this.readyState === XMLHttpRequest.UNSENT) {
        throw new Error(''); // todo
      }
      if (forbiddenRequestHeaders.test(header)) return;
      this._properties.requestHeaders[header] = value;
    };
  })(XMLHttpRequest.prototype);

  module.exports = XMLHttpRequest;
})(this);
