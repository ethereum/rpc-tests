var config = {
    rpcMessageId: 1,
    testBlocks: require('./tests/BlockTests/bcValidBlockTest.json'),
    hosts: {
        cpp: 'http://localhost:8080',
        go: 'http://localhost:8545'
    }
};


module.exports = config;