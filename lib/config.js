var config = {
    rpcMessageId: 1,
    testBlocks: require('./tests/BlockTests/bcJS_API_Test.json').JS_API_Tests,
    hosts: {
        cpp: 'http://localhost:8080',
        go: 'http://localhost:8545'
    }
};


module.exports = config;