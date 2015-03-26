var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert;

// METHOD
var method = 'db_getHex';


// TEST
var syncTest = function(host, params, expectedResult){
    var result = Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: params

    });

        
    assert.property(result, 'result', (result.error) ? result.error.message : 'error');
    assert.isString(result.result, 'is string');
    assert.match(result.result, /^0x/, 'is hex');

    assert.equal(result.result, expectedResult, 'should match '+ expectedResult);

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
            it('should return the previously stored value', function(){
                var randomHex = '0x'+ Math.random().toString().replace('.','');

                Helpers.send(host, {
                    id: config.rpcMessageId++, jsonrpc: "2.0", method: 'db_putHex',
                    
                    // PARAMETERS
                    params: [
                    'myDb',
                    'myKey',
                    randomHex
                    ]

                });

                syncTest(host, [
                    'myDb',
                    'myKey'
                    ], randomHex);
            });

            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(host, done);
            });
        });
    });
});
