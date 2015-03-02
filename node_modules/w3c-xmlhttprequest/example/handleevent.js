(function(global) {
  'use strict';

  var XMLHttpRequest = require('../lib/xmlhttprequest');

  var obj = {
    name: 'XMLHttpRequest...',
    handleEvent: function(event) {
      var client = event.target;
      var response = client.response;
      console.log('==== %s ====', this.name);
      console.log('%s %s', client.status, client.statusText);
      console.log(client.getAllResponseHeaders());
      console.log(response.split('\n').slice(0, 3).join('\n'));
      console.log('...');
    }
  };

  function request(uri) {
    var client;
    if (!uri) {
      throw new TypeError('URI is required for the argument.');
    }
    client = new XMLHttpRequest();
    client.open('GET', uri);
    client.responseType = 'text';
    client.addEventListener('load', obj, false);
    client.send(null);
  }

  function main(argv) {
    try {
      request.apply(this, argv.slice(2));
    } catch (error) {
      console.error(error.message);
    }
  }

  main(process.argv);
})(this);
