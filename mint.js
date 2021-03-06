const {BN, Long, bytes, units} = require('@zilliqa-js/util');
const {Zilliqa} = require('@zilliqa-js/zilliqa');
const {
    toBech32Address,
    getAddressFromPrivateKey,
} = require('@zilliqa-js/crypto');


async function main() {
    const zilliqa = new Zilliqa('https://dev-api.zilliqa.com');
    const CHAIN_ID = 333;
    const MSG_VERSION = 1;
    const VERSION = bytes.pack(CHAIN_ID, MSG_VERSION);
    privkey = '589e486b65e553df4efbc0543a3c7678aa52d347c8189169e4f9acb6a08d1c7e';
    zilliqa.wallet.addByPrivateKey(
        privkey
    );
    const address = getAddressFromPrivateKey(privkey);
    console.log("Your account address is:");
    console.log(`${address}`);
    const myGasPrice = units.toQa('2000', units.Units.Li); // Gas Price that will be used by all transactions


    const nftAddr = toBech32Address("03d074d5ef0fb093c21b3d299459b90fc4991a83");
    try {
        const contract = zilliqa.contracts.at(nftAddr);
        const callTx = await contract.callWithoutConfirm(
            'Mint',
            [
                {
                    vname: 'to',
                    type: 'ByStr20',
                    value: `${address}`,
                },
                {
                    vname: 'token_uri',
                    type: 'String',
                    value: 'Qmc6qQbGuLdJyqTVSDU2FhRiZqshnagL9NpT2tn2qCvhJP',
                }
            ],
            {
                // amount, gasPrice and gasLimit must be explicitly provided
                version: VERSION,
                amount: new BN(0),
                gasPrice: myGasPrice,
                gasLimit: Long.fromNumber(10000),
            }
        );

        // check the pending status
        const pendingStatus = await zilliqa.blockchain.getPendingTxn(callTx.id);
        console.log(`Pending status is: `);
        console.log(pendingStatus.result);

        // process confirm
        console.log(`The transaction id is:`, callTx.id);
        console.log(`Waiting transaction be confirmed`);
        const confirmedTxn = await callTx.confirm(callTx.id);

        console.log(`The transaction status is:`);
        console.log(confirmedTxn.receipt);

    } catch (err) {
        console.log(err);
    }
}

main();