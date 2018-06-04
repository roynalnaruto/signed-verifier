const a = require('awaiting');
const Verifier = artifacts.require('Verifier.sol');

contract('Verifier', function (accounts) {
  let verifer;
  before(async function () {
    verifier = await Verifier.new();
  });
  describe('Verifying messages', function () {
    it('[valid]: true', async function () {
      const msg = 'I am sending this message';
      const hexMsg = web3.toHex(msg);
      const signature = (web3.eth.sign(accounts[1], hexMsg)).substr(2);
      const r = '0x' + signature.slice(0, 64);
      const s = '0x' + signature.slice(64, 128);
      const v = '0x' + signature.slice(128, 130);
      const vUint8 = web3.toDecimal(v) + 27;
      const finalMsg = `\x19Ethereum Signed Message:\n${msg.length}${msg}`;
      const msgHash = web3.sha3(finalMsg);

      assert.deepEqual(await verifier.isSigned.call(msgHash, vUint8, r, s, { from: accounts[1] }), true);
      assert.deepEqual(await verifier.recoverAddress.call(msgHash, vUint8, r, s, { from: accounts[1] }), accounts[1]);
    });
    it('[invalid]: revert', async function () {
      const msg = 'I am sending this message';
      const hexMsg = web3.toHex(msg);
      const signature = (web3.eth.sign(accounts[1], hexMsg)).substr(2);
      const r = '0x' + signature.slice(0, 64);
      const s = '0x' + signature.slice(64, 128);
      const v = '0x' + signature.slice(128, 130);
      const vUint8 = web3.toDecimal(v) + 27;
      const finalMsg = `\x19Ethereum Signed Message:\n${msg.length}${msg}`;
      const msgHash = web3.sha3(finalMsg);

      assert(await a.failure(verifier.isSigned.call(msgHash, vUint8, r, s, { from: accounts[0] })));
    });
  });
});
