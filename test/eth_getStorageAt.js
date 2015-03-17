var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert;

// METHOD
var method = 'eth_getStorageAt';

// TODO check fo balance
// TODO TEST for specific states (blocks) and pending?

// TEST
var asyncTest = function(host, done, params, expectedResult){
    Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: params

    }, function(result, status) {

        
        assert.equal(status, 200, 'has status code');
        assert.property(result, 'result', (result.error) ? result.error.message : 'error');
        assert.isString(result.result, 'is string');
        assert.match(result.result, /^0x/, 'is hex');

        assert.equal(result.result, expectedResult, 'should match '+ expectedResult);

        done();
    });
};


var asyncErrorTest = function(host, done){
    Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: []

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
            it('should return the correct storage entry when the defaultBlock is "latest" for 0x6295ee1b4f6dd65047762f924ecd367c17eabf8f', function(done){
                var storagePos = '0x05';
                asyncTest(host, done, [
                    '0x6295ee1b4f6dd65047762f924ecd367c17eabf8f',
                    storagePos,
                    'latest'
                    ], config.testBlocks.postState['6295ee1b4f6dd65047762f924ecd367c17eabf8f'].storage[storagePos]);
            });
            it('should return the correct storage entry when the defaultBlock is 0 for 0x6295ee1b4f6dd65047762f924ecd367c17eabf8f', function(done){
                var storagePos = '0x05';
                asyncTest(host, done, [
                    '0x6295ee1b4f6dd65047762f924ecd367c17eabf8f',
                    storagePos,
                    '0x0'
                    ], config.testBlocks.postState['6295ee1b4f6dd65047762f924ecd367c17eabf8f'].storage[storagePos]);
            });
            it('should return nothing when the defaultBlock is 0 for 0x6295ee1b4f6dd65047762f924ecd367c17eabf8f', function(done){
                var storagePos = '0x04';
                asyncTest(host, done, [
                    '0x6295ee1b4f6dd65047762f924ecd367c17eabf8f',
                    storagePos,
                    '0x0'
                    ], '0x00');
            });
            it('should return nothing when the defaultBlock is 0 for 0xec0e71ad0a90ffe1909d27dac207f7680abba42d', function(done){
                var storagePos = '0x01';
                asyncTest(host, done, [
                    '0xec0e71ad0a90ffe1909d27dac207f7680abba42d',
                    storagePos,
                    '0x0'
                    ], '0x00');
            });


            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(host, done);
            });
        });
    });
});
