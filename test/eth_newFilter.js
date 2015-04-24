var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert,
    currentFilterId = null;

// METHOD
var method = 'eth_newFilter';


// TEST
var asyncTest = function(host, done, param){
    Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: [param]

    }, function(result, status) {
        
        assert.equal(status, 200, 'has status code');
        assert.property(result, 'result', (result.error) ? result.error.message : 'error');
        assert.isString(result.result, 'is string');
        assert.match(result.result, /^0x/, 'should be HEX starting with 0x');
        assert.isNumber(+result.result, 'can be converted to a number');

        // set current filter id
        currentFilterId = result.result;

        done();
    });
};


var asyncErrorTest = function(host, done, param){
    Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: param ? [param] : []

    }, function(result, status) {

        assert.equal(status, 200, 'has status code');
        assert.property(result, 'error');
        assert.equal(result.error.code, -32602);

        done();
    });
};



describe(method, function(){

    Helpers.eachHost(function(key, host){
        describe(key, function(){

            // uninstall the filters after we are done
            afterEach(function(){
                if(currentFilterId) {
                    Helpers.send(host, {
                        id: config.rpcMessageId++, jsonrpc: "2.0", method: 'eth_uninstallFilter',
                        
                        // PARAMETERS
                        params: [currentFilterId]

                    });
                    currentFilterId = null;
                }
            });

            it('should return a number as hexstring when all options are passed with single address', function(done){
                asyncTest(host, done, {
                    "fromBlock": "0x1", // 1
                    "toBlock": "0x2", // 2
                    "address": "0xfd9801e0aa27e54970936aa910a7186fdf5549bc",
                    "topics": ['0x01e0aa27e54970936aa910a713', '0x6aa910a7186fdf']
                });
            });

            it('should return a number as hexstring when all options are passed with address array', function(done){
                asyncTest(host, done, {
                    "fromBlock": "0x1", // 1
                    "toBlock": "0x2", // 2
                    "address": ["0xfd9801e0aa27e54970936aa910a7186fdf5549bc", "0xab9801e0aa27e54970936aa910a7186fdf5549bc"],
                    "topics": ['0x01e0aa27e54970936aa910a713', '0x6aa910a7186fdf']
                });
            });

            it('should return a number as hexstring when all options with "latest" and "pending" for to and fromBlock', function(done){
                asyncTest(host, done, {
                    "fromBlock": "latest",
                    "toBlock": "pending",
                    "address": "0xfd9801e0aa27e54970936aa910a7186fdf5549bc",
                    "topics": ['0x01e0aa27e54970936aa910a713', '0x6aa910a7186fdf']
                });
            });

            it('should return a number as hexstring when a few options are passed', function(done){
                asyncTest(host, done, {
                    "fromBlock": "0x1", // 1
                    "toBlock": "0x2", // 2
                });
            });

            // it('should return an error when a wrong parameter is passed', function(done){
            //     asyncErrorTest(host, done, {
            //         "fromBlock": 'abc',
            //         "toBlock": 'abc',
            //         "address": "0xfd9801e0aa27e54970936aa910a7186fdf5549bc"
            //     });
            // });

            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(host, done);
            });
        });
    });
});
