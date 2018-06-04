pragma solidity ^0.4.23;

contract Verifier {
  function recoverAddress(bytes32 msgHash, uint8 v, bytes32 r, bytes32 s)
    public
    pure
    returns (address _recoveredAddress)
  {
    _recoveredAddress = ecrecover(msgHash, v, r, s);
  }

  function isSigned(bytes32 msgHash, uint8 v, bytes32 r, bytes32 s)
    public
    view
    returns (bool _signed)
  {
    require(ecrecover(msgHash, v, r, s) == msg.sender);
    _signed = true;
  }
}
