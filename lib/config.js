var assert = require('chai').assert,
    _ = require('underscore');
// var chai = require('chai');
// chai.config.includeStack = false;
// chai.config.showDiff = false;

var config = {
    rpcMessageId: 1,
    hosts: {
        cpp: 'http://localhost:8080',
        python: 'http://localhost:8081',
        go: 'http://localhost:8545',
    },
    testBlocks: require('./tests/BlockchainTests/bcRPC_API_Test.json').RPC_API_Test,
    senderAddress: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
    contractAddress: '0x6295ee1b4f6dd65047762f924ecd367c17eabf8f',
    compiledTestContract: '0xf90942f901faa002aa46ee7e8a588ecb36ae05a225f442a4410e7dca91b4e2e8fa351148a418c5a01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347948888f1f195afa192cfee860698584c030f4c9db1a06d030caaafd4575d820b495c72c2471cd427c1f314e675045227d1646ef862f1a00337bf35b741bf9be4594a78cbdcd220d7736eb452c9711343637f75508d73a7a0843716b02b7b22c1c8beb74a8ce2421471f9f35bccaf454b06ca1a6e796dee52b90100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008302000001832fefd8830767eb84552ce19880a0e7c0ac40e41e32853cd7fd612fce5c5d199515fcb0f41182817a7ecdf57cadf588648151f718824fd6f90741f9073e8001832fefd8800ab906f05b5b6106e0806100106000396000f3006000357c010000000000000000000000000000000000000000000000000000000090048063102accc11461012c57806312a7b9141461013a5780631774e6461461014c5780631e26fd331461015d5780631f9030371461016e578063343a875d1461018057806338cc4831146101955780634e7ad367146101bd57806357cb2fc4146101cb57806365538c73146101e057806368895979146101ee57806376bc21d9146102005780639a19a9531461020e5780639dc2c8f51461021f578063a53b1c1e1461022d578063a67808571461023e578063b61c05031461024c578063c2b12a731461025a578063d2282dc51461026b578063e30081a01461027c578063e8beef5b1461028d578063f38b06001461029b578063f5b53e17146102a9578063fd408767146102bb57005b6101346104b1565b60006000f35b610142610376565b8060005260206000f35b610157600435610301565b60006000f35b6101686004356102c9565b60006000f35b61017661041d565b8060005260206000f35b6101886103ae565b8060ff1660005260206000f35b61019d6103ee565b8073ffffffffffffffffffffffffffffffffffffffff1660005260206000f35b6101c56104a0565b60006000f35b6101d3610392565b8060000b60005260206000f35b6101e861042f565b60006000f35b6101f66103dc565b8060005260206000f35b6102086104fa565b60006000f35b6102196004356102e5565b60006000f35b61022761066e565b60006000f35b61023860043561031d565b60006000f35b61024661045f565b60006000f35b61025461046e565b60006000f35b610265600435610368565b60006000f35b61027660043561032b565b60006000f35b610287600435610339565b60006000f35b61029561058f565b60006000f35b6102a3610522565b60006000f35b6102b16103ca565b8060005260206000f35b6102c36105db565b60006000f35b80600060006101000a81548160ff021916908302179055505b50565b80600060016101000a81548160ff021916908302179055505b50565b80600060026101000a81548160ff021916908302179055505b50565b806001600050819055505b50565b806002600050819055505b50565b80600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50565b806004600050819055505b50565b6000600060009054906101000a900460ff16905061038f565b90565b6000600060019054906101000a900460ff1690506103ab565b90565b6000600060029054906101000a900460ff1690506103c7565b90565b600060016000505490506103d9565b90565b600060026000505490506103eb565b90565b6000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905061041a565b90565b6000600460005054905061042c565b90565b7f65c9ac8011e286e89d02a269890f41d67ca2cc597b2c76c7c69321ff492be5806000602a81526020016000a15b565b6000602a81526020016000a05b565b60017f81933b308056e7e85668661dcd102b1f22795b4431f9cf4625794f381c271c6b6000602a81526020016000a25b565b60016000602a81526020016000a15b565b3373ffffffffffffffffffffffffffffffffffffffff1660017f0e216b62efbb97e751a2ce09f607048751720397ecfb9eef1e48a6644948985b6000602a81526020016000a35b565b3373ffffffffffffffffffffffffffffffffffffffff1660016000602a81526020016000a25b565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6001023373ffffffffffffffffffffffffffffffffffffffff1660017f317b31292193c2a4f561cc40a95ea0d97a2733f14af6d6d59522473e1f3ae65f6000602a81526020016000a45b565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6001023373ffffffffffffffffffffffffffffffffffffffff1660016000602a81526020016000a35b565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6001023373ffffffffffffffffffffffffffffffffffffffff1660017fd5f0a30e4be0c6be577a71eceb7464245a796a7e6a55c0d971837b250de05f4e60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe98152602001602a81526020016000a45b565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6001023373ffffffffffffffffffffffffffffffffffffffff16600160007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe98152602001602a81526020016000a35b561ca0f3ad419ce7510ae207aaa5aaefa0809d70e5dc2cc8eaae13918b5225631b9bfda0ed8214956dac9f349be703fe3a7c4061614066e5dc491047f66bbc71074d0f7cc0',
    logs: [{
        eventName: "log4a", // for debug purposes only
        call: '0x9dc2c8f5',
        anonymous: true,
        indexArgs: [true, 'msg.sender', '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'],
        args: [-23, 42]
    },{
        eventName: "log4",
        call: '0xfd408767',
        anonymous: false,
        indexArgs: [true, 'msg.sender', '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'],
        args: [-23, 42]
    },{
        eventName: "log3a",
        call: '0xe8beef5b',
        anonymous: true,
        indexArgs: [true, 'msg.sender', '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'],
        args: [42]
    },{
        eventName: "log3",
        call: '0xf38b0600',
        anonymous: false,
        indexArgs: [true, 'msg.sender', '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'],
        args: [42]
    },{
        eventName: "log2a",
        call: '0x76bc21d9',
        anonymous: true,
        indexArgs: [true, 'msg.sender'],
        args: [42]
    },{
        eventName: "log2",
        call: '0x102accc1',
        anonymous: false,
        indexArgs: [true, 'msg.sender'],
        args: [42]
    },{
        eventName: "log1a",
        call: '0x4e7ad367',
        anonymous: true,
        indexArgs: [true],
        args: [42]
    },{
        eventName: "log1",
        call: '0xb61c0503',
        anonymous: false,
        indexArgs: [true],
        args: [42]
    },{
        eventName: "log0a",
        call: '0xa6780857',
        anonymous: true,
        indexArgs: [],
        args: [42]
    },{
        eventName: "log0",
        call: '0x65538c73',
        anonymous: false,
        indexArgs: [],
        args: [42]
    }]
};

