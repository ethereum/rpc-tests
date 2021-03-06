var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert;

// METHOD
var method = 'db_getHex';


// TEST
var asyncTest = function(host, params, expectedResult, done){
    Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: params

    }, function(result, status){

        assert.property(result, 'result', (result.error) ? result.error.message : 'error');
        assert.isString(result.result, 'is string');
        assert.match(result.result, /^0x/, 'should be HEX starting with 0x');

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
            it('should return the previously stored value', function(done){
                var randomHex = '0x'+ Math.random().toString().replace('.','').replace(/0/g,'');

                if(randomHex.length % 2 !== 0)
                    randomHex += 'f';

                Helpers.send(host, {
                    id: config.rpcMessageId++, jsonrpc: "2.0", method: 'db_putHex',
                    
                    // PARAMETERS
                    params: [
                        'myDb',
                        'myKey',
                        randomHex
                    ]

                }, function(result){
                    
                    asyncTest(host, [
                        'myDb',
                        'myKey'
                        ], randomHex, done);
                });

            });

            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(host, done);
            });
        });
    });
});
