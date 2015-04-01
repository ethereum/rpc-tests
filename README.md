# Ethereum RPC tests


Untested:

- eth_sendTransaction
- eth_call
- eth_flush
- eth_compileSolidity
- eth_getFilterChanges
- eth_getFilterLogs
- eth_getLogs
- eth_getWork
- eth_submitWork
- db_putString
- db_getString
- db_putHex
- db_getHex
- shh_post
- shh_newGroup
- shh_addToGroup
- shh_getFilterChanges
- shh_getMessages


## Usage

1. clone `$ git clone https://github.com/ethereum/rpc-tests`
2. `$ cd rpc-tests`
3. `$ git submodule update --init`
4. `$ npm install`
5. start a local CPP node at `http://localhost:8080` and local GO node at `http://localhost:8545`
6. The nodes need the following state to work: https://github.com/ethereum/tests/blob/develop/BlockTests/bcJS_API_Test.json
7. run `$ make test`

You can also run only tests for `eth_`, `shh_` or `net_` RPC methods as follows:

    $ make test.eth
    $ make test.shh
    $ make test.net

If you don't want to run the tests against all nodes, or run against remote nodes, just change the `hosts` in the `lib/config.js`.

### Running single tests

To run a single test you need to install mocha globally:

    $ npm install -g mocha
    $ cd rpc-tests
    $ mocha test/1_testConnection.js test/eth_myMethod.js

By changing the last file name to whatever method you want to test, you can run test only for that specifc method.

### Start a node with a certain state

To load a fixed state, clone the ethereum test repo as follows:

    $ git clone https://github.com/ethereum/tests

#### CPP

Then run the following cpp cli and load the `JS_API_Tests` test:

    $ ethrpctest --json <pathToTheTestRepo>/BlockTests/bcJS_API_Test.json --test JS_API_Tests

## License

The MIT License

Copyright (c) 2015 Fabian Vogelsteller

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
