var config = {
    rpcMessageId: 1,
    ethFilter: null,
    shhFilter: null,
    testBlocks: require('./tests/BlockTests/bcValidBlockTest.json'),
    hosts: {
        cpp: 'http://localhost:8080',
        go: 'http://localhost:8545'
    }
};


module.exports = config;