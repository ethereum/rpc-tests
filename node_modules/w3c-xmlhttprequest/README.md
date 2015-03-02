# node-xmlhttprequest

Server-side XMLHttpRequest like [W3C spec](http://www.w3.org/TR/2012/WD-XMLHttpRequest-20121206/) for [Node](http://nodejs.org/).

This library is still in development. We are recruiting contributors and your pull requests.

## Install

```shell
$ npm install w3c-xmlhttprequest
```

or

```shell
$ npm install git://github.com/ykzts/node-xmlhttprequest.git
```

## Example

### Simple GET request

```javascript
var XMLHttpRequest = require('w3c-xmlhttprequest').XMLHttpRequest;

var client = new XMLHttpRequest();
client.open('GET', 'http://example.com/');
client.addEventListener('load', function(event) {
  console.log('HTTP Request OSHIMAI.');
}, false);
client.send();
```

### Parse JSON response

```javascript
var XMLHttpRequest = require('w3c-xmlhttprequest').XMLHttpRequest;

var client = new XMLHttpRequest();
client.open('GET', 'http://exmaple.com/data.json');
client.responseType = 'json';
client.addEventListener('load', function() {
  var data = client.response;
  if (data.meta.status !== 200) {
    return;
  }
  console.log(data.response.blog.title);
}, false);
client.send();
```

## LICENSE

[MIT License](LICENSE)
