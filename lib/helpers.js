var config = require('../lib/config'),
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest,
    _ = require('underscore');

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
                        // remove offline host from config
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

            if(xhr.readyState === 4 && xhr.status !== 200) {
                throw new Error('Can\'t connect to '+ host);
            }

            return JSON.parse(xhr.responseText);
        }
    },
    eachHost: function(callback){
        for (var key in config.hosts) {
            (function(key){
                callback(key.toUpperCase(), config.hosts[key]);
            })(key);
        }
    },
    getKeyByValue: function(object, value) {
        for( var prop in object ) {
            if( object.hasOwnProperty( prop ) ) {
                 if( object[ prop ] === value )
                     return prop;
            }
        }
    },
    fromAscii: function(str) {
        var hex = "";
        for(var i = 0; i < str.length; i++) {
            var n = str.charCodeAt(i).toString(16);
            hex += n.length < 2 ? '0' + n : n;
        }

        return '0x'+ hex;
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
        if (!_.isString(address)) {
            return false;
        }

        return ((address.indexOf('0x') === 0 && address.length === 42) ||
                (address.indexOf('0x') === -1 && address.length === 40));
    }
};


module.exports = Helpers;