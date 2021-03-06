pragma solidity >=0.4.22 <0.6.0;


contract Verify {

	// return address retreived from signed data
	function recoverAddr(bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) public returns (address) {
		return ecrecover(msgHash, v, r, s);
	}

	// check if the data is signed by the current user
	function isSigned(address _addr, bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) public returns (bool ) {
		return ecrecover(msgHash, v, r, s) == _addr;
	}

}