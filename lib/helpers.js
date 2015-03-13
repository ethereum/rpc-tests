var config = require('../lib/config'),
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

var Helpers = {
    send: function(host, data, callback) {
        var xhr = new XMLHttpRequest();

        // ASYNC
        if(typeof callback === 'function') {
            xhr.onreadystatechange = function() {
                if(xhr.readyState === 4) {
                    if(xhr.status === 200) {
                        callback(JSON.parse(xhr.responseText), xhr.status);
                    } else {
                        throw new Error('Can\'t connect to '+ host);
                    }
                }
            };

            xhr.open('POST', host, true);
            xhr.send(JSON.stringify(data));

        // SYNC
        } else {
            xhr.open('POST', host, false);
            xhr.send(JSON.stringify(data));

            if(xhr.readyState === 4 && xhr.status !== 200)
                throw new Error('Can\'t connect to '+ host);

            return JSON.parse(xhr.responseText);
        }
    },
    each: function(callback){
        for (var key in config.hosts) {
            (function(key){
                callback(key.toUpperCase(), config.hosts[key]);
            })(key);
        }
    },
    toAscii: function(hex) {
        // Find termination
        var str = "";
        var i = 0, l = hex.length;
        if (hex.substring(0, 2) === '0x') {
            i = 2;
        }
        for (; i < l; i+=2) {
            var code = parseInt(hex.substr(i, 2), 16);
            if (code === 0) {
                break;
            }

            str += String.fromCharCode(code);
        }

        return str;
    },
    // toDecimal: function (value) {
    //     return toBigNumber(value).toNumber();
    // },
    isAddress: function(address) {
        if (!this.isString(address)) {
            return false;
        }

        return ((address.indexOf('0x') === 0 && address.length === 42) ||
                (address.indexOf('0x') === -1 && address.length === 40));
    },
    isString: function (object) {
        return typeof object === 'string' ||
            (object && object.constructor && object.constructor.name === 'String');
    },
    isObject: function (object) {
        return typeof object === 'object';
    },
    isBoolean: function (object) {
        return typeof object === 'boolean';
    },
    isArray: function (object) {
        return object instanceof Array; 
    }
};


module.exports = Helpers;