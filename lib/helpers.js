var XMLHttpRequest = require('w3c-xmlhttprequest').XMLHttpRequest;

var Helpers = {
    send: function(host, data, callback) {
        var client = new XMLHttpRequest();
        client.open('POST', host);
        client.responseType = 'json';
        client.addEventListener('load', function() {
            callback(client.response, client.status);

        }, false);
        client.send(JSON.stringify(data));
    }
};


module.exports = Helpers;