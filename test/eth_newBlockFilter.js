var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert,
    currentFilterId = null;

// METHOD
var method = 'eth_newBlockFilter';


// TEST
var asyncTest = function(host, done){
    Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: []

    }, function(result, status) {

        
        assert.equal(status, 200, 'has status code');
        assert.property(result, 'result', (result.error) ? result.error.message : 'error');
        assert.isString(result.result, 'is string');
        assert.match(result.result, /^0x/, 'should be HEX starting with 0x');
        assert.isNumber(+result.result, 'can be converted to a number');

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

                    }, function(){
                        
                    });
                    currentFilterId = null;
                }
            });

            it('should return a number as hexstring', function(done){
                asyncTest(host, done);
            });

            // TODO test again?
            // it('should return an error when a parameter is passed', function(done){
            //     asyncErrorTest(host, done, 'something');
            // });
        });
    });
});