// from the oldest to the newest!
config.logs.reverse();

// add the log.block, log.tx and log.txIndex
config.logs = _.map(config.logs, function(log){
    var transaction = null,
        txIndex = null;
    log.block = _.find(config.testBlocks.blocks, function(block){
        return _.find(block.transactions, function(tx, index){
            if (tx.data === log.call){
                transaction = tx;
                txIndex = index;
                return true;
            } else
                return false;
        });
    });
    log.tx = transaction;
    log.txIndex = txIndex;
    //console.log(log.eventName + " : " + log.block.blockHeader.hash);
    return log;
});

// prepare test for quiring forked blocks
var reverted = config.testBlocks.blocks.filter(function (block) {
    return block.reverted === true;
});

var decent = config.testBlocks.blocks.filter(function (block) {
    if (block.reverted === true) {
        return false;
    }

    return !!_.findWhere(reverted, { blocknumber: block.blocknumber});
});

// assuming there is only 1 fork
config.specialLogQuery = {
    fromBlock: '0x' + _.last(reverted).blockHeader.hash,
    toBlock: '0x' + _.last(decent).blockHeader.hash
};

var route = reverted.reverse().concat(decent);

var specialLogs = _.map(route, function (block) {
    var tx = block.transactions[0];
    var log = _.findWhere(config.logs, { call: tx.data});
    log = _.extend({}, log); // copy it
    log.tx = tx;
    log.txIndex = 0;
    log.block = block;
    return log;
});

config.specialLogResult = specialLogs; 

module.exports = config;

