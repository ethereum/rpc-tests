(function(global) {
  'use strict';

  var XMLHttpRequest = require('../lib/xmlhttprequest');

  var API_URI = 'http://registry.npmjs.org/w3c-xmlhttprequest';

  function request(searchKeyword) {
    var client = new XMLHttpRequest();
    client.open('GET', API_URI);
    client.responseType = 'json';
    client.addEventListener('load', function(event) {
      var response = client.response;
      var result = JSON.stringify(response, null, '  ');
      console.log(result);
    });
    client.send(null);
  }

  function main(argv) {
    request.apply(this, argv.slice(2));
  }

  main(process.argv);
})(this);
