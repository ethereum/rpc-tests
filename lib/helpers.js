var XMLHttpRequest = require('w3c-xmlhttprequest').XMLHttpRequest;

var Helpers = {
    send: function(host, data, callback, async) {
        var client = new XMLHttpRequest();
        client.open('POST', host, !!async);
        client.responseType = 'json';
        client.addEventListener('load', function() {
            callback(client.response, client.status);

        }, false);
        client.send(JSON.stringify(data));
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