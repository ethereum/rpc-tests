var config = require('../lib/config'),
    Helpers = require('../lib/helpers'),
    assert = require('chai').assert;

// METHOD
var method = 'shh_uninstallFilter';

// TEST
var asyncTest = function(host, done, filterId){

    Helpers.send(host, {
        id: config.rpcMessageId++, jsonrpc: "2.0", method: method,
        
        // PARAMETERS
        params: [filterId]

    }, function(result, status) {
        
        assert.equal(status, 200, 'has status code');
        assert.property(result, 'result', (result.error) ? result.error.message : 'error');
        assert.isTrue(result.result);

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

        // OPTIONS FILTER
        describe(key, function(){

            it('should return a boolean when uninstalling a options filter', function(done){
                // INSTALL a options filter first
                var optionsFilterId = Helpers.send(host, {
                    id: config.rpcMessageId++, jsonrpc: "2.0", method: 'shh_newFilter',
                    
                    // PARAMETERS
                    params: [{
                        "to": "0xfd9801e0aa27e54970936aa910a7186fdf5549bc",
                        "topics": ['0x01e0aa27e54970936aa910a71', '0x6aa910a7186fdf']
                    }]

                });
                asyncTest(host, done, optionsFilterId.result);
            });

            it('should return an error when no parameter is passed', function(done){
                asyncErrorTest(host, done);
            });
        });
    });
});
